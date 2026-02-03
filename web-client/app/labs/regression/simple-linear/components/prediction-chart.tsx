'use client';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrainingResult } from '@/app/labs/regression/simple-linear/hooks/use-linear-regression';

interface PredictionChartProps {
  trainingResult: TrainingResult;
}

export default function PredictionChart({
  trainingResult,
}: PredictionChartProps) {
  // Calculate predictions
  const predictionData = trainingResult.data_points.map((point, idx) => {
    const predicted = trainingResult.slope * point.x + trainingResult.intercept;
    return {
      index: idx,
      actual: point.y,
      predicted: predicted,
    };
  });

  // Generate perfect line (y=x reference)
  const minVal = Math.min(...trainingResult.data_points.map(p => p.y));
  const maxVal = Math.max(...trainingResult.data_points.map(p => p.y));
  const perfectLineData = [
    { actual: minVal, predicted: minVal },
    { actual: maxVal, predicted: maxVal },
  ];

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="actual" 
          type="number" 
          name="Actual Values"
          stroke="#9CA3AF"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          dataKey="predicted" 
          type="number" 
          name="Predicted Values"
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
        
        {/* Perfect predictions line */}
        <Scatter 
          name="Perfect (y=x)" 
          data={perfectLineData} 
          stroke="#10B981" 
          fill="none"
          strokeWidth={2}
          isAnimationActive={false}
        />
        
        {/* Actual predictions */}
        <Scatter 
          name="Model Predictions" 
          data={predictionData} 
          fill="#8B5CF6" 
          fillOpacity={0.6}
          isAnimationActive={false}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
