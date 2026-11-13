
from app.embeddings.google_embeddings import generate_embeddings

try:
    texts = [
        "A data structure organizes and stores data.",
        "An array stores elements in contiguous memory locations."
    ]

    vectors = generate_embeddings(texts)

    print("Local embedding test successful!")
    print("Number of vectors:", len(vectors))
    print("Vector dimensions:", len(vectors[0]))

except Exception as error:
    print("Embedding test failed:")
    print(error)
