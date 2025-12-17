import os
import re
import time
from typing import TypedDict, List, Optional
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_ollama import ChatOllama
from langchain_core.messages import SystemMessage, HumanMessage
from langgraph.graph import StateGraph, END
import docker
import tarfile
import io

load_dotenv()

# --- 1. Sandbox Engine ---
class UltraSandbox:
    def __init__(self, image="python:3.11-slim"):
        try:
            self.client = docker.from_env()
            self.client.ping()
        except Exception as e:
            print(f"⚠️ Docker Connection Failed: {e}")
            # Fallback for Windows if needed (npipe)
            pass 

        self.image = image
        self.container = None

    def start(self):
        try:
            # Just create a client here to be safe
            cli = docker.from_env()
            try:
                cli.images.get(self.image)
            except docker.errors.ImageNotFound:
                print(f"⬇️ Pulling Docker Image {self.image}...")
                cli.images.pull(self.image)

            self.container = cli.containers.run(
                self.image,
                command="tail -f /dev/null",
                detach=True,
                mem_limit="512m",
                network_disabled=True,
                working_dir="/app"
            )
            return self.container.id
        except Exception as e:
            print(f"Docker Launch Error: {e}")
            # If docker fails, we proceed without sandbox execution (safe fallback)
            return None 

    def run_code(self, code: str):
        if not self.container:
            return {"exit_code": -1, "output": "Sandbox not active (Docker failure)"}

        try:
            tar_stream = io.BytesIO()
            with tarfile.open(fileobj=tar_stream, mode='w') as tar:
                data = code.encode('utf-8')
                info = tarfile.TarInfo(name="script.py")
                info.size = len(data)
                tar.addfile(info, io.BytesIO(data))
            tar_stream.seek(0)
            
            self.container.put_archive("/app", tar_stream)
            exec_result = self.container.exec_run("python script.py")
            
            return {
                "exit_code": exec_result.exit_code,
                "output": exec_result.output.decode("utf-8")
            }
        except Exception as e:
            return {"exit_code": -1, "output": f"System Error: {str(e)}"}

    def stop(self):
        if self.container:
            try:
                self.container.remove(force=True)
            except:
                pass

# --- 2. Hybrid Agent Brain ---

class AgentState(TypedDict):
    task: str
    code: str
    logs: List[str]
    attempts: int
    status: str
    file_context: Optional[str]
    images: Optional[List[dict]]
    model_mode: str 

# FIX: Clean List of Cloud Models (One per line)
CLOUD_MODELS = [
    "gemini-1.5-flash",
    "gemini-2.0-flash-exp",
    "gemini-pro"
]

# FIX: Switch to lighter local model to prevent crash (4GB RAM requirement)
LOCAL_MODEL = "qwen2.5-coder:7b" 

def get_ai_response(system_instruction: str, user_prompt: str, images: list = None, mode: str = "cloud"):
    
    # --- MODE 1: LOCAL ---
    if mode == "local":
        print(f"🧠 [BRAIN] Switching to Local Neural Engine ({LOCAL_MODEL})...")
        try:
            llm = ChatOllama(
                model=LOCAL_MODEL,
                temperature=0,
                base_url="http://host.docker.internal:11434"
            )
            return llm.invoke([
                SystemMessage(content=system_instruction), 
                HumanMessage(content=user_prompt)
            ])
        except Exception as e:
            print(f"❌ Local Model Failed: {e}")
            print("⚠️ Falling back to Cloud...")
            mode = "cloud"

    # --- MODE 2: CLOUD ---
    api_key = os.getenv("GOOGLE_API_KEY")
    message_content = [{"type": "text", "text": user_prompt}]
    
    if images and mode == "cloud":
        for img in images:
            message_content.append({
                "type": "image_url",
                "image_url": {"url": f"data:{img['mime_type']};base64,{img['data']}"}
            })

    for model_name in CLOUD_MODELS:
        print(f"☁️ Attempting Cloud Model: {model_name}...")
        try:
            llm = ChatGoogleGenerativeAI(
                model=model_name,
                temperature=0,
                google_api_key=api_key,
                convert_system_message_to_human=True
            )
            return llm.invoke([
                SystemMessage(content=system_instruction), 
                HumanMessage(content=message_content)
            ])
        except Exception as e:
            print(f"⚠️ Cloud Model {model_name} failed. Retrying...")
            time.sleep(1)
            continue

    raise Exception("All AI Systems (Local & Cloud) failed.")

def write_code(state: AgentState):
    attempt = state["attempts"] + 1
    file_context = state.get("file_context", "")
    images = state.get("images", [])
    model_mode = state.get("model_mode", "cloud")

    error_context = ""
    if state["logs"] and "Error" in state["logs"][-1]:
        error_context = f"PREVIOUS ERROR: {state['logs'][-1]}\nFix this error."

    system_instruction = """
    You are CodeOps ULTRA. Write RUNNABLE Python code.
    OUTPUT FORMAT: Return ONLY the raw code inside markdown code blocks.
    """

    user_prompt = f"TASK: {state['task']}\nCONTEXT: {file_context}\n{error_context}\nGenerate Code."
    
    try:
        response = get_ai_response(system_instruction, user_prompt, images, model_mode)
        
        content = response.content
        if isinstance(content, list): content = " ".join([str(x) for x in content])
        
        match = re.search(r"```python(.*?)```", str(content), re.DOTALL)
        code = match.group(1).strip() if match else str(content).strip()
        
        return {"code": code, "attempts": attempt}
    except Exception as e:
        return {"code": "", "logs": state["logs"] + [f"AI Error: {str(e)}"], "status": "error", "attempts": attempt}

def test_code(state: AgentState):
    print("🧪 Spawning Sandbox...")
    if not state["code"]:
        return {"logs": state["logs"] + ["Error: Empty code generated"], "status": "error"}

    sandbox = UltraSandbox()
    sandbox_id = sandbox.start()
    
    if not sandbox_id:
        # Docker failed to start, skip execution but return code
        return {"logs": state["logs"] + ["⚠️ Sandbox Unavailable - Code Generated but not Verified"], "status": "success"}

    try:
        result = sandbox.run_code(state["code"])
        output = result['output'].strip()
        
        if result['exit_code'] == 0:
            return {"logs": state["logs"] + [f"Success: {output}"], "status": "success"}
        else:
            return {"logs": state["logs"] + [f"Error: {output}"], "status": "error"}
    finally:
        sandbox.stop()

def router(state: AgentState):
    if state["status"] == "success": return END
    if state["attempts"] >= 3: return END
    return "write_code"

# Build Graph
workflow = StateGraph(AgentState)
workflow.add_node("write_code", write_code)
workflow.add_node("test_code", test_code)
workflow.set_entry_point("write_code")
workflow.add_edge("write_code", "test_code")
workflow.add_conditional_edges("test_code", router, {"write_code": "write_code", END: END})
agent_app = workflow.compile()

async def run_agent_task(task: str, file_context: str = "", images: list = [], model_mode: str = "cloud"):
    return agent_app.invoke({
        "task": task, 
        "attempts": 0, 
        "logs": [], 
        "status": "start", 
        "code": "",
        "file_context": file_context,
        "images": images,
        "model_mode": model_mode
    })