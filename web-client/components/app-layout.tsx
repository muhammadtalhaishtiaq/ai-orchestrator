'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ChevronRight,
  ChevronDown,
  Play,
  Database,
  Beaker,
  Box,
  Settings,
  TrendingUp,
  Users,
  GitBranch,
  Brain,
  Sparkles,
  Cpu,
  FileText,
  LogOut,
} from 'lucide-react';
import { logout as apiLogout } from '@/lib/auth';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: NavItem[];
}

const navStructure: NavItem[] = [
  {
    label: 'Core Labs',
    icon: <Beaker className="w-4 h-4" />,
    children: [
      {
        label: 'Regression',
        icon: <TrendingUp className="w-4 h-4" />,
        children: [
          { label: 'Simple Linear', href: '/labs/regression/simple-linear', icon: null },
          { label: 'Multiple Linear', href: '/labs/regression/multiple-linear', icon: null },
          { label: 'Polynomial', href: '/labs/regression/polynomial', icon: null },
          { label: 'SVR', href: '/labs/regression/svr', icon: null },
          { label: 'Decision Tree', href: '/labs/regression/decision-tree', icon: null },
          { label: 'Random Forest', href: '/labs/regression/random-forest', icon: null },
        ],
      },
      {
        label: 'Classification',
        icon: <GitBranch className="w-4 h-4" />,
        children: [
          { label: 'Logistic Regression', href: '/labs/classification/logistic-regression', icon: null },
          { label: 'K-Nearest Neighbors', href: '/labs/classification/knn', icon: null },
          { label: 'SVM', href: '/labs/classification/svm', icon: null },
          { label: 'Naive Bayes', href: '/labs/classification/naive-bayes', icon: null },
          { label: 'Decision Tree', href: '/labs/classification/decision-tree', icon: null },
          { label: 'Random Forest', href: '/labs/classification/random-forest', icon: null },
        ],
      },
      {
        label: 'Clustering',
        icon: <Users className="w-4 h-4" />,
        children: [
          { label: 'K-Means', href: '/labs/clustering/k-means', icon: null },
          { label: 'Hierarchical', href: '/labs/clustering/hierarchical', icon: null },
          { label: 'DBSCAN', href: '/labs/clustering/dbscan', icon: null },
        ],
      },
    ],
  },
  {
    label: 'Deep Learning',
    icon: <Brain className="w-4 h-4" />,
    children: [
      {
        label: 'Neural Networks',
        icon: <Cpu className="w-4 h-4" />,
        children: [
          { label: 'Neuron Basics', href: '/labs/neural-networks/neuron-basics', icon: null },
          { label: 'ANN Playground', href: '/labs/neural-networks/ann-playground', icon: null },
          { label: 'CNN Workshop', href: '/labs/neural-networks/cnn-workshop', icon: null },
          { label: 'RNN / LSTM', href: '/labs/neural-networks/rnn-lstm', icon: null },
          { label: 'ResNet', href: '/labs/neural-networks/resnet', icon: null },
        ],
      },
    ],
  },
  {
    label: 'Modern AI',
    icon: <Sparkles className="w-4 h-4" />,
    children: [
      {
        label: 'Transformers',
        icon: <Sparkles className="w-4 h-4" />,
        children: [
          { label: 'Attention', href: '/labs/transformers/attention', icon: null },
          { label: 'Encoder/Decoder', href: '/labs/transformers/encoder-decoder', icon: null },
          { label: 'Tokenization', href: '/labs/transformers/tokenization', icon: null },
          { label: 'LLM Utilities', href: '/labs/transformers/llm-utilities', icon: null },
        ],
      },
      {
        label: 'Generative AI',
        icon: <Sparkles className="w-4 h-4" />,
        children: [
          { label: 'Diffusion', href: '/labs/generative/diffusion', icon: null },
          { label: 'VAE', href: '/labs/generative/vae', icon: null },
          { label: 'GAN', href: '/labs/generative/gan', icon: null },
        ],
      },
    ],
  },
  {
    label: 'Reinforcement Learning',
    icon: <Play className="w-4 h-4" />,
    children: [
      { label: 'Q-Learning', href: '/labs/reinforcement-learning/q-learning', icon: null },
      { label: 'DQN', href: '/labs/reinforcement-learning/dqn', icon: null },
      { label: 'Policy Gradient', href: '/labs/reinforcement-learning/policy-gradient', icon: null },
    ],
  },
  {
    label: 'NLP',
    icon: <FileText className="w-4 h-4" />,
    children: [
      { label: 'Text Preprocessing', href: '/labs/nlp/text-preprocessing', icon: null },
      { label: 'Embeddings', href: '/labs/nlp/embeddings', icon: null },
      { label: 'TF-IDF / BOW', href: '/labs/nlp/tfidf-bow', icon: null },
    ],
  },
  {
    label: 'System',
    icon: <Settings className="w-4 h-4" />,
    children: [
      { label: 'Datasets', href: '/datasets', icon: <Database className="w-4 h-4" /> },
      { label: 'Experiments', href: '/experiments', icon: <Beaker className="w-4 h-4" /> },
      { label: 'Models', href: '/models', icon: <Box className="w-4 h-4" /> },
      { label: 'Settings', href: '/settings', icon: <Settings className="w-4 h-4" /> },
    ],
  },
];

