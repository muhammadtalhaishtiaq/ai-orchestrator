# V0.DEV PROMPT FOR PROJECT NEBULA DASHBOARD

Copy-paste this ENTIRE prompt into v0.dev to generate the **Dashboard** that matches the existing landing page design.

---

## PROMPT FOR V0.DEV

```
You are creating the **Dashboard page** for "Project Nebula" (AI/ML experimentation and visualization platform). This is NOT the landing page. It is the post-login main hub.

IMPORTANT: The dashboard must visually match the existing landing page style:
- Dark theme with neon accents (blues, purples, cyan)
- Futuristic, clean, professional look
- Same typography, spacing, card styles, glow effects
- Smooth animations and hover effects
- Tailwind + shadcn/ui + Framer Motion

PROJECT CONTEXT:
- Project Nebula is an interactive AI/ML experimentation platform
- Users build algorithms from scratch, run experiments, and visualize results
- Audience: builders, researchers, ML engineers
- Goal: **fast navigation to any topic** and **hands-on experimentation**

DESIGN REQUIREMENTS:

1. LAYOUT
- This is a **dashboard** screen inside the app
- MUST include a **left sidebar** within this page (do NOT assume it exists globally)
- Content in main area only
- Desktop-first, fully responsive

2. TOP HEADER
- Title: “Dashboard”
- Subtitle: “Experiment Hub”
- Right-side actions:
  - “New Experiment” (primary)
  - “Import Dataset” (secondary)
  - “Open Playground” (ghost)

3. SIDEBAR (INSIDE THIS PAGE)
Create a visible sidebar with **category grouping** and nested links:

Core Labs
- Regression
  - Simple Linear
  - Multiple Linear
  - Polynomial
  - SVR
  - Decision Tree (Reg)
  - Random Forest (Reg)
- Classification
  - Logistic Regression
  - K‑Nearest Neighbors
  - SVM
  - Naive Bayes
  - Decision Tree (Clf)
  - Random Forest (Clf)
- Clustering
  - K‑Means
  - Hierarchical
  - DBSCAN

Deep Learning
- Neural Networks
  - Neuron Basics
  - ANN Playground
  - CNN Workshop
  - RNN / LSTM
  - ResNet

Modern AI
- Transformers
  - Attention
  - Encoder/Decoder
  - Tokenization
  - LLM Utilities
- Generative AI
  - Diffusion
  - VAE
  - GAN

Reinforcement Learning
- Q‑Learning
- DQN
- Policy Gradient

NLP
- Text Preprocessing
- Embeddings
- TF‑IDF / BOW

System
- Datasets
- Experiments
- Models
- Settings

4. ROUTING MAP (MUST CREATE PAGES)
Create **separate pages** for each sidebar item using Next.js App Router.
Use these routes (keep consistent naming):

Core Labs
- /dashboard
- /labs/regression/simple-linear
- /labs/regression/multiple-linear
- /labs/regression/polynomial
- /labs/regression/svr
- /labs/regression/decision-tree
- /labs/regression/random-forest

- /labs/classification/logistic-regression
- /labs/classification/knn
- /labs/classification/svm
- /labs/classification/naive-bayes
- /labs/classification/decision-tree
- /labs/classification/random-forest

- /labs/clustering/k-means
- /labs/clustering/hierarchical
- /labs/clustering/dbscan

Deep Learning
- /labs/neural-networks/neuron-basics
- /labs/neural-networks/ann-playground
- /labs/neural-networks/cnn-workshop
- /labs/neural-networks/rnn-lstm
- /labs/neural-networks/resnet

Modern AI
- /labs/transformers/attention
- /labs/transformers/encoder-decoder
- /labs/transformers/tokenization
- /labs/transformers/llm-utilities

- /labs/generative/diffusion
- /labs/generative/vae
- /labs/generative/gan

Reinforcement Learning
- /labs/reinforcement-learning/q-learning
- /labs/reinforcement-learning/dqn
- /labs/reinforcement-learning/policy-gradient

NLP
- /labs/nlp/text-preprocessing
- /labs/nlp/embeddings
- /labs/nlp/tfidf-bow

System
- /datasets
- /experiments
- /models
- /settings

5. MAIN CONTENT (MINIMAL, PROTOTYPE‑STYLE)
This is **experimental/working prototype**, not a course site. Keep it light:

Section A: “Quick Start Experiments” (3 compact cards)
- Linear Regression Baseline (5–10 mins)
- K‑Means Segmentation (10–15 mins)
- Transformer Encoder Demo (30–45 mins)

Section B: “Active Experiment” (single compact card)
- Name + status + progress
- Buttons: “View Run” + “Stop”

Section C: “Recent Runs” (simple list)
- 3 recent runs with status

Section D: “System Status” (small panel)
- “All services operational”
- “Data pipeline: Healthy”

6. OPTIONAL: Minimal stats row (2 cards max)
- Experiments Run
- Models Trained

Avoid heavy analytics/learning paths/achievements. This is NOT a course dashboard.

STYLING
- Background: #0f1419
- Primary: #00d9ff
- Accent: #a855f7
- Cards: #1f2937 with subtle glow
- Text: #e5e7eb
- Use gradients + subtle animated glows

INTERACTIONS
- Card hover: scale + glow
- Buttons: loading states
- Smooth transitions
- Tooltips on sidebar icons

OUTPUT REQUIREMENTS
- Generate the dashboard page AND **placeholder pages** for every route above
- All pages MUST keep the **same header and sidebar** visible (persistent layout)
- Each placeholder page should include:
  - Page title
  - Short description
  - “Back to Dashboard” link
  - Minimal content area (use same theme)
- Uses Tailwind + shadcn/ui + Framer Motion
- Proper TypeScript typing
- Fully responsive
- Components organized within file (sections with clear comments)

Make it visually consistent with the landing page branding, but **lean and prototype‑focused**.
```

---

## HOW TO USE

1. Open v0.dev
2. Create → New Project
3. Paste the prompt above
4. Generate
5. Export code
6. Place the dashboard in `web-client/app/dashboard/page.tsx`
7. Place generated route pages inside `web-client/app` following the routing map

---

**Result**: A dashboard with built‑in sidebar and category navigation for all topics.
