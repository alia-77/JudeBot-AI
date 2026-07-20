from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings

from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
    Docx2txtLoader,
)

from config import GEMINI_API_KEY

embeddings = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-001",
    google_api_key=GEMINI_API_KEY
)

vector_store = None

def load_document(filepath):

    global vector_store

    if filepath.endswith(".pdf"):
        loader = PyPDFLoader(filepath)

    elif filepath.endswith(".txt"):
        loader = TextLoader(filepath, encoding="utf-8")

    elif filepath.endswith(".docx"):
        loader = Docx2txtLoader(filepath)

    else:
        raise Exception("Unsupported file type.")

    documents = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    chunks = splitter.split_documents(documents)
    vector_store = FAISS.from_documents(
        chunks,
        embeddings
    )


def retrieve_context(question):
    global vector_store

    if vector_store is None:
        return None

    docs = vector_store.similarity_search(
        question,
        k=4
    )

    return "\n\n".join(
        doc.page_content for doc in docs
    )