'use client';

import { Upload, Play, RefreshCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useRef, useState } from 'react';
import type { CSVValidationResult } from '../hooks/use-multiple-linear-regression';
import { Dataset } from '@/app/labs/regression/multiple-linear/constants/datasets';

interface DataSectionProps {
  currentDataset: Dataset | null;
  selectedDataset: string;
  datasetOptions: { id: string; label: string }[];
  csvValidation: CSVValidationResult | null;
  selectedFeatures: string[];
  targetColumn: string;
  isTraining: boolean;
  hasResults: boolean;
  onDatasetChange: (dataset: string) => void;
  onCSVUpload: (file: File) => Promise<void>;
  onToggleFeature: (column: string) => void;
  onTargetChange: (column: string) => void;
  onTrain: () => void;
  onReset: () => void;
}

function downloadSampleCSV(dataset: Dataset, filename: string) {
  // Get all columns
  const headers = dataset.columns.join(',');
  
  // Create rows from data
  const rows = dataset.data.map(row => {
    return dataset.columns.map(col => row[col]).join(',');
  }).join('\n');
  
  const csvContent = `${headers}\n${rows}`;

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export default function DataSection({
  currentDataset,
  selectedDataset,
  datasetOptions,
  csvValidation,
  selectedFeatures,
  targetColumn,
  isTraining,
  hasResults,
  onDatasetChange,
  onCSVUpload,
  onToggleFeature,
  onTargetChange,
  onTrain,
  onReset,
}: DataSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await onCSVUpload(file);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownloadCSV = () => {
    if (!currentDataset) return;
    const filename = selectedDataset === 'house_price_multi' 
      ? 'house-prices-multi.csv' 
      : selectedDataset === 'student_performance'
      ? 'student-performance.csv'
      : 'employee-salary.csv';
    downloadSampleCSV(currentDataset, filename);
  };

  // Get available columns from CSV validation or current dataset
  const availableColumns = csvValidation?.columns || currentDataset?.columns || [];
  const numericColumns = csvValidation?.numeric_columns || [];
  const categoricalColumns = csvValidation?.categorical_columns || [];

  return (
    <div className="lg:col-span-1 rounded-lg border border-cyan-500/20 bg-[#1a1f2e] p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Upload className="w-5 h-5 text-cyan-400" />
        📤 Your Data & Training
      </h2>

      {/* Dataset Selection */}
      <div className="mb-4">
        <Label className="text-sm text-gray-300 mb-2 block">Dataset Selection:</Label>
        <select
          value={selectedDataset}
          onChange={(e) => onDatasetChange(e.target.value)}
          className="w-full bg-gray-800 border border-cyan-500/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
        >
          {datasetOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-2 mb-2">Or upload custom CSV:</p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload CSV file"
        />
        
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full border-cyan-500/20 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? 'Processing CSV...' : 'Upload Custom CSV'}
        </Button>

        <p className="text-xs text-gray-500 mt-3">
          Don't have CSV?{' '}
          <button
            onClick={handleDownloadCSV}
            className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
          >
            Try ours and test it
          </button>
        </p>
      </div>

      {/* Data Preview */}
      {currentDataset && !csvValidation && (
        <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
          <p className="text-xs text-gray-400 mb-2">Sample Dataset Preview (first 5 rows):</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-cyan-500/20">
                  {currentDataset.columns.map((col) => (
                    <th key={col} className="px-2 py-1 text-left text-cyan-400">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentDataset.data.slice(0, 5).map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-700/30">
                    {currentDataset.columns.map((col) => (
                      <td key={col} className="px-2 py-1 text-gray-300">
                        {row[col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Total: {currentDataset.rowCount || currentDataset.data.length} rows
          </p>
        </div>
      )}

      {csvValidation && (
        <div className="mb-4 p-3 bg-gray-800/50 rounded-lg text-xs text-gray-400 space-y-1">
          <p>✓ {csvValidation.row_count} rows loaded</p>
          <p>✓ {numericColumns.length} numeric, {categoricalColumns.length} categorical columns</p>
        </div>
      )}

      {/* Column Selection */}
      {availableColumns.length > 0 && (
        <>
          <div className="mb-4 space-y-3">
            <div>
              <Label className="text-sm text-gray-300 mb-2 block">Feature Columns (select multiple):</Label>
              <div className="bg-gray-900 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                {availableColumns
                  .filter(col => col !== targetColumn)
                  .map(column => (
                    <div key={column} className="flex items-center gap-2">
                      <Checkbox
                        id={`feature-${column}`}
                        checked={selectedFeatures.includes(column)}
                        onCheckedChange={() => onToggleFeature(column)}
                        className="border-cyan-500/30 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                      />
                      <label
                        htmlFor={`feature-${column}`}
                        className="text-sm text-gray-300 cursor-pointer flex-1"
                      >
                        {column}
                      </label>
                    </div>
                  ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {selectedFeatures.length} feature(s) selected
              </p>
            </div>

            <div>
              <Label className="text-sm text-gray-300 mb-2 block">Target (Y) Column:</Label>
              <select
                value={targetColumn}
                onChange={(e) => onTargetChange(e.target.value)}
                className="w-full bg-gray-800 border border-cyan-500/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
              >
                <option value="">Select target...</option>
                {availableColumns
                  .filter(col => !selectedFeatures.includes(col))
                  .map(column => (
                    <option key={column} value={column}>{column}</option>
                  ))}
              </select>
            </div>
          </div>

          {/* Train Button */}
          {!hasResults ? (
            <Button
              onClick={onTrain}
              disabled={isTraining || selectedFeatures.length === 0 || !targetColumn}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
            >
              {isTraining ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Training...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Train Model
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={onReset}
              variant="outline"
              className="w-full border-cyan-500/20 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset & Train Again
            </Button>
          )}
        </>
      )}

      {!csvValidation && !currentDataset && (
        <div className="text-center text-gray-500 py-8">
          <p className="text-sm">Select a sample dataset or upload a CSV file to get started</p>
          <p className="text-xs mt-2">Need at least 3 columns (2 features + 1 target)</p>
        </div>
      )}
    </div>
  );
}
