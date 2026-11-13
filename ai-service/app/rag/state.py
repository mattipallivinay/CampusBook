
from app.rag.vector_store import STORAGE_DIR, load_vector_store

# Stores all loaded document indexes
vector_stores = {}


def load_saved_indexes():
    """Load all previously saved FAISS indexes."""

    for index_path in STORAGE_DIR.iterdir():

        if index_path.is_dir():
            try:
                vector_stores[index_path.name] = load_vector_store(
                    index_path.name
                )

                print(f"Loaded FAISS index: {index_path.name}")

            except Exception as error:
                print(
                    f"Could not load index {index_path.name}: {error}"
                )
