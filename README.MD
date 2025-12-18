🚀 CodeOps ULTRA: Enterprise Edition

Autonomous AI Engineering Agent with Secure Docker Sandboxing & Multimodal Analysis.

🌟 Overview

CodeOps ULTRA is a next-generation AI software engineer designed for enterprise environments. Unlike standard coding assistants, it doesn't just generate code—it verifies it.

The system features a Self-Correction Loop: it writes code, spins up an isolated Docker Container, executes the script, captures logs/errors, and automatically fixes bugs before presenting the solution to the user. It also supports Multimodal RAG, allowing it to "see" error screenshots and "read" PDF documentation to inform its solutions.

✨ Key Features

🛡️ Secure Sandbox Engine: Every task runs in an ephemeral, network-isolated Docker container. Malicious code cannot escape.

🧠 Autonomous Self-Healing: The Agent detects runtime errors (e.g., ZeroDivisionError, SyntaxError) and rewrites the code automatically.

👁️ Multimodal Vision: Drag & Drop error screenshots or architecture diagrams; the Agent analyzes them to generate fixes.

📄 Document RAG: Upload PDFs/Text files to give the Agent context about your specific codebase or requirements.

💾 Persistent Memory: Full audit logs and project history stored in PostgreSQL.

🎨 Cyberpunk Mission Control: A stunning Next.js 14 frontend with glassmorphism UI, real-time terminal logs, and Monaco Editor.

🏗️ Architecture

The system follows a modern Microservices architecture orchestrated by Docker Compose:

Frontend: Next.js 14 (TypeScript, Tailwind CSS, Framer Motion)

Backend API: FastAPI (Python 3.11, Async)

AI Orchestration: LangGraph + LangChain + Google Gemini 1.5 Flash

Database: PostgreSQL 15 (Async SQLAlchemy)

Infrastructure: Docker Engine + Docker Socket (Docker-in-Docker)

🚀 Quick Start Guide

Prerequisites

Docker Desktop (Must be running)

Google Gemini API Key (Free Tier is supported)

Installation

Clone the Repository

git clone [https://github.com/Arjo216/CodeOPS-ULTRA-Enterprise.git](https://github.com/yourusername/codeops-ultra.git)
cd codeops-ultra


Configure Environment
Create a .env file in the root directory:


Launch System (Docker Compose)
This single command builds the backend, sets up the database, and starts the frontend.

docker-compose up --build


Access the Dashboard

Mission Control UI: http://localhost:3000

API Documentation: http://localhost:8000/docs

🧪 Usage Examples

Scenario A: The "Impossible" Algorithm

Prompt: "Write a Python script to verify the Collatz Conjecture for the first 10,000 integers. Print the number with the longest chain."

Result: The Agent writes efficient code, runs it in the sandbox, and returns the verified output 97 (or similar depending on range) along with the source code.

Scenario B: Visual Debugging

Take a screenshot of a React error in your browser.

Drag the image into the Context Files zone.

Prompt: "Fix the error shown in this screenshot."

Result: The Agent analyzes the stack trace in the image and provides the corrected code block.

📂 Project Structure

CodeOPS_Enterprise/
├── docker-compose.yml       # Infrastructure Orchestration
├── README.md                # Documentation
├── backend/                 # FastAPI Python Server
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py          # API Entry Point
│       ├── models.py        # Database Schema
│       ├── routers/         # API Endpoints
│       └── services/        # Business Logic
│           ├── agent_service.py  # LangGraph Brain & Sandbox
│           └── file_service.py   # PDF/Image Processing
└── frontend/                # Next.js React Client
    ├── src/
    │   ├── app/             # App Router Pages
    │   ├── components/      # UI Components
    │   │   └── dashboard/   # Agent Console & Upload Zone
    │   └── lib/             # Utilities
    └── tailwind.config.ts   # Cyberpunk Theme Config


🤝 Contributing

Fork the repository

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License

Distributed under the MIT License. See LICENSE for more information.
