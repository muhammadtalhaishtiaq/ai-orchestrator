'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    <div className="mt-3 rounded-lg border border-cyan-500/20 bg-[#1a1f2e] p-3">
      <h2 className="text-lg font-semibold mb-2">🔮 Predict</h2>

      {isMultiFeature && (
        <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded text-xs text-amber-300 mb-2">
          ⚠ Categorical feature - single predictions unsupported
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">{featureColumn}</label>
          <Input
            type="number"
            value={predictValue}
            onChange={(e) => onValueChange(e.target.value)}
            placeholder="Value"
            className="h-7 text-xs bg-gray-800 border-cyan-500/20"
            disabled={isMultiFeature}
          />
        </div>

        <div className="flex gap-2 items-end">
          <Button
            onClick={onPredict}
            disabled={!predictValue || isMultiFeature}
            className="h-7 text-xs px-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
          >
            Predict
          </Button>
          {predictedResult !== null && (
            <div className="text-right">
              <p className="text-xs text-gray-400">{targetColumn}</p>
              <p className="text-sm font-bold text-green-400">{formatNumber(predictedResult)}</p>
            </div>
          )}
        </div>
      </div>

      {predictedResult !== null && (
        <p className="text-xs text-gray-500 mt-1">
          Confidence: {(trainingResult.r_squared * 100).toFixed(0)}%
        </p>
      )}
    </div>
  );
}
