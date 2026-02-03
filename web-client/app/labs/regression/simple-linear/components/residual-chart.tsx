'use client';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrainingResult } from '@/app/labs/regression/simple-linear/hooks/use-linear-regression';

interface ResidualChartProps {
  trainingResult: TrainingResult;
  featureColumn: string;
}

export default function ResidualChart({
  trainingResult,
  featureColumn,
}: ResidualChartProps) {
  // Calculate residuals
  const residualData = trainingResult.data_points.map((point, idx) => {
    const predicted = trainingResult.slope * point.x + trainingResult.intercept;
    const residual = point.y - predicted;
    return {
      x: point.x,
      residual: residual,
      predicted: predicted,
      actual: point.y,
    };
  });

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
          dataKey="residual" 
          type="number" 
          name="Residuals"
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
        <Legend wrapperStyle={{ paddingTop: '20px' }} />
        
        {/* Zero line reference */}
        <line x1="0" y1="0" x2="100%" y2="0" stroke="#6B7280" strokeDasharray="5 5" />
        
        {/* Residuals */}
        <Scatter 
          name="Residuals (Error)" 
          data={residualData} 
          fill="#F59E0B" 
          fillOpacity={0.7}
          isAnimationActive={false}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
