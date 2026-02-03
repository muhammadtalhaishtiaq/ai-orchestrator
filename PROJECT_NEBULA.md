# PROJECT NEBULA - COMPLETE REFERENCE

> **Status**: Active Development - February 2, 2026
> **Type**: AI/ML Interactive Learning Platform
> **Mission**: Master AI/ML engineering by implementing 40+ algorithms from scratch
> **Team**: Solo developer with Copilot assistance
> **Revision**: 1.0 - Consolidated Core Understanding

---

## 📌 EXECUTIVE SUMMARY

**Project Nebula** is an interactive learning platform where users:
1. **Implement** 40+ ML algorithms from scratch (not using libraries)
2. **Visualize** how algorithms work with real-time animations
3. **Test** on real datasets interactively
4. **Build** a portfolio of ML projects
5. **Learn** deep understanding (not just surface-level theory)

**Tagline**: "Don't just use ML libraries - understand how they work by building them"

**Stack**:
- Backend: FastAPI + MongoDB + Motor (async)
- Frontend: Next.js 15 + React + TypeScript
- Auth: JWT tokens in httpOnly cookies (secure)
- Deployment: Cloud-ready (AWS/GCP/Azure)

---

## 🎯 CORE VALUES

| Value | Means | Example |
|-------|-------|---------|
| **Learning by Doing** | Users implement, don't just consume | Build neural network from scratch, not use PyTorch |
| **Visualization First** | See every concept animated | Watch gradient descent optimize in real-time |
| **From Scratch** | 40+ algorithms implemented by hand | No sklearn magic - understand the math |
| **Interactive** | Users control parameters, see results instantly | Adjust learning rate, watch training change |
| **Progressive** | Start simple, get complex | Neuron → ANN → CNN → Transformers |
| **Portfolio Ready** | Export code, add to LinkedIn, show employers | Each project is publishable |

---

## 🧭 PROJECT NEBULA JOURNEY (NOW → COMPLETE)

### Phase 1: Foundation (Done)
- Auth system, secure cookies, middleware protection
- Backend architecture (API → Services → Repositories)
- Base UI scaffolding

### Phase 2: Platform Structure (Done)
- Algorithm taxonomy and backend structure
- Security and coding standards
- Copilot instructions for consistent output

### Phase 3: Core Algorithm Lab (Next)
- Implement regression + classification + clustering from scratch
- Build dataset loader + metrics utilities
- Add unit tests for every algorithm

### Phase 4: Neural Networks Lab
- Implement neuron, layers, activations, loss, optimizers
- Build ANN training loop + visualization hooks

### Phase 5: Transformers & Modern AI
- Attention, transformer blocks, tokenization, LLM utilities
- Inference + monitoring hooks

### Phase 6: Generative Models
- Diffusion, VAE, GAN implementations
- Sampling + visualization components

### Phase 7: Reinforcement Learning
- Q-learning, DQN, policy gradients
- Environment runners + visual summaries

### Phase 8: Product Completion
- Polished UI (dashboard + lab modules)
- Project export + portfolio
- System health + observability

### Definition of Done
- All core algorithms implemented from scratch
- Visualizers integrated for each module
- Clean API + tests + documentation
- UI supports running, comparing, exporting experiments

---

## 🏗️ PROJECT ARCHITECTURE

### Backend Layer Structure
```
API Routes (Controllers)
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (Data Access)
    ↓
Database (MongoDB)
```

**Rule**: Each layer is independent. Routes never touch DB directly.

### Backend Directory Organization

