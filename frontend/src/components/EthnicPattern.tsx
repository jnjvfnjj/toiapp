export function EthnicPattern({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Kyrgyz "koshka muiz" (ram's horn) pattern */}
      <pattern id="ethnoPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        {/* Ram's horn spiral */}
        <path
          d="M 20 40 Q 25 30, 30 35 Q 35 40, 30 45 Q 25 50, 20 40"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          opacity="0.3"
        />
        <path
          d="M 60 40 Q 55 30, 50 35 Q 45 40, 50 45 Q 55 50, 60 40"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          opacity="0.3"
        />
        {/* Center diamond */}
        <path
          d="M 40 30 L 45 40 L 40 50 L 35 40 Z"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          opacity="0.2"
        />
      </pattern>
      <rect width="400" height="100" fill="url(#ethnoPattern)" />
    </svg>
  );
}

export function EthnicBorder({ className = "" }: { className?: string }) {
  return (
    <div className={`h-1 ${className}`}>
      <svg width="100%" height="4" viewBox="0 0 400 4" fill="none" xmlns="http://www.w3.org/2000/svg">
        <pattern id="border" x="0" y="0" width="20" height="4" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="currentColor" opacity="0.3" />
          <circle cx="10" cy="2" r="1.5" fill="currentColor" opacity="0.4" />
          <circle cx="18" cy="2" r="1" fill="currentColor" opacity="0.3" />
        </pattern>
        <rect width="400" height="4" fill="url(#border)" />
      </svg>
    </div>
  );
}
