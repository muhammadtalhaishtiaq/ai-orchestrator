'use client';

import React from 'react';
import { AlertCircle, Loader } from 'lucide-react';

interface OutputDisplayProps {
  output: string;
  error: string | null;
  isLoading: boolean;
}

export default function OutputDisplay({ output, error, isLoading }: OutputDisplayProps) {
  return (
    <div className="h-full p-4 flex flex-col">
      {isLoading && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Loader className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-2" />
            <p className="text-gray-400">Executing code...</p>
          </div>
        </div>
      )}

      {!isLoading && error && (
        <div className="flex-1 flex flex-col">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-400 mb-1">Error</h3>
              <pre className="text-xs text-red-300 font-mono whitespace-pre-wrap break-words">{error}</pre>
            </div>
          </div>
          {output && (
            <div className="flex-1 overflow-auto">
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap break-words">{output}</pre>
              </div>
            </div>
          )}
        </div>
      )}

      {!isLoading && !error && output && (
        <div className="flex-1 overflow-auto">
          <div className="bg-gray-900 rounded-lg p-4 border border-green-500/20">
            <p className="text-xs text-green-400 font-semibold mb-2">✓ Execution Successful</p>
            <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap break-words">{output}</pre>
          </div>
        </div>
      )}

      {!isLoading && !error && !output && (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 text-sm">Click "Run Code" to execute and see output here</p>
          </div>
        </div>
      )}
    </div>
  );
}
