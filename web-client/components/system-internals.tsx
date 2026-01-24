"use client"

import { MoreHorizontal } from "lucide-react"
import BrainVisualization from "@/components/brain-visualization"
import MemoryNetwork from "@/components/memory-network"

export default function SystemInternals() {
  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header */}
      <h2 className="text-center text-sm font-bold tracking-[0.2em] text-gray-400 uppercase">
        System Internals
      </h2>

      {/* Router Status Card */}
      <div className="flex-1 bg-gradient-to-br from-[#0d1a30]/60 to-[#0a1628]/60 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        
        <div className="relative z-10 h-full flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold tracking-[0.15em] text-gray-300 uppercase">
              Router Status
            </h3>
            <button className="text-gray-500 hover:text-gray-300 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Brain Visualization */}
          <div className="flex-1 flex items-center justify-center">
            <BrainVisualization />
          </div>

          {/* Status */}
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-400 text-xs font-bold tracking-wider">SLM: ACTIVE</span>
            </div>
            <p className="text-gray-400 text-xs">
              Routing to: <span className="text-cyan-300">Data Scientist Agent</span>
            </p>
          </div>
        </div>
      </div>

      {/* Memory Card */}
      <div className="flex-1 bg-gradient-to-br from-[#0d1a30]/60 to-[#0a1628]/60 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        
        <div className="relative z-10 h-full flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold tracking-[0.15em] text-gray-300 uppercase">
              Memory
            </h3>
            <button className="text-gray-500 hover:text-gray-300 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Memory Network Visualization */}
          <div className="flex-1 flex items-center justify-center">
            <MemoryNetwork />
          </div>

          {/* Stats */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Connected Nodes:</span>
              <span className="text-cyan-400 font-semibold">8,452</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Memory Usage:</span>
              <span className="text-cyan-400 font-semibold">34%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
