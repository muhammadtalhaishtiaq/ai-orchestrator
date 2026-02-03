'use client';

import { ChevronDown, ChevronUp, BookOpen, Code2 } from 'lucide-react';
import Link from 'next/link';

interface LearningGuideProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

export default function LearningGuide({ isOpen, onToggle }: LearningGuideProps) {
  return (
    <div className="mb-6 rounded-lg border border-cyan-500/20 bg-cyan-500/5 overflow-hidden">
      <div className="w-full flex items-center justify-between p-4 bg-cyan-500/5 hover:bg-cyan-500/10 transition-colors">
        <button
          onClick={() => onToggle(!isOpen)}
          className="flex items-center gap-2 flex-1"
        >
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold">📚 Learning Guide</h2>
        </button>
        <div className="flex items-center gap-3">
          <Link href="./simple-linear/playground">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 rounded text-xs text-purple-300 transition-colors">
              <Code2 className="w-4 h-4" />
              Playground
            </button>
          </Link>
          <button
            onClick={() => onToggle(!isOpen)}
            className="p-1 hover:bg-cyan-500/20 rounded transition-colors"
          >
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-cyan-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-cyan-400" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 border-t border-cyan-500/20 space-y-4 text-sm">
          <div>
            <h3 className="font-semibold text-cyan-300 mb-2">What is Linear Regression?</h3>
            <p className="text-gray-400">
              A method to find the best-fit line through your data. It helps predict continuous values based on relationships in your data.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-cyan-300 mb-2">The Math: y = mx + b</h3>
            <ul className="text-gray-400 space-y-1 ml-4">
              <li>• <span className="font-mono">m</span> = slope (how steep the line is)</li>
              <li>• <span className="font-mono">b</span> = y-intercept (where line crosses y-axis)</li>
              <li>• <span className="font-mono">x</span> = input value (feature/independent variable)</li>
              <li>• <span className="font-mono">y</span> = output value (prediction/dependent variable)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-cyan-300 mb-2">Why Use It?</h3>
            <ul className="text-gray-400 space-y-1 ml-4">
              <li>✓ Understand relationships between variables</li>
              <li>✓ Make predictions for new data points</li>
              <li>✓ Simple, interpretable, and fast!</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-cyan-300 mb-2">How It Works (4 Steps)</h3>
            <ol className="text-gray-400 space-y-1 ml-4 list-decimal">
              <li>Load your data (CSV or sample dataset)</li>
              <li>Select feature column (X) and target column (Y)</li>
              <li>Click "Train Model" to calculate m and b</li>
              <li>Use model to make predictions on new values</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-cyan-300 mb-2">R² Score (Model Quality)</h3>
            <p className="text-gray-400 mb-2">Ranges from 0 to 1 (higher = better fit)</p>
            <ul className="text-gray-400 space-y-1 ml-4">
              <li>• <span className="font-mono">0.9+</span> = excellent fit</li>
              <li>• <span className="font-mono">0.7-0.9</span> = good fit</li>
              <li>• <span className="font-mono">&lt;0.5</span> = weak fit</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