```
backend/
├── algorithms/              # 40+ ML algorithms from scratch
│   ├── regression/         # 6 algorithms: linear, poly, SVR, tree, forest, etc
│   ├── classification/     # 6 algorithms: logistic, KNN, SVM, naive bayes, etc
│   ├── clustering/         # K-means, hierarchical, DBSCAN
│   ├── feature_engineering/ # Scaling, encoding, selection
│   ├── model_selection/    # Cross-validation, grid search, metrics
│   └── association/        # Apriori algorithm
│
├── neural_networks/        # Deep learning from scratch
│   ├── core/              # Neurons, layers, activations, loss, optimizers
│   ├── ann/               # Artificial neural networks
│   ├── cnn/               # Convolutional networks
│   ├── rnn/               # Recurrent networks (LSTM, GRU)
│   ├── architectures/     # ResNet, VGG, Inception
│   └── visualization/     # Layer viz, gradient viz
│
├── transformers/          # Modern architectures
│   ├── attention/         # Scaled dot-product, multi-head
│   ├── transformer/       # Encoder, decoder, full transformer
│   ├── tokenization/      # BPE, WordPiece, vocab
│   └── llm/              # LLM training, fine-tuning, monitoring
│
├── generative/           # Generative models
│   ├── diffusion/        # Forward/reverse diffusion, UNet
│   ├── vae/              # Variational autoencoders
│   └── gan/              # Generative adversarial networks
│
├── reinforcement_learning/ # RL algorithms
│   ├── q_learning/       # Q-learning, Q-table
│   ├── dqn/              # Deep Q-networks
│   └── policy/           # Policy gradient
│
├── nlp/                  # Natural language processing
│   ├── preprocessing/    # Cleaning, tokenizing, lemmatization
│   ├── embeddings/       # Word2Vec, GloVe, FastText
│   └── text_classification/ # Bag of words, TF-IDF
│
├── services/            # Business logic layer
├── repositories/        # Data access layer
├── schemas/             # Pydantic data models
├── api/                 # Route handlers
├── core/                # Configuration, security, logging
├── datasets/            # Sample datasets (CSV, txt)
├── tests/               # Unit tests for all modules
├── main.py              # FastAPI app
└── requirements.txt
```

**Quick Find**: Any algorithm takes 3 seconds to locate!

---

## 🔐 SECURITY REQUIREMENTS (MUST APPLY)

### 🚨 CRITICAL - Every Generated Code Must Pass Through:

#### 1. AUTHENTICATION & TOKENS
- ✅ **DO**: Hash passwords with bcrypt (12+ rounds)
- ✅ **DO**: Store JWT in httpOnly cookies (not localStorage)
- ✅ **DO**: Validate tokens on every request
- ❌ **NEVER**: Store plaintext passwords
- ❌ **NEVER**: Put tokens in localStorage
- ❌ **NEVER**: Trust client-side auth

#### 2. API SECURITY
- ✅ **DO**: Validate ALL inputs with Pydantic schemas
- ✅ **DO**: Implement rate limiting:
  - General: 100 requests/min per user
  - Login: 5 attempts/15 min
  - Training: 5 jobs/hour per user
- ✅ **DO**: Return safe error messages (no stack traces, no system details)
- ❌ **NEVER**: Accept unvalidated input
- ❌ **NEVER**: Expose internal errors to client
- ❌ **NEVER**: Allow unlimited requests

#### 3. DATA PROTECTION
- ✅ **DO**: Encrypt sensitive data in database
- ✅ **DO**: Use HTTPS/TLS 1.2+ for all connections
- ✅ **DO**: Never log passwords, tokens, or API keys
- ✅ **DO**: Implement security headers:
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - Strict-Transport-Security: max-age=31536000
- ❌ **NEVER**: Store plaintext secrets
- ❌ **NEVER**: Transmit over HTTP
- ❌ **NEVER**: Log sensitive data

#### 4. DEPENDENCY SECURITY
- ✅ **DO**: Pin exact versions in requirements.txt
- ✅ **DO**: Run `pip audit` weekly
- ✅ **DO**: Use environment variables for secrets
- ❌ **NEVER**: Hardcode secrets in code
- ❌ **NEVER**: Commit .env files
- ❌ **NEVER**: Use weak/old versions

#### 5. ERROR HANDLING & LOGGING
- ✅ **DO**: Log important events with context
- ✅ **DO**: Mask sensitive data in logs
- ✅ **DO**: Use structured logging
- ❌ **NEVER**: Log passwords, tokens, API keys
- ❌ **NEVER**: Log full request bodies with sensitive data
- ❌ **NEVER**: Use print() for production logs

**Security Checklist** (Before every deployment):
- [ ] All passwords hashed with bcrypt
- [ ] All tokens in httpOnly cookies
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] No sensitive data in logs
- [ ] No hardcoded secrets
- [ ] HTTPS/TLS enforced
- [ ] Security headers set
- [ ] Error messages are safe
- [ ] Dependencies pinned and audited

