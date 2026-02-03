'use client';

import { TrainingResult } from '@/app/labs/regression/simple-linear/hooks/use-linear-regression';

interface ResultsSectionProps {
  trainingResult: TrainingResult | null;
  featureColumn: string;
  targetColumn: string;
  formatNumber: (num: number) => string;
}

export default function ResultsSection({
  trainingResult,
  featureColumn,
  targetColumn,
  formatNumber,
}: ResultsSectionProps) {
  if (!trainingResult) {
    return (
      <div className="lg:col-span-1 rounded-lg border border-cyan-500/20 bg-[#1a1f2e] p-6">
        <h2 className="text-xl font-semibold mb-4">📈 Results</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-900 rounded-lg border border-cyan-500/10 text-center">
            <p className="text-gray-500">⏳ Waiting for training...</p>
            <p className="text-xs text-gray-600 mt-2">Train a model to see results here</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-1 rounded-lg border border-cyan-500/20 bg-[#1a1f2e] p-6">
      <h2 className="text-xl font-semibold mb-4">📈 Results</h2>

      {/* Model Equation */}
      <div className="mb-4 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
        <p className="text-xs text-gray-400 mb-1">Model Equation:</p>
        <p className="font-mono text-lg text-cyan-300">
          {trainingResult.equation}
        </p>
      </div>

      {/* R² Score */}
      <div className="mb-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
        <p className="text-xs text-gray-400 mb-1">R² Score (Model Quality):</p>
        <p className="text-2xl font-bold text-blue-300">{(trainingResult.r_squared * 100).toFixed(1)}%</p>
        <p className="text-xs text-gray-400 mt-2">
          {trainingResult.r_squared >= 0.9
            ? '✓ Excellent fit - Model explains the data very well'
            : trainingResult.r_squared >= 0.7
              ? '✓ Good fit - Model explains the data reasonably well'
              : '⚠ Weak fit - Model may need improvement'}
        </p>
      </div>

      {/* Interpretation */}
      <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
        <p className="text-xs text-gray-400 mb-2">Interpretation:</p>
        {trainingResult.is_multi_feature ? (
          <div className="text-xs text-gray-400 space-y-2">
            <p>• Categorical feature was one-hot encoded (multiple coefficients).</p>
            {trainingResult.coefficients && trainingResult.coefficients.length > 0 && (
              <p className="font-mono">
                Coefficients: {trainingResult.coefficients.map((c) => c.toFixed(2)).join(', ')}
              </p>
            )}
            <p className="font-mono">Intercept: {formatNumber(trainingResult.intercept)}</p>
          </div>
        ) : (
          <ul className="text-xs text-gray-400 space-y-1 ml-3">
            <li>• For every 1 unit increase in {featureColumn}:</li>
            <li className="font-mono ml-2">{targetColumn} increases by {trainingResult.slope.toFixed(2)}</li>
            <li>• Base value (when {featureColumn} = 0):</li>
            <li className="font-mono ml-2">{formatNumber(trainingResult.intercept)}</li>
          </ul>
        )}
      </div>
    </div>
  );
}
