
from pathlib import Path

from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_core.embeddings import Embeddings

from app.embeddings.google_embeddings import (
    generate_embeddings,
    generate_query_embedding
)


class LocalEmbeddings(Embeddings):

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        return generate_embeddings(texts)

    def embed_query(self, text: str) -> list[float]:
        return generate_query_embedding(text)


embeddings = LocalEmbeddings()

STORAGE_DIR = Path(__file__).resolve().parents[2] / "storage" / "faiss"
STORAGE_DIR.mkdir(parents=True, exist_ok=True)


def create_vector_store(chunks: list[dict]) -> FAISS:
    if not chunks:
        raise ValueError("No document chunks provided.")

    documents = [
        Document(
            page_content=chunk["text"],
            metadata={
                "chunk_id": index,
                "page_number": chunk["page_number"]
            }
        )
        for index, chunk in enumerate(chunks)
    ]

    return FAISS.from_documents(documents, embeddings)


def save_vector_store(vector_store: FAISS, document_id: str) -> None:
    index_path = STORAGE_DIR / document_id
    index_path.mkdir(parents=True, exist_ok=True)

    vector_store.save_local(str(index_path))


def load_vector_store(document_id: str) -> FAISS:
    index_path = STORAGE_DIR / document_id

    if not index_path.exists():
        raise FileNotFoundError(
            f"No saved FAISS index found for document: {document_id}"
        )

    return FAISS.load_local(
        str(index_path),
        embeddings,
        allow_dangerous_deserialization=True
    )


def search_documents(
    vector_store: FAISS,
    question: str,
    k: int = 4,
    score_threshold: float = 0.30
) -> list[Document]:

    results = vector_store.similarity_search_with_relevance_scores(
        question,
        k=k
    )

    return [
        document
        for document, score in results
        if score >= score_threshold
    ]