---

## 📝 CODING STANDARDS (MUST FOLLOW)

### File & Class Naming
```python
# Files (snake_case)
simple_linear.py          ✓ Algorithm name
backpropagation.py        ✓ Process name
gradient_descent.py       ✓ Descriptive

# Classes (PascalCase)
class SimpleLinearRegression:  ✓ Clear purpose
class DenseLayer:              ✓ Component name
class KMeansClusterer:         ✓ Algorithm + er
class MultiHeadAttention:      ✓ Specific component

# Functions (snake_case, verb first)
def train_model(X, y, epochs):     ✓ Action-oriented
def predict(X):                    ✓ Single responsibility
def calculate_accuracy(y_true, y_pred): ✓ Clear intent
def validate_input(data):          ✓ Descriptive

# Variables (snake_case, descriptive)
learning_rate = 0.01               ✓ Meaningful name
epochs = 100                       ✓ Clear purpose
hidden_layer_size = 64             ✓ Specific
X_train, y_train                   ✓ ML convention
```

### Code Quality Requirements
- ✅ **Type hints** on all functions: `def train(X: np.ndarray, y: np.ndarray) -> Model:`
- ✅ **Docstrings** for all functions (Google style):
  ```python
  def gradient_descent(X, y, learning_rate=0.01):
      """
      Optimize weights using gradient descent.
      
      Args:
          X: Training data (N, features)
          y: Target labels (N,)
          learning_rate: Step size (default: 0.01)
          
      Returns:
          Optimized weights (features,)
      """
  ```
- ✅ **Comments** explain WHY (not WHAT):
  ```python
  # Good: Explains the reason
  # Use batch normalization because it stabilizes training
  # and allows higher learning rates
  batch_norm = BatchNormalization()
  
  # Bad: States the obvious
  x = x + 1  # Add 1 to x
  ```
- ✅ **Error handling** with specific exceptions:
  ```python
  try:
      model = load_model(path)
  except FileNotFoundError:
      logger.error(f"Model file not found: {path}")
      raise
  except json.JSONDecodeError:
      logger.error(f"Invalid model format: {path}")
      raise
  ```
- ❌ **Never**: Bare `except:` clauses
- ❌ **Never**: Multiple statements per line
- ❌ **Never**: Magic numbers (use constants)
- ❌ **Never**: Commented-out code

### Testing Requirements
Every algorithm MUST have unit tests:
```python
# tests/test_simple_linear.py
class TestSimpleLinearRegression:
    def test_fit_converges(self):
        """Model should converge on simple data."""
        ...
    
    def test_predict_accuracy(self):
        """Predictions should be accurate."""
        ...
    
    def test_invalid_input(self):
        """Should handle invalid inputs."""
        ...
```

### Documentation Requirements
Each algorithm folder needs README.md:
```markdown
# Simple Linear Regression

## What is it?
Simple explanation of the algorithm.

## Mathematical Formula
y = mx + b

## When to Use
- For simple linear relationships
- When interpretability matters

## Usage Example
```python
from backend.algorithms.regression import SimpleLinearRegression
model = SimpleLinearRegression()
model.fit(X_train, y_train)
predictions = model.predict(X_test)
```

## Parameters
- learning_rate: Step size (default: 0.01)
- epochs: Training iterations (default: 100)
```

---

## 🎨 FRONTEND STRUCTURE

### Route Organization
```
web-client/
├── app/
│   ├── layout.tsx           # Root layout with sidebar
│   ├── page.tsx             # Landing page (via V0.dev)
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/page.tsx   # Main hub after login
│   ├── explore/             # ML Explorer module
│   ├── neural-nets/         # NN Playground
│   ├── transformers/        # LLM Workshop
│   ├── generative/          # Generative AI Lab
│   ├── projects/            # My Projects
│   ├── progress/            # Achievements
│   └── settings/            # User Settings
├── components/
│   ├── auth/
│   ├── layout/
│   ├── modules/
│   └── shared/
├── lib/
│   ├── auth/                # Auth logic
│   ├── chat/                # Chat client
│   ├── api-client.ts        # API calls
│   └── utils.ts
└── styles/
```

