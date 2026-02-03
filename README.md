# Project Nebula 🌌

An interactive AI/ML learning platform where you implement 40+ algorithms from scratch and learn how they actually work.

**Status**: Core Algorithm Laboratory (Active)  
<!-- **Date**: February 2, 2026   -->
**Mission**: Don't just use ML libraries - understand how they work by building them

---

## 📌 What is Project Nebula?

Project Nebula is an interactive learning platform that lets you:

1. **Implement** 40+ ML algorithms from scratch (regression, classification, clustering, neural networks, transformers, generative models, reinforcement learning)
2. **Visualize** how each algorithm works with real-time animations
3. **Test** on real datasets with interactive controls
4. **Build** a portfolio of ML projects you actually understand
5. **Learn** deep ML engineering (not just theory)

**Core Philosophy**: "Don't use sklearn - build sklearn"

---

## 🚀 Current Status

| Component | Status | Completion |
|-----------|--------|-----------|
| **Phase 1**: Foundation (Auth, Backend Setup) | ✅ DONE |
| **Phase 2**: Platform Structure | ✅ DONE |
| **Phase 3**: Core Algorithms (Regression, Classification, Clustering) | 🔄 ACTIVE | 0% |
| **Phase 4-8**: Neural Networks, Transformers, Generative, RL | ⏳ PENDING | 0% |

### What's Done
- ✅ User authentication system (JWT + httpOnly cookies)
- ✅ Backend layered architecture (API → Services → Repositories)
- ✅ MongoDB integration with async Motor driver
- ✅ 30+ lab routes with persistent sidebar navigation
- ✅ UI generated (landing page + dashboard + all lab routes)
<!-- - ✅ Copilot instructions in VS Code for consistent development -->
- ✅ Security & coding standards documented

### What's Next (Phase 3)
- 🔄 Implement 15 core algorithms:
  - 6 regression algorithms (simple linear, multiple linear, polynomial, SVR, decision tree, random forest)
  - 6 classification algorithms (logistic, KNN, SVM, naive bayes, decision tree, random forest)
  - 3 clustering algorithms (K-means, hierarchical, DBSCAN)
- 🔄 Create API endpoints for training and prediction
- 🔄 Write 150+ unit tests with >90% coverage
- 🔄 Connect frontend lab pages to backend
- 🔄 Add visualization for algorithm results

---

## 💻 Tech Stack

**Frontend**:
- Next.js 15 + React 18 + TypeScript
- Tailwind CSS + shadcn/ui + Framer Motion
- Real-time visualizations

**Backend**:
- FastAPI (async Python web framework)
- MongoDB + Motor (async driver)
- Pydantic (validation)
- Numpy + Pandas (no sklearn in core algorithms)

**Infrastructure**:
- JWT authentication in httpOnly cookies
- Bcrypt password hashing (12+ rounds)
- Rate limiting on sensitive endpoints
- Structured logging without secrets
- Cloud-ready deployment

**Development**:
- VS Code
- Pytest for testing (>90% coverage target)
- Automated checks and validations

---

## 🏗️ Architecture

### Backend Layered Architecture

```
HTTP Request
    ↓
API Routes (Controllers)     # Input validation, HTTP responses
    ↓
Service Layer               # Business logic, algorithm orchestration
    ↓
Repository Layer            # Data access patterns
    ↓
MongoDB Collections         # Persistent data storage
```

**Key Rules**:
- API routes are thin (no database logic)
- Services contain all business logic
- Repositories handle all data access
- No shortcuts through layers

### Frontend Structure

```
web-client/
├── app/
│   ├── page.tsx (Landing)
│   ├── dashboard/ (Dashboard home)
│   ├── labs/ (30+ algorithm labs)
│   │   ├── regression/ (6 algorithms)
│   │   ├── classification/ (6 algorithms)
│   │   ├── clustering/ (3 algorithms)
│   │   ├── neural-networks/ (Phase 4)
│   │   ├── transformers/ (Phase 5)
│   │   ├── nlp/ (Phase 6)
│   │   ├── generative/ (Phase 7)
│   │   └── reinforcement-learning/ (Phase 8)
│   └── auth/ (login, register, profile, settings)
├── components/
│   ├── sidebar.tsx (Navigation)
│   ├── lab-page-template.tsx (Reusable lab page)
│   └── ui/ (shadcn/ui components)
└── hooks/ (useToast, useMobile)
```

---

## 📚 40+ Algorithm Taxonomy

### Phase 3: Core Algorithms (Current)
- **Regression** (6): Simple Linear, Multiple Linear, Polynomial, SVR, Decision Tree, Random Forest
- **Classification** (6): Logistic, KNN, SVM, Naive Bayes, Decision Tree, Random Forest
- **Clustering** (3): K-Means, Hierarchical, DBSCAN

### Phase 4: Neural Networks
- Neuron Basics, ANN, CNN, RNN/LSTM, ResNet

### Phase 5: Transformers & Modern AI
- Attention, Tokenization, Encoder-Decoder, LLM Utilities

### Phase 6: NLP
- Text Preprocessing, TF-IDF & BoW, Embeddings

### Phase 7: Generative Models
- VAE, GAN, Diffusion Models

### Phase 8: Reinforcement Learning
- Q-Learning, DQN, Policy Gradients

---

## 🔒 Security Standards

