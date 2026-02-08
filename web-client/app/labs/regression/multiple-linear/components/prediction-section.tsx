'use client';

import { Calculator, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { TrainingResult } from '../hooks/use-multiple-linear-regression';

interface PredictionSectionProps {
  trainingResult: TrainingResult | null;
  selectedFeatures: string[];
  targetColumn: string;
  predictionInputs: { [key: string]: string };
  predictionResult: number | null;
  onInputChange: (feature: string, value: string) => void;
  onPredict: () => void;
}

export default function PredictionSection({
  trainingResult,
  selectedFeatures,
  targetColumn,
  predictionInputs,
  predictionResult,
  onInputChange,
  onPredict,
}: PredictionSectionProps) {
  if (!trainingResult) {
    return (
      <div className="rounded-lg border border-cyan-500/20 bg-[#1a1f2e] p-3">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-cyan-400" />
          🔮 Make Prediction
        </h2>
        <div className="text-center text-gray-500 py-6 text-sm">
          Train a model first
        </div>
      </div>
    );
  }

  const allInputsFilled = selectedFeatures.every(
    feature => predictionInputs[feature] && predictionInputs[feature].trim() !== ''
  );

  return (
    <div className="rounded-lg border border-cyan-500/20 bg-[#1a1f2e] p-3">
      <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
        <Calculator className="w-5 h-5 text-cyan-400" />
        🔮 Predict {targetColumn}
      </h2>

      {/* Compact Horizontal Layout */}
      <div className="flex flex-col md:flex-row gap-2 items-end">
        {/* Input Fields */}
        <div className="flex-1 flex gap-2 flex-wrap">
          {selectedFeatures.map((feature) => (
            <div key={feature} className="flex-1 min-w-32">
              <label className="text-xs text-gray-400 block mb-0.5">{feature}</label>
              <Input
                type="number"
                step="any"
                value={predictionInputs[feature] || ''}
                onChange={(e) => onInputChange(feature, e.target.value)}
                placeholder="Value"
                className="h-7 bg-gray-800 border-cyan-500/20 text-white text-xs focus:border-cyan-500"
              />
            </div>
          ))}
        </div>

        {/* Predict Button */}
        <Button
          onClick={onPredict}
          disabled={!allInputsFilled}
          className="h-7 px-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xs whitespace-nowrap"
        >
          <TrendingUp className="w-3 h-3 mr-1" />
          Predict
        </Button>

        {/* Prediction Result */}
        {predictionResult !== null && (
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/50 rounded px-3 py-1 whitespace-nowrap">
            <p className="text-xs text-gray-400">Result:</p>
            <p className="text-lg font-bold text-blue-300">
              {predictionResult.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
