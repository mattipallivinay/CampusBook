
from app.rag.vector_store import create_vector_store, search_documents

try:
    chunks = [
        "A data structure organizes and stores data efficiently.",
        "An array stores elements in contiguous memory locations.",
        "A linked list consists of nodes connected using pointers.",
        "A stack follows the Last In First Out (LIFO) principle."
    ]

    vector_store = create_vector_store(chunks)

    results = search_documents(
        vector_store,
        "Explain the LIFO principle",
        k=2
    )

    print("FAISS test successful!")
    print("\nRelevant documents:")

    for result in results:
        print("-", result.page_content)

except Exception as error:
    print("FAISS test failed:")
    print(error)
