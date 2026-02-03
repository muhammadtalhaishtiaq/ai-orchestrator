# PROJECT NEBULA - ML/AI TOPICS RESEARCH & BREAKDOWN

> **Purpose**: Master AI/ML Engineering by implementing EVERY concept from scratch
> **Goal**: Build a visual, interactive learning platform that shows "what's happening behind the curtains"
> **Date**: February 2, 2026

---

## 🎓 LEARNING PHILOSOPHY

**This is NOT just a chat app. This is an AI/ML LEARNING LABORATORY.**

Every concept should be:
- ✅ Implemented from scratch (understand internals)
- ✅ Visualized (see how it works)
- ✅ Interactive (experiment with parameters)
- ✅ Compared (different algorithms side-by-side)
- ✅ Measured (performance metrics, latency, accuracy)

---

## 📚 COMPLETE TOPIC BREAKDOWN

### 🔢 CATEGORY 1: REGRESSION ALGORITHMS

**Goal**: Predict continuous values, understand different approaches to curve fitting

#### 1.1 Simple Linear Regression
- **Theory**: y = mx + b, minimize squared error
- **Implementation**: From scratch (gradient descent)
- **Use Case**: House prices based on size
- **Visualization**: 
  - Scatter plot with regression line
  - Animate gradient descent converging
  - Show residuals (error visualization)
- **Metrics**: R², MSE, MAE
- **Library Version**: scikit-learn comparison
- **Interactive Elements**: 
  - Adjust learning rate slider
  - Change number of iterations
  - Add noise to data and see impact

#### 1.2 Multiple Linear Regression
- **Theory**: Multiple features → single output
- **Implementation**: Matrix operations (X^T * X)^-1 * X^T * y
- **Use Case**: House prices based on size, bedrooms, location, age
- **Visualization**:
  - 3D surface plot (2 features + output)
  - Feature importance bar chart
  - Correlation heatmap
- **Metrics**: R², adjusted R², p-values
- **Interactive**: Toggle features on/off, see impact

#### 1.3 Polynomial Regression
- **Theory**: Transform features to higher degree polynomials
- **Implementation**: Feature transformation + linear regression
- **Use Case**: Non-linear relationships (salary vs experience curve)
- **Visualization**:
  - Degree 1, 2, 3, 4... curves overlaid
  - Overfitting demonstration (degree 10+ on small dataset)
  - Training vs validation error curve
- **Key Learning**: Bias-variance tradeoff
- **Interactive**: Slider for polynomial degree

#### 1.4 Support Vector Regression (SVR)
- **Theory**: Find tube that fits most data, ignore outliers outside margin
- **Implementation**: Use kernel trick (RBF, polynomial, linear)
- **Use Case**: Stock price prediction with volatile data
- **Visualization**:
  - Epsilon tube visualization
  - Support vectors highlighted
  - Different kernels comparison
- **Interactive**: Adjust epsilon, C, gamma parameters

#### 1.5 Decision Tree Regression
- **Theory**: Recursive binary splitting, minimize MSE at each split
- **Implementation**: Build tree from scratch (greedy algorithm)
- **Use Case**: Piecewise constant predictions
- **Visualization**:
  - Tree structure diagram (nodes, splits, leaf values)
  - Decision boundaries in feature space
  - Animate tree growing
- **Interactive**: Adjust max_depth, min_samples_split

#### 1.6 Random Forest Regression
- **Theory**: Ensemble of decision trees with bagging
- **Implementation**: Bootstrap sampling + aggregate predictions
- **Use Case**: Robust predictions with feature importance
- **Visualization**:
  - Multiple trees displayed
  - Feature importance chart
  - Out-of-bag error
  - Individual tree vs ensemble prediction
- **Interactive**: Adjust n_estimators, see convergence

---

### 🎯 CATEGORY 2: CLASSIFICATION ALGORITHMS

**Goal**: Predict discrete classes, understand decision boundaries

#### 2.1 Logistic Regression
- **Theory**: Sigmoid function, log-likelihood, maximum likelihood estimation
- **Implementation**: Gradient descent on log loss
- **Use Case**: Binary classification (spam/not spam, disease/healthy)
- **Visualization**:
  - Sigmoid curve
  - Decision boundary (2D)
  - Probability contours
  - Confusion matrix heatmap
