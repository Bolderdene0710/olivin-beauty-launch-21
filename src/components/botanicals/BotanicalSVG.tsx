/**
 * Botanical SVG leaf/branch decorations for the homepage.
 * Each variant is an inline SVG path positioned absolute.
 */

interface BotanicalProps {
  className?: string;
}

export const PalmBranchLeft = ({ className = "" }: BotanicalProps) => (
  <svg
    className={`pointer-events-none ${className}`}
    width="180"
    height="400"
    viewBox="0 0 180 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.85">
      {/* Main stem */}
      <path d="M90 400 C85 300, 70 200, 60 80 C55 40, 50 10, 55 0" stroke="#7d9b6e" strokeWidth="2" fill="none" />
      {/* Leaves */}
      <path d="M60 80 C30 60, 5 90, 10 120 C20 100, 40 85, 60 80Z" fill="#7d9b6e" opacity="0.7" />
      <path d="M65 120 C25 100, 0 140, 5 170 C20 145, 45 125, 65 120Z" fill="#5a7a4e" opacity="0.6" />
      <path d="M70 160 C35 145, 10 180, 15 210 C30 185, 50 165, 70 160Z" fill="#a8c49a" opacity="0.5" />
      <path d="M75 200 C40 190, 15 220, 25 250 C40 225, 55 205, 75 200Z" fill="#7d9b6e" opacity="0.6" />
      <path d="M60 80 C80 50, 110 70, 120 100 C100 80, 80 75, 60 80Z" fill="#a8c49a" opacity="0.5" />
      <path d="M65 120 C90 95, 125 110, 130 140 C110 120, 85 115, 65 120Z" fill="#7d9b6e" opacity="0.6" />
      <path d="M70 160 C95 140, 130 155, 135 185 C115 165, 90 155, 70 160Z" fill="#5a7a4e" opacity="0.5" />
      {/* Leaf veins */}
      <path d="M60 80 L25 105" stroke="#5a7a4e" strokeWidth="0.5" opacity="0.4" />
      <path d="M65 120 L20 150" stroke="#5a7a4e" strokeWidth="0.5" opacity="0.4" />
      <path d="M60 80 L105 85" stroke="#5a7a4e" strokeWidth="0.5" opacity="0.4" />
    </g>
  </svg>
);

export const LeafSprigRight = ({ className = "" }: BotanicalProps) => (
  <svg
    className={`pointer-events-none ${className}`}
    width="120"
    height="280"
    viewBox="0 0 120 280"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.85">
      <path d="M60 280 C65 220, 70 160, 65 80 C63 40, 60 10, 62 0" stroke="#7d9b6e" strokeWidth="1.5" fill="none" />
      <path d="M65 80 C90 60, 110 80, 105 110 C95 90, 80 78, 65 80Z" fill="#7d9b6e" opacity="0.7" />
      <path d="M63 130 C85 115, 105 130, 100 155 C90 135, 75 125, 63 130Z" fill="#a8c49a" opacity="0.6" />
      <path d="M65 80 C40 55, 15 75, 20 105 C30 85, 50 75, 65 80Z" fill="#5a7a4e" opacity="0.6" />
      <path d="M63 130 C38 110, 15 130, 22 158 C32 138, 48 125, 63 130Z" fill="#7d9b6e" opacity="0.5" />
      <path d="M64 180 C85 165, 100 180, 95 205 C88 188, 75 175, 64 180Z" fill="#a8c49a" opacity="0.5" />
    </g>
  </svg>
);

export const SmallLeaf = ({ className = "" }: BotanicalProps) => (
  <svg
    className={`pointer-events-none ${className}`}
    width="80"
    height="120"
    viewBox="0 0 80 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.85">
      <path d="M40 120 C38 80, 35 40, 40 5" stroke="#7d9b6e" strokeWidth="1.5" fill="none" />
      <path d="M40 30 C55 15, 75 25, 70 50 C60 35, 50 28, 40 30Z" fill="#7d9b6e" opacity="0.7" />
      <path d="M40 30 C25 12, 5 22, 10 48 C20 32, 30 26, 40 30Z" fill="#a8c49a" opacity="0.6" />
      <path d="M38 65 C52 50, 68 58, 65 78 C56 65, 48 58, 38 65Z" fill="#5a7a4e" opacity="0.5" />
      <path d="M38 65 C24 48, 8 58, 12 80 C22 65, 30 58, 38 65Z" fill="#7d9b6e" opacity="0.6" />
    </g>
  </svg>
);
