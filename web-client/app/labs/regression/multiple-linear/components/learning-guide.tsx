'use client';

import { ChevronDown, ChevronUp, BookOpen, ExternalLink } from 'lucide-react';

interface LearningGuideProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

export default function LearningGuide({ isOpen, onToggle }: LearningGuideProps) {
  return (
    <div className="mb-6 rounded-lg border border-cyan-500/20 bg-cyan-500/5 overflow-hidden">
      <div className="w-full flex items-center justify-between p-4 bg-cyan-500/5 hover:bg-cyan-500/10 transition-colors">
        <button
          onClick={() => onToggle(!isOpen)}
          className="flex items-center gap-2 flex-1"
        >
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold">📚 Learn About Multiple Linear Regression</h2>
        </button>
        <button
          onClick={() => onToggle(!isOpen)}
          className="p-1 hover:bg-cyan-500/20 rounded transition-colors"
        >
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-cyan-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-cyan-400" />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="p-4 border-t border-cyan-500/20 space-y-4 text-sm">
          {/* What is it? */}
          <div>
            <h3 className="font-semibold text-cyan-300 mb-2">🤔 What is it?</h3>
            <p className="text-gray-400 mb-3">
              Multiple Linear Regression is a statistical technique that models the relationship between a target variable (y) and multiple independent variables (x₁, x₂, ..., xₙ). It extends simple linear regression to handle multiple features simultaneously.
            </p>
            <p className="text-gray-400 mb-3">
              <strong>Real-world example:</strong> Predicting house price based on square footage, number of bedrooms, age of house, and location. Instead of using just one factor, we use all of them together.
            </p>
            <a
              href="https://colab.research.google.com/drive/170d6PB0mLpxI5O-VzoVVGSF_fz09WNgF?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 underline mt-2"
            >
              <ExternalLink className="w-4 h-4" />
              Open Interactive Google Colab Notebook
            </a>
          </div>

          {/* Key Concepts */}
          <div>
            <h3 className="font-semibold text-cyan-300 mb-2">💡 Key Concepts</h3>
            <ul className="text-gray-400 space-y-2 ml-4">
              <li><strong>• Linear relationship:</strong> Assumes the target changes proportionally to features (straight line in multi-dimensional space)</li>
              <li><strong>• Coefficients (β):</strong> The multipliers that show how much each feature impacts the prediction</li>
              <li><strong>• Intercept (b₀):</strong> The baseline value when all features are zero</li>
              <li><strong>• Multicollinearity:</strong> When features are correlated with each other (degrades model reliability)</li>
              <li><strong>• Adjusted R²:</strong> Performance metric that accounts for the number of features</li>
            </ul>
          </div>

          {/* The Math */}
          <div>
            <h3 className="font-semibold text-cyan-300 mb-2">📐 The Formula</h3>
            <div className="bg-gray-900 rounded p-3 font-mono text-cyan-300 mb-2 overflow-x-auto">
              y = b₀ + b₁x₁ + b₂x₂ + ... + bₙxₙ
            </div>
            <p className="text-gray-400">Where:</p>
            <ul className="text-gray-400 space-y-1 ml-4 text-xs">
              <li>• y = predicted value</li>
              <li>• b₀ = intercept (y when all x = 0)</li>
              <li>• b₁, b₂, ..., bₙ = coefficients (slopes for each feature)</li>
              <li>• x₁, x₂, ..., xₙ = feature values</li>
            </ul>
          </div>

          {/* Real-world Applications */}
          <div>
            <h3 className="font-semibold text-cyan-300 mb-2">🌍 Real-world Applications</h3>
            <ul className="text-gray-400 space-y-2 ml-4">
              <li><strong>Real Estate:</strong> Predict house prices using square footage, bedrooms, bathrooms, age, location</li>
              <li><strong>Healthcare:</strong> Predict patient outcomes based on age, weight, blood pressure, cholesterol</li>
              <li><strong>Economics:</strong> Forecast GDP using employment rate, investment, consumer spending</li>
              <li><strong>Sales Forecasting:</strong> Predict revenue based on marketing spend, seasonality, competitor pricing</li>
            </ul>
          </div>

          {/* Pros and Cons */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-500/10 border border-green-500/30 rounded p-3">
              <h4 className="font-semibold text-green-400 mb-2">✅ Advantages</h4>
              <ul className="text-gray-400 space-y-1 text-xs ml-3 list-disc">
                <li>Simple and interpretable</li>
                <li>Fast to train</li>
                <li>Works well with linear data</li>
                <li>Provides feature importance</li>
                <li>Computationally efficient</li>
              </ul>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded p-3">
              <h4 className="font-semibold text-red-400 mb-2">❌ Limitations</h4>
              <ul className="text-gray-400 space-y-1 text-xs ml-3 list-disc">
                <li>Assumes linear relationships</li>
                <li>Sensitive to outliers</li>
                <li>Requires feature scaling</li>
                <li>Suffers from multicollinearity</li>
                <li>Not suitable for categorical data</li>
              </ul>
            </div>
          </div>

          {/* Further Reading */}
          <div>
            <h3 className="font-semibold text-cyan-300 mb-2">📖 Further Reading</h3>
            <ul className="text-gray-400 space-y-1 ml-4">
              <li>• <a href="https://en.wikipedia.org/wiki/Linear_regression" target="_blank" className="text-cyan-400 hover:underline">Wikipedia: Linear Regression</a></li>
              <li>• <a href="https://scikit-learn.org/stable/modules/linear_model.html#ordinary-least-squares" target="_blank" className="text-cyan-400 hover:underline">Scikit-learn: Linear Regression Documentation</a></li>
              <li>• <a href="https://www.khanacademy.org/math/statistics-probability" target="_blank" className="text-cyan-400 hover:underline">Khan Academy: Statistics & Probability</a></li>
            </ul>
          </div>

          {/* Implementation Tips */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3">
            <h4 className="font-semibold text-blue-300 mb-2">💡 Implementation Tips</h4>
            <ul className="text-gray-400 space-y-1 ml-4 text-xs">
              <li>• <strong>Normalize features:</strong> Scale features to similar ranges (0-1 or -1 to 1)</li>
              <li>• <strong>Check correlation:</strong> Look at feature correlations to detect multicollinearity</li>
              <li>• <strong>Remove outliers:</strong> Extreme values can skew the model</li>
              <li>• <strong>Use Adjusted R²:</strong> Better metric than R² when you have many features</li>
              <li>• <strong>Condition number:</strong> Values {'>'} 30 indicate multicollinearity issues</li>
            </ul>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3">
            <p className="text-yellow-300 text-xs">
              <strong>Note:</strong> Multiple Linear Regression assumes linear relationships. For non-linear patterns, consider <strong>polynomial regression, decision trees, or random forests</strong>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
