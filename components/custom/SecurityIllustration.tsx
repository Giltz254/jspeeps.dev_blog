const SecurityIllustration = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <svg
        viewBox="0 0 400 300"
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0" y="280" width="400" height="20" fill="#f3f4f6" />
        <g>
          <path
            d="M 150 100 Q 200 60 250 100 L 250 200 L 150 200 Z"
            fill="#d1d5db"
            stroke="#9ca3af"
            strokeWidth="2"
          />
          <rect x="190" y="180" width="20" height="100" fill="#6b7280" />
          <rect x="185" y="175" width="30" height="10" fill="#374151" />
          <rect
            x="260"
            y="140"
            width="40"
            height="60"
            fill="#e5e7eb"
            stroke="#9ca3af"
            strokeWidth="1"
          />
          <circle cx="270" cy="155" r="3" fill="#10b981" />
          <circle cx="285" cy="155" r="3" fill="#ef4444" />
          <rect x="265" y="170" width="25" height="3" fill="#6b7280" />
          <rect x="265" y="180" width="20" height="3" fill="#6b7280" />
        </g>
        <g transform="translate(120, 140)">
          <ellipse cx="15" cy="45" rx="12" ry="20" fill="#3b82f6" />
          <circle cx="15" cy="15" r="12" fill="#fbbf24" />
          <rect x="8" y="12" width="14" height="4" fill="#1f2937" rx="2" />
          <ellipse cx="5" cy="35" rx="4" ry="12" fill="#3b82f6" />
          <ellipse cx="25" cy="35" rx="4" ry="12" fill="#3b82f6" />
          <ellipse cx="10" cy="70" rx="4" ry="15" fill="#6b7280" />
          <ellipse cx="20" cy="70" rx="4" ry="15" fill="#6b7280" />
          <ellipse cx="15" cy="8" rx="14" ry="4" fill="#1f2937" />
          <rect x="12" y="5" width="6" height="6" fill="#1f2937" />
        </g>
        <line
          x1="100"
          y1="220"
          x2="160"
          y2="220"
          stroke="#ef4444"
          strokeWidth="3"
        />
        <line
          x1="240"
          y1="220"
          x2="300"
          y2="220"
          stroke="#ef4444"
          strokeWidth="3"
        />
        <rect x="95" y="200" width="10" height="25" fill="#6b7280" />
        <rect x="295" y="200" width="10" height="25" fill="#6b7280" />
        <g transform="translate(320, 150)">
          <ellipse cx="15" cy="40" rx="10" ry="18" fill="#e5e7eb" />
          <circle cx="15" cy="12" r="10" fill="#fbbf24" />
          <ellipse
            cx="6"
            cy="25"
            rx="3"
            ry="10"
            fill="#e5e7eb"
            transform="rotate(-30 6 25)"
          />
          <ellipse
            cx="24"
            cy="25"
            rx="3"
            ry="10"
            fill="#e5e7eb"
            transform="rotate(30 24 25)"
          />
          <ellipse cx="10" cy="65" rx="3" ry="12" fill="#6b7280" />
          <ellipse cx="20" cy="65" rx="3" ry="12" fill="#6b7280" />
          <rect x="25" y="50" width="8" height="6" fill="#374151" rx="1" />
          <rect x="26" y="51" width="6" height="1" fill="#6b7280" />
        </g>
        <g transform="translate(70, 180)">
          <polygon
            points="15,0 30,25 0,25"
            fill="#fbbf24"
            stroke="#f59e0b"
            strokeWidth="1"
          />
          <text
            x="15"
            y="20"
            textAnchor="middle"
            fill="#1f2937"
            fontSize="12"
            fontWeight="bold"
          >
            !
          </text>
        </g>
        <text x="350" y="140" fill="#9ca3af" fontSize="16" fontWeight="bold">
          ?
        </text>
        <text x="360" y="130" fill="#d1d5db" fontSize="12" fontWeight="bold">
          ?
        </text>
      </svg>
    </div>
  );
};

export default SecurityIllustration;
