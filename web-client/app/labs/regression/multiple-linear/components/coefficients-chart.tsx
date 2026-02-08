'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface CoefficientsChartProps {
  coefficients: number[];
  featureNames: string[];
  standardizedCoefficients?: number[];
  showStandardized?: boolean;
}

export default function CoefficientsChart({
  coefficients,
  featureNames,
  standardizedCoefficients,
  showStandardized = false,
}: CoefficientsChartProps) {
  // Prepare data for chart
  const data = featureNames.map((name, idx) => ({
    name,
    coefficient: parseFloat(coefficients[idx]?.toFixed(4) || '0'),
    standardized: standardizedCoefficients ? parseFloat(standardizedCoefficients[idx]?.toFixed(4) || '0') : 0,
  }));

  // Determine colors: blue for positive, red for negative
  const getBarColor = (value: number) => {
    return value >= 0 ? '#3b82f6' : '#ef4444'; // blue for positive, red for negative
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isStandardized = payload[0].name === 'Standardized';
      const value = isStandardized ? data.standardized : data.coefficient;
      
      return (
        <div className="bg-[#1a1f2e] border border-cyan-500/30 rounded p-3 text-sm">
          <p className="text-gray-100 font-semibold">{data.name}</p>
          <p className={`${value >= 0 ? 'text-blue-400' : 'text-red-400'} font-mono`}>
            {isStandardized ? 'Std. Coef: ' : 'Coefficient: '}{value.toFixed(4)}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            {value >= 0 ? '↑ Positive impact' : '↓ Negative impact'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2a3141" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
          />
          <YAxis
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            axisLine={{ stroke: '#4b5563' }}
          />
          <Tooltip content={<CustomTooltip />} />
          {showStandardized && standardizedCoefficients && (
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="square"
            />
          )}
          
          {/* Main coefficients bar */}
          <Bar
            dataKey="coefficient"
            name="Coefficient"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getBarColor(entry.coefficient)}
              />
            ))}
          </Bar>

          {/* Standardized coefficients bar (if showing) */}
          {showStandardized && standardizedCoefficients && (
            <Bar
              dataKey="standardized"
              name="Standardized"
              fill="#8b5cf6"
              radius={[4, 4, 0, 0]}
              opacity={0.7}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`std-cell-${index}`}
                  fill={getBarColor(entry.standardized)}
                  opacity={0.7}
                />
              ))}
            </Bar>
          )}
        </BarChart>
      </ResponsiveContainer>

      {/* Legend explanation */}
      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded text-sm">
        <p className="text-gray-300">
          <span className="inline-block w-4 h-4 bg-blue-500 rounded mr-2"></span>
          <strong>Blue bars:</strong> Positive impact on target (increases prediction)
        </p>
      </div>
      
      <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded text-sm">
        <p className="text-gray-300">
          <span className="inline-block w-4 h-4 bg-red-500 rounded mr-2"></span>
          <strong>Red bars:</strong> Negative impact on target (decreases prediction)
        </p>
      </div>

      {showStandardized && standardizedCoefficients && (
        <div className="mt-2 p-3 bg-purple-500/10 border border-purple-500/20 rounded text-sm">
          <p className="text-gray-300">
            <strong>💡 Standardized coefficients</strong> show relative importance when all features are on the same scale
          </p>
        </div>
      )}
    </div>
  );
}
