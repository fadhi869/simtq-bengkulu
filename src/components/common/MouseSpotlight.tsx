import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const MouseSpotlight: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  const mouseX = useMotionValue(
    typeof window !== 'undefined' ? window.innerWidth / 2 : 500
  );
  const mouseY = useMotionValue(
    typeof window !== 'undefined' ? 300 : 300
  );

  // Smooth lag for spotlight tracking
  const springX = useSpring(mouseX, { stiffness: 120, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 25 });

  useEffect(() => {
    setIsMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Real-time interactive spotlight centered on cursor */}
      <motion.div
        className="absolute w-[900px] h-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: springX,
          top: springY,
          background:
            'radial-gradient(circle, rgba(0, 255, 135, 0.09) 0%, rgba(0, 255, 135, 0.03) 35%, transparent 70%)',
          filter: 'blur(35px)',
        }}
      />
    </div>
  );
};