### Component Naming (PascalCase)
```tsx
<MLExplorer />              ✓ Feature component
<NeuralNetPlayground />     ✓ Descriptive
<RegressorAlgorithm />      ✓ Clear purpose
<Button />                  ✓ UI component
<Card />                    ✓ Container
```

---

## 📊 WHAT WE'RE BUILDING (40+ Topics)

### REGRESSION (6 algorithms)
- Simple Linear: y = mx + b
- Multiple Linear: Multiple features
- Polynomial: Curved relationships
- SVR: Support Vector Regression
- Decision Tree: Tree-based
- Random Forest: Ensemble

### CLASSIFICATION (6 algorithms)
- Logistic Regression: Binary/multi-class
- K-Nearest Neighbors: Distance-based
- Support Vector Machine: Max margin
- Naive Bayes: Probability-based
- Decision Tree: Tree-based
- Random Forest: Ensemble

### CLUSTERING (3+ algorithms)
- K-Means: Centroid-based
- Hierarchical: Distance-based
- DBSCAN: Density-based

### MODEL SELECTION & OPTIMIZATION
- Cross-validation (K-fold)
- Grid search & Random search
- Feature engineering & scaling
- Hyperparameter tuning
- Evaluation metrics

### NEURAL NETWORKS (FROM SCRATCH)
- Neurons: Forward pass, backprop
- Layers: Dense, Conv, Pooling
- Activations: ReLU, Sigmoid, Tanh, Softmax
- Loss Functions: MSE, Cross-entropy
- Optimizers: SGD, Adam, RMSprop
- Training loops with animations

### DEEP ARCHITECTURES
- ANN: Fully connected networks
- CNN: Convolutional networks (image processing)
- RNN: Recurrent networks (sequences)
- ResNet: Skip connections
- VGG, Inception: Advanced architectures

### TRANSFORMERS & LLMs (CUTTING-EDGE)
- Attention Mechanism: Scaled dot-product
- Multi-Head Attention
- Transformer: Encoder-Decoder
- Tokenization: BPE, WordPiece
- Language Models: GPT-style
- Fine-tuning LLMs
- RAG: Retrieval-augmented generation
- LLM Monitoring: Latency, tokens, cost
- BitNet: 1.58-bit efficient LLMs (2026)

### GENERATIVE MODELS
- Diffusion: Add noise → denoise
- VAE: Variational autoencoders
- GAN: Generative adversarial networks

### REINFORCEMENT LEARNING
- Q-Learning: Tabular
- Deep Q-Networks: Neural networks
- Policy Gradient: Actor-critic

### NLP
- Text Preprocessing
- Embeddings: Word2Vec, GloVe, FastText
- TF-IDF & Bag of Words
- Text Classification

---

## 🚀 CURRENT PHASE (Phase 2c - Infrastructure)

### ✅ Completed
- Phase 0: Project foundation, MongoDB, health checks
- Phase 1: Complete authentication system (registration, login, JWT, middleware)
- Phase 2a: Chat infrastructure (MVP complete, awaiting OpenAI integration)
- Phase 2b: Backend structure and guidelines (complete)
- Phase 2c: Security and project standards (complete)
- Phase 2d: UI framework and landing page prompt (ready for V0.dev)

### 🔄 In Progress
- Create unified Copilot instructions (THIS FILE)

### ⏭️ Next Phases
- Phase 3: Implement regression algorithms (8 weeks)
- Phase 4: Neural networks from scratch (10 weeks)
- Phase 5: Transformers & LLMs (12 weeks)
- Phase 6: Generative models (8 weeks)
- Phase 7: Reinforcement learning (6 weeks)
- Phase 8: UI visualization system (ongoing)
- Phase 9: Model export & portfolio features (4 weeks)

---

## ⚡ QUICK REFERENCE

### Where to Find Things

**Algorithm Code**: `backend/algorithms/[category]/[algorithm].py`
- Regression? → `backend/algorithms/regression/simple_linear.py`
- K-Means? → `backend/algorithms/clustering/kmeans.py`
- Attention? → `backend/transformers/attention/scaled_dot_product.py`

**Tests**: `backend/tests/test_[module].py`

**API Routes**: `backend/api/[endpoint_group].py`

**Services**: `backend/services/[domain]_service.py`

