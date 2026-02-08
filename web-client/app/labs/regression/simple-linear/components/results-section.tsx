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
      <div className="rounded-lg border border-cyan-500/20 bg-[#1a1f2e] p-3">
        <h2 className="text-lg font-semibold mb-2">📈 Results</h2>
        <div className="bg-gray-900 rounded p-2 border border-cyan-500/10 text-center">
          <p className="text-gray-500 text-sm">⏳ Waiting for training...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-cyan-500/20 bg-[#1a1f2e] p-3">
      <h2 className="text-lg font-semibold mb-2">📈 Results</h2>

      {/* Model Equation - Compact */}
      <div className="mb-2 p-2 bg-cyan-500/10 rounded border border-cyan-500/20">
        <p className="text-xs text-gray-400 mb-1">Model Equation:</p>
        <p className="font-mono text-sm text-cyan-300 break-all leading-tight">
          {trainingResult.equation}
        </p>
      </div>

      {/* R² Score - Compact */}
      <div className="mb-2 p-2 bg-blue-500/10 rounded border border-blue-500/20">
        <p className="text-xs text-gray-400">R² Score (Model Quality):</p>
        <p className="text-lg font-bold text-blue-300">{(trainingResult.r_squared * 100).toFixed(1)}%</p>
        <p className="text-xs text-gray-400 mt-1">
          {trainingResult.r_squared >= 0.9
            ? '✓ Excellent fit'
            : trainingResult.r_squared >= 0.7
              ? '✓ Good fit'
              : '⚠ Weak fit'}
        </p>
      </div>

      {/* Interpretation - Compact */}
      <div className="p-2 bg-purple-500/10 rounded border border-purple-500/20">
        <p className="text-xs text-gray-400 mb-1">Interpretation:</p>
        {trainingResult.is_multi_feature ? (
          <div className="text-xs text-gray-400 space-y-1">
            <p>• Categorical feature was one-hot encoded</p>
            {trainingResult.coefficients && trainingResult.coefficients.length > 0 && (
              <p className="font-mono text-xs">{trainingResult.coefficients.map((c) => c.toFixed(2)).join(', ')}</p>
            )}
            <p className="font-mono text-xs">Intercept: {formatNumber(trainingResult.intercept)}</p>
          </div>
        ) : (
          <ul className="text-xs text-gray-400 space-y-0.5 ml-2">
            <li>• For every 1 unit increase in {featureColumn}:</li>
            <li className="font-mono ml-1">{trainingResult.slope.toFixed(2)} increase in {targetColumn}</li>
            <li>• Base value (when {featureColumn} = 0):</li>
            <li className="font-mono ml-1">{formatNumber(trainingResult.intercept)}</li>
          </ul>
        )}
      </div>
    </div>
  );
}
