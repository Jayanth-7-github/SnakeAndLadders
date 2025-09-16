import { useState } from "react";
import { motion, useAnimation } from "framer-motion";

export default function Dice({ onRoll, disabled }) {
  const controls = useAnimation();
  const [rolling, setRolling] = useState(false);

  async function handleClick(e) {
    if (disabled) return;
    setRolling(true);
    controls.start({
      rotate: 360,
      transition: { duration: 0.5, ease: "easeInOut" },
    });
    setTimeout(() => {
      controls.set({ rotate: 0 });
      setRolling(false);
    }, 500);
    await onRoll(e);
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || rolling}
      className="bg-gradient-to-br from-yellow-300 via-red-300 to-blue-400 text-black font-bold px-6 py-3 rounded-full shadow-lg border-2 border-white hover:scale-105 hover:from-yellow-400 hover:to-blue-500 transition-all duration-200 disabled:opacity-40 flex items-center gap-2"
      style={{ fontSize: "1.3rem", letterSpacing: "0.05em" }}
    >
      <motion.span
        role="img"
        aria-label="dice"
        animate={controls}
        style={{ display: "inline-block" }}
      >
        🎲
      </motion.span>{" "}
      Roll Dice
    </button>
  );
}
