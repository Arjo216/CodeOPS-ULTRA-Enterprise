from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.services.agent_service import run_agent_task
from app.services.file_service import process_file
from app.database import get_db
from app.models import AuditLog

router = APIRouter()

@router.post("/solve")
async def solve_task(
    task: str = Form(...), 
    mode: str = Form("cloud"), # <--- NEW PARAMETER
    files: List[UploadFile] = File(default=[]),
    db: AsyncSession = Depends(get_db)
):
    try:
        combined_text_context = ""
        image_data = []

        for file in files:
            processed = await process_file(file)
            if processed["type"] == "text":
                combined_text_context += processed["content"] + "\n"
            elif processed["type"] == "image":
                image_data.append(processed)

        # Pass the 'mode' to the agent
        result = await run_agent_task(task, combined_text_context, image_data, mode)
        
        try:
            new_log = AuditLog(
                project_id=1,
                task_prompt=task,
                ai_response_code=result.get("code", ""),
                execution_output="\n".join(result.get("logs", [])),
                status=result.get("status", "unknown"),
                attempts_count=result.get("attempts", 0)
            )
            db.add(new_log)
            await db.commit()
        except Exception:
            pass
        
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))