- **Metrics**: Accuracy, precision, recall, F1, ROC-AUC
- **Interactive**: Threshold slider (adjust classification cutoff)

#### 2.2 K-Nearest Neighbors (KNN)
- **Theory**: Vote of k nearest neighbors based on distance
- **Implementation**: Distance calculation (Euclidean, Manhattan, Minkowski)
- **Use Case**: Pattern recognition, recommendation
- **Visualization**:
  - Voronoi diagram (decision regions)
  - k neighbors highlighted for test point
  - Distance circles
- **Interactive**: Adjust k value, change distance metric

#### 2.3 Support Vector Machine (SVM)
- **Theory**: Find hyperplane with maximum margin
- **Implementation**: Linear and kernel SVM
- **Use Case**: Text classification, image recognition
- **Visualization**:
  - Support vectors highlighted
  - Margin visualization (2D)
  - Different kernels (linear, RBF, polynomial)
- **Interactive**: Adjust C (regularization), kernel parameters

#### 2.4 Naive Bayes
- **Theory**: Bayes theorem, conditional independence assumption
- **Implementation**: Calculate prior and likelihood probabilities
- **Use Case**: Text classification, spam filtering
- **Visualization**:
  - Probability distributions for each class
  - Prior vs posterior probabilities
- **Interactive**: Add new data point, see probability calculations

#### 2.5 Decision Tree Classification
- **Theory**: Information gain (entropy, gini impurity)
- **Implementation**: Recursive splitting to maximize purity
- **Use Case**: Rule-based classification
- **Visualization**:
  - Tree structure with split rules
  - Decision boundaries
  - Impurity decrease at each node
- **Interactive**: Adjust max_depth, criterion (gini vs entropy)

#### 2.6 Random Forest Classification
- **Theory**: Ensemble of trees with majority voting
- **Implementation**: Bagging + random feature subset
- **Use Case**: General-purpose robust classifier
- **Visualization**:
  - Feature importance
  - Out-of-bag accuracy
  - Individual tree predictions vs ensemble
- **Interactive**: Adjust n_estimators, max_features

---

### 🧩 CATEGORY 3: UNSUPERVISED LEARNING

**Goal**: Find patterns without labels

#### 3.1 K-Means Clustering
- **Theory**: Minimize within-cluster sum of squares
- **Implementation**: Lloyd's algorithm (assign, update centroids, repeat)
- **Use Case**: Customer segmentation, image compression
- **Visualization**:
  - **ANIMATE THIS**: Centroids moving iteration by iteration
  - Points colored by cluster
  - Elbow method plot (K vs inertia)
  - Silhouette analysis
- **Interactive**: Adjust K, change initialization method

#### 3.2 Hierarchical Clustering
- **Theory**: Build tree of nested clusters (agglomerative or divisive)
- **Implementation**: Distance matrix, linkage methods (single, complete, average, ward)
- **Use Case**: Taxonomy creation, gene analysis
- **Visualization**:
  - **Dendrogram** (tree structure)
  - Cut tree at different heights
  - Animate cluster merging
- **Interactive**: Adjust cut threshold, change linkage

#### 3.3 DBSCAN
- **Theory**: Density-based clustering, find arbitrary shaped clusters
- **Implementation**: Core points, border points, noise
- **Use Case**: Spatial data, outlier detection
- **Visualization**:
  - Clusters with different shapes
  - Noise points highlighted
  - Epsilon neighborhood circles
- **Interactive**: Adjust eps, min_samples

#### 3.4 Association Rule Learning (Apriori)
- **Theory**: Find frequent itemsets, generate rules
- **Implementation**: Candidate generation, support counting
- **Use Case**: Market basket analysis, recommendation
- **Visualization**:
  - Network graph of rules
  - Support vs confidence scatter
  - Lift heatmap
- **Interactive**: Adjust min_support, min_confidence

---

### ⚙️ CATEGORY 4: MODEL SELECTION & OPTIMIZATION

#### 4.1 Train-Test Split
- **Theory**: Holdout method to estimate generalization
- **Implementation**: Random shuffle, stratified split
- **Visualization**: Dataset pie chart, distribution comparison

