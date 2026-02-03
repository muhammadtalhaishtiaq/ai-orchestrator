import { DataPoint } from '@/app/labs/regression/simple-linear/constants/datasets';

export interface TrainingResult {
  slope: number;
  intercept: number;
  coefficients?: number[];
  is_multi_feature?: boolean;
  r_squared: number;
  data_points: DataPoint[];
  equation: string;
}

export async function trainLinearRegressionAPI(
  data: DataPoint[],
  featureColumn?: string,
  targetColumn?: string,
  datasetName?: string,
  datasetId?: string
): Promise<TrainingResult> {
  if (!datasetId && data.length < 2) {
    throw new Error('Need at least 2 data points');
  }

  const response = await fetch(
    'http://localhost:8000/api/algorithms/linear-regression/train',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: datasetId ? undefined : data,
        dataset_id: datasetId,
        feature_column: featureColumn,
        target_column: targetColumn,
        dataset_name: datasetName,
      }),
      credentials: 'include',
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.detail || 'Failed to train model'
    );
  }

  const result = await response.json();
  
  // Transform visualization_data to work with our components
  const transformedResult: TrainingResult = {
    slope: result.slope,
    intercept: result.intercept,
    r_squared: result.r2_test,
    data_points: result.data_points || data,
    equation: result.equation,
    coefficients: result.coefficients || [],
    is_multi_feature: result.is_multi_feature || false,
  };
  
  return transformedResult;
}

export function calculateLinearRegression(data: DataPoint[]): TrainingResult {
  const n = data.length;
  const sumX = data.reduce((sum, d) => sum + d.x, 0);
  const sumY = data.reduce((sum, d) => sum + d.y, 0);
  const sumXY = data.reduce((sum, d) => sum + d.x * d.y, 0);
  const sumX2 = data.reduce((sum, d) => sum + d.x * d.x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R²
  const yMean = sumY / n;
  const ssTotal = data.reduce((sum, d) => sum + Math.pow(d.y - yMean, 2), 0);
  const ssRes = data.reduce((sum, d) => {
    const yPred = slope * d.x + intercept;
    return sum + Math.pow(d.y - yPred, 2);
  }, 0);
  const r_squared = 1 - ssRes / ssTotal;

  const equation = `y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`;

  return {
    slope,
    intercept,
    r_squared,
    data_points: data,
    equation,
  };
}
