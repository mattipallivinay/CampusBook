
from app.llm import llm

try:
    response = llm.invoke("Explain what an AI assistant is in one sentence.")
    print("\nGemini Response:")
    print(response.content)
    print("\nGemini connection successful!")

except Exception as error:
    print("Gemini connection failed:")
    print(error)
