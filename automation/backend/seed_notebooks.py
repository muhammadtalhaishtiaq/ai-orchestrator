"""
Seed exact notebook structure from PROJECT_STRUCTURE.md.
Run: python3.12 seed_notebooks.py
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

from app.database import supabase_admin


def name_from_file(filename: str) -> str:
    """Convert filename to human-readable name. e.g. 01_python_basics.ipynb -> Python Basics"""
    base = filename.replace(".ipynb", "")
    # Remove leading order prefix like "01_"
    parts = base.split("_", 1)
    label = parts[1] if len(parts) > 1 else parts[0]
    return label.replace("_", " ").title()


# ─── EXACT structure from PROJECT_STRUCTURE.md ──────────────────────────────
# Format: (folder, folder_order, subfolder_or_None, notebook_order, filename)
# path = folder/subfolder/filename  OR  folder/filename (if no subfolder)
# ─────────────────────────────────────────────────────────────────────────────

CATALOG = [

    # ── 00-foundations (12) ─────────────────────────────────────────────────
    ("00-foundations", 0, "python-essentials", 1,  "01_python_basics.ipynb"),
    ("00-foundations", 0, "python-essentials", 2,  "02_numpy_fundamentals.ipynb"),
    ("00-foundations", 0, "python-essentials", 3,  "03_pandas_mastery.ipynb"),
    ("00-foundations", 0, "python-essentials", 4,  "04_matplotlib_seaborn.ipynb"),
    ("00-foundations", 0, "math-for-ml",       5,  "01_linear_algebra.ipynb"),
    ("00-foundations", 0, "math-for-ml",       6,  "02_calculus_gradients.ipynb"),
    ("00-foundations", 0, "math-for-ml",       7,  "03_probability_statistics.ipynb"),
    ("00-foundations", 0, "math-for-ml",       8,  "04_optimization.ipynb"),
    ("00-foundations", 0, "statistics",        9,  "01_descriptive_statistics.ipynb"),
    ("00-foundations", 0, "statistics",        10, "02_inferential_statistics.ipynb"),
    ("00-foundations", 0, "statistics",        11, "03_hypothesis_testing.ipynb"),
    ("00-foundations", 0, "statistics",        12, "04_distributions.ipynb"),

    # ── 01-data-preprocessing (6) ───────────────────────────────────────────
    ("01-data-preprocessing", 1, None, 1, "01_handling_missing_data.ipynb"),
    ("01-data-preprocessing", 1, None, 2, "02_encoding_categorical.ipynb"),
    ("01-data-preprocessing", 1, None, 3, "03_feature_scaling.ipynb"),
    ("01-data-preprocessing", 1, None, 4, "04_train_test_split.ipynb"),
    ("01-data-preprocessing", 1, None, 5, "05_data_augmentation.ipynb"),
    ("01-data-preprocessing", 1, None, 6, "06_imbalanced_data.ipynb"),

    # ── 02-exploratory-data-analysis (6) ────────────────────────────────────
    ("02-exploratory-data-analysis", 2, None, 1, "01_eda_workflow.ipynb"),
    ("02-exploratory-data-analysis", 2, None, 2, "02_univariate_analysis.ipynb"),
    ("02-exploratory-data-analysis", 2, None, 3, "03_bivariate_analysis.ipynb"),
    ("02-exploratory-data-analysis", 2, None, 4, "04_correlation_analysis.ipynb"),
    ("02-exploratory-data-analysis", 2, None, 5, "05_outlier_detection.ipynb"),
    ("02-exploratory-data-analysis", 2, None, 6, "06_automated_eda_tools.ipynb"),

    # ── 03-feature-engineering (7) ──────────────────────────────────────────
    ("03-feature-engineering", 3, None, 1, "01_feature_selection.ipynb"),
    ("03-feature-engineering", 3, None, 2, "02_feature_extraction.ipynb"),
    ("03-feature-engineering", 3, None, 3, "03_feature_transformation.ipynb"),
    ("03-feature-engineering", 3, None, 4, "04_polynomial_features.ipynb"),
    ("03-feature-engineering", 3, None, 5, "05_binning_discretization.ipynb"),
    ("03-feature-engineering", 3, None, 6, "06_datetime_features.ipynb"),
    ("03-feature-engineering", 3, None, 7, "07_text_features.ipynb"),

    # ── 04-regression (8) ───────────────────────────────────────────────────
    ("04-regression", 4, None, 1, "01_linear_regression.ipynb"),
    ("04-regression", 4, None, 2, "02_multiple_linear_regression.ipynb"),
    ("04-regression", 4, None, 3, "03_polynomial_regression.ipynb"),
    ("04-regression", 4, None, 4, "04_support_vector_regression.ipynb"),
    ("04-regression", 4, None, 5, "05_decision_tree_regression.ipynb"),
    ("04-regression", 4, None, 6, "06_random_forest_regression.ipynb"),
    ("04-regression", 4, None, 7, "07_gradient_boosting_regression.ipynb"),
    ("04-regression", 4, None, 8, "08_xgboost_regression.ipynb"),

    # ── 05-classification (9) ───────────────────────────────────────────────
    ("05-classification", 5, None, 1, "01_logistic_regression.ipynb"),
    ("05-classification", 5, None, 2, "02_knn.ipynb"),
    ("05-classification", 5, None, 3, "03_svm.ipynb"),
    ("05-classification", 5, None, 4, "04_kernel_svm.ipynb"),
    ("05-classification", 5, None, 5, "05_naive_bayes.ipynb"),
    ("05-classification", 5, None, 6, "06_decision_tree_classifier.ipynb"),
    ("05-classification", 5, None, 7, "07_random_forest_classifier.ipynb"),
    ("05-classification", 5, None, 8, "08_xgboost_classifier.ipynb"),
    ("05-classification", 5, None, 9, "09_multiclass_strategies.ipynb"),

    # ── 06-clustering (5) ───────────────────────────────────────────────────
    ("06-clustering", 6, None, 1, "01_kmeans.ipynb"),
    ("06-clustering", 6, None, 2, "02_hierarchical_clustering.ipynb"),
    ("06-clustering", 6, None, 3, "03_dbscan.ipynb"),
    ("06-clustering", 6, None, 4, "04_gaussian_mixture_models.ipynb"),
    ("06-clustering", 6, None, 5, "05_cluster_evaluation.ipynb"),

    # ── 07-dimensionality-reduction (5) ─────────────────────────────────────
    ("07-dimensionality-reduction", 7, None, 1, "01_pca.ipynb"),
    ("07-dimensionality-reduction", 7, None, 2, "02_lda.ipynb"),
    ("07-dimensionality-reduction", 7, None, 3, "03_kernel_pca.ipynb"),
    ("07-dimensionality-reduction", 7, None, 4, "04_tsne.ipynb"),
    ("07-dimensionality-reduction", 7, None, 5, "05_umap.ipynb"),

    # ── 08-model-evaluation (6) ─────────────────────────────────────────────
    ("08-model-evaluation", 8, None, 1, "01_cross_validation.ipynb"),
    ("08-model-evaluation", 8, None, 2, "02_confusion_matrix_metrics.ipynb"),
    ("08-model-evaluation", 8, None, 3, "03_roc_auc_curves.ipynb"),
    ("08-model-evaluation", 8, None, 4, "04_hyperparameter_tuning.ipynb"),
    ("08-model-evaluation", 8, None, 5, "05_bias_variance_tradeoff.ipynb"),
    ("08-model-evaluation", 8, None, 6, "06_model_comparison.ipynb"),

    # ── 09-ensemble-methods (6) ─────────────────────────────────────────────
    ("09-ensemble-methods", 9, None, 1, "01_bagging.ipynb"),
    ("09-ensemble-methods", 9, None, 2, "02_boosting.ipynb"),
    ("09-ensemble-methods", 9, None, 3, "03_xgboost.ipynb"),
    ("09-ensemble-methods", 9, None, 4, "04_lightgbm.ipynb"),
    ("09-ensemble-methods", 9, None, 5, "05_catboost.ipynb"),
    ("09-ensemble-methods", 9, None, 6, "06_stacking.ipynb"),

    # ── 10-neural-networks (20) ─────────────────────────────────────────────
    ("10-neural-networks", 10, "fundamentals", 1,  "01_perceptron.ipynb"),
    ("10-neural-networks", 10, "fundamentals", 2,  "02_multilayer_perceptron.ipynb"),
    ("10-neural-networks", 10, "fundamentals", 3,  "03_activation_functions.ipynb"),
    ("10-neural-networks", 10, "fundamentals", 4,  "04_backpropagation.ipynb"),
    ("10-neural-networks", 10, "fundamentals", 5,  "05_optimizers.ipynb"),
    ("10-neural-networks", 10, "fundamentals", 6,  "06_regularization.ipynb"),
    ("10-neural-networks", 10, "cnn",          7,  "01_cnn_basics.ipynb"),
    ("10-neural-networks", 10, "cnn",          8,  "02_convolution_pooling.ipynb"),
    ("10-neural-networks", 10, "cnn",          9,  "03_image_classification.ipynb"),
    ("10-neural-networks", 10, "cnn",          10, "04_transfer_learning.ipynb"),
    ("10-neural-networks", 10, "cnn",          11, "05_popular_architectures.ipynb"),
    ("10-neural-networks", 10, "rnn",          12, "01_rnn_basics.ipynb"),
    ("10-neural-networks", 10, "rnn",          13, "02_lstm.ipynb"),
    ("10-neural-networks", 10, "rnn",          14, "03_gru.ipynb"),
    ("10-neural-networks", 10, "rnn",          15, "04_sequence_to_sequence.ipynb"),
    ("10-neural-networks", 10, "rnn",          16, "05_time_series.ipynb"),
    ("10-neural-networks", 10, "advanced",     17, "01_autoencoders.ipynb"),
    ("10-neural-networks", 10, "advanced",     18, "02_variational_autoencoders.ipynb"),
    ("10-neural-networks", 10, "advanced",     19, "03_gans.ipynb"),
    ("10-neural-networks", 10, "advanced",     20, "04_diffusion_models.ipynb"),

    # ── 11-attention-transformers (7) ───────────────────────────────────────
    ("11-attention-transformers", 11, None, 1, "01_attention_mechanism.ipynb"),
    ("11-attention-transformers", 11, None, 2, "02_self_attention.ipynb"),
    ("11-attention-transformers", 11, None, 3, "03_transformer_architecture.ipynb"),
    ("11-attention-transformers", 11, None, 4, "04_positional_encoding.ipynb"),
    ("11-attention-transformers", 11, None, 5, "05_bert.ipynb"),
    ("11-attention-transformers", 11, None, 6, "06_gpt.ipynb"),
    ("11-attention-transformers", 11, None, 7, "07_vision_transformers.ipynb"),

    # ── 12-nlp (10) ─────────────────────────────────────────────────────────
    ("12-nlp", 12, "classical", 1,  "01_text_preprocessing.ipynb"),
    ("12-nlp", 12, "classical", 2,  "02_bag_of_words.ipynb"),
    ("12-nlp", 12, "classical", 3,  "03_tfidf.ipynb"),
    ("12-nlp", 12, "classical", 4,  "04_word2vec.ipynb"),
    ("12-nlp", 12, "classical", 5,  "05_sentiment_analysis.ipynb"),
    ("12-nlp", 12, "modern",    6,  "01_huggingface_basics.ipynb"),
    ("12-nlp", 12, "modern",    7,  "02_text_classification.ipynb"),
    ("12-nlp", 12, "modern",    8,  "03_named_entity_recognition.ipynb"),
    ("12-nlp", 12, "modern",    9,  "04_text_summarization.ipynb"),
    ("12-nlp", 12, "modern",    10, "05_question_answering.ipynb"),

    # ── 13-computer-vision (5) ──────────────────────────────────────────────
    ("13-computer-vision", 13, None, 1, "01_image_preprocessing.ipynb"),
    ("13-computer-vision", 13, None, 2, "02_object_detection.ipynb"),
    ("13-computer-vision", 13, None, 3, "03_image_segmentation.ipynb"),
    ("13-computer-vision", 13, None, 4, "04_face_recognition.ipynb"),
    ("13-computer-vision", 13, None, 5, "05_ocr.ipynb"),

    # ── 14-llms (15) ────────────────────────────────────────────────────────
    ("14-llms", 14, "fundamentals",       1,  "01_what_are_llms.ipynb"),
    ("14-llms", 14, "fundamentals",       2,  "02_tokenization.ipynb"),
    ("14-llms", 14, "fundamentals",       3,  "03_inference_parameters.ipynb"),
    ("14-llms", 14, "fundamentals",       4,  "04_local_llms.ipynb"),
    ("14-llms", 14, "fundamentals",       5,  "05_api_usage.ipynb"),
    ("14-llms", 14, "prompt-engineering", 6,  "01_prompt_basics.ipynb"),
    ("14-llms", 14, "prompt-engineering", 7,  "02_zero_few_shot.ipynb"),
    ("14-llms", 14, "prompt-engineering", 8,  "03_chain_of_thought.ipynb"),
    ("14-llms", 14, "prompt-engineering", 9,  "04_structured_outputs.ipynb"),
    ("14-llms", 14, "prompt-engineering", 10, "05_prompt_optimization.ipynb"),
    ("14-llms", 14, "fine-tuning",        11, "01_when_to_finetune.ipynb"),
    ("14-llms", 14, "fine-tuning",        12, "02_lora.ipynb"),
    ("14-llms", 14, "fine-tuning",        13, "03_qlora.ipynb"),
    ("14-llms", 14, "fine-tuning",        14, "04_full_finetuning.ipynb"),
    ("14-llms", 14, "fine-tuning",        15, "05_evaluation_benchmarks.ipynb"),

    # ── 15-rag (8) ──────────────────────────────────────────────────────────
    ("15-rag", 15, None, 1, "01_rag_fundamentals.ipynb"),
    ("15-rag", 15, None, 2, "02_vector_databases.ipynb"),
    ("15-rag", 15, None, 3, "03_embeddings.ipynb"),
    ("15-rag", 15, None, 4, "04_chunking_strategies.ipynb"),
    ("15-rag", 15, None, 5, "05_retrieval_techniques.ipynb"),
    ("15-rag", 15, None, 6, "06_reranking.ipynb"),
    ("15-rag", 15, None, 7, "07_advanced_rag.ipynb"),
    ("15-rag", 15, None, 8, "08_rag_evaluation.ipynb"),

    # ── 16-ai-agents (14) ───────────────────────────────────────────────────
    ("16-ai-agents", 16, "fundamentals", 1,  "01_what_are_agents.ipynb"),
    ("16-ai-agents", 16, "fundamentals", 2,  "02_tool_use.ipynb"),
    ("16-ai-agents", 16, "fundamentals", 3,  "03_memory_systems.ipynb"),
    ("16-ai-agents", 16, "fundamentals", 4,  "04_planning_reasoning.ipynb"),
    ("16-ai-agents", 16, "frameworks",   5,  "01_langchain.ipynb"),
    ("16-ai-agents", 16, "frameworks",   6,  "02_langgraph.ipynb"),
    ("16-ai-agents", 16, "frameworks",   7,  "03_crewai.ipynb"),
    ("16-ai-agents", 16, "frameworks",   8,  "04_autogen.ipynb"),
    ("16-ai-agents", 16, "frameworks",   9,  "05_pydantic_ai.ipynb"),
    ("16-ai-agents", 16, "frameworks",   10, "06_openai_agents.ipynb"),
    ("16-ai-agents", 16, "patterns",     11, "01_react_agent.ipynb"),
    ("16-ai-agents", 16, "patterns",     12, "02_multi_agent.ipynb"),
    ("16-ai-agents", 16, "patterns",     13, "03_supervisor_pattern.ipynb"),
    ("16-ai-agents", 16, "patterns",     14, "04_human_in_loop.ipynb"),

    # ── 17-reinforcement-learning (6) ───────────────────────────────────────
    ("17-reinforcement-learning", 17, None, 1, "01_rl_fundamentals.ipynb"),
    ("17-reinforcement-learning", 17, None, 2, "02_markov_decision_process.ipynb"),
    ("17-reinforcement-learning", 17, None, 3, "03_q_learning.ipynb"),
    ("17-reinforcement-learning", 17, None, 4, "04_deep_q_network.ipynb"),
    ("17-reinforcement-learning", 17, None, 5, "05_policy_gradient.ipynb"),
    ("17-reinforcement-learning", 17, None, 6, "06_ppo.ipynb"),

    # ── 18-mlops (32) ───────────────────────────────────────────────────────
    ("18-mlops", 18, "experiment-tracking",    1,  "01_mlflow.ipynb"),
    ("18-mlops", 18, "experiment-tracking",    2,  "02_weights_biases.ipynb"),
    ("18-mlops", 18, "experiment-tracking",    3,  "03_tensorboard.ipynb"),
    ("18-mlops", 18, "model-registry",         4,  "01_what_is_model_registry.ipynb"),
    ("18-mlops", 18, "model-registry",         5,  "02_mlflow_registry.ipynb"),
    ("18-mlops", 18, "model-registry",         6,  "03_dvc_versioning.ipynb"),
    ("18-mlops", 18, "model-registry",         7,  "04_model_promotion.ipynb"),
    ("18-mlops", 18, "model-serving",          8,  "01_flask_api.ipynb"),
    ("18-mlops", 18, "model-serving",          9,  "02_fastapi.ipynb"),
    ("18-mlops", 18, "model-serving",          10, "03_streamlit_demo.ipynb"),
    ("18-mlops", 18, "model-serving",          11, "04_gradio.ipynb"),
    ("18-mlops", 18, "model-serving",          12, "05_docker.ipynb"),
    ("18-mlops", 18, "model-serving",          13, "06_kubernetes_basics.ipynb"),
    ("18-mlops", 18, "ci-cd",                  14, "01_github_actions_ml.ipynb"),
    ("18-mlops", 18, "ci-cd",                  15, "02_automated_testing.ipynb"),
    ("18-mlops", 18, "ci-cd",                  16, "03_model_validation_gates.ipynb"),
    ("18-mlops", 18, "ci-cd",                  17, "04_continuous_training.ipynb"),
    ("18-mlops", 18, "monitoring",             18, "01_why_monitoring.ipynb"),
    ("18-mlops", 18, "monitoring",             19, "02_data_drift.ipynb"),
    ("18-mlops", 18, "monitoring",             20, "03_concept_drift.ipynb"),
    ("18-mlops", 18, "monitoring",             21, "04_performance_tracking.ipynb"),
    ("18-mlops", 18, "monitoring",             22, "05_alerting_systems.ipynb"),
    ("18-mlops", 18, "monitoring",             23, "06_evidently_ai.ipynb"),
    ("18-mlops", 18, "deployment-strategies",  24, "01_blue_green.ipynb"),
    ("18-mlops", 18, "deployment-strategies",  25, "02_canary_deployment.ipynb"),
    ("18-mlops", 18, "deployment-strategies",  26, "03_shadow_mode.ipynb"),
    ("18-mlops", 18, "deployment-strategies",  27, "04_ab_testing_ml.ipynb"),
    ("18-mlops", 18, "deployment-strategies",  28, "05_rollback_strategies.ipynb"),
    ("18-mlops", 18, "pipelines",              29, "01_airflow.ipynb"),
    ("18-mlops", 18, "pipelines",              30, "02_prefect.ipynb"),
    ("18-mlops", 18, "pipelines",              31, "03_dagster.ipynb"),
    ("18-mlops", 18, "pipelines",              32, "04_kubeflow.ipynb"),

    # ── 19-data-engineering (11) ────────────────────────────────────────────
    ("19-data-engineering", 19, "etl",           1,  "01_etl_basics.ipynb"),
    ("19-data-engineering", 19, "etl",           2,  "02_pandas_at_scale.ipynb"),
    ("19-data-engineering", 19, "etl",           3,  "03_polars.ipynb"),
    ("19-data-engineering", 19, "etl",           4,  "04_pyspark_basics.ipynb"),
    ("19-data-engineering", 19, "etl",           5,  "05_dbt.ipynb"),
    ("19-data-engineering", 19, "feature-stores",6,  "01_what_is_feature_store.ipynb"),
    ("19-data-engineering", 19, "feature-stores",7,  "02_feast.ipynb"),
    ("19-data-engineering", 19, "feature-stores",8,  "03_feature_pipelines.ipynb"),
    ("19-data-engineering", 19, "data-quality",  9,  "01_data_validation.ipynb"),
    ("19-data-engineering", 19, "data-quality",  10, "02_schema_validation.ipynb"),
    ("19-data-engineering", 19, "data-quality",  11, "03_data_contracts.ipynb"),

    # ── 20-cloud-deployment (9) ─────────────────────────────────────────────
    ("20-cloud-deployment", 20, "aws",   1, "01_sagemaker_basics.ipynb"),
    ("20-cloud-deployment", 20, "aws",   2, "02_lambda_inference.ipynb"),
    ("20-cloud-deployment", 20, "aws",   3, "03_s3_data_storage.ipynb"),
    ("20-cloud-deployment", 20, "aws",   4, "04_ec2_gpu_training.ipynb"),
    ("20-cloud-deployment", 20, "gcp",   5, "01_vertex_ai.ipynb"),
    ("20-cloud-deployment", 20, "gcp",   6, "02_cloud_run.ipynb"),
    ("20-cloud-deployment", 20, "gcp",   7, "03_bigquery_ml.ipynb"),
    ("20-cloud-deployment", 20, "azure", 8, "01_azure_ml_studio.ipynb"),
    ("20-cloud-deployment", 20, "azure", 9, "02_azure_functions.ipynb"),

    # ── 21-production-best-practices (8) ────────────────────────────────────
    ("21-production-best-practices", 21, None, 1, "01_ml_system_design.ipynb"),
    ("21-production-best-practices", 21, None, 2, "02_error_handling.ipynb"),
    ("21-production-best-practices", 21, None, 3, "03_logging_observability.ipynb"),
    ("21-production-best-practices", 21, None, 4, "04_security_ml.ipynb"),
    ("21-production-best-practices", 21, None, 5, "05_cost_optimization.ipynb"),
    ("21-production-best-practices", 21, None, 6, "06_latency_optimization.ipynb"),
    ("21-production-best-practices", 21, None, 7, "07_batch_vs_realtime.ipynb"),
    ("21-production-best-practices", 21, None, 8, "08_model_governance.ipynb"),

    # ── 22-end-to-end-projects (35) ─────────────────────────────────────────
    ("22-end-to-end-projects", 22, "project-1-churn-prediction",       1,  "01_problem_definition.ipynb"),
    ("22-end-to-end-projects", 22, "project-1-churn-prediction",       2,  "02_data_collection.ipynb"),
    ("22-end-to-end-projects", 22, "project-1-churn-prediction",       3,  "03_eda.ipynb"),
    ("22-end-to-end-projects", 22, "project-1-churn-prediction",       4,  "04_feature_engineering.ipynb"),
    ("22-end-to-end-projects", 22, "project-1-churn-prediction",       5,  "05_model_training.ipynb"),
    ("22-end-to-end-projects", 22, "project-1-churn-prediction",       6,  "06_evaluation.ipynb"),
    ("22-end-to-end-projects", 22, "project-1-churn-prediction",       7,  "07_deployment.ipynb"),
    ("22-end-to-end-projects", 22, "project-1-churn-prediction",       8,  "08_monitoring.ipynb"),
    ("22-end-to-end-projects", 22, "project-2-fraud-detection",        9,  "01_problem_definition.ipynb"),
    ("22-end-to-end-projects", 22, "project-2-fraud-detection",        10, "02_data_collection.ipynb"),
    ("22-end-to-end-projects", 22, "project-2-fraud-detection",        11, "03_eda.ipynb"),
    ("22-end-to-end-projects", 22, "project-2-fraud-detection",        12, "04_feature_engineering.ipynb"),
    ("22-end-to-end-projects", 22, "project-2-fraud-detection",        13, "05_model_training.ipynb"),
    ("22-end-to-end-projects", 22, "project-2-fraud-detection",        14, "06_evaluation.ipynb"),
    ("22-end-to-end-projects", 22, "project-2-fraud-detection",        15, "07_deployment.ipynb"),
    ("22-end-to-end-projects", 22, "project-2-fraud-detection",        16, "08_monitoring.ipynb"),
    ("22-end-to-end-projects", 22, "project-3-recommendation-system",  17, "01_problem_definition.ipynb"),
    ("22-end-to-end-projects", 22, "project-3-recommendation-system",  18, "02_data_collection.ipynb"),
    ("22-end-to-end-projects", 22, "project-3-recommendation-system",  19, "03_eda.ipynb"),
    ("22-end-to-end-projects", 22, "project-3-recommendation-system",  20, "04_feature_engineering.ipynb"),
    ("22-end-to-end-projects", 22, "project-3-recommendation-system",  21, "05_model_training.ipynb"),
    ("22-end-to-end-projects", 22, "project-3-recommendation-system",  22, "06_evaluation.ipynb"),
    ("22-end-to-end-projects", 22, "project-3-recommendation-system",  23, "07_deployment.ipynb"),
    ("22-end-to-end-projects", 22, "project-3-recommendation-system",  24, "08_monitoring.ipynb"),
    ("22-end-to-end-projects", 22, "project-4-chatbot-rag",            25, "01_requirements.ipynb"),
    ("22-end-to-end-projects", 22, "project-4-chatbot-rag",            26, "02_data_ingestion.ipynb"),
    ("22-end-to-end-projects", 22, "project-4-chatbot-rag",            27, "03_vector_store.ipynb"),
    ("22-end-to-end-projects", 22, "project-4-chatbot-rag",            28, "04_rag_pipeline.ipynb"),
    ("22-end-to-end-projects", 22, "project-4-chatbot-rag",            29, "05_api_deployment.ipynb"),
    ("22-end-to-end-projects", 22, "project-4-chatbot-rag",            30, "06_evaluation.ipynb"),
    ("22-end-to-end-projects", 22, "project-5-ai-agent",               31, "01_agent_design.ipynb"),
    ("22-end-to-end-projects", 22, "project-5-ai-agent",               32, "02_tool_creation.ipynb"),
    ("22-end-to-end-projects", 22, "project-5-ai-agent",               33, "03_memory_setup.ipynb"),
    ("22-end-to-end-projects", 22, "project-5-ai-agent",               34, "04_testing.ipynb"),
    ("22-end-to-end-projects", 22, "project-5-ai-agent",               35, "05_deployment.ipynb"),
]


def seed_notebooks(user_id: str, repo_full_name: str = "muhammadtalhaishtiaq/ai-orchestrator"):
    print(f"\n🌱 Seeding exact PROJECT_STRUCTURE.md notebooks for user: {user_id}")
    inserted = 0
    skipped = 0

    for (folder, folder_order, subfolder, nb_order, filename) in CATALOG:
        # Build path: folder/subfolder/file  OR  folder/file
        if subfolder:
            path = f"{folder}/{subfolder}/{filename}"
        else:
            path = f"{folder}/{filename}"

        # Human-readable name from filename
        nb_name = name_from_file(filename)

        # Skip if already exists
        existing = supabase_admin.table("notebooks")\
            .select("id")\
            .eq("user_id", user_id)\
            .eq("path", path)\
            .execute()

        if existing.data:
            skipped += 1
            continue

        supabase_admin.table("notebooks").insert({
            "user_id": user_id,
            "repo_full_name": repo_full_name,
            "path": path,
            "name": nb_name,
            "raw_name": filename,
            "folder": folder,
            "folder_order": folder_order,
            "notebook_order": nb_order,
            "status": "missing",
            "sha": None,
            "html_url": f"https://github.com/{repo_full_name}/blob/main/{path}",
        }).execute()
        inserted += 1

    print(f"\n✅ Done! Inserted: {inserted}, Skipped (existing): {skipped}")
    print(f"📊 Total in catalog: {len(CATALOG)}")

    # Per-folder summary
    from collections import Counter
    folder_counts = Counter(row[0] for row in CATALOG)
    for folder, count in sorted(folder_counts.items(), key=lambda x: x[1][0] if x else 0):
        print(f"   {folder}: {count}")


if __name__ == "__main__":
    users = supabase_admin.table("user_profiles").select("id").execute()
    if not users.data:
        print("❌ No users found"); sys.exit(1)
    for user in users.data:
        seed_notebooks(user["id"])