function shouldItemBeOpen(item: NavItem, pathname: string): boolean {
  // Check if this item's href matches the current pathname
  if (item.href === pathname) {
    return true;
  }
  
  // Check if any child recursively matches
  if (item.children) {
    return item.children.some(child => shouldItemBeOpen(child, pathname));
  }
  
  return false;
}

function SidebarItem({ item, level = 0 }: { item: NavItem; level?: number }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(() => shouldItemBeOpen(item, pathname));
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.href === pathname;

  if (item.href) {
    return (
      <Link href={item.href}>
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors cursor-pointer group ${
            level > 0 ? 'ml-4' : ''
          } ${
            isActive
              ? 'bg-cyan-500/20 text-cyan-400 border-l-2 border-cyan-400'
              : 'hover:bg-cyan-500/10'
          }`}
        >
          {item.icon}
          <span
            className={`text-sm transition-colors ${
              isActive ? 'text-cyan-400 font-medium' : 'text-gray-300 group-hover:text-cyan-400'
            }`}
          >
            {item.label}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-cyan-500/10 transition-colors cursor-pointer group ${
          level > 0 ? 'ml-4' : ''
        }`}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        {item.icon}
        <span className="text-sm text-gray-300 group-hover:text-cyan-400 transition-colors flex-1">
          {item.label}
        </span>
        {hasChildren &&
          (isOpen ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          ))}
      </div>
      {hasChildren && isOpen && (
        <div className="mt-1 space-y-1">
          {item.children?.map((child, index) => (
            <SidebarItem key={index} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await apiLogout();
    } finally {
      document.cookie = 'nebula_token=; path=/; max-age=0';
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1419] text-gray-100">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative flex">
        {/* Sidebar */}
        <aside className="w-64 h-screen sticky top-0 border-r border-cyan-500/20 bg-[#1a1f2e]/80 backdrop-blur-xl overflow-y-auto scrollbar-thin">
          <div className="p-4">
            <Link href="/dashboard">
              <div className="mb-6">
                <h1 className="text-lg font-bold text-cyan-400">Project Nebula</h1>
                <p className="text-xs text-gray-500">ML Experimentation Lab</p>
              </div>
            </Link>

            <nav className="space-y-1">
              {navStructure.map((item, index) => (
                <SidebarItem key={index} item={item} />
              ))}
            </nav>

            <div className="mt-6 pt-4 border-t border-cyan-500/20">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
