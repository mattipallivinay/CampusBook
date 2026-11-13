
from app.document_processing.pdf_loader import extract_text_from_pdf
from app.document_processing.text_chunker import split_text
from app.rag.vector_store import create_vector_store, save_vector_store


def ingest_pdf(file_path: str, document_id: str):

    pages = extract_text_from_pdf(file_path)

    chunks = split_text(pages)

    if not chunks:
        raise ValueError("No text chunks were generated from the PDF.")

    vector_store = create_vector_store(chunks)

    # Save this document's FAISS index permanently
    save_vector_store(vector_store, document_id)

    return {
        "vector_store": vector_store,
        "document_id": document_id,
        "total_pages": len(pages),
        "total_chunks": len(chunks),
        "message": "PDF successfully processed and indexed."
    }
