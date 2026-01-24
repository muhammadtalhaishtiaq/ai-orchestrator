"use client"

export default function BrainVisualization() {
  return (
    <div className="relative w-32 h-32">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 rounded-full blur-xl" />
      
      {/* Brain SVG */}
      <svg viewBox="0 0 100 100" className="w-full h-full relative z-10">
        <defs>
          <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <filter id="brainGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Brain outline */}
        <path
          d="M50 15 C30 15 20 30 20 45 C20 55 25 60 25 70 C25 80 30 85 40 85 C45 85 48 82 50 80 C52 82 55 85 60 85 C70 85 75 80 75 70 C75 60 80 55 80 45 C80 30 70 15 50 15"
          fill="none"
          stroke="url(#brainGradient)"
          strokeWidth="1.5"
          filter="url(#brainGlow)"
        />
        
        {/* Brain folds - left hemisphere */}
        <path
          d="M35 35 Q40 40 35 50 Q30 60 35 70"
          fill="none"
          stroke="url(#brainGradient)"
          strokeWidth="1"
          opacity="0.8"
        />
        <path
          d="M30 45 Q38 50 30 60"
          fill="none"
          stroke="url(#brainGradient)"
          strokeWidth="1"
          opacity="0.6"
        />
        
        {/* Brain folds - right hemisphere */}
        <path
          d="M65 35 Q60 40 65 50 Q70 60 65 70"
          fill="none"
          stroke="url(#brainGradient)"
          strokeWidth="1"
          opacity="0.8"
        />
        <path
          d="M70 45 Q62 50 70 60"
          fill="none"
          stroke="url(#brainGradient)"
          strokeWidth="1"
          opacity="0.6"
        />
        
        {/* Center division */}
        <path
          d="M50 20 L50 80"
          fill="none"
          stroke="url(#brainGradient)"
          strokeWidth="1"
          opacity="0.5"
        />
        
        {/* Neural connection points */}
        {[
          { cx: 35, cy: 35 },
          { cx: 65, cy: 35 },
          { cx: 30, cy: 55 },
          { cx: 70, cy: 55 },
          { cx: 40, cy: 75 },
          { cx: 60, cy: 75 },
          { cx: 50, cy: 45 },
        ].map((point, i) => (
          <circle
            key={i}
            cx={point.cx}
            cy={point.cy}
            r="2"
            fill="#22d3ee"
            filter="url(#brainGlow)"
            className="animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
        
        {/* Connecting lines (neural pathways) */}
        <path
          d="M35 35 L50 45 L65 35 M30 55 L50 45 L70 55 M40 75 L50 45 L60 75"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="0.5"
          opacity="0.4"
        />
      </svg>
    </div>
  )
}
