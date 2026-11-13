
from sentence_transformers import SentenceTransformer

# Load the local embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")


def generate_embeddings(texts: list[str]) -> list[list[float]]:
    """Generate local embeddings for document chunks."""
    vectors = model.encode(
        texts,
        convert_to_numpy=True,
        normalize_embeddings=True
    )

    return vectors.tolist()


def generate_query_embedding(text: str) -> list[float]:
    """Generate an embedding for a student question."""
    vector = model.encode(
        text,
        convert_to_numpy=True,
        normalize_embeddings=True
    )

    return vector.tolist()
