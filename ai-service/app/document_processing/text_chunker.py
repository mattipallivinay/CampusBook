
def split_text(
    pages: list[dict],
    chunk_size: int = 1000,
    chunk_overlap: int = 200
) -> list[dict]:

    if chunk_size <= 0:
        raise ValueError("Chunk size must be greater than zero.")

    if chunk_overlap < 0 or chunk_overlap >= chunk_size:
        raise ValueError("Invalid chunk overlap.")

    chunks = []

    for page in pages:
        text = page["text"]
        page_number = page["page_number"]

        start = 0

        while start < len(text):
            end = start + chunk_size

            if end < len(text):
                boundary = text.rfind(" ", start, end)
                if boundary > start:
                    end = boundary

            chunk_text = text[start:end].strip()

            if chunk_text:
                chunks.append({
                    "page_number": page_number,
                    "text": chunk_text
                })

            start = end - chunk_overlap

    return chunks

