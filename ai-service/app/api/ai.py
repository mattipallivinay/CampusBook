
import os
import tempfile
import uuid

from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel

from app.rag import state
from app.rag.ingestion import ingest_pdf
from app.rag.qa_service import answer_question
from app.rag.document_registry import (
    register_document,
    get_all_documents,
    get_document,
    remove_document,
    delete_document_storage
)

router = APIRouter(prefix="/api/ai", tags=["CampusBook AI"])


class QuestionRequest(BaseModel):
    question: str
    document_id: str


@router.post("/upload")
def upload_document(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported"
        )

    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".pdf"
        ) as temp_file:
            temp_path = temp_file.name
            temp_file.write(file.file.read())

        document_id = str(uuid.uuid4())
        result = ingest_pdf(temp_path, document_id)
        state.vector_stores[document_id] = result["vector_store"]
        document = register_document(
    document_id=document_id,
    filename=file.filename,
    total_pages=result["total_pages"],
    total_chunks=result["total_chunks"]
        )

        return {
    "success": True,
    "message": result["message"],
    "document_id": result["document_id"],
    "document": document,
    "total_pages": result["total_pages"],
    "total_chunks": result["total_chunks"]
        }
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)

@router.get("/documents")
def list_documents():

    try:
        documents = get_all_documents()

        return {
            "success": True,
            "total_documents": len(documents),
            "documents": documents
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


@router.delete("/documents/{document_id}")
def delete_document(document_id: str):

    document = get_document(document_id)

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    try:
        # Remove the saved FAISS index
        delete_document_storage(document_id)

        # Remove the in-memory vector store
        state.vector_stores.pop(document_id, None)

        # Remove document metadata
        remove_document(document_id)

        return {
            "success": True,
            "message": "Document and its associated data deleted successfully.",
            "document_id": document_id
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


@router.post("/ask")
def ask_question(request: QuestionRequest):

    vector_store = state.vector_stores.get(request.document_id)

    if vector_store is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found. Please upload the PDF first."
        )

    try:
        result = answer_question(
            vector_store,
            request.question
        )

        return {
            "success": True,
            "data": result
        }

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

