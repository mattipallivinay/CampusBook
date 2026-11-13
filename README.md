# 🎓 CampusBook

### Your Campus. Your Knowledge. One Platform.

<p align="center">
  A full-stack campus learning platform that brings academic resources, course management, student collaboration, a book marketplace, and AI-powered learning assistance together in one place.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-Enabled-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Python-AI_Service-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Express.js-API-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/FastAPI-AI_Service-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
</p>

---

## 📌 Overview

**CampusBook** is a full-stack academic platform designed to simplify campus life by connecting students, faculty, and administrators through a unified digital environment.

The platform combines academic resource sharing, course enrollment, faculty uploads, a student marketplace, and an AI-powered study assistant. Its AI service uses Retrieval-Augmented Generation (RAG) to help students understand uploaded academic documents and obtain context-aware answers.

Built with a modular architecture, CampusBook separates the frontend, backend API, AI service, and database into independent components.

## ✨ Key Features

### 🤖 AI-Powered Study Assistant
- Ask questions about uploaded academic documents.
- PDF document processing and text extraction.
- Semantic search using Sentence Transformers.
- Vector similarity search with FAISS.
- Context-aware responses powered by Google Gemini.
- Document-based question answering.

### 📚 Academic Resource Management
- Browse academic resources.
- Search and filter learning materials.
- Access course-related resources.
- Faculty resource upload functionality.
- Cloud-based file storage using Cloudinary.

### 🎓 Course Management
- Browse available courses.
- Course enrollment for students.
- View enrolled courses.
- Faculty and administrator course management.

### 🛒 Campus Marketplace
- Browse available academic books.
- Create book listings.
- Manage personal listings.
- Track listing availability and status.

### 📊 Role-Based Dashboard
- Student dashboard with academic statistics.
- Faculty dashboard with resource and marketplace statistics.
- Administrator dashboard with platform statistics.
- Role-based access control.

### 👤 User Management
- User authentication using JWT.
- Student, Faculty, and Admin roles.
- Profile information.
- Account settings and logout.

## 🏗️ System Architecture

CampusBook follows a modular full-stack architecture.

```text
                 ┌──────────────────────┐
                 │      FRONTEND        │
                 │   React + TypeScript │
                 │     Vite + Tailwind  │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │     BACKEND API      │
                 │   Node.js + Express  │
                 │   JWT Authentication│
                 └───────┬───────┬──────┘
                         │       │
              ┌──────────┘       └──────────┐
              ▼                             ▼
    ┌──────────────────┐          ┌──────────────────┐
    │    PostgreSQL    │          │    AI SERVICE    │
    │      Prisma      │          │ Python + FastAPI │
    │                  │          │                  │
    │ Users            │          │ PDF Processing   │
    │ Courses          │          │ Embeddings       │
    │ Enrollments      │          │ FAISS Vector DB  │
    │ Resources        │          │ Gemini LLM       │
    │ Marketplace      │          │ RAG Pipeline     │
    │ Conversations    │          │                  │
    └──────────────────┘          └──────────────────┘
                                            │
                                            ▼
                                  ┌──────────────────┐
                                  │  Google Gemini   │
                                  │  AI Integration  │
                                  └──────────────────┘

                 ┌──────────────────────┐
                 │      Cloudinary      │
                 │    File Storage      │
                 └──────────────────────┘
```

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Routing | React Router |
| HTTP Client | Axios |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JSON Web Tokens (JWT) |
| AI Framework | Python, FastAPI |
| Language Model | Google Gemini 2.5 Flash |
| Embeddings | Sentence Transformers |
| Vector Database | FAISS |
| Document Processing | PDF processing and text chunking |
| File Storage | Cloudinary |
| Version Control | Git and GitHub |

## 📂 Project Structure

```text
CampusBook/
│
├── ai-service/
│   ├── app/
│   │   ├── api/
│   │   ├── document_processing/
│   │   ├── embeddings/
│   │   ├── rag/
│   │   ├── agents/
│   │   ├── llm.py
│   │   └── main.py
│   ├── requirements.txt
│   └── tests/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.ts
│   └── package.json
│
├── database/
│   └── prisma/
│       ├── migrations/
│       └── schema.prisma
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## ⚙️ Installation and Setup

### 1. Prerequisites

Make sure the following tools are installed:

- Node.js and npm
- Python 3.11+
- PostgreSQL
- Git
- Google Gemini API key
- Cloudinary account

### 2. Clone the Repository

```bash
git clone https://github.com/mattipallivinay/CampusBook.git

cd CampusBook
```

### 3. Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend development server:

```text
http://localhost:5173
```

### 4. Backend Setup

```bash
cd backend

npm install
```

Configure your backend environment variables in `backend/.env` before starting the API.

### 5. AI Service Setup

```bash
cd ai-service

python -m venv venv
```

Activate the virtual environment:

**Windows:**

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure the required Gemini API key in `ai-service/.env`.

Start the AI service:

```bash
uvicorn app.main:app --reload --port 8000
```

AI service:

```text
http://localhost:8000
```

### 6. Database Configuration

- Install and start PostgreSQL.
- Create a PostgreSQL database for CampusBook.
- Configure the database connection string in `backend/.env`.
- Apply the Prisma migrations using the project's configured Prisma schema and migration setup.

**Important:** Never commit `.env` files, API keys, database passwords, JWT secrets, or other credentials to GitHub.

## 🌐 Development Services

| Service | Local URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| AI Service | http://localhost:8000 |

## 🔐 Security

CampusBook uses several security-related mechanisms:

- JWT-based authentication.
- Role-based authorization.
- Protected API routes.
- Environment-based configuration.
- Database access through Prisma.
- Cloud-based document storage.

## 📸 Screenshots

Screenshots of the application will be added here.

| Dashboard | AI Study Assistant |
|---|---|
| *Coming soon* | *Coming soon* |

| Course Catalog | Campus Marketplace |
|---|---|
| *Coming soon* | *Coming soon* |

## 🚀 Future Enhancements

Potential improvements planned for CampusBook:

- Real-time notifications.
- Enhanced faculty and student collaboration.
- Advanced analytics and reporting.
- Improved AI-generated study materials.
- Personalized learning recommendations.
- Enhanced marketplace functionality.
- Automated testing and deployment pipelines.

## 👥 Team

**CampusBook** is developed as a final-year undergraduate major project by a team of four members.

## 📄 License

This project is currently developed for academic purposes. A formal open-source license can be added when the project licensing decision is finalized.

---

<p align="center">
  <b>Built with ❤️ for smarter campus learning.</b>
</p>

<p align="center">
  ⭐ If you find CampusBook interesting, consider starring the repository!
</p>