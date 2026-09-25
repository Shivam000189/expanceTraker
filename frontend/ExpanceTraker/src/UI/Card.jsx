import { motion, useReducedMotion } from "framer-motion";
import { twMerge } from "tailwind-merge";

export default function Card({ children, className = "", onClick, ...props }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 25, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduceMotion ? undefined : { y: -3 }}
      onClick={onClick}
      className={twMerge(
        "relative w-full h-full min-h-0 flex flex-col justify-between",
        "overflow-hidden rounded-[24px] border border-white/10",
        "bg-white/[0.08] p-4 lg:p-5 text-white",
        "shadow-[0_20px_60px_rgba(0,0,0,0.35)]",
        "backdrop-blur-xl backdrop-saturate-150 transform-gpu",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