#### 4.2 Cross-Validation
- **Theory**: K-fold CV, reduce variance in performance estimate
- **Implementation**: Split data into K folds, train/test K times
- **Visualization**:
  - K-fold diagram (which fold is test each time)
  - Score distribution across folds (box plot)
- **Interactive**: Adjust K value

#### 4.3 Grid Search
- **Theory**: Exhaustive search over hyperparameter space
- **Implementation**: Nested loops over parameter combinations
- **Visualization**:
  - Heatmap of parameter combinations vs score
  - Best parameters highlighted
- **Interactive**: Define search space, see live search

#### 4.4 Random Search
- **Theory**: Sample random combinations, often more efficient
- **Implementation**: Random sampling from distributions
- **Visualization**: Compare to grid search efficiency

#### 4.5 Feature Engineering
- **Theory**: Create new features, transform existing ones
- **Techniques**:
  - Scaling (StandardScaler, MinMaxScaler)
  - Encoding (OneHot, Label, Target)
  - Feature creation (polynomial, interactions)
  - Feature selection (RFE, SelectKBest, L1 regularization)
- **Visualization**:
  - Before/after distribution plots
  - Feature importance after engineering
  - Correlation changes

---

### 🧠 CATEGORY 5: NEURAL NETWORKS (FROM SCRATCH)

**Goal**: Understand deep learning fundamentals by building from ground up

#### 5.1 Artificial Neural Network (ANN) - From Scratch
- **Theory**: Neurons, layers, weights, biases, activation functions
- **Implementation in Pure Python**:
  ```python
  class NeuralNetwork:
      def __init__(self, layer_sizes):
          # Initialize weights and biases
      
      def forward(self, X):
          # Forward propagation
          # z = W * x + b
          # a = activation(z)
      
      def backward(self, X, y):
          # Backpropagation
          # Calculate gradients
          # dW, db
      
      def train(self, X, y, epochs, learning_rate):
          # Gradient descent
  ```
- **Use Case**: Binary classification, multi-class classification, regression
- **Visualization**:
  - **Network architecture diagram** (input, hidden, output layers)
  - **ANIMATE FORWARD PASS**: Show values flowing through network
  - **ANIMATE BACKPROPAGATION**: Show gradients flowing backward
  - Weight matrices as heatmaps
  - Loss curve over epochs
  - Activation functions (ReLU, sigmoid, tanh) - shape and derivative
- **Interactive**:
  - Adjust network architecture (layers, neurons)
  - Change learning rate (see divergence if too high)
  - Change activation functions
  - Add regularization (L1, L2, dropout)

#### 5.2 Backpropagation - Deep Dive
- **Theory**: Chain rule applied to neural networks
- **Implementation**: Compute gradients layer by layer
- **Visualization**:
  - **Step-by-step gradient calculation**
  - Computational graph
  - Gradient magnitudes per layer (vanishing/exploding gradients)
- **Key Learning**: Why deep networks are hard to train

#### 5.3 Convolutional Neural Network (CNN)
- **Theory**: Convolution, pooling, feature maps
- **Implementation From Scratch**:
  - Convolution operation (sliding window)
  - Max pooling
  - Flatten layer
  - Fully connected layers
- **Use Case**: Image classification (MNIST, CIFAR-10)
- **Visualization**:
  - **Show filters/kernels as images**
  - **Feature maps at each layer** (what network "sees")
  - **Activation maps** (which parts of image activate neurons)
  - Receptive field visualization
- **Interactive**: Upload image, see CNN processing step-by-step

#### 5.4 Recurrent Neural Network (RNN)
- **Theory**: Hidden state, temporal dependencies
- **Implementation From Scratch**:
  - Basic RNN cell
  - LSTM cell (forget gate, input gate, output gate)
  - GRU cell
- **Use Case**: Time series, sequence prediction, text generation
- **Visualization**:
  - **Unrolled RNN** through time
  - Hidden state evolution
  - LSTM gates (what they remember/forget)
- **Interactive**: Text generation character-by-character

#### 5.5 ResNet Architecture
- **Theory**: Skip connections solve vanishing gradient
- **Implementation**:
  ```python
  class ResidualBlock:
      def forward(self, x):
          identity = x
          out = conv1(x)
          out = conv2(out)
          out += identity  # Skip connection
          return relu(out)
  ```
