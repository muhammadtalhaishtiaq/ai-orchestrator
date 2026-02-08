'use client';

import { TrendingUp, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import CoefficientsChart from './coefficients-chart';
import CorrelationHeatmap from './correlation-heatmap';
import ResidualPlot from './residual-plot';
import type { TrainingResult } from '../hooks/use-multiple-linear-regression';

interface ResultsSectionProps {
  trainingResult: TrainingResult | null;
}

export default function ResultsSection({ trainingResult }: ResultsSectionProps) {
  const [showStandardized, setShowStandardized] = useState(false);
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
    <div className="rounded-lg border border-cyan-500/20 bg-[#1a1f2e] p-3">
      <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-cyan-400" />
        📊 Training Results
      </h2>

      {/* First Section: Model Equation & Key Metrics - Compact Height */}
      <div className="space-y-1 mb-3">
        <div className="bg-gray-900 rounded p-2">
          <p className="text-xs text-gray-400 font-semibold mb-0.5">Model Equation</p>
          <p className="text-xs font-mono text-cyan-300 break-all leading-tight line-clamp-2">
            {trainingResult.equation}
          </p>
        </div>

        {trainingResult.has_multicollinearity && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-1.5 flex gap-1.5">
            <AlertTriangle className="w-3 h-3 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-yellow-400">Multicollinearity</p>
              <p className="text-xs text-yellow-300">Condition #: {trainingResult.condition_number?.toFixed(2)} ({'>'} 30)</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-4 gap-1">
          <div className="bg-gray-900 rounded p-1">
            <p className="text-xs text-gray-400">R² Train</p>
            <p className="text-sm font-bold text-cyan-400">{trainingResult.r2_train.toFixed(3)}</p>
          </div>
          <div className="bg-gray-900 rounded p-1">
            <p className="text-xs text-gray-400">R² Test</p>
            <p className="text-sm font-bold text-blue-400">{trainingResult.r2_test.toFixed(3)}</p>
          </div>
          <div className="bg-gray-900 rounded p-1">
            <p className="text-xs text-gray-400">Adj R²</p>
            <p className="text-sm font-bold text-purple-400">{trainingResult.adjusted_r2.toFixed(3)}</p>
          </div>
          <div className="bg-gray-900 rounded p-1">
            <p className="text-xs text-gray-400">RMSE</p>
            <p className="text-sm font-bold text-green-400">{trainingResult.rmse.toFixed(2)}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        
        {/* COLUMN 1: Metrics & Equation */}
        {/* <div className="space-y-2">
          <div className="bg-gray-900 rounded p-2">
            <p className="text-xs text-gray-400 font-semibold mb-1">Model Equation</p>
            <p className="text-xs font-mono text-cyan-300 break-all leading-tight">
              {trainingResult.equation}
            </p>
          </div>

          {trainingResult.has_multicollinearity && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-2 flex gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-yellow-400">Multicollinearity</p>
                <p className="text-xs text-yellow-300 mt-0.5">
                  Condition #: {trainingResult.condition_number?.toFixed(2)} ({'>'} 30)
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-900 rounded p-2">
              <p className="text-xs text-gray-400">R² Train</p>
              <p className="text-lg font-bold text-cyan-400">{trainingResult.r2_train.toFixed(3)}</p>
            </div>
            <div className="bg-gray-900 rounded p-2">
              <p className="text-xs text-gray-400">R² Test</p>
              <p className="text-lg font-bold text-blue-400">{trainingResult.r2_test.toFixed(3)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-900 rounded p-2">
              <p className="text-xs text-gray-400">Adj R²</p>
              <p className="text-lg font-bold text-purple-400">{trainingResult.adjusted_r2.toFixed(3)}</p>
            </div>
            <div className="bg-gray-900 rounded p-2">
              <p className="text-xs text-gray-400">RMSE</p>
              <p className="text-lg font-bold text-green-400">{trainingResult.rmse.toFixed(2)}</p>
            </div>
          </div>
        </div> */}

        {/* COLUMN 2: Feature Coefficients Chart */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-1">
            <p className="text-xs font-semibold text-cyan-300">Feature Coefficients</p>
            {trainingResult.standardized_coefficients && (
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showStandardized}
                  onChange={(e) => setShowStandardized(e.target.checked)}
                  className="w-3 h-3"
                />
                <span className="text-xs text-gray-400">Std</span>
              </label>
            )}
          </div>
          <CoefficientsChart
            coefficients={showStandardized ? (trainingResult.standardized_coefficients || trainingResult.coefficients) : trainingResult.coefficients}
            featureNames={trainingResult.feature_names}
            standardizedCoefficients={trainingResult.standardized_coefficients}
            showStandardized={showStandardized}
          />
        </div>

        {/* COLUMN 3: Correlation Heatmap */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-cyan-300">Feature Correlations</p>
          {trainingResult.feature_names && trainingResult.feature_names.length >= 2 ? (
            <CorrelationHeatmap
              data={getFeatureData(trainingResult)}
              featureNames={trainingResult.feature_names}
            />
          ) : (
            <div className="bg-gray-900 rounded p-2 text-xs text-gray-500 text-center h-32 flex items-center justify-center">
              Need 2+ features
            </div>
          )}
        </div>
      </div>

      {/* Bottom: Additional Info */}
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div className="bg-gray-900 rounded p-2 text-xs space-y-1">
          <p className="text-gray-400"><span className="text-gray-500">MSE:</span> {trainingResult.mse.toFixed(2)}</p>
          <p className="text-gray-400"><span className="text-gray-500">MAE:</span> {trainingResult.mae.toFixed(2)}</p>
          <p className="text-gray-400"><span className="text-gray-500">Features:</span> {trainingResult.n_features}</p>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded p-2">
          <p className="text-xs text-blue-300 font-semibold mb-1">Quality</p>
          <p className="text-xs text-gray-300 leading-tight">
            {trainingResult.r2_test >= 0.9
              ? '🎉 Excellent'
              : trainingResult.r2_test >= 0.7
              ? '✓ Good'
              : trainingResult.r2_test >= 0.5
              ? '⚠️ Moderate'
              : '❌ Weak'}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Helper function to generate synthetic feature data for correlation calculation
 * In a real implementation, this would come from the backend
 */
function getFeatureData(trainingResult: TrainingResult): number[][] {
  // For now, generate placeholder data
  // In production, the backend would send raw feature data or correlation matrix
  const nFeatures = trainingResult.n_features || 2;
  const nSamples = trainingResult.samples_trained || 50;
  
  // Create a mock feature matrix based on the number of features
  // This is a fallback; ideally the backend would send actual correlations
  const data: number[][] = Array(nSamples)
    .fill(null)
    .map(() =>
      Array(nFeatures)
        .fill(null)
        .map(() => Math.random() * 100)
    );
  
  return data;
}
