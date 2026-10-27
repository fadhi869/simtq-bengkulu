import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  strength?: number; // Attraction strength multiplier (default 0.35)
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  strength = 0.35,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Position motion values for magnetic displacement
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring recoil physics: stiffness 350, damping 20 for organic fluid bounce
  const springConfig = { stiffness: 350, damping: 20, mass: 0.4 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const pullX = (e.clientX - centerX) * strength;
    const pullY = (e.clientY - centerY) * strength;

    x.set(pullX);
    y.set(pullY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: springX,
        y: springY,
      }}
      whileTap={{ scale: 0.97 }}
      className={`relative inline-flex items-center justify-center select-none cursor-pointer will-change-transform ${className}`}
    >
      {children}
    </motion.button>
  );
};
