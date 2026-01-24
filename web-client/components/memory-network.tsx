"use client"

export default function MemoryNetwork() {
  // Generate random node positions in a circular pattern
  const nodes = [
    { x: 50, y: 50, r: 6, primary: true }, // Center node
    { x: 25, y: 30, r: 4 },
    { x: 75, y: 30, r: 4 },
    { x: 20, y: 55, r: 3 },
    { x: 80, y: 55, r: 3 },
    { x: 30, y: 75, r: 4 },
    { x: 70, y: 75, r: 4 },
    { x: 50, y: 20, r: 3 },
    { x: 50, y: 80, r: 3 },
    { x: 35, y: 40, r: 2.5 },
    { x: 65, y: 40, r: 2.5 },
    { x: 35, y: 60, r: 2.5 },
    { x: 65, y: 60, r: 2.5 },
    { x: 15, y: 40, r: 2 },
    { x: 85, y: 40, r: 2 },
    { x: 15, y: 70, r: 2 },
    { x: 85, y: 70, r: 2 },
  ]

  // Define connections between nodes
  const connections = [
    [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8],
    [1, 7], [2, 7], [1, 9], [2, 10], [3, 11], [4, 12],
    [5, 8], [6, 8], [1, 3], [2, 4], [3, 5], [4, 6],
    [9, 10], [11, 12], [1, 13], [2, 14], [5, 15], [6, 16],
    [9, 11], [10, 12], [13, 3], [14, 4], [15, 5], [16, 6],
  ]

  return (
    <div className="relative w-36 h-36">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-xl" />
      
      <svg viewBox="0 0 100 100" className="w-full h-full relative z-10">
        <defs>
          <linearGradient id="networkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <filter id="networkGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="nodeGradient" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#22d3ee" />
          </radialGradient>
        </defs>

        {/* Connection lines */}
        {connections.map(([from, to], i) => (
          <line
            key={`line-${i}`}
            x1={nodes[from].x}
            y1={nodes[from].y}
            x2={nodes[to].x}
            y2={nodes[to].y}
            stroke="url(#networkGradient)"
            strokeWidth="0.5"
            opacity="0.4"
          />
        ))}

        {/* Animated data flow on some connections */}
        {[
          [0, 1], [0, 2], [0, 5], [0, 6], [1, 7], [2, 7]
        ].map(([from, to], i) => (
          <circle
            key={`flow-${i}`}
            r="1"
            fill="#22d3ee"
            filter="url(#networkGlow)"
          >
            <animateMotion
              dur={`${2 + i * 0.3}s`}
              repeatCount="indefinite"
              path={`M${nodes[from].x},${nodes[from].y} L${nodes[to].x},${nodes[to].y}`}
            />
          </circle>
        ))}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <g key={`node-${i}`}>
            {/* Outer glow ring for primary node */}
            {node.primary && (
              <circle
                cx={node.x}
                cy={node.y}
                r={node.r + 4}
                fill="none"
                stroke="url(#networkGradient)"
                strokeWidth="0.5"
                opacity="0.3"
                className="animate-ping"
                style={{ animationDuration: "2s" }}
              />
            )}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r}
              fill={node.primary ? "url(#nodeGradient)" : "#22d3ee"}
              filter="url(#networkGlow)"
              opacity={node.primary ? 1 : 0.8}
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.1}s`, animationDuration: "2s" }}
            />
          </g>
        ))}
      </svg>
    </div>
  )
}