- **Use Case**: Very deep networks (50+ layers)
- **Visualization**:
  - Skip connections highlighted
  - Gradient flow comparison (with/without skip)
- **Key Learning**: Why ResNet enabled very deep networks

---

### 🤖 CATEGORY 6: TRANSFORMERS & LLMs

**Goal**: Understand modern AI architecture powering ChatGPT, GPT-4

#### 6.1 Attention Mechanism
- **Theory**: Query, Key, Value, scaled dot-product attention
- **Implementation From Scratch**:
  ```python
  def attention(Q, K, V):
      scores = Q @ K.T / sqrt(d_k)
      weights = softmax(scores)
      output = weights @ V
      return output, weights
  ```
- **Use Case**: Machine translation, text summarization
- **Visualization**:
  - **Attention weights heatmap** (which words attend to which)
  - Query-Key matching visualization
  - Attention heads (multi-head attention)
- **Interactive**: Input sentence, see attention patterns

#### 6.2 Transformer Architecture - From Scratch
- **Theory**: Self-attention, positional encoding, encoder-decoder
- **Implementation Components**:
  - Positional encoding
  - Multi-head attention
  - Feed-forward network
  - Layer normalization
  - Encoder stack
  - Decoder stack
- **Code Structure**:
  ```python
  class Transformer:
      def __init__(self, vocab_size, d_model, n_heads, n_layers):
          self.embedding = Embedding(vocab_size, d_model)
          self.positional_encoding = PositionalEncoding()
          self.encoder = Encoder(n_layers, d_model, n_heads)
          self.decoder = Decoder(n_layers, d_model, n_heads)
  ```
- **Visualization**:
  - **Architecture diagram** (encoder-decoder stacks)
  - Attention patterns at each layer
  - Token embeddings + positional encoding
- **Interactive**: Translation demo, see each component

#### 6.3 How LLMs Work
- **Theory**: 
  - Tokenization (BPE, WordPiece)
  - Pretraining (next token prediction)
  - Fine-tuning (instruction tuning, RLHF)
  - Inference (autoregressive generation)
- **Key Concepts**:
  - Context window (token limits)
  - Temperature (randomness in generation)
  - Top-k, top-p sampling
  - Beam search
- **Visualization**:
  - Tokenization process (text → tokens)
  - Next token probability distribution
  - Temperature effect on distribution
  - Beam search tree

#### 6.4 Build Your Own LLM/SLM (Small Language Model)
- **Implementation Plan**:
  1. Collect text corpus
  2. Train tokenizer (BPE)
  3. Build transformer architecture (smaller scale)
  4. Pretrain on corpus (next token prediction)
  5. Fine-tune on specific task
