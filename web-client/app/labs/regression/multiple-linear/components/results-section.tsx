'use client';

import { TrendingUp } from 'lucide-react';
import type { TrainingResult } from '../hooks/use-multiple-linear-regression';

interface ResultsSectionProps {
  trainingResult: TrainingResult | null;
}

export default function ResultsSection({ trainingResult }: ResultsSectionProps) {
  if (!trainingResult) {
    return (
      <div className="lg:col-span-1 rounded-lg border border-cyan-500/20 bg-[#1a1f2e] p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          📊 Model Results
        </h2>
        <div className="text-center text-gray-500 py-12">
          <p className="text-sm">Train a model to see results</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-1 rounded-lg border border-cyan-500/20 bg-[#1a1f2e] p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-cyan-400" />
        📊 Model Results
      </h2>

      {/* Equation */}
      <div className="mb-4 bg-gray-900 rounded-lg p-4">
        <p className="text-xs text-gray-400 mb-2">Model Equation:</p>
        <p className="text-sm font-mono text-cyan-300 break-all leading-relaxed">
          {trainingResult.equation}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-900 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">R² (Training)</p>
          <p className="text-2xl font-bold text-cyan-400">
            {trainingResult.r2_train.toFixed(4)}
          </p>
        </div>

        <div className="bg-gray-900 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">R² (Test)</p>
          <p className="text-2xl font-bold text-blue-400">
            {trainingResult.r2_test.toFixed(4)}
          </p>
        </div>

        <div className="bg-gray-900 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Adjusted R²</p>
          <p className="text-2xl font-bold text-purple-400">
            {trainingResult.adjusted_r2.toFixed(4)}
          </p>
        </div>

        <div className="bg-gray-900 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">RMSE</p>
          <p className="text-2xl font-bold text-green-400">
            {trainingResult.rmse.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="bg-gray-900 rounded-lg p-3 mb-4 text-xs text-gray-400 space-y-1">
        <p>MSE: <span className="text-white">{trainingResult.mse.toFixed(2)}</span></p>
        <p>MAE: <span className="text-white">{trainingResult.mae.toFixed(2)}</span></p>
        <p>Features: <span className="text-white">{trainingResult.n_features}</span></p>
        <p>Training samples: <span className="text-white">{trainingResult.samples_trained}</span></p>
        <p>Test samples: <span className="text-white">{trainingResult.samples_tested}</span></p>
      </div>

      {/* Interpretation */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
        <p className="text-xs text-blue-300 mb-2 font-semibold">Interpretation:</p>
        <p className="text-xs text-gray-300 leading-relaxed">
          {trainingResult.r2_test >= 0.9
            ? '🎉 Excellent fit! The model explains ' + (trainingResult.r2_test * 100).toFixed(1) + '% of the variance.'
            : trainingResult.r2_test >= 0.7
            ? '✓ Good fit. The model explains ' + (trainingResult.r2_test * 100).toFixed(1) + '% of the variance.'
            : trainingResult.r2_test >= 0.5
            ? '⚠️ Moderate fit (' + (trainingResult.r2_test * 100).toFixed(1) + '%). Consider adding more features.'
            : '❌ Weak fit (' + (trainingResult.r2_test * 100).toFixed(1) + '%). Linear regression may not be suitable.'}
        </p>
        {trainingResult.adjusted_r2 < trainingResult.r2_test - 0.05 && (
          <p className="text-xs text-yellow-300 mt-2">
            ⚠️ Adjusted R² is lower - some features may not contribute much.
          </p>
        )}
      </div>
    </div>
  );
}
