from google import genai
from datetime import datetime

from rag import retrieve_context
from config import GEMINI_API_KEY, MODEL_NAME

client = genai.Client(api_key=GEMINI_API_KEY)

def ask_gemini(prompt, history, image_path=None):

    from PIL import Image

    today = datetime.now().strftime("%B %d, %Y")

    system_prompt = f"""
You are JudeBot.

You are a friendly, intelligent AI assistant.

Today's date is {today}.

Always answer clearly and professionally.

When appropriate:
- use Markdown
- explain concepts with examples
- format code properly

If the user uploads a document, base your answers primarily on that document.
"""

    # Image uploaded
    if image_path:

        image = Image.open(image_path)

        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=[
                system_prompt,
                image,
                prompt
            ]
        )

        history.append(("user", prompt))
        history.append(("model", response.text))

        return response.text, history

    # Document RAG
    context = retrieve_context(prompt)

    if context:
        prompt = f"""
Use the following document to answer the user's question.

Document:
{context}

Question:
{prompt}
"""

    contents = [
        {
            "role": "user",
            "parts": [{"text": system_prompt}]
        }
    ]

    for role, text in history:
        contents.append(
            {
                "role": role,
                "parts": [{"text": text}]
            }
        )

    contents.append(
        {
            "role": "user",
            "parts": [{"text": prompt}]
        }
    )

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=contents
    )

    history.append(("user", prompt))
    history.append(("model", response.text))

    return response.text, history

def clear_history():
    pass