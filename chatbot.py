from datetime import datetime

from google import genai

from config import GEMINI_API_KEY, MODEL_NAME
from language_tutor.tutor import build_tutor_prompt
from language_tutor.translator import FrenchEnglishTranslator
from rag import retrieve_context


client = genai.Client(api_key=GEMINI_API_KEY)
translator = None


def get_translator():
    global translator

    if translator is None:
        translator = FrenchEnglishTranslator()

    return translator


def ask_gemini(prompt, history, image_path=None, mode="chat"):
    from PIL import Image

    today = datetime.now().strftime("%B %d, %Y")

    if mode == "tutor":
        system_prompt = build_tutor_prompt(today)
    else:
        system_prompt = ""

    if image_path:
        image = Image.open(image_path)

        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=[
                system_prompt,
                image,
                prompt,
            ],
        )

        history.append(("user", prompt))
        history.append(("model", response.text))

        return response.text, history

    if mode == "tutor":
        translation = get_translator().translate(prompt)

        tutor_prompt = f"""
French:
{prompt}

English translation:
{translation}
"""
    else:
        tutor_prompt = prompt

    context = retrieve_context(prompt)

    if context:
        tutor_prompt = f"""
Use the following document to answer the user's question.

Document:
{context}

{tutor_prompt}
"""

    contents = []

    if system_prompt:
        contents.append(
            {
                "role": "user",
                "parts": [{"text": system_prompt}],
            }
        )

    for role, text in history:
        contents.append(
            {
                "role": role,
                "parts": [{"text": text}],
            }
        )

    contents.append(
        {
            "role": "user",
            "parts": [{"text": tutor_prompt}],
        }
    )

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=contents,
    )

    history.append(("user", prompt))
    history.append(("model", response.text))

    return response.text, history


def clear_history():
    pass