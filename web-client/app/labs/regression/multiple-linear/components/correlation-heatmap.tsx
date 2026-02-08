'use client';

import React from 'react';

interface CorrelationHeatmapProps {
  data: number[][];
  featureNames: string[];
}

/**
 * Correlation Matrix Heatmap Component
 * 
 * Shows feature-to-feature correlations in a color-coded grid.
 * Red = positive correlation, Blue = negative correlation
 * Darker = stronger correlation
 */
export default function CorrelationHeatmap({
  data,
  featureNames,
}: CorrelationHeatmapProps) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-400">No correlation data available</p>
      </div>
    );
  }

  // Calculate correlation matrix from raw data
  const correlationMatrix = calculateCorrelationMatrix(data);

  // Get color based on correlation strength
  const getHeatmapColor = (correlation: number): string => {
    const absCorr = Math.abs(correlation);
    
    if (correlation > 0) {
      // Positive correlation: red scale
      if (absCorr > 0.9) return '#7f1d1d'; // dark red
      if (absCorr > 0.7) return '#b91c1c';
      if (absCorr > 0.5) return '#dc2626';
      if (absCorr > 0.3) return '#ef4444';
      return '#fca5a5'; // light red
    } else {
      // Negative correlation: blue scale
      if (absCorr > 0.9) return '#001f3f'; // dark blue
      if (absCorr > 0.7) return '#0066cc';
      if (absCorr > 0.5) return '#0084ff';
      if (absCorr > 0.3) return '#5db3ff';
      return '#b3d9ff'; // light blue
    }
  };

  const getCellBorder = (correlation: number): string => {
    const absCorr = Math.abs(correlation);
    if (absCorr > 0.7) return '2px solid white';
    if (absCorr > 0.5) return '1px solid rgba(255,255,255,0.5)';
    return '1px solid #3a4556';
  };

  const cellSize = Math.max(50, 350 / featureNames.length);

  return (
    <div className="w-full">
      <div className="inline-block">
        {/* Header row with feature names */}
        <div className="flex">
          <div style={{ width: cellSize, height: cellSize }} className="flex items-center justify-center flex-shrink-0"></div>
          {featureNames.map((name, idx) => (
            <div
              key={`header-${idx}`}
              style={{ width: cellSize, height: cellSize, minWidth: cellSize }}
              className="flex items-center justify-center bg-gray-800 border border-gray-700 text-xs font-semibold text-gray-300 flex-shrink-0"
            >
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-45deg)', transformOrigin: 'center', overflow: 'visible' }}>
                <span style={{ whiteSpace: 'nowrap', fontSize: '10px' }}>{name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Heatmap rows */}
        {featureNames.map((rowName, rowIdx) => (
          <div key={`row-${rowIdx}`} className="flex">
            {/* Row label */}
            <div
              style={{ width: cellSize, height: cellSize, minWidth: cellSize }}
              className="flex items-center justify-center bg-gray-800 border border-gray-700 text-xs font-semibold text-gray-300 px-1 flex-shrink-0 overflow-hidden"
            >
              <span style={{ fontSize: '10px', whiteSpace: 'normal', wordWrap: 'break-word', textAlign: 'center', lineHeight: '1.2' }}>{rowName}</span>
            </div>

            {/* Correlation cells */}
            {featureNames.map((colName, colIdx) => {
              const correlation = correlationMatrix[rowIdx][colIdx];
              const color = getHeatmapColor(correlation);
              const border = getCellBorder(correlation);

              return (
                <HeatmapCell
                  key={`cell-${rowIdx}-${colIdx}`}
                  correlation={correlation}
                  color={color}
                  border={border}
                  size={cellSize}
                  isHighCorrelation={Math.abs(correlation) > 0.7 && rowIdx !== colIdx}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-600 border border-red-400"></div>
          <span className="text-gray-400">Positive Correlation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 border border-blue-400"></div>
          <span className="text-gray-400">Negative Correlation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white border border-gray-400"></div>
          <span className="text-gray-400">No Correlation (0)</span>
        </div>
      </div>

      {/* Interpretation */}
      <div className="mt-2 p-2 bg-cyan-500/10 border border-cyan-500/30 rounded text-xs text-gray-300">
        <p className="mb-2">
          <strong>💡 High correlations ({'>'}0.7)</strong> between features indicate multicollinearity.
        </p>
        <p className="text-gray-400">
          This means features contain redundant information. Consider feature selection or dimensionality reduction.
        </p>
      </div>
    </div>
  );
}

/**
 * Individual heatmap cell component
 */
interface HeatmapCellProps {
  correlation: number;
  color: string;
  border: string;
  size: number;
  isHighCorrelation: boolean;
}

function HeatmapCell({
  correlation,
  color,
  border,
  size,
  isHighCorrelation,
}: HeatmapCellProps) {
  const [showTooltip, setShowTooltip] = React.useState(false);

  return (
    <div
      style={{
        width: size,
        height: size,
        minWidth: size,
        backgroundColor: color,
        border: border,
        cursor: 'pointer',
      }}
      className="flex items-center justify-center relative group flex-shrink-0"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="text-xs font-semibold text-white drop-shadow-lg">
        {correlation.toFixed(2)}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 border border-cyan-500/50 rounded px-3 py-2 text-xs whitespace-nowrap z-10 pointer-events-none">
          <p className="text-gray-100">Correlation: {correlation.toFixed(3)}</p>
          <p className="text-gray-400">
            {Math.abs(correlation) > 0.7
              ? '🔴 High - Potential multicollinearity'
              : Math.abs(correlation) > 0.5
              ? '🟡 Moderate'
              : '🟢 Weak'}
          </p>
        </div>
      )}

      {/* High correlation indicator */}
      {isHighCorrelation && (
        <div className="absolute top-0.5 right-0.5 w-2 h-2 bg-yellow-400 rounded-full"></div>
      )}
    </div>
  );
}

/**
 * Calculate Pearson correlation matrix from data
 * 
 * @param data - 2D array of features (n_samples x n_features)
 * @returns Correlation matrix (n_features x n_features)
 */
function calculateCorrelationMatrix(data: number[][]): number[][] {
  const nFeatures = data[0].length;
  const correlations: number[][] = Array(nFeatures)
    .fill(null)
    .map(() => Array(nFeatures).fill(0));

  // Calculate mean for each feature
  const means = Array(nFeatures)
    .fill(0)
    .map((_, i) => {
      const sum = data.reduce((acc, row) => acc + (row[i] || 0), 0);
      return sum / data.length;
    });

  // Calculate correlation between each pair of features
  for (let i = 0; i < nFeatures; i++) {
    for (let j = 0; j < nFeatures; j++) {
      if (i === j) {
        correlations[i][j] = 1.0; // Correlation with itself is 1
      } else {
        const numerator = data.reduce(
          (acc, row) => acc + (row[i] - means[i]) * (row[j] - means[j]),
          0
        );
        const stdI = Math.sqrt(
          data.reduce((acc, row) => acc + Math.pow(row[i] - means[i], 2), 0)
        );
        const stdJ = Math.sqrt(
          data.reduce((acc, row) => acc + Math.pow(row[j] - means[j], 2), 0)
        );

        if (stdI === 0 || stdJ === 0) {
          correlations[i][j] = 0;
        } else {
          correlations[i][j] = numerator / (stdI * stdJ);
        }
      }
    }
  }

  return correlations;
}
