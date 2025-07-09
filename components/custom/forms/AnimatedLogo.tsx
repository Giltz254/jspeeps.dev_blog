import React from "react";

const AnimatedLogo = ({ className = "w-24 h-24" }: { className?: string }) => {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full drop-shadow-lg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#3B82F6", stopOpacity: 1 }}>
              <animate
                attributeName="stop-color"
                values="#3B82F6;#8B5CF6;#06B6D4;#3B82F6"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
            <stop
              offset="100%"
              style={{ stopColor: "#8B5CF6", stopOpacity: 1 }}
            >
              <animate
                attributeName="stop-color"
                values="#8B5CF6;#06B6D4;#3B82F6;#8B5CF6"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>

          <linearGradient
            id="accentGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              style={{ stopColor: "#F59E0B", stopOpacity: 0.8 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#EF4444", stopOpacity: 0.8 }}
            />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx="60"
          cy="60"
          r="55"
          fill="none"
          stroke="url(#logoGradient)"
          strokeWidth="2"
          opacity="0.3"
        >
          <animate
            attributeName="r"
            values="55;58;55"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.3;0.6;0.3"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
        <g transform="translate(60, 60)">
          <path
            d="M -25 -20 L -10 -20 Q -5 -20 -5 -15 L -5 5 Q -5 15 -15 15 Q -25 15 -25 5"
            fill="url(#logoGradient)"
            stroke="url(#logoGradient)"
            strokeWidth="1"
            filter="url(#glow)"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0;2;-2;0"
              dur="6s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M 5 -15 Q 15 -20 25 -15 Q 25 -10 15 -8 L 10 -5 Q 5 -2 10 2 L 15 5 Q 25 7 25 12 Q 15 17 5 12"
            fill="url(#logoGradient)"
            stroke="url(#logoGradient)"
            strokeWidth="1"
            filter="url(#glow)"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0;-2;2;0"
              dur="6s"
              repeatCount="indefinite"
            />
          </path>
          <circle cx="-2" cy="-5" r="2" fill="url(#accentGradient)">
            <animate
              attributeName="r"
              values="2;3;2"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.7;1;0.7"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="2" cy="5" r="1.5" fill="url(#accentGradient)">
            <animate
              attributeName="r"
              values="1.5;2.5;1.5"
              dur="2.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.7;1;0.7"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx="-30"
            cy="-10"
            r="1"
            fill="url(#accentGradient)"
            opacity="0.6"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0;5,-5;0,0"
              dur="4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;1;0.6"
              dur="4s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx="30"
            cy="10"
            r="1.5"
            fill="url(#accentGradient)"
            opacity="0.4"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0;-3,3;0,0"
              dur="5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.4;0.8;0.4"
              dur="5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx="-20"
            cy="25"
            r="1"
            fill="url(#accentGradient)"
            opacity="0.5"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0;3,-2;0,0"
              dur="3.5s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
        <circle
          cx="60"
          cy="60"
          r="58"
          fill="none"
          stroke="url(#logoGradient)"
          strokeWidth="1"
          strokeDasharray="5,5"
          opacity="0.5"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 60 60;360 60 60"
            dur="20s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default AnimatedLogo;
