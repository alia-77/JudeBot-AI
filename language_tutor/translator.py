import os

from transformers import MarianTokenizer, MarianMTModel


MODEL_PATH = os.getenv(
    "TRANSLATOR_MODEL_PATH",
    "../language-learning-transformer/fine_tuned_model_checkpoint",
)


class FrenchEnglishTranslator:
    def __init__(self, model_path=MODEL_PATH):
        self.tokenizer = MarianTokenizer.from_pretrained(model_path)
        self.model = MarianMTModel.from_pretrained(model_path)

    def translate(self, text):
        inputs = self.tokenizer(
            text,
            return_tensors="pt",
            padding=True,
            truncation=True,
        )

        translated = self.model.generate(
            **inputs,
            max_length=128,
        )

        return self.tokenizer.decode(
            translated[0],
            skip_special_tokens=True,
        )