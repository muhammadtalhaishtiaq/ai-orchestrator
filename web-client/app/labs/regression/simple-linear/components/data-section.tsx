'use client';

import { Upload, Play, RefreshCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dataset } from '@/app/labs/regression/simple-linear/constants/datasets';
import { useRef, useState } from 'react';

interface DataSectionProps {
  currentDataset: Dataset;
  selectedDataset: string;
  datasetOptions: { id: string; label: string }[];
  featureColumn: string;
  targetColumn: string;
  isTraining: boolean;
  hasResults: boolean;
  onDatasetChange: (dataset: string) => void;
  onFeatureChange: (column: string) => void;
  onTargetChange: (column: string) => void;
  onTrain: () => void;
  onReset: () => void;
  onCSVUpload?: (dataset: Dataset, featureCol: string, targetCol: string, datasetId: string) => void;
  formatNumber: (num: number) => string;
}

function downloadSampleCSV(dataset: Dataset, filename: string) {
  // Create CSV content
  const headers = dataset.columns.join(',');
  const rows = dataset.data.map(point => `${point.x},${point.y}`).join('\n');
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
  featureColumn,
  targetColumn,
  isTraining,
  hasResults,
  onDatasetChange,
  onFeatureChange,
  onTargetChange,
  onTrain,
  onReset,
  onCSVUpload,
  formatNumber,
}: DataSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDownloadCSV = () => {
    const filename = selectedDataset === 'house_price' ? 'house-prices.csv' : 'student-scores.csv';
    downloadSampleCSV(currentDataset, filename);
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show loading state
    const loadingMsg = document.createElement('div');
    loadingMsg.textContent = 'Processing CSV...';

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csvContent = event.target?.result as string;

        // Send to backend for processing
        const response = await fetch(
          'http://localhost:8000/api/algorithms/linear-regression/validate-csv',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              csv_content: csvContent,
              filename: file.name,
            }),
            credentials: 'include',
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          alert(`❌ ${errorData.detail || 'Invalid CSV'}`);
          return;
        }

        const result = await response.json();

        const columns: string[] = result.columns || [];
        const numericColumns: string[] = result.numeric_columns || [];
        const previewRows: Record<string, string>[] = result.preview_rows || [];

        if (columns.length < 2) {
          alert('CSV must have at least 2 columns');
          return;
        }

        // Choose default columns (prefer numeric)
        const defaultFeature = numericColumns[0] || columns[0];
        const defaultTarget = numericColumns[1] || columns[1];

        // Build preview data points using selected columns (first 10 rows)
        const previewData = previewRows
          .map((row) => ({
            x: parseFloat(row[defaultFeature]),
            y: parseFloat(row[defaultTarget]),
          }))
          .filter((point) => !Number.isNaN(point.x) && !Number.isNaN(point.y));

        alert(
          `✅ CSV Loaded!\n\n` +
          `Rows: ${result.row_count}\n` +
          `Columns: ${columns.join(', ')}`
        );

        if (onCSVUpload && result.dataset_id) {
          const tempDataset: Dataset = {
            name: file.name,
            columns,
            data: previewData,
            rowCount: result.row_count,
          };
          onCSVUpload(tempDataset, defaultFeature, defaultTarget, result.dataset_id);
        }
      } catch (error) {
        alert('Error uploading CSV: ' + (error instanceof Error ? error.message : 'Unknown error'));
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
          onChange={handleCSVUpload}
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

      {/* Column Configuration */}
      <div className="mb-4 space-y-3">
        <div>
          <Label className="text-sm text-gray-300 mb-2 block">Feature (X) Column:</Label>
          <select
            value={featureColumn}
            onChange={(e) => {
              const newFeature = e.target.value;
              onFeatureChange(newFeature);
              // If target is same as feature, change target to next available
              if (targetColumn === newFeature && currentDataset.columns.length > 1) {
                const nextTarget = currentDataset.columns.find(
                  col => col !== newFeature
                );
                if (nextTarget) onTargetChange(nextTarget);
              }
            }}
            className="w-full bg-gray-800 border border-cyan-500/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
          >
            {currentDataset.columns
              .filter(col => col !== targetColumn) // Exclude selected target
              .map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
          </select>
        </div>

        <div>
          <Label className="text-sm text-gray-300 mb-2 block">Target (Y) Column:</Label>
          <select
            value={targetColumn}
            onChange={(e) => {
              const newTarget = e.target.value;
              onTargetChange(newTarget);
              // If feature is same as target, change feature to next available
              if (featureColumn === newTarget && currentDataset.columns.length > 1) {
                const nextFeature = currentDataset.columns.find(
                  col => col !== newTarget
                );
                if (nextFeature) onFeatureChange(nextFeature);
              }
            }}
            className="w-full bg-gray-800 border border-cyan-500/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
          >
            {currentDataset.columns
              .filter(col => col !== featureColumn) // Exclude selected feature
              .map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Data Preview */}
      <div className="mb-4">
        <Label className="text-sm text-gray-300 mb-2 block">Data Preview (first 10 rows):</Label>
        <div className="bg-gray-900 rounded-lg overflow-x-auto text-xs">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyan-500/20">
                <th className="px-3 py-2 text-left text-cyan-400 font-mono">{featureColumn}</th>
                <th className="px-3 py-2 text-left text-cyan-400 font-mono">{targetColumn}</th>
              </tr>
            </thead>
            <tbody>
              {currentDataset.data.slice(0, 10).map((point, idx) => (
                <tr key={idx} className="border-b border-gray-700 hover:bg-gray-800">
                  <td className="px-3 py-2 font-mono text-gray-400">{point.x}</td>
                  <td className="px-3 py-2 font-mono text-gray-400">{formatNumber(point.y)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Total rows: {currentDataset.rowCount ?? currentDataset.data.length}
        </p>
      </div>

      {/* Train Button */}
      {!hasResults ? (
        <Button
          onClick={onTrain}
          disabled={isTraining}
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
    </div>
  );
}
