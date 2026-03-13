import { motion } from "framer-motion";

const shapes = [
  { className: "top-[8%] left-[8%] w-16 h-16 md:w-24 md:h-24 rounded-full bg-pastel-pink/50 backdrop-blur-sm", delay: 0 },
  { className: "top-[15%] right-[12%] w-12 h-12 md:w-20 md:h-20 rounded-full bg-pastel-mint/40 backdrop-blur-sm", delay: 0.3 },
  { className: "bottom-[25%] left-[5%] w-10 h-10 md:w-16 md:h-16 rounded-full bg-pastel-yellow/50 backdrop-blur-sm", delay: 0.6 },
  { className: "top-[50%] right-[6%] w-14 h-14 md:w-20 md:h-20 rounded-full bg-pastel-lilac/40 backdrop-blur-sm", delay: 0.2 },
  { className: "bottom-[15%] right-[25%] w-8 h-8 md:w-14 md:h-14 rounded-full bg-pastel-peach/50 backdrop-blur-sm", delay: 0.8 },
  { className: "top-[35%] left-[15%] w-6 h-6 md:w-10 md:h-10 rounded-full bg-pastel-blue/40 backdrop-blur-sm", delay: 0.4 },
  { className: "bottom-[35%] left-[40%] w-8 h-8 md:w-12 md:h-12 rounded-full bg-pastel-rose/30 backdrop-blur-sm", delay: 1.0 },
  { className: "top-[70%] right-[40%] w-10 h-10 md:w-16 md:h-16 rounded-full bg-pastel-mint/30 backdrop-blur-sm", delay: 0.5 },
];

const FloatingShapes = () => {
  return (
    <>
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className={`absolute pointer-events-none ${shape.className}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: shape.delay, type: "spring" }}
          style={{
            animation: `float-${(i % 5) + 1} ${3.5 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${shape.delay + 1}s`,
          }}
        />
      ))}
    </>
  );
};

export default FloatingShapes;
