'use client';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrainingResult } from '@/app/labs/regression/simple-linear/hooks/use-linear-regression';

interface RegressionChartProps {
  trainingResult: TrainingResult;
  featureColumn: string;
  targetColumn: string;
}

export default function RegressionChart({
  trainingResult,
  featureColumn,
  targetColumn,
}: RegressionChartProps) {
  // Generate regression line data
  const minX = Math.min(...trainingResult.data_points.map(p => p.x));
  const maxX = Math.max(...trainingResult.data_points.map(p => p.x));
  
  const regressionLineData = [
    {
      x: minX,
      y: trainingResult.slope * minX + trainingResult.intercept,
    },
    {
      x: maxX,
      y: trainingResult.slope * maxX + trainingResult.intercept,
    },
  ];

  // Prepare scatter data
  const scatterData = trainingResult.data_points.map(point => ({
    x: point.x,
    y: point.y,
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="x" 
          type="number" 
          name={featureColumn}
          stroke="#9CA3AF"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          dataKey="y" 
          type="number" 
          name={targetColumn}
          stroke="#9CA3AF"
          style={{ fontSize: '12px' }}
        />
        <Tooltip 
          cursor={{ strokeDasharray: '3 3' }}
          contentStyle={{
            backgroundColor: '#1F2937',
            border: '1px solid #4B5563',
            borderRadius: '6px',
            padding: '8px',
          }}
          labelStyle={{ color: '#E5E7EB' }}
          formatter={(value: any) => value.toFixed(2)}
        />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          formatter={(value) => {
            if (value === 'Data Points') return `📊 ${value}`;
            if (value === 'Regression Line') return `📈 ${value}`;
            return value;
          }}
        />
        
        {/* Data points */}
        <Scatter 
          name="Data Points" 
          data={scatterData} 
          fill="#06B6D4" 
          fillOpacity={0.6}
          isAnimationActive={false}
        />
        
        {/* Regression line */}
        <Scatter 
          name="Regression Line" 
          data={regressionLineData} 
          stroke="#EC4899" 
          fill="none"
          strokeWidth={2}
          isAnimationActive={false}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
