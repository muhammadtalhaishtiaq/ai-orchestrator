"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

const data = [
  { quarter: "Q1", enterprise: 20, consumer: 35, projected: 25 },
  { quarter: "Q2", enterprise: 40, consumer: 45, projected: 42 },
  { quarter: "Q3", enterprise: 55, consumer: 50, projected: 58 },
  { quarter: "Q4", enterprise: 75, consumer: 55, projected: 70 },
]

export default function RevenueChart() {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 30, right: 30, left: 0, bottom: 10 }}
        >
          <defs>
            <linearGradient id="enterpriseGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="consumerGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="projectedGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1e3a5f"
            vertical={false}
          />
          <XAxis
            dataKey="quarter"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
            label={{
              value: "Revenue (in Millions)",
              angle: -90,
              position: "insideLeft",
              fill: "#64748b",
              fontSize: 11,
              dx: -10,
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0d1a30",
              border: "1px solid rgba(34, 211, 238, 0.3)",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          
          {/* Consumer line (purple/pink) */}
          <Line
            type="monotone"
            dataKey="consumer"
            stroke="url(#consumerGradient)"
            strokeWidth={3}
            dot={{ fill: "#ec4899", strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: "#ec4899" }}
            filter="url(#glow)"
          />
          
          {/* Projected line (green) */}
          <Line
            type="monotone"
            dataKey="projected"
            stroke="url(#projectedGradient)"
            strokeWidth={3}
            dot={{ fill: "#22c55e", strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: "#22c55e" }}
            filter="url(#glow)"
          />
          
          {/* Enterprise line (cyan) */}
          <Line
            type="monotone"
            dataKey="enterprise"
            stroke="url(#enterpriseGradient)"
            strokeWidth={3}
            dot={{ fill: "#22d3ee", strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: "#22d3ee" }}
            filter="url(#glow)"
          />
        </LineChart>
      </ResponsiveContainer>
      
      {/* Growth Label */}
      <div className="absolute top-8 right-16 bg-[#0a1628]/90 border border-cyan-500/30 rounded-lg px-3 py-2 text-xs">
        <div className="text-green-400 font-semibold">+15% Growth</div>
        <div className="text-gray-400">(Enterprise)</div>
      </div>
    </div>
  )
}
