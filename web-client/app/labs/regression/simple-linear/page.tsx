'use client';

import React, { useState, useCallback } from 'react';
import { TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LearningGuide from './components/learning-guide';
import DataSection from './components/data-section';
import VisualizationSection from './components/visualization-section';
import ResultsSection from './components/results-section';
import PredictionSection from './components/prediction-section';
import { SAMPLE_DATASETS, type Dataset } from './constants/datasets';
import { calculateLinearRegression, trainLinearRegressionAPI, type TrainingResult } from './hooks/use-linear-regression';

export default function SimpleLinearRegressionPage() {
  const { toast } = useToast();
  const [datasets, setDatasets] = useState(SAMPLE_DATASETS);
  const [selectedDataset, setSelectedDataset] = useState<string>('house_price');
  const [datasetId, setDatasetId] = useState<string | null>(null);
  const [featureColumn, setFeatureColumn] = useState('Square Feet');
  const [targetColumn, setTargetColumn] = useState('Price');
  const [isTraining, setIsTraining] = useState(false);
  const [trainingResult, setTrainingResult] = useState<TrainingResult | null>(null);
  const [predictValue, setPredictValue] = useState('');
  const [predictedResult, setPredictedResult] = useState<number | null>(null);
  const [showLearning, setShowLearning] = useState(false); // Closed by default

  const currentDataset = datasets[selectedDataset] || SAMPLE_DATASETS.house_price;
  const datasetOptions = Object.entries(datasets).map(([id, dataset]) => ({
    id,
    label: dataset.name,
  }));

  const handleTrain = useCallback(async () => {
    setIsTraining(true);
    try {
      const result = await trainLinearRegressionAPI(
        currentDataset.data,
        featureColumn,
        targetColumn,
        currentDataset.name,
        datasetId || undefined
      );
      setTrainingResult(result);
      toast({
        title: 'Model Trained!',
        description: `Equation: ${result.equation}`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to train model';
      toast({
        title: 'Training Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsTraining(false);
    }
  }, [currentDataset, featureColumn, targetColumn, datasetId, toast]);

  const handlePredict = useCallback(() => {
    if (!trainingResult || !predictValue) return;
    const x = parseFloat(predictValue);
    const y = trainingResult.slope * x + trainingResult.intercept;
    setPredictedResult(y);
  }, [trainingResult, predictValue]);

  const handleReset = () => {
    setTrainingResult(null);
    setPredictValue('');
    setPredictedResult(null);
  };

  const handleDatasetChange = (dataset: string) => {
    setSelectedDataset(dataset);
    if (dataset !== 'custom_csv') {
      setDatasetId(null);
    }
    handleReset();
  };

  const handleCSVUpload = (dataset: Dataset, featureCol: string, targetCol: string, newDatasetId: string) => {
    setDatasets((prev) => ({
      ...prev,
      custom_csv: dataset,
    }));
    setSelectedDataset('custom_csv');
    setFeatureColumn(featureCol);
    setTargetColumn(targetCol);
    setDatasetId(newDatasetId);
    handleReset();
  };

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

  return (
    <div className="min-h-screen bg-[#0f1419] text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-cyan-400" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Simple Linear Regression
            </h1>
          </div>
          <p className="text-gray-400">Learn regression, train models, and make predictions all in one place</p>
        </div>

        {/* Learning Guide - Closed by default */}
        <LearningGuide isOpen={showLearning} onToggle={setShowLearning} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Data Input Section */}
          <DataSection
            currentDataset={currentDataset}
            selectedDataset={selectedDataset}
            datasetOptions={datasetOptions}
            featureColumn={featureColumn}
            targetColumn={targetColumn}
            isTraining={isTraining}
            hasResults={!!trainingResult}
            onDatasetChange={handleDatasetChange}
            onFeatureChange={setFeatureColumn}
            onTargetChange={setTargetColumn}
            onTrain={handleTrain}
            onReset={handleReset}
            onCSVUpload={handleCSVUpload}
            formatNumber={formatNumber}
          />

          {/* Visualization Section - Always visible */}
          <VisualizationSection 
            trainingResult={trainingResult}
            featureColumn={featureColumn}
            targetColumn={targetColumn}
          />

          {/* Results Section - Always visible */}
          <ResultsSection
            trainingResult={trainingResult}
            featureColumn={featureColumn}
            targetColumn={targetColumn}
            formatNumber={formatNumber}
          />
        </div>

        {/* Prediction Section - Only shows after training */}
        {trainingResult && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 w-full">
            <PredictionSection
            trainingResult={trainingResult}
            featureColumn={featureColumn}
            targetColumn={targetColumn}
            predictValue={predictValue}
            predictedResult={predictedResult}
            onValueChange={(value) => {
              setPredictValue(value);
              setPredictedResult(null);
            }}
            onPredict={handlePredict}
            formatNumber={formatNumber}
          />
          </div>
        )}
      </div>
    </div>
  );
}
