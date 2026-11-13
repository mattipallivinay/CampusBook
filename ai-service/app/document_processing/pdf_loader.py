
from pathlib import Path
from pypdf import PdfReader


def extract_text_from_pdf(file_path: str) -> list[dict]:
    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"PDF file not found: {file_path}")

    if path.suffix.lower() != ".pdf":
        raise ValueError("Only PDF files are supported.")

    reader = PdfReader(str(path))
    extracted_pages = []

    for page_number, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""

        if text.strip():
            extracted_pages.append({
                "page_number": page_number,
                "text": text.strip()
            })

    if not extracted_pages:
        raise ValueError(
            "No readable text found. The PDF may contain scanned images."
        )

    return extracted_pages
