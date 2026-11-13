
from app.llm import llm
from app.rag.vector_store import search_documents
from langchain_core.prompts import ChatPromptTemplate


INSUFFICIENT_INFO = (
    "The uploaded study material does not contain enough "
    "information to answer this question."
)


prompt = ChatPromptTemplate.from_template("""
You are CampusBook AI, an expert academic tutor and university
examination answer writer.

Your task is to answer students' questions using ONLY the
provided uploaded study material.

STUDY MATERIAL:
{context}

STUDENT QUESTION:
{question}

ACADEMIC ANSWER INSTRUCTIONS:

1. Understand the question carefully.
2. Identify whether the student requests a 2-mark, 5-mark,
   10-mark, or other examination answer.
3. Adjust the answer length and depth according to the marks.

FOR 2-MARK QUESTIONS:
- Give a precise definition or direct answer.
- Include two important points.
- Keep the answer short and easy to memorize.

FOR 5-MARK QUESTIONS:
- Start with a brief introduction.
- Explain the concept using 4-6 meaningful points.
- Include relevant examples where available.
- Use headings and bullet points.

FOR 10-MARK QUESTIONS:
- Start with a clear introduction and definition.
- Explain the concept in sufficient academic detail.
- Organize the answer using meaningful headings.
- Include 8-12 substantial, well-explained points where
  the supplied material supports them.
- Explain important principles, characteristics,
  operations, applications, advantages, and examples
  when relevant to the question.
- Include step-by-step explanations where appropriate.
- Include a relevant example where available.
- Finish with a meaningful conclusion.
- Provide enough detail for a university examination.
- Do not artificially shorten the answer.

GENERAL RULES:
- Use simple, clear academic English.
- Prefer numbered points and meaningful headings.
- Explain each point rather than listing keywords.
- Do not repeat the same information.
- Do not invent facts or unsupported examples.
- Never introduce information absent from the study material.
- If the material does not sufficiently answer the question,
  clearly explain that limitation.
- Keep the answer relevant to the exact question.

Write the final answer in a clean, examination-ready format.
""")



def answer_question(vector_store, question: str):

    if not question.strip():
        raise ValueError("Question cannot be empty.")

    documents = search_documents(
        vector_store,
        question,
        k=4,
        score_threshold=0.30
    )

    if not documents:
        return {
            "answer": INSUFFICIENT_INFO,
            "sources": []
        }

    context = "\n\n".join(
        f"[Page {document.metadata['page_number']}]\n"
        f"{document.page_content}"
        for document in documents
    )

    messages = prompt.format_messages(
        context=context,
        question=question,
        insufficient_info=INSUFFICIENT_INFO
    )

    response = llm.invoke(messages)

    sources = [
        {
            "page_number": document.metadata["page_number"],
            "content": document.page_content
        }
        for document in documents
    ]

    return {
        "answer": response.content,
        "sources": sources
    }
