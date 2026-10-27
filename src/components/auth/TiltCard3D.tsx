import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCard3DProps {
  children: React.ReactNode;
  className?: string;
}

export const TiltCard3D: React.FC<TiltCard3DProps> = ({ children, className = '' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Normalized mouse coordinates from -0.5 to 0.5
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // High-performance spring damping for fluid 60fps responsiveness
  const mouseXSpring = useSpring(x, { stiffness: 260, damping: 22 });
  const mouseYSpring = useSpring(y, { stiffness: 260, damping: 22 });

  // Map to 3D rotation angles (-10 to 10 deg)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-10, 10]);

  // Dynamic glass sheen coordinates
  const sheenX = useTransform(mouseXSpring, [-0.5, 0.5], [10, 90]);
  const sheenY = useTransform(mouseYSpring, [-0.5, 0.5], [10, 90]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;

    const xPct = mouseXPos / rect.width - 0.5;
    const yPct = mouseYPos / rect.height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div
      style={{ perspective: '1200px' }}
      className="w-full flex justify-center items-center py-4"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full relative overflow-hidden rounded-3xl bg-[#0d0f17]/90 backdrop-blur-2xl border border-white/10 hover:border-[#00FF87]/40 shadow-[0_25px_60px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.1)] transition-colors duration-300 group ${className}`}
      >
        {/* Dynamic Glass Sheen Overlay sweeping across the surface */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(450px circle at ${sheenX.get()}% ${sheenY.get()}%, rgba(255, 255, 255, 0.12) 0%, rgba(0, 255, 135, 0.08) 30%, transparent 65%)`,
          }}
        />

        {/* Subtle Ambient Glowing Gradients inside the card */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FF87]/[0.05] blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/[0.04] blur-3xl pointer-events-none -z-10" />

        {/* Content with 3D Depth */}
        <div style={{ transform: 'translateZ(20px)' }} className="relative z-10">
          {children}
        </div>
      </motion.div>
    </div>
  );
};
