'use client';

import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';

interface ResidualPlotProps {
  actualValues: number[];
  predictedValues: number[];
}

/**
 * Residual Plot Component
 * 
 * Shows the difference between actual and predicted values.
 * Used to check model assumptions and identify patterns in errors.
 */
export default function ResidualPlot({
  actualValues,
  predictedValues,
}: ResidualPlotProps) {
  if (!actualValues || !predictedValues || actualValues.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <p className="text-gray-400">No residual data available</p>
      </div>
    );
  }

  // Calculate residuals
  const data = actualValues.map((actual, idx) => {
    const predicted = predictedValues[idx] || 0;
    const residual = actual - predicted;
    return {
      predicted,
      residual,
      actual,
      absoluteError: Math.abs(residual),
    };
  });

  // Calculate statistics
  const residuals = data.map(d => d.residual);
  const meanResidual = residuals.reduce((a, b) => a + b, 0) / residuals.length;
  const stdResidual = Math.sqrt(
    residuals.reduce((sq, n) => sq + Math.pow(n - meanResidual, 2), 0) / residuals.length
  );

  // Color points based on residual magnitude
  const getPointColor = (residual: number) => {
    const absResidual = Math.abs(residual);
    if (absResidual > 2 * stdResidual) return '#ef4444'; // Red for outliers
    if (absResidual > stdResidual) return '#f97316'; // Orange for moderate
    return '#22c55e'; // Green for good
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#1a1f2e] border border-cyan-500/30 rounded p-3 text-sm">
          <p className="text-gray-100 font-semibold">Prediction Details</p>
          <p className="text-gray-400">Actual: {data.actual.toFixed(2)}</p>
          <p className="text-gray-400">Predicted: {data.predicted.toFixed(2)}</p>
          <p className={`font-mono ${
            Math.abs(data.residual) > stdResidual ? 'text-red-400' : 'text-green-400'
          }`}>
            Residual: {data.residual.toFixed(4)}
          </p>
          <p className="text-gray-500 text-xs mt-1">
            {Math.abs(data.residual) > 2 * stdResidual 
              ? '🔴 Outlier' 
              : Math.abs(data.residual) > stdResidual 
                ? '🟡 Moderate error'
                : '🟢 Good prediction'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      {/* Residuals vs Predicted Plot */}
      <div className="mb-4">
        <ResponsiveContainer width="100%" height={250}>
          <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3141" />
            <XAxis
              type="number"
              dataKey="predicted"
              name="Predicted"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              axisLine={{ stroke: '#4b5563' }}
              label={{ value: 'Predicted Values', position: 'bottom', fill: '#9ca3af', fontSize: 12 }}
            />
            <YAxis
              type="number"
              dataKey="residual"
              name="Residual"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              axisLine={{ stroke: '#4b5563' }}
              label={{ value: 'Residuals', angle: -90, position: 'left', fill: '#9ca3af', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" />
            <Scatter data={data} fill="#3b82f6">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getPointColor(entry.residual)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-900 rounded p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Mean Residual</p>
          <p className={`text-lg font-bold ${Math.abs(meanResidual) < 0.1 ? 'text-green-400' : 'text-yellow-400'}`}>
            {meanResidual.toFixed(4)}
          </p>
          <p className="text-xs text-gray-500">Should be ≈ 0</p>
        </div>

        <div className="bg-gray-900 rounded p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Std Deviation</p>
          <p className="text-lg font-bold text-blue-400">
            {stdResidual.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">Spread of errors</p>
        </div>

        <div className="bg-gray-900 rounded p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Outliers</p>
          <p className="text-lg font-bold text-red-400">
            {data.filter(d => Math.abs(d.residual) > 2 * stdResidual).length}
          </p>
          <p className="text-xs text-gray-500">|residual| {'>'} 2σ</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span className="text-gray-400">Good (within 1σ)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-orange-500"></div>
          <span className="text-gray-400">Moderate (1-2σ)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span className="text-gray-400">Outlier ({'>'}2σ)</span>
        </div>
      </div>

      {/* Interpretation */}
      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded p-3 text-xs">
        <p className="text-cyan-300 font-semibold mb-2">📊 Residual Analysis:</p>
        <ul className="text-gray-300 space-y-1 ml-4">
          <li>• <strong>Random scatter</strong> around zero = good model fit</li>
          <li>• <strong>Patterns</strong> (curves, cones) = model missing something</li>
          <li>• <strong>Outliers</strong> = check those data points</li>
          <li>• <strong>Mean ≈ 0</strong> = unbiased predictions</li>
        </ul>
      </div>
    </div>
  );
}
