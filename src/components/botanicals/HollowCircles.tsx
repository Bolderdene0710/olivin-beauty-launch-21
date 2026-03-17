interface HollowCircleProps {
  size: number;
  className?: string;
  speed?: "slow" | "normal" | "fast";
}

const HollowCircle = ({ size, className = "", speed = "normal" }: HollowCircleProps) => {
  const animClass =
    speed === "slow" ? "animate-circle-float-slow" :
    speed === "fast" ? "animate-circle-float-fast" :
    "animate-circle-float";

  return (
    <div
      className={`rounded-full border border-[hsl(var(--circle-border))] pointer-events-none ${animClass} ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

export default HollowCircle;
