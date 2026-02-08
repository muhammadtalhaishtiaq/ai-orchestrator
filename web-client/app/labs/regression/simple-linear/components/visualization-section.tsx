'use client';

import { useState } from 'react';
import RegressionChart from './regression-chart';
import ResidualChart from './residual-chart';
import PredictionChart from './prediction-chart';
import { TrainingResult } from '@/app/labs/regression/simple-linear/hooks/use-linear-regression';

interface VisualizationSectionProps {
  trainingResult: TrainingResult | null;
  featureColumn: string;
  targetColumn: string;
}

type ChartType = 'regression' | 'residuals' | 'prediction';

export default function VisualizationSection({ 
  trainingResult,
  featureColumn,
  targetColumn,
}: VisualizationSectionProps) {
  const [chartType, setChartType] = useState<ChartType>('regression');

  const chartOptions: { value: ChartType; label: string; description: string }[] = [
    { value: 'regression', label: '📈 Regression Fit', description: 'Data points & fitted line' },
    { value: 'residuals', label: '📊 Residuals', description: 'Prediction errors' },
    { value: 'prediction', label: '🎯 Actual vs Predicted', description: 'How close predictions are' },
  ];

  return (
    <div className="rounded-lg border border-cyan-500/20 bg-[#1a1f2e] p-3">
      <h2 className="text-lg font-semibold mb-2">📊 Visualization</h2>
      
      {/* Chart Selector - Compact */}
      {trainingResult && (
        <div className="mb-2 flex flex-wrap gap-1">
          {chartOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setChartType(option.value)}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                chartType === option.value
                  ? 'bg-cyan-600 text-white border border-cyan-400'
                  : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-cyan-500/50'
              }`}
              title={option.description}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      <div className="bg-gray-900 rounded border border-cyan-500/10 h-64">
        {trainingResult ? (
          trainingResult.is_multi_feature ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <p className="text-amber-300 mb-2">⚠ Categorical Feature Detected</p>
                <p className="text-xs text-gray-400">
                  One-hot encoding creates multiple features, so the simple 2D charts
                  aren’t shown here. Use numeric features for visualization.
                </p>
              </div>
            </div>
          ) : (
            <>
              {chartType === 'regression' && (
                <RegressionChart
                  trainingResult={trainingResult}
                  featureColumn={featureColumn}
                  targetColumn={targetColumn}
                />
              )}
              {chartType === 'residuals' && (
                <ResidualChart
                  trainingResult={trainingResult}
                  featureColumn={featureColumn}
                />
              )}
              {chartType === 'prediction' && (
                <PredictionChart trainingResult={trainingResult} />
              )}
            </>
          )
        ) : (
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500 mb-2">📊 Waiting for results...</p>
              <p className="text-xs text-gray-600">Train a model to see visualization</p>
            </div>
          </div>
        )}
      </div>

      {/* Chart Description */}
      {trainingResult && (
        <div className="mt-2 p-1.5 bg-gray-900 rounded text-xs text-gray-400">
          {chartType === 'regression' && (
            <p>Cyan dots = data | Pink line = fitted model</p>
          )}
          {chartType === 'residuals' && (
            <p>Orange dots = errors | Center line = perfect</p>
          )}
          {chartType === 'prediction' && (
            <p>Purple = predictions | Green line = perfect match</p>
          )}
        </div>
      )}
    </div>
  );
}
