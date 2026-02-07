'use client';

import { ChevronDown, ChevronUp, BookOpen, Code2 } from 'lucide-react';

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
          <h2 className="text-lg font-semibold">📚 Learning Guide</h2>
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
          <div>
            <h3 className="font-semibold text-cyan-300 mb-2">What is Multiple Linear Regression?</h3>
            <p className="text-gray-400">
              An extension of simple linear regression that uses <strong>multiple features</strong> to predict a target value. Instead of y = mx + b, we have y = b₀ + b₁x₁ + b₂x₂ + ... + bₙxₙ
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-cyan-300 mb-2">The Math: y = b₀ + b₁x₁ + b₂x₂ + ... + bₙxₙ</h3>
            <ul className="text-gray-400 space-y-1 ml-4">
              <li>• <span className="font-mono">b₀</span> = intercept (base value)</li>
              <li>• <span className="font-mono">b₁, b₂, ..., bₙ</span> = coefficients (impact of each feature)</li>
              <li>• <span className="font-mono">x₁, x₂, ..., xₙ</span> = features (independent variables)</li>
              <li>• <span className="font-mono">y</span> = prediction (dependent variable)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-cyan-300 mb-2">Why Use It?</h3>
            <ul className="text-gray-400 space-y-1 ml-4">
              <li>✓ Model complex relationships with multiple factors</li>
              <li>✓ Understand which features are most important</li>
              <li>✓ More accurate predictions than simple linear regression</li>
              <li>✓ Handle real-world scenarios (e.g., house price based on size, bedrooms, age)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-cyan-300 mb-2">How It Works (4 Steps)</h3>
            <ol className="text-gray-400 space-y-1 ml-4 list-decimal">
              <li>Upload CSV file with multiple columns</li>
              <li>Select multiple feature columns (X₁, X₂, ...) and one target (Y)</li>
              <li>Click "Train Model" to calculate all coefficients</li>
              <li>Enter feature values to predict target</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-cyan-300 mb-2">Metrics</h3>
            <ul className="text-gray-400 space-y-1 ml-4">
              <li>• <span className="font-mono">R²</span> = how well features explain the target (0-1, higher = better)</li>
              <li>• <span className="font-mono">Adjusted R²</span> = R² adjusted for number of features (penalizes overfitting)</li>
              <li>• <span className="font-mono">RMSE</span> = average prediction error (lower = better)</li>
            </ul>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3">
            <p className="text-yellow-300 text-xs">
              <strong>Note:</strong> Multiple Linear Regression assumes linear relationships. For non-linear patterns, consider polynomial regression or decision trees.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
