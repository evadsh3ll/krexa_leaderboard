export function PacMan({ size = 44 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      <path fill="var(--gold)">
        <animate
          attributeName="d"
          dur="0.3s"
          repeatCount="indefinite"
          values="M50,50 L98,25 A48,48 0 1,1 98,75 Z;M50,50 L98,47 A48,48 0 1,1 98,53 Z;M50,50 L98,25 A48,48 0 1,1 98,75 Z"
        />
      </path>
      <circle cx="58" cy="28" r="6" fill="var(--bg)" />
    </svg>
  );
}

export function Ghost({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <svg viewBox="0 0 30 30" width={size} height={size} aria-hidden="true">
      <path
        d="M3,15 a12,12 0 0,1 24,0 V28 l-4,-3 l-4,3 l-4,-3 l-4,3 l-4,-3 Z"
        fill={color}
      />
      <circle cx="11" cy="14" r="3.4" fill="#fff" />
      <circle cx="19" cy="14" r="3.4" fill="#fff" />
      <circle cx="12" cy="14" r="1.7" fill="#1919A6" />
      <circle cx="20" cy="14" r="1.7" fill="#1919A6" />
    </svg>
  );
}
