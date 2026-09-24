# JudeBot

JudeBot is an AI-powered chatbot built with FastAPI and Google's Gemini API. It supports general conversation, document-based question answering, and an interactive French Tutor mode.

## Features

* AI chat powered by Google Gemini
* Session-based conversation history
* French Tutor mode with grammar correction and explanations
* French → English translation using a fine-tuned MarianMT model
* PDF, DOCX, and TXT document uploads
* Retrieval-Augmented Generation (RAG) with FAISS
* Markdown and code syntax highlighting
* Responsive web interface
* Conversation history clearing

## Tech Stack

* Python
* FastAPI
* Google Gemini API
* Hugging Face Transformers
* MarianMT
* LangChain
* FAISS
* HTML, CSS, JavaScript

## Project Structure

```text
JudeBot/
├── app.py
├── chatbot.py
├── config.py
├── rag.py
├── language_tutor/
├── templates/
├── static/
├── uploads/
├── requirements.txt
└── README.md
```

## Installation

Clone the repository:

```bash
git clone https://github.com/alia-77/JudeBot-AI
cd JudeBot-AI
```

Create and activate a virtual environment:

```bash
python -m venv venv
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file:

```env
GEMINI_API_KEY=YOUR_API_KEY
```

Run the application:

```bash
uvicorn app:app --reload
```

Then open `http://127.0.0.1:8000`.

## Future Improvements

* Chat/Tutor mode selector in the UI
* Persistent conversation history
* User authentication
* Improved multi-document RAG
* Public deployment
