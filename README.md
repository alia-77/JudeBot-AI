# JudeBot

JudeBot is a modern AI-powered chatbot built with FastAPI and Google's Gemini API. It provides conversational AI, document question answering through Retrieval-Augmented Generation (RAG), and a clean web interface.

---

## Features

- AI chatbot powered by Google Gemini
- Conversation memory during the session
- Upload PDF, DOCX, and TXT documents
- Retrieval-Augmented Generation (RAG) using FAISS
- Markdown rendering
- Syntax highlighting for code responses
- Responsive web interface
- Enter to send messages
- Shift + Enter for multiline input
- Clear conversation history

---

## Technologies

- Python
- FastAPI
- Google Gemini API
- LangChain
- FAISS
- HTML
- CSS
- JavaScript

---

## Project Structure

```
JudeBot/
│
├── app.py
├── chatbot.py
├── config.py
├── rag.py
├── templates/
├── static/
├── uploads/
├── requirements.txt
└── README.md
```

---

## Installation

Clone the repository

```bash
<<<<<<< HEAD
git clone https://github.com/alia-77/JudeBot-AI.git
=======
git clone https://github.com/alia-77/JudeBot-AI
>>>>>>> 1f43532 (Update JudeBot README)
cd JudeBot-AI
```

Create a virtual environment

```bash
python -m venv venv
```

Activate it

Windows

```bash
venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Create a `.env` file

```env
GEMINI_API_KEY=YOUR_API_KEY
```

Run the application

```bash
uvicorn app:app --reload
```

Open

```
http://127.0.0.1:8000
```

---

## Future Improvements

- User authentication
- SQLite database
- Persistent conversation history
- Multiple-document RAG
- Public deployment