- **Scale**: Start with 10M parameters (vs GPT-3's 175B)
- **Visualization**:
  - Training loss curve
  - Sample generations at different checkpoints
  - Token embeddings (t-SNE visualization)

#### 6.5 Build Your Own ChatGPT
- **Implementation Plan**:
  1. Base model (pretrained transformer)
  2. Instruction tuning dataset
  3. Supervised fine-tuning (SFT)
  4. Reward model training
  5. Reinforcement Learning from Human Feedback (RLHF)
- **Visualization**:
  - Before/after instruction tuning (quality comparison)
  - Reward model scores
  - RLHF training progress

#### 6.6 LLM Latency & Token Monitoring
- **Metrics to Track**:
  - Time to First Token (TTFT)
  - Tokens per second
  - Total latency
  - Token usage (prompt + completion)
  - Cost per request
- **Implementation**:
  ```python
  class LLMMonitor:
      def track_request(self, prompt, response):
          metrics = {
              'ttft': time_to_first_token,
              'tps': tokens_per_second,
              'total_tokens': prompt_tokens + completion_tokens,
              'cost': calculate_cost(total_tokens, model)
          }
          return metrics
  ```
- **Visualization**:
  - Real-time dashboard
  - Latency distribution histogram
  - Token usage over time
  - Cost tracking

---

### 🎨 CATEGORY 7: GENERATIVE MODELS

#### 7.1 Diffusion Models - From Scratch
- **Theory**: Add noise progressively (forward), learn to denoise (reverse)
- **Implementation**:
  - Forward process (add Gaussian noise)
  - Reverse process (U-Net denoising)
  - Training (predict noise)
  - Sampling (iterative denoising)
- **Use Case**: Image generation, text-to-image (Stable Diffusion)
- **Visualization**:
  - **ANIMATE DIFFUSION**: Show image → noise → image
  - Denoising steps visualization
  - Latent space interpolation
- **Interactive**: Text prompt, generate image step-by-step

#### 7.2 Variational Autoencoders (VAE)
- **Theory**: Encode to latent distribution, sample, decode
- **Implementation**: Encoder, decoder, KL divergence loss
- **Visualization**: Latent space (2D), interpolation between points

#### 7.3 Generative Adversarial Networks (GAN)
- **Theory**: Generator vs discriminator, adversarial training
- **Implementation**: Generator network, discriminator network, alternating training
- **Visualization**:
  - Generated samples over epochs
  - Discriminator accuracy
  - Mode collapse detection

---

### 🎮 CATEGORY 8: REINFORCEMENT LEARNING

**Goal**: Learn by interaction, reward-driven behavior

#### 8.1 Q-Learning
- **Theory**: Learn Q-values (state-action values), epsilon-greedy exploration
- **Implementation**: Q-table, Bellman equation updates
- **Use Case**: Grid world, simple games
- **Visualization**:
  - Q-table heatmap
  - Agent path in environment
  - Reward over episodes
- **Interactive**: Adjust learning rate, epsilon, gamma

#### 8.2 Deep Q-Network (DQN)
- **Theory**: Neural network approximates Q-function
- **Implementation**: Experience replay, target network
- **Use Case**: Atari games, complex environments
- **Visualization**:
  - Agent playing game
  - Loss curve
  - Epsilon decay

---

### 📝 CATEGORY 9: NATURAL LANGUAGE PROCESSING

#### 9.1 Text Preprocessing
- **Techniques**: Tokenization, stemming, lemmatization, stop words
- **Implementation**: Build custom tokenizer
- **Visualization**: Before/after text cleaning

#### 9.2 Bag of Words (BoW)
- **Theory**: Count-based representation
- **Visualization**: Document-term matrix heatmap

#### 9.3 TF-IDF
- **Theory**: Term frequency × inverse document frequency
- **Visualization**: Word importance scores

#### 9.4 Word Embeddings (Word2Vec, GloVe)
- **Theory**: Dense vector representations capturing semantics
- **Implementation**: Skip-gram, CBOW
- **Visualization**:
  - t-SNE of embeddings (see semantic clusters)
  - Vector arithmetic (king - man + woman = queen)

---

## 🏗️ PLATFORM ARCHITECTURE TO DEMONSTRATE ALL TOPICS

### Vision: **Interactive ML/AI Learning Dashboard**

```
┌─────────────────────────────────────────────────────────────────┐
│                   PROJECT NEBULA LEARNING PLATFORM              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐      │
│  │  ML Explorer │  │ Neural Net   │  │  LLM Workshop    │      │
│  │              │  │ Playground   │  │                  │      │
│  │ - Regression │  │ - Build ANN  │  │ - Transformers   │      │
│  │ - Classify   │  │ - See Layers │  │ - Build LLM      │      │
│  │ - Cluster    │  │ - Backprop   │  │ - Monitor Tokens │      │
│  └──────────────┘  └──────────────┘  └──────────────────┘      │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐      │
│  │  Model Lab   │  │ Visualization│  │  Chat Interface  │      │
│  │              │  │ Center       │  │                  │      │
│  │ - Compare    │  │ - Animate ML │  │ - Explain AI     │      │
│  │ - Tune       │  │ - See Inside │  │ - Ask Questions  │      │
│  │ - Evaluate   │  │ - Interactive│  │ - Get Insights   │      │
│  └──────────────┘  └──────────────┘  └──────────────────┘      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Key Features:

1. **ML Explorer Tab**
   - Select algorithm (regression, classification, clustering)
   - Upload data or use sample dataset
   - Adjust parameters with sliders
   - See visualization update in real-time
   - Compare multiple algorithms side-by-side

2. **Neural Network Playground**
   - Drag-and-drop architecture builder
   - Add layers (dense, conv, recurrent)
   - Watch forward pass animation
   - See backpropagation gradients
   - Train on MNIST, see learning progress

3. **LLM Workshop**
   - Tokenization demo
   - Attention visualization
   - Build transformer from scratch (step-by-step)
   - Monitor latency/tokens
   - Compare different LLMs

4. **Model Lab**
   - Cross-validation experiments
   - Hyperparameter tuning (grid/random search)
   - Feature engineering tools
   - Performance metrics dashboard

5. **Visualization Center**
   - All animations (clustering, gradient descent, diffusion)
   - Interactive plots (click on data points)
   - 3D visualizations (decision boundaries)
   - Architecture diagrams

6. **Chat Interface** (Educational AI Tutor)
   - Ask: "Explain backpropagation"
   - Request: "Show me how K-means works"
   - Command: "Compare SVM vs Random Forest"
   - AI explains + shows visualization

---

## 📋 IMPLEMENTATION CHECKLIST (COMPREHENSIVE)

### Phase 3: ML Fundamentals (Supervised Learning)
- [ ] Implement 6 regression algorithms from scratch
- [ ] Implement 6 classification algorithms from scratch
- [ ] Create interactive visualizations for each
- [ ] Build comparison dashboard
- [ ] Add sample datasets
- [ ] Create learning guides for each algorithm

### Phase 4: Unsupervised Learning & Feature Engineering
- [ ] Implement clustering algorithms (K-means, hierarchical, DBSCAN)
- [ ] Implement association rules (Apriori)
- [ ] Build feature engineering toolkit
- [ ] Implement cross-validation
- [ ] Implement hyperparameter tuning (grid search, random search)

### Phase 5: Neural Networks From Scratch
- [ ] Build ANN from pure Python (no frameworks)
- [ ] Implement backpropagation with step-by-step visualization
- [ ] Build CNN from scratch
- [ ] Build RNN/LSTM from scratch
- [ ] Implement ResNet architecture
- [ ] Create neural network playground UI

### Phase 6: Transformers & LLMs
- [ ] Implement attention mechanism
- [ ] Build transformer from scratch
- [ ] Create LLM monitoring system
- [ ] Train small language model (10M params)
- [ ] Build ChatGPT clone with fine-tuning
- [ ] Implement token latency tracking

### Phase 7: Generative Models
- [ ] Implement diffusion model from scratch
- [ ] Build VAE
- [ ] Build GAN
- [ ] Create image generation interface

### Phase 8: Reinforcement Learning
- [ ] Implement Q-learning
- [ ] Build DQN
- [ ] Create game environment
- [ ] Visualize agent learning

### Phase 9: NLP Deep Dive
- [ ] Build tokenizer from scratch
- [ ] Implement Word2Vec
- [ ] Create embedding visualizations
- [ ] Build text classification pipeline

---

## 🎯 LEARNING OUTCOMES

By completing this project, you will have:

### ✅ Deep Understanding
- How every ML algorithm works mathematically
- How neural networks learn (backpropagation intuition)
- How transformers enable LLMs
- How diffusion models generate images
- How reinforcement learning finds optimal strategies

### ✅ Practical Skills
- Implement algorithms from scratch (not just use libraries)
- Build neural networks without frameworks
- Create custom architectures
- Debug ML models (visualize what's wrong)
- Optimize hyperparameters

### ✅ Portfolio Project
- Impressive GitHub project
- Demonstrates breadth (many algorithms) and depth (from scratch implementations)
- Visual/interactive (not just code)
- Educational value (can teach others)

### ✅ Interview Readiness
- Can explain any algorithm in detail
- Can code ML algorithms on whiteboard
- Understand tradeoffs (when to use what)
- Know modern architectures (transformers, diffusion, ResNet)

---

## 🚀 NEXT STEPS

1. ✅ Finalize this research document
2. Update CORE_UNDERSTANDING.md with learning mission
3. Update TASKS.txt with phased implementation plan
4. Design UI mockups for ML playground
5. Start with Phase 3: Implement first regression algorithm (Simple Linear Regression from scratch)

---

**This document is the master reference for all ML/AI topics we will cover. Nothing will be missed!**
