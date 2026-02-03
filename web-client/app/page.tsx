'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Brain,
  PlayCircle,
  Menu,
  X,
} from 'lucide-react';

export default function LandingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [setStats] = useState({
    algorithms: 0,
    visualizations: 0,
    examples: 0,
  });

  return (
    <div className="min-h-screen bg-[#0f1419] text-gray-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-cyan-500/20 p-2 rounded-lg border border-cyan-500/30"
      >
        {sidebarOpen ? <X className="w-6 h-6 text-cyan-400" /> : <Menu className="w-6 h-6 text-cyan-400" />}
      </button>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-30 bg-[#0f1419]/80 backdrop-blur-xl border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              {/* <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div> */}
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Project Nebula
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white" asChild>
                <Link href="/register">Sign Up Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700" />
          <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
            Master AI/ML Engineering
            {/* <br />
            Through Interactive Learning */}
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Implement 40+ algorithms from scratch. Visualize how they work.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-6 text-lg" asChild>
              <Link href="/dashboard">
                <PlayCircle className="w-5 h-5 mr-2" />
                Start Learning
              </Link>
            </Button>
          </div>

          {/* Floating Math Formulas */}
          {/* <div className="mt-16 text-cyan-400/30 text-sm space-y-2">
            <div className="animate-pulse">∇f(x) = lim(h→0) [f(x+h) - f(x)] / h</div>
            <div className="animate-pulse delay-500">σ(z) = 1 / (1 + e⁻ᶻ)</div>
          </div> */}
        </div>
      </section>
    </div>
  );
}