- **Passwords**: Bcrypt with 12+ rounds
- **Tokens**: JWT in httpOnly cookies (not localStorage)
- **Validation**: Pydantic on all endpoints
- **Rate Limiting**: 100/min general, 5/15min login, 5/hour training
- **Logging**: Structured logs (zero sensitive data)
- **Configuration**: Environment variables only (no hardcoded secrets)

---

## 📋 How to Contribute / Extend

### Adding a New Algorithm (Example: Simple Linear Regression)

1. **Create the algorithm file**:
   ```bash
   touch backend/core/algorithms/regression/linear_regression.py
   ```

2. **Implement with type hints + docstrings**:
   ```python
   class SimpleLinearRegression:
       """Simple linear regression using normal equation or gradient descent."""
       
       def fit(self, X: np.ndarray, y: np.ndarray) -> None:
           """Fit the model to training data."""
           pass
       
       def predict(self, X: np.ndarray) -> np.ndarray:
           """Predict using the trained model."""
           pass
   ```

3. **Write 10+ test cases**:
   ```bash
   touch backend/core/algorithms/tests/test_simple_linear_regression.py
   ```

4. **Create API endpoint**:
   ```bash
   echo "POST /api/regression/train" >> backend/api/routes/regression_routes.py
   ```

5. **Connect to frontend**:
   - Lab page: `web-client/app/labs/regression/simple-linear/page.tsx`
   - Uses `lab-page-template.tsx` component
   - Add upload + parameter controls
   - Display results

<!-- **See TASKS.txt for detailed step-by-step tasks.** -->

---

<!-- ## 📖 Documentation -->

<!-- - **[MASTER_ROADMAP.md](MASTER_ROADMAP.md)**: Complete project vision, all 40+ algorithms, phases 1-8 -->
<!-- - **[TASKS.txt](TASKS.txt)**: Phase 3 detailed task breakdown with checkboxes -->
<!-- - **[.vscode/copilot-instructions.md](.vscode/copilot-instructions.md)**: Auto-loaded Copilot context -->
<!-- - **[PROJECT_NEBULA.md](PROJECT_NEBULA.md)**: Original consolidated reference (being merged) -->

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (frontend)
- Python 3.10+ (backend)
- MongoDB Atlas account (free tier works)

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # Windows
pip install -r requirements.txt
python main.py  # Runs on http://localhost:8000
```

### Frontend Setup
```bash
cd web-client
npm install
npm run dev  # Runs on http://localhost:3000
```

### Environment Variables
Create `.env` in backend/:
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/
JWT_SECRET=your-secret-key-here
OPENAI_API_KEY=sk-...  # Optional, for future AI features
```

---

## ⚡ Key Features

- **Learning-Focused**: We use ML libraries in core workflows while also implementing algorithms from scratch to understand how they work
- **Type Safe**: Full type hints on every function
- **Well Tested**: 150+ unit tests with >90% coverage target
- **Documented**: Google-style docstrings on all code
- **Secure**: Bcrypt, JWT, httpOnly cookies, rate limiting
- **Clean Architecture**: Layered design, no shortcuts
- **Visual Learning**: Interactive parameter controls and result visualization
- **Portfolio Ready**: Export code and results to showcase on GitHub/LinkedIn

---

## 📊 Success Criteria
<!-- **Phase 3 Complete When**:
- ✅ 15 algorithms implemented and tested
- ✅ 150+ unit tests passing with >90% coverage
- ✅ All API endpoints functional
- ✅ UI lab pages connected to backend
- ✅ Results visualization working
- ✅ Zero security vulnerabilities -->

**Full Project Complete When**:
- ✅ 40+ algorithms across all 8 phases
- ✅ 400+ unit tests with >85% coverage
- ✅ Full UI with visualizations
- ✅ Export and portfolio features
- ✅ Production-ready observability

---

## 🎯 Next Steps

<!-- 1. Check [TASKS.txt](TASKS.txt) for Phase 3 detailed breakdown
2. Start with Phase 3 Step 1: Create backend directory structure
3. Implement SimpleLinearRegression first
4. Write tests as you go
5. Connect to API endpoints
6. Test end-to-end with frontend -->

<!-- **See [MASTER_ROADMAP.md](MASTER_ROADMAP.md) for complete project vision.** -->

---

## 📝 License

Personal learning project - feel free to fork and learn!

---

**Built with ❤️ and a lot of curiosity about how things really work.**
│   ├── schemas/             # Pydantic request/response models
│   ├── dependencies/        # FastAPI dependencies (auth)
│   ├── core/                # Security helpers (JWT, hashing)
│   ├── auth/                # Legacy wrappers (backward compatibility)
│   └── main.py              # App entry
├── ai-engine/               # ML modules
└── web-client/
	├── app/                 # Pages
	├── components/          # UI components
	└── lib/
		├── auth/             # Auth client + storage + types
		└── chat/             # Chat client + types
```

## Current Status

🚧 **Very much a work in progress** 🚧

- [x] Project setup
- [x] MongoDB connection
- [x] Basic API structure
- [x] CI/CD pipeline
- [x] User authentication
- [x] Chat MVP (sessions + message storage)
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

<!-- ## Learning Journey

I'm documenting what I learn as I build. Check out [LEARNING_GUIDE.md](./LEARNING_GUIDE.md) if you're curious. -->

## Will this ever be finished?

I hope so! But that's the fun part, no?

---

*Built with ☕ and questionable life choices*
