import base64
from fastapi import UploadFile
from pypdf import PdfReader
from PIL import Image
import io

async def process_file(file: UploadFile):
    """
    Reads a file and returns a format suitable for Gemini.
    - PDF: Returns extracted text.
    - Image: Returns base64 encoded string.
    - Text: Returns string content.
    """
    content = await file.read()
    filename = file.filename.lower()
    
    # Case 1: PDF Processing
    if filename.endswith(".pdf"):
        try:
            pdf_file = io.BytesIO(content)
            reader = PdfReader(pdf_file)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return {"type": "text", "content": f"--- FILE CONTENT ({filename}) ---\n{text}\n----------------"}
        except Exception as e:
            return {"type": "error", "content": f"Failed to read PDF: {str(e)}"}

    # Case 2: Image Processing (Gemini Vision)
    elif filename.endswith((".png", ".jpg", ".jpeg", ".webp")):
        try:
            # Optimize image size if needed, but for now just base64 encode
            encoded_image = base64.b64encode(content).decode("utf-8")
            return {"type": "image", "mime_type": file.content_type, "data": encoded_image}
        except Exception as e:
            return {"type": "error", "content": f"Failed to process Image: {str(e)}"}

    # Case 3: Text/Code Files
    else:
        try:
            text_content = content.decode("utf-8")
            return {"type": "text", "content": f"--- FILE CONTENT ({filename}) ---\n{text_content}\n----------------"}
        except:
            return {"type": "error", "content": "File type not supported or unreadable."}