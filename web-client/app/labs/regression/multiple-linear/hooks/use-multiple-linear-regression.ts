/**
 * Hook for Multiple Linear Regression API calls
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface TrainingResult {
  coefficients: number[];
  intercept: number;
  feature_names: string[];
  equation: string;
  r2_train: number;
  r2_test: number;
  adjusted_r2: number;
  mse: number;
  rmse: number;
  mae: number;
  samples_trained: number;
  samples_tested: number;
  n_features: number;
  condition_number: number;
  has_multicollinearity: boolean;
  standardized_coefficients: number[];
  y_test: number[];
  y_pred: number[];
  residuals: number[];
}

export interface CSVValidationResult {
  dataset_id: string;
  columns: string[];
  numeric_columns: string[];
  categorical_columns: string[];
  row_count: number;
  sample_data: Array<Record<string, any>>;
}

/**
 * Validate and upload CSV file
 */
export async function validateCSV(file: File): Promise<CSVValidationResult> {
  const text = await file.text();
  
  const response = await fetch(`${API_BASE_URL}/api/algorithms/multiple-linear-regression/validate-csv`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      csv_content: text,
      filename: file.name,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to validate CSV');
  }

  return response.json();
}

/**
 * Train Multiple Linear Regression model
 */
export async function trainMLR(
  datasetId: string,
  featureColumns: string[],
  targetColumn: string
): Promise<TrainingResult> {
  const response = await fetch(`${API_BASE_URL}/api/algorithms/multiple-linear-regression/train`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dataset_id: datasetId,
      feature_columns: featureColumns,
      target_column: targetColumn,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to train model');
  }

  return response.json();
}

/**
 * Make prediction with trained model
 */
export async function predictMLR(
  features: number[],
  coefficients: number[],
  intercept: number
): Promise<number> {
  const response = await fetch(`${API_BASE_URL}/api/algorithms/multiple-linear-regression/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      features,
      coefficients,
      intercept,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to make prediction');
  }

  const result = await response.json();
  return result.y_pred;
}
