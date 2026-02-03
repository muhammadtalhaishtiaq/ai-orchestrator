'use client';

import React from 'react';
import { ChevronLeft, ExternalLink, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// Update this with your actual Colab notebook ID
// How to get it:
// 1. Upload Linear_Regression_Project_Nebula.ipynb to Google Colab
// 2. Click Share button → copy the link
// 3. Extract the ID from: https://colab.research.google.com/drive/YOUR_ID_HERE
const COLAB_NOTEBOOK_URL = 'https://colab.research.google.com/drive/1ixhqkkenba92hTOG-5yrdIstTdmB6uu2?usp=sharing'

export default function PlaygroundPage() {
  const [copied, setCopied] = useState(false);

  const copyColabLink = () => {
    navigator.clipboard.writeText(COLAB_NOTEBOOK_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f1419] text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="./">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm">
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Python Playground
              </h1>
              <p className="text-gray-400 text-sm mt-1">Learn Linear Regression with Google Colab</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Google Colab Section */}
          <div className="lg:col-span-2 rounded-lg border border-blue-500/20 bg-blue-500/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-white">📓</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-blue-300">Google Colab Notebook</h2>
                <p className="text-sm text-gray-400">Free, cloud-based Python environment</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-300">
                We've prepared a complete Linear Regression notebook in Google Colab. You can:
              </p>

              <ul className="space-y-2 text-gray-300 ml-4">
                <li className="flex gap-2">
                  <span className="text-green-400 font-bold">✓</span>
                  <span>Run the code with a single click</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400 font-bold">✓</span>
                  <span>Modify parameters to experiment</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400 font-bold">✓</span>
                  <span>Use free GPU for faster training</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400 font-bold">✓</span>
                  <span>See visualizations in real-time</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400 font-bold">✓</span>
                  <span>No installation required</span>
                </li>
              </ul>

              <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mt-6">
                <h3 className="font-semibold text-blue-300 mb-2">📝 What's in the Notebook:</h3>
                <ol className="text-sm text-gray-300 space-y-1 ml-4 list-decimal">
                  <li>Data loading & exploration</li>
                  <li>Train/test data splitting</li>
                  <li>Model training with sklearn</li>
                  <li>Performance metrics (R², MSE, RMSE)</li>
                  <li>Visualizations & predictions</li>
                  <li>Interactive experiments</li>
                </ol>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                <a href={COLAB_NOTEBOOK_URL} target="_blank" rel="noopener noreferrer">
                  <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors w-full sm:w-auto">
                    <ExternalLink className="w-5 h-5" />
                    Open in Colab
                  </button>
                </a>
                <button
                  onClick={copyColabLink}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5 text-green-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copy Link
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="lg:col-span-1 space-y-4">
            {/* Why Colab */}
            <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4">
              <h3 className="font-semibold text-purple-300 mb-3">🚀 Why Google Colab?</h3>
              <ul className="text-xs text-gray-400 space-y-2">
                <li className="flex gap-2">
                  <span className="text-purple-400 font-bold">→</span>
                  <span>No installation needed</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400 font-bold">→</span>
                  <span>Free GPU/TPU access</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400 font-bold">→</span>
                  <span>Runs on Google servers</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400 font-bold">→</span>
                  <span>No setup or dependency issues</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400 font-bold">→</span>
                  <span>Share & collaborate easily</span>
                </li>
              </ul>
            </div>

            {/* Getting Started */}
            <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
              <h3 className="font-semibold text-green-300 mb-3">🎯 Getting Started:</h3>
              <ol className="text-xs text-gray-400 space-y-2 list-decimal ml-3">
                <li>Click "Open in Colab"</li>
                <li>Sign in with Google account</li>
                <li>Click the ▶ icon to run cells</li>
                <li>Modify code & experiment</li>
                <li>Save to your Drive</li>
              </ol>
            </div>

            {/* Performance Note */}
            <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4">
              <h3 className="font-semibold text-cyan-300 mb-2">⚡ Performance:</h3>
              <p className="text-xs text-gray-400">
                Large datasets? No problem! Colab handles heavy computation without slowing down our platform.
              </p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
          <h3 className="font-semibold text-yellow-300 mb-2">💡 Pro Tips:</h3>
          <ul className="text-sm text-gray-400 space-y-1 ml-4 list-disc">
            <li>Use Colab's <span className="font-mono bg-gray-800 px-2 py-0.5 rounded">Ctrl+F9</span> to run all cells</li>
            <li>Enable GPU: Runtime → Change runtime type → GPU</li>
            <li>Save your work to Google Drive automatically</li>
            <li>Share the notebook with friends to collaborate</li>
            <li>Use <span className="font-mono bg-gray-800 px-2 py-0.5 rounded">!pip install</span> for any Python package</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