**Frontend Routes**: `web-client/app/[route]/page.tsx`

**Documentation**: `README.md` in each major folder

### Common Commands

```bash
# Run backend
cd backend
python main.py

# Run frontend
cd web-client
npm run dev

# Run tests
pytest backend/tests/ -v

# Security check
pip audit

# Format code
black backend/
```

### Import Patterns

```python
# Algorithms
from backend.algorithms.regression import SimpleLinearRegression
from backend.algorithms.classification import KNN
from backend.algorithms.clustering import KMeans

# Neural Networks
from backend.neural_networks.ann import ANNNetwork
from backend.neural_networks.cnn import CNNNetwork
from backend.neural_networks.core import DenseLayer

# Transformers
from backend.transformers import TransformerEncoder
from backend.transformers.attention import MultiHeadAttention
from backend.transformers.llm import LanguageModel

# Services
from backend.services.training_service import TrainingService
from backend.services.visualization_service import VisualizationService
```

---

## 🎓 IMPLEMENTATION PRINCIPLES

When implementing ANY feature:

1. **Read the math first** - Understand the algorithm conceptually
2. **Implement from scratch** - No sklearn magic, build it by hand
3. **Type hint everything** - Python type hints on all functions
4. **Document thoroughly** - Docstrings and comments explaining WHY
5. **Test comprehensively** - Unit tests for all scenarios
6. **Visualize clearly** - Every concept should be animated/shown
7. **Pass security review** - Every piece goes through security checklist
8. **Follow naming conventions** - Consistent with project standards
9. **Single responsibility** - One class = one thing
10. **Layer separation** - API ≠ Service ≠ Repository ≠ DB

---

## 💡 KEY DECISIONS

| Decision | Choice | Reason |
|----------|--------|--------|
| Database | MongoDB | Flexible schema, good for user data |
| Auth Storage | httpOnly cookies | More secure than localStorage |
| API Style | RESTful | Standard, easy to understand |
| Frontend | Next.js | Excellent DX, built-in optimizations |
| Algorithms | From scratch | Core mission = deep understanding |
| Visualization | Interactive | Users learn by exploring |
| Deployment | Cloud-ready | Easy scaling when needed |

---

## 🔄 CONTINUOUS IMPROVEMENT

**Weekly**:
- [ ] Run `pip audit` - check for security vulnerabilities
- [ ] Code review - check for security issues
- [ ] Performance check - ensure algorithms run < 1s

**Monthly**:
- [ ] Security audit - comprehensive review
- [ ] Performance benchmarks - measure improvements
- [ ] Documentation review - keep up to date

**Quarterly**:
- [ ] Penetration testing - test security
- [ ] Architecture review - evaluate patterns
- [ ] User feedback - implement improvements

---

## 📞 WHEN IN DOUBT

1. **Security question?** → Check SECURITY section above
2. **Naming question?** → Check CODING STANDARDS
3. **Where to put file?** → Check BACKEND directory structure
4. **Testing question?** → All algorithms need unit tests
5. **Documentation question?** → Each module gets README.md

---

## ✨ COPILOT INSTRUCTIONS

**When generating ANY code:**

1. **Check Mission**: Does this align with learning-by-doing philosophy?
2. **Apply Security**: Did I include all security checks?
3. **Follow Standards**: Are naming conventions correct?
4. **Add Tests**: Does this have unit tests?
5. **Document**: Is there a docstring?
6. **Verify Structure**: Does it follow layered architecture?
7. **Self-Correct**: Fix any issues before providing code

**Example Before Providing Code**:
- ✅ Is password hashed with bcrypt?
- ✅ Does API validate input with Pydantic?
- ✅ Are tokens in httpOnly cookies?
- ✅ Does function have type hints?
- ✅ Is there a docstring?
- ✅ Are there unit tests?
- ✅ Does it follow naming conventions?
- ✅ Is error handling specific (not bare except)?
- ✅ Is sensitive data never logged?
- ✅ Is the code following layered architecture?

**If ANY check fails**: Fix before providing to user.

---

**This is your single source of truth for Project Nebula. Reference this file for every decision, every implementation, every code review.** 🎯

---

*Last Updated: February 2, 2026*
*Version: 1.0 - Consolidated Core Understanding*
