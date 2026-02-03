'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Beaker,
  Box,
  TrendingUp,
  Users,
  Zap,
  Clock,
  CheckCircle2,
  Circle,
  XCircle,
  Plus,
  Upload,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Experiment Hub</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-gray-300 hover:text-cyan-400 bg-transparent">
              <Zap className="w-4 h-4 mr-2" />
              Open Playground
            </Button>
            <Button
              variant="outline"
              className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Dataset
            </Button>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              New Experiment
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-6 bg-gradient-to-br from-[#1f2937] to-[#1a1f2e] border-cyan-500/20 hover:border-cyan-500/40 transition-all hover:shadow-lg hover:shadow-cyan-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Experiments Run</p>
                <p className="text-3xl font-bold text-cyan-400">247</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
                <Beaker className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-6 bg-gradient-to-br from-[#1f2937] to-[#1a1f2e] border-purple-500/20 hover:border-purple-500/40 transition-all hover:shadow-lg hover:shadow-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Models Trained</p>
                <p className="text-3xl font-bold text-purple-400">89</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Box className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick Start Experiments */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-200 mb-4">Quick Start Experiments</h2>
        <div className="grid grid-cols-3 gap-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="p-5 bg-gradient-to-br from-[#1f2937] to-[#1a1f2e] border-cyan-500/20 hover:border-cyan-500/40 transition-all hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-200 mb-1">Linear Regression Baseline</h3>
                  <p className="text-xs text-gray-400">Build and train a simple linear model</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  5-10 mins
                </span>
                <ChevronRight className="w-4 h-4 text-cyan-400" />
              </div>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="p-5 bg-gradient-to-br from-[#1f2937] to-[#1a1f2e] border-blue-500/20 hover:border-blue-500/40 transition-all hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-200 mb-1">K-Means Segmentation</h3>
                  <p className="text-xs text-gray-400">Cluster data into meaningful groups</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  10-15 mins
                </span>
                <ChevronRight className="w-4 h-4 text-blue-400" />
              </div>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="p-5 bg-gradient-to-br from-[#1f2937] to-[#1a1f2e] border-purple-500/20 hover:border-purple-500/40 transition-all hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-200 mb-1">Transformer Encoder Demo</h3>
                  <p className="text-xs text-gray-400">Explore attention mechanisms</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  30-45 mins
                </span>
                <ChevronRight className="w-4 h-4 text-purple-400" />
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-6">
        {/* Active Experiment */}
        <section>
          <h2 className="text-xl font-semibold text-gray-200 mb-4">Active Experiment</h2>
          <Card className="p-6 bg-gradient-to-br from-[#1f2937] to-[#1a1f2e] border-green-500/20">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-1">CNN Image Classifier</h3>
                <p className="text-sm text-gray-400">Training on CIFAR-10 dataset</p>
              </div>
              <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium flex items-center gap-1">
                <Circle className="w-2 h-2 fill-current animate-pulse" />
                Running
              </span>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-400">Progress</span>
                <span className="text-cyan-400 font-medium">73%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: '73%' }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Epoch 22/30 • Est. 12 min remaining</p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
              >
                View Run
              </Button>
              <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent">
                Stop
              </Button>
            </div>
          </Card>
        </section>

        {/* Recent Runs */}
        <section>
          <h2 className="text-xl font-semibold text-gray-200 mb-4">Recent Runs</h2>
          <Card className="p-6 bg-gradient-to-br from-[#1f2937] to-[#1a1f2e] border-cyan-500/20">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/40 hover:bg-gray-800/60 transition-colors cursor-pointer">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">Random Forest - Titanic</p>
                  <p className="text-xs text-gray-400">Accuracy: 84.2% • 2h ago</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/40 hover:bg-gray-800/60 transition-colors cursor-pointer">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">LSTM Sentiment Analysis</p>
                  <p className="text-xs text-gray-400">F1: 0.89 • 5h ago</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/40 hover:bg-gray-800/60 transition-colors cursor-pointer">
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">GAN Training</p>
                  <p className="text-xs text-gray-400">Failed • 1d ago</p>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>

      {/* System Status */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold text-gray-200 mb-4">System Status</h2>
        <Card className="p-6 bg-gradient-to-br from-[#1f2937] to-[#1a1f2e] border-green-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <Circle className="w-3 h-3 fill-current text-green-400 animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-200">All Systems Operational</p>
                <p className="text-xs text-gray-400">GPU Cluster: 8/12 nodes active</p>
              </div>
            </div>
            <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300 bg-transparent">
              View Details
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
