from fastapi import FastAPI, Request, UploadFile, File
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware

import os

from chatbot import ask_gemini, clear_history
from rag import load_document

app = FastAPI()

app.add_middleware(
    SessionMiddleware,
    secret_key="CHANGE_THIS_TO_A_RANDOM_SECRET_KEY"
)

os.makedirs("uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html"
    )


@app.post("/chat")
async def chat(request: Request):

    data = await request.json()
    message = data.get("message", "")
    history = request.session.get("history", [])

    # reply, history = ask_gemini(message, history)

    image_path = request.session.get("image_path")
    reply, history = ask_gemini(
        message,
        history,
        image_path
    )

    request.session["history"] = history

    return JSONResponse(
        {
            "reply": reply
        }
    )


@app.post("/clear")
async def clear(request: Request):

    request.session["history"] = []

    clear_history()

    return {"status": "success"}


@app.post("/upload")
async def upload(request: Request, file: UploadFile = File(...)):

    filepath = os.path.join("uploads", file.filename)

    with open(filepath, "wb") as f:
        f.write(await file.read())

    ext = os.path.splitext(file.filename)[1].lower()

    if ext in [".pdf", ".txt", ".docx"]:
        load_document(filepath)
        request.session["image_path"] = None

    elif ext in [".png", ".jpg", ".jpeg"]:
        request.session["image_path"] = filepath

    else:
        return {"message": "Unsupported file type."}

    return {"message": "Upload successful."}