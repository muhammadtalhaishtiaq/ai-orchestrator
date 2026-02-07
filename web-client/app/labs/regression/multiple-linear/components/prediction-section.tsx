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
      <div className="lg:col-span-1 rounded-lg border border-cyan-500/20 bg-[#1a1f2e] p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-cyan-400" />
          🔮 Make Prediction
        </h2>
        <div className="text-center text-gray-500 py-12">
          <p className="text-sm">Train a model first to make predictions</p>
        </div>
      </div>
    );
  }

  const allInputsFilled = selectedFeatures.every(
    feature => predictionInputs[feature] && predictionInputs[feature].trim() !== ''
  );

  return (
    <div className="lg:col-span-1 rounded-lg border border-cyan-500/20 bg-[#1a1f2e] p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Calculator className="w-5 h-5 text-cyan-400" />
        🔮 Make Prediction
      </h2>

      <p className="text-xs text-gray-400 mb-4">
        Enter values for each feature to predict {targetColumn}:
      </p>

      {/* Input fields for each feature */}
      <div className="space-y-3 mb-4">
        {selectedFeatures.map((feature) => (
          <div key={feature}>
            <Label className="text-sm text-gray-300 mb-1 block">{feature}:</Label>
            <Input
              type="number"
              step="any"
              value={predictionInputs[feature] || ''}
              onChange={(e) => onInputChange(feature, e.target.value)}
              placeholder={`Enter ${feature}...`}
              className="bg-gray-800 border-cyan-500/20 text-white focus:border-cyan-500"
            />
          </div>
        ))}
      </div>

      {/* Predict Button */}
      <Button
        onClick={onPredict}
        disabled={!allInputsFilled}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 mb-4"
      >
        <TrendingUp className="w-4 h-4 mr-2" />
        Predict {targetColumn}
      </Button>

      {/* Prediction Result */}
      {predictionResult !== null && (
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/50 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-1">Predicted {targetColumn}:</p>
          <p className="text-3xl font-bold text-blue-300 mb-2">
            {predictionResult.toFixed(2)}
          </p>
          <p className="text-xs text-gray-400">
            Based on {selectedFeatures.length} feature(s)
          </p>
        </div>
      )}
    </div>
  );
}
