# Project Nebula 🌌

A personal AI assistant I'm building while learning Machine Learning. Think of it as my playground to implement everything from the ML A-Z course into something actually useful.

## What is this?

It's a hybrid AI system that combines:
- **Chat Interface** - Talk to it like ChatGPT
- **ML Models** - All the algorithms I learn get added here
- **Memory** - It remembers our conversations (unlike my goldfish)

## Why am I building this?

I'm a software engineer learning ML, and I got tired of just following tutorials. I wanted to build something real that:
1. Forces me to actually understand the concepts
2. Shows potential employers I can ship code
3. Might actually be useful someday

## Tech Stack

**Frontend:** Next.js + React + TypeScript + Tailwind  
**Backend:** FastAPI + Python  
**Database:** MongoDB Atlas  
**AI:** OpenAI API (for now, might add local models later)

## Current Status

🚧 **Very much a work in progress** 🚧

- [x] Project setup
- [x] MongoDB connection
- [x] Basic API structure
- [x] CI/CD pipeline
- [ ] User authentication
- [ ] Chat functionality
- [ ] First ML model integration
- [ ] ...and like 20 more things

## Running Locally

```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd web-client
pnpm install
pnpm dev
```

You'll need a `.env` file with MongoDB URI and OpenAI key. Not sharing mine, get your own 😄

## Learning Journey

I'm documenting what I learn as I build. Check out [LEARNING_GUIDE.md](./LEARNING_GUIDE.md) if you're curious.

## Will this ever be finished?

Probably not. But that's the fun part, right?

---

*Built with ☕ and questionable life choices*
