from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline


# =========================================================
# CREATE FASTAPI APP
# =========================================================

app = FastAPI(title="StudyBuddy AI")


# =========================================================
# CORS
# Allows React frontend to communicate with FastAPI
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# LOAD OPEN-SOURCE AI MODEL
# =========================================================

generator = pipeline(
    "text-generation",
    model="Qwen/Qwen2.5-0.5B-Instruct",
    device=-1
)


# =========================================================
# REQUEST MODELS
# =========================================================

class StudyRequest(BaseModel):
    topic: str


class ExamRequest(BaseModel):
    topic: str


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():
    return {
        "message": "StudyBuddy AI is running!"
    }


# =========================================================
# EXPLAIN TOPIC
# =========================================================

@app.post("/explain")
def explain_topic(request: StudyRequest):

    prompt = f"""Explain the college topic: {request.topic}

Give a simple explanation for a college student.

Include:

Definition:
Simple Explanation:
Real-World Example:
Key Points:

Use simple English.
"""

    result = generator(
        prompt,
        max_new_tokens=180,
        do_sample=False,
        return_full_text=False
    )

    explanation = result[0]["generated_text"].strip()

    return {
        "topic": request.topic,
        "explanation": explanation
    }


# =========================================================
# EXAM PREPARATION
# =========================================================

@app.post("/exam")
def exam_preparation(request: ExamRequest):

    topic = request.topic

    # Important questions
    questions = [
        f"What is {topic}?",
        f"Explain the main concepts of {topic}.",
        f"What are the important features of {topic}?",
        f"Explain the advantages of {topic}.",
        f"Explain the limitations of {topic}."
    ]

    # Short answer questions
    short_questions = [
        f"Define {topic}.",
        f"Write two important points about {topic}.",
        f"Give one real-world example of {topic}."
    ]

    # MCQs
    mcqs = [
        {
            "question": f"What is the main purpose of {topic}?",
            "options": [
                "To manage and organize information",
                "To play games",
                "To edit images",
                "To create music"
            ],
            "answer": "To manage and organize information"
        },
        {
            "question": f"Which statement about {topic} is correct?",
            "options": [
                "It helps solve problems related to the topic",
                "It is only used for entertainment",
                "It cannot be used in software",
                "It has no practical applications"
            ],
            "answer": "It helps solve problems related to the topic"
        }
    ]

    # Quick revision
    revision_points = [
        f"Understand the definition of {topic}.",
        f"Learn the main concepts of {topic}.",
        f"Remember important features of {topic}.",
        f"Study advantages and limitations of {topic}.",
        f"Practice examples related to {topic}."
    ]

    return {
        "topic": topic,
        "important_questions": questions,
        "short_answer_questions": short_questions,
        "mcqs": mcqs,
        "revision_points": revision_points
    }