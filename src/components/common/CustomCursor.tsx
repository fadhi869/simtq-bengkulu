import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth damping as specified: stiffness: 200, damping: 30
  const springConfig = { stiffness: 200, damping: 30 };
  const ringX = useSpring(cursorX, springConfig);
  const ringY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.closest('button') ||
        target?.closest('a') ||
        target?.closest('input') ||
        target?.closest('select') ||
        target?.closest('[role="button"]') ||
        target?.closest('.cursor-pointer')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousemove', handleElementHover);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousemove', handleElementHover);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer ring with smooth liquid damping trail */}
      <motion.div
        className="fixed rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 border border-[#00FF87]/50 bg-[#00FF87]/[0.06] backdrop-blur-[1px]"
        style={{
          left: ringX,
          top: ringY,
          width: isHovered ? 48 : 34,
          height: isHovered ? 48 : 34,
          boxShadow: isHovered
            ? '0 0 25px rgba(0, 255, 135, 0.45), inset 0 0 10px rgba(0, 255, 135, 0.2)'
            : '0 0 15px rgba(0, 255, 135, 0.25)',
        }}
      />

      {/* Main inner pointer dot: Bright neon green (#00FF87) */}
      <motion.div
        className="fixed rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 bg-[#00FF87] shadow-[0_0_12px_#00FF87]"
        style={{
          left: cursorX,
          top: cursorY,
          width: isHovered ? 8 : 6,
          height: isHovered ? 8 : 6,
        }}
      />
    </div>
  );
};
