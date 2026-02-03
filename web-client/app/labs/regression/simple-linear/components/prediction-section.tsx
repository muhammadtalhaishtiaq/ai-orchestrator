'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrainingResult } from '@/app/labs/regression/simple-linear/hooks/use-linear-regression';

interface PredictionSectionProps {
  trainingResult: TrainingResult;
  featureColumn: string;
  targetColumn: string;
  predictValue: string;
  predictedResult: number | null;
  onValueChange: (value: string) => void;
  onPredict: () => void;
  formatNumber: (num: number) => string;
}

export default function PredictionSection({
  trainingResult,
  featureColumn,
  targetColumn,
  predictValue,
  predictedResult,
  onValueChange,
  onPredict,
  formatNumber,
}: PredictionSectionProps) {
  const isMultiFeature = !!trainingResult.is_multi_feature;

  return (
    <div className="mt-6 lg:col-span-3 rounded-lg border border-cyan-500/20 bg-[#1a1f2e] p-6">
      <h2 className="text-xl font-semibold mb-4">🔮 Make Predictions</h2>
      <p className="text-gray-400 text-sm mb-4">Test the model with new data:</p>

      {isMultiFeature && (
        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded text-xs text-amber-300">
          This model used one-hot encoding for a categorical feature. Single-value prediction isn’t supported here.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm text-gray-300 mb-2 block">{featureColumn} Input:</Label>
          <Input
            type="number"
            value={predictValue}
            onChange={(e) => {
              onValueChange(e.target.value);
            }}
            placeholder="Enter a value"
            className="bg-gray-800 border-cyan-500/20"
            disabled={isMultiFeature}
          />
        </div>

        <div>
          <Label className="text-sm text-gray-300 mb-2 block">&nbsp;</Label>
          <Button
            onClick={onPredict}
            disabled={!predictValue || isMultiFeature}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
          >
            Calculate Prediction
          </Button>
        </div>
      </div>

      {predictedResult !== null && (
        <div className="mt-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
          <p className="text-xs text-gray-400 mb-1">Predicted {targetColumn}:</p>
          <p className="text-3xl font-bold text-green-400 mb-2">{formatNumber(predictedResult)}</p>
          <p className="text-xs text-gray-400">
            Confidence: {(trainingResult.r_squared * 100).toFixed(0)}% (based on R² score)
          </p>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-4">
        Try different values and see how predictions change!
      </p>
    </div>
  );
}
