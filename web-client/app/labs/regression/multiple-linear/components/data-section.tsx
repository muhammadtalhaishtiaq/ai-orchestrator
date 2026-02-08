'use client';

import { Upload, Play, RefreshCw, Download, ChevronDown } from 'lucide-react';
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
  const [isFeatureDropdownOpen, setIsFeatureDropdownOpen] = useState(false);

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
    <div className="rounded-lg border border-cyan-500/20 bg-[#1a1f2e] p-3 flex flex-col">
      <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
        <Upload className="w-5 h-5 text-cyan-400" />
        📤 Your Data & Training
      </h2>

      {/* TWO COLUMNS: Left (20%) Controls, Right (80%) Data Preview - Fixed Height Container */}
      <div className="grid grid-cols-5 gap-3 h-96 flex-shrink-0 overflow-hidden auto-rows-max">
        
        {/* LEFT COLUMN (20% = col-span-1): Upload, Dataset, Features, Target */}
        <div className="col-span-1 space-y-1 flex flex-col overflow-y-auto h-96">
          
          {/* Dataset Selection */}
          <div className="flex-shrink-0">
            <p className="text-xs text-gray-400 font-semibold mb-0.5">Dataset</p>
            <select
              value={selectedDataset}
              onChange={(e) => onDatasetChange(e.target.value)}
              className="w-full bg-gray-800 border border-cyan-500/20 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-cyan-500"
            >
              {datasetOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Upload CSV */}
          {/* <div className="flex-shrink-0">
            <p className="text-xs text-gray-400 font-semibold mb-0.5">Upload</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div className="flex gap-2 flex-col">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full h-7 text-xs px-2 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10"
              >
                <Upload className="w-3 h-3 mr-1" />
                {isUploading ? 'Processing...' : 'Upload CSV'}
              </Button>

              <button
                onClick={handleDownloadCSV}
                className="w-full text-xs text-cyan-400 hover:text-cyan-300 py-1 px-2 rounded hover:bg-gray-800 border border-cyan-500/20"
              >
                <Download className="w-3 h-3 inline mr-1" />
                Sample
              </button>
            </div>
          </div> */}

          {/* Features Multi-Select Dropdown */}
          <div className="flex-shrink-0">
            <p className="text-xs text-gray-400 font-semibold mb-0.5">Features</p>
            
            <div className="relative flex flex-col">
              <button
                onClick={() => setIsFeatureDropdownOpen(!isFeatureDropdownOpen)}
                className="w-full bg-gray-800 border border-cyan-500/20 rounded px-2 py-1 text-xs text-gray-300 text-left flex items-center justify-between hover:border-cyan-500/50"
              >
                <span className="truncate">
                  {selectedFeatures.length === 0 
                    ? 'Select...' 
                    : `${selectedFeatures.length}`}
                </span>
                <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform flex-shrink-0 ${isFeatureDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isFeatureDropdownOpen && (
                <div className="absolute top-8 left-0 right-0 bg-gray-800 border border-cyan-500/20 rounded shadow-lg z-10 max-h-40 overflow-y-auto">
                  {availableColumns
                    .filter(col => col !== targetColumn)
                    .map(column => (
                      <label
                        key={column}
                        className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-700 cursor-pointer text-xs text-gray-300"
                      >
                        <Checkbox
                          checked={selectedFeatures.includes(column)}
                          onCheckedChange={() => onToggleFeature(column)}
                          className="w-3 h-3"
                        />
                        <span className="truncate">{column}</span>
                      </label>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Target Selection */}
          <div className="flex-shrink-0">
            <p className="text-xs text-gray-400 font-semibold mb-0.5">Target (Y)</p>
            <select
              value={targetColumn}
              onChange={(e) => onTargetChange(e.target.value)}
              className="w-full bg-gray-800 border border-cyan-500/20 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="">Select...</option>
              {availableColumns
                .filter(col => !selectedFeatures.includes(col))
                .map(column => (
                  <option key={column} value={column}>{column}</option>
                ))}
            </select>
          </div>

          {/* Stats */}
          <div className="pt-2 border-t border-gray-700 space-y-1">
            <p className="text-xs text-gray-500">Selected: <span className="text-cyan-300 font-semibold">{selectedFeatures.length}</span></p>
            <p className="text-xs text-gray-500">Rows: <span className="text-cyan-300 font-semibold">{csvValidation?.row_count || currentDataset?.rowCount || 0}</span></p>
          </div>
        </div>

        {/* RIGHT COLUMN (80% = col-span-4): Data Preview */}
        <div className="col-span-4 space-y-2 flex flex-col h-96 overflow-hidden">
          <p className="text-xs text-gray-400 font-semibold">Data Preview (All Rows)</p>
          
          {currentDataset || csvValidation ? (
            <div className="flex-1 bg-gray-900 rounded px-2 py-1 overflow-y-scroll overflow-x-auto border border-gray-800 min-h-0">
              <table className="text-xs whitespace-nowrap w-max">
                <thead className="sticky top-0 bg-gray-800">
                  <tr className="border-b border-gray-700">
                    {availableColumns.map((col) => (
                      <th key={col} className="px-2 py-0.5 text-left text-cyan-400 text-xs">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {((currentDataset?.data || csvValidation?.sample_data) || []).map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-700/50 hover:bg-gray-800/50">
                      {availableColumns.map((col) => (
                        <td key={col} className="px-2 py-0.5 text-gray-300 text-xs">
                          {String(row[col]).substring(0, 20)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex-1 bg-gray-900 rounded px-2 py-2 text-xs text-gray-500 text-center border border-gray-800 flex items-center justify-center min-h-0">
              No data
            </div>
          )}
        </div>
      </div>

      {/* Train Button - Full Width Below - Separate Section */}
      <div className="mt-3 flex gap-2 flex-shrink-0 relative z-20">
        {!hasResults ? (
          <Button
            onClick={onTrain}
            disabled={isTraining || selectedFeatures.length === 0 || !targetColumn}
            className="flex-1 h-7 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-xs"
          >
            {isTraining ? (
              <>
                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                Training...
              </>
            ) : (
              <>
                <Play className="w-3 h-3 mr-1" />
                Train Model
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={onReset}
            variant="outline"
            className="flex-1 h-7 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 text-xs"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
