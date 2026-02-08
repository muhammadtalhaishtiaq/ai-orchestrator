'use client';

import React, { useState, useCallback } from 'react';
import { TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LearningGuide from './components/learning-guide';
import DataSection from './components/data-section';
import ResultsSection from './components/results-section';
import PredictionSection from './components/prediction-section';
import { SAMPLE_DATASETS, type Dataset } from './constants/datasets';
import { validateCSV, trainMLR, type TrainingResult, type CSVValidationResult } from './hooks/use-multiple-linear-regression';

export default function MultipleLinearRegressionPage() {
  const { toast } = useToast();
  const [showLearning, setShowLearning] = useState(false);
  const [datasets, setDatasets] = useState(SAMPLE_DATASETS);
  const [selectedDataset, setSelectedDataset] = useState<string>('house_price_multi');
  const [csvData, setCsvData] = useState<CSVValidationResult | null>(null);
  const [datasetId, setDatasetId] = useState<string | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['Size_sqft', 'Bedrooms', 'Age_years']);
  const [targetColumn, setTargetColumn] = useState<string>('Price');
  const [isTraining, setIsTraining] = useState(false);
  const [trainingResult, setTrainingResult] = useState<TrainingResult | null>(null);
  const [predictionInputs, setPredictionInputs] = useState<{ [key: string]: string }>({});
  const [predictionResult, setPredictionResult] = useState<number | null>(null);

  const currentDataset = datasets[selectedDataset] || SAMPLE_DATASETS.house_price_multi;
  const datasetOptions = Object.entries(datasets).map(([id, dataset]) => ({
    id,
    label: dataset.name,
  }));

  const handleCSVUpload = useCallback(async (file: File) => {
    try {
      const result = await validateCSV(file);
      setCsvData(result);
      setDatasetId(result.dataset_id);
      
      // Create dataset entry from CSV
      const csvDataset: Dataset = {
        name: file.name,
        columns: result.columns,
        data: result.sample_data,
        rowCount: result.row_count,
        suggestedFeatures: result.numeric_columns.slice(0, -1) || [],
        suggestedTarget: result.numeric_columns[result.numeric_columns.length - 1] || '',
      };
      
      setDatasets(prev => ({
        ...prev,
        custom_csv: csvDataset,
      }));
      setSelectedDataset('custom_csv');
      setSelectedFeatures([]);
      setTargetColumn('');
      setTrainingResult(null);
      setPredictionInputs({});
      setPredictionResult(null);
      
      toast({
        title: 'CSV Uploaded!',
        description: `${result.row_count} rows, ${result.columns.length} columns`,
      });
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Failed to upload CSV',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  const handleToggleFeature = useCallback((column: string) => {
    setSelectedFeatures(prev => 
      prev.includes(column) 
        ? prev.filter(c => c !== column)
        : [...prev, column]
    );
  }, []);

  const handleDatasetChange = useCallback((dataset: string) => {
    setSelectedDataset(dataset);
    if (dataset !== 'custom_csv') {
      setCsvData(null);
      setDatasetId(null);
      // Set suggested features for sample datasets
      const selectedSampleDataset = SAMPLE_DATASETS[dataset];
      if (selectedSampleDataset) {
        setSelectedFeatures(selectedSampleDataset.suggestedFeatures);
        setTargetColumn(selectedSampleDataset.suggestedTarget);
      }
    }
    setTrainingResult(null);
    setPredictionInputs({});
    setPredictionResult(null);
  }, []);

  const formatNumber = (num: number) => {
    if (num > 1000) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
      }).format(num);
    }
    return num.toFixed(2);
  };

  const handleTargetChange = useCallback((column: string) => {
    setTargetColumn(column);
  }, []);

  const handleTrain = useCallback(async () => {
    if (selectedFeatures.length === 0 || !targetColumn) {
      toast({
        title: 'Invalid Selection',
        description: 'Please select at least 1 feature and 1 target column',
        variant: 'destructive',
      });
      return;
    }

    setIsTraining(true);
    try {
      // For CSV uploads, use the dataset_id from backend
      // For sample datasets, we need to upload them first
      let effectiveDatasetId = datasetId;
      
      if (!effectiveDatasetId && currentDataset) {
        // Upload sample dataset to backend
        const csvContent = [
          currentDataset.columns.join(','),
          ...currentDataset.data.map(row => 
            currentDataset.columns.map(col => row[col]).join(',')
          )
        ].join('\n');
        
        const uploadResult = await validateCSV(
          new File([csvContent], `${selectedDataset}.csv`, { type: 'text/csv' })
        );
        effectiveDatasetId = uploadResult.dataset_id;
        setDatasetId(effectiveDatasetId);
      }

      if (!effectiveDatasetId) {
        throw new Error('No dataset available');
      }

      const result = await trainMLR(effectiveDatasetId, selectedFeatures, targetColumn);
      setTrainingResult(result);
      
      // Initialize prediction inputs
      const inputs: { [key: string]: string } = {};
      selectedFeatures.forEach(feature => {
        inputs[feature] = '';
      });
      setPredictionInputs(inputs);
      setPredictionResult(null);
      
      toast({
        title: 'Model Trained!',
        description: `R² = ${result.r2_test.toFixed(4)}, Adjusted R² = ${result.adjusted_r2.toFixed(4)}`,
      });
    } catch (error) {
      toast({
        title: 'Training Failed',
        description: error instanceof Error ? error.message : 'Failed to train model',
        variant: 'destructive',
      });
    } finally {
      setIsTraining(false);
    }
  }, [datasetId, currentDataset, selectedDataset, selectedFeatures, targetColumn, toast]);

  const handleReset = useCallback(() => {
    setTrainingResult(null);
    setPredictionInputs({});
    setPredictionResult(null);
  }, []);

  const handlePredictionInputChange = useCallback((feature: string, value: string) => {
    setPredictionInputs(prev => ({ ...prev, [feature]: value }));
    setPredictionResult(null);
  }, []);

  const handlePredict = useCallback(() => {
    if (!trainingResult) return;

    try {
      const featureValues = selectedFeatures.map(feature => {
        const value = parseFloat(predictionInputs[feature]);
        if (isNaN(value)) {
          throw new Error(`Invalid value for ${feature}`);
        }
        return value;
      });

      const prediction = trainingResult.intercept + 
        trainingResult.coefficients.reduce((sum, coef, idx) => sum + coef * featureValues[idx], 0);
      
      setPredictionResult(prediction);
    } catch (error) {
      toast({
        title: 'Prediction Failed',
        description: error instanceof Error ? error.message : 'Failed to make prediction',
        variant: 'destructive',
      });
    }
  }, [trainingResult, selectedFeatures, predictionInputs, toast]);

  return (
    <div className="min-h-screen bg-[#0f1419] text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-cyan-400" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Multiple Linear Regression
            </h1>
          </div>
          <p className="text-gray-400">Train regression models with multiple independent variables</p>
        </div>

        {/* Learning Guide */}
        <LearningGuide isOpen={showLearning} onToggle={setShowLearning} />

        {/* Main Content - Vertical Stacked Layout */}
        <div className="space-y-6">
          {/* Section 1: Data Upload & Feature Selection (Top) */}
          <DataSection
            currentDataset={currentDataset}
            selectedDataset={selectedDataset}
            datasetOptions={datasetOptions}
            csvValidation={csvData}
            selectedFeatures={selectedFeatures}
            targetColumn={targetColumn}
            isTraining={isTraining}
            hasResults={!!trainingResult}
            onDatasetChange={handleDatasetChange}
            onCSVUpload={handleCSVUpload}
            onToggleFeature={handleToggleFeature}
            onTargetChange={handleTargetChange}
            onTrain={handleTrain}
            onReset={handleReset}
          />

          {/* Section 2: Model Training Results (Middle - Full Width) */}
          <ResultsSection trainingResult={trainingResult} />

          {/* Section 3: Test/Predict on Trained Model (Bottom) */}
          <PredictionSection
            trainingResult={trainingResult}
            selectedFeatures={selectedFeatures}
            targetColumn={targetColumn}
            predictionInputs={predictionInputs}
            predictionResult={predictionResult}
            onInputChange={handlePredictionInputChange}
            onPredict={handlePredict}
          />
        </div>
      </div>
    </div>
  );
}
