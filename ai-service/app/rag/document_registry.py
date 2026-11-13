
import json
from datetime import datetime, timezone
from pathlib import Path
import shutil

STORAGE_DIR = Path(__file__).resolve().parents[2] / "storage"
REGISTRY_FILE = STORAGE_DIR / "documents.json"

STORAGE_DIR.mkdir(parents=True, exist_ok=True)


def load_registry() -> dict:
    """Load document metadata from JSON storage."""

    if not REGISTRY_FILE.exists():
        return {}

    with open(REGISTRY_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def save_registry(registry: dict) -> None:
    """Save document metadata to JSON storage."""

    temp_file = REGISTRY_FILE.with_suffix(".tmp")

    with open(temp_file, "w", encoding="utf-8") as file:
        json.dump(registry, file, indent=4)

    temp_file.replace(REGISTRY_FILE)


def register_document(
    document_id: str,
    filename: str,
    total_pages: int,
    total_chunks: int
) -> dict:

    registry = load_registry()

    document = {
        "document_id": document_id,
        "filename": filename,
        "total_pages": total_pages,
        "total_chunks": total_chunks,
        "uploaded_at": datetime.now(timezone.utc).isoformat()
    }

    registry[document_id] = document

    save_registry(registry)

    return document


def get_all_documents() -> list[dict]:
    """Return metadata for all uploaded documents."""

    registry = load_registry()
    return list(registry.values())


def get_document(document_id: str) -> dict | None:
    """Find a document using its unique ID."""

    registry = load_registry()
    return registry.get(document_id)


def remove_document(document_id: str) -> bool:
    """Remove document metadata."""

    registry = load_registry()

    if document_id not in registry:
        return False

    del registry[document_id]
    save_registry(registry)

    return True
def delete_document_storage(document_id: str) -> bool:
    """Delete the saved FAISS index for a document."""

    index_path = (
        STORAGE_DIR / "faiss" / document_id
    )

    if not index_path.exists():
        return False

    shutil.rmtree(index_path)

    return True