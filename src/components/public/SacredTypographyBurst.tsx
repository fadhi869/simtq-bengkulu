import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HIJAIYAH_LETTERS = [
  'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ',
  'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص',
  'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق',
  'ك', 'ل', 'م', 'ن', 'هـ', 'و', 'ي'
];

interface Particle {
  id: number;
  char: string;
  originX: number;
  originY: number;
  deltaX: number;
  deltaY: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  fontSize: number;
}

export const SacredTypographyBurst: React.FC = () => {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const nextIdRef = useRef(0);

  // Maximum particle cap to ensure solid 60fps under fast mouse sweeps
  const MAX_ACTIVE_PARTICLES = 50;

  // Garbage collection: removes particle by ID once animation finishes
  const removeParticle = useCallback((id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // Spatial Lock: calculate exact center coordinate of the touched letter
  const triggerBurst = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (!containerRef.current) return;

    const parentRect = containerRef.current.getBoundingClientRect();
    const rect = e.currentTarget.getBoundingClientRect();

    // Exact geometric center of the specific letter glyph
    const originX = rect.left + rect.width / 2 - parentRect.left;
    const originY = rect.top + rect.height / 2 - parentRect.top;

    // Generate 3 to 5 random Hijaiyah particles
    const burstCount = Math.floor(Math.random() * 3) + 3; // 3, 4, or 5
    const newParticles: Particle[] = [];

    for (let i = 0; i < burstCount; i++) {
      const char = HIJAIYAH_LETTERS[Math.floor(Math.random() * HIJAIYAH_LETTERS.length)];

      // Radial physics: 360-degree spread (0 - 2*PI) with balanced distance (-60px to 60px)
      const angle = Math.random() * Math.PI * 2;
      const distance = 25 + Math.random() * 35; // 25px - 60px
      const deltaX = Math.cos(angle) * distance;
      const deltaY = Math.sin(angle) * distance;

      // Random 3D spin rotations
      const rotateX = (Math.random() - 0.5) * 360;
      const rotateY = (Math.random() - 0.5) * 360;
      const rotateZ = (Math.random() - 0.5) * 240;

      const fontSize = 16 + Math.floor(Math.random() * 8); // 16px - 24px

      newParticles.push({
        id: ++nextIdRef.current,
        char,
        originX,
        originY,
        deltaX,
        deltaY,
        rotateX,
        rotateY,
        rotateZ,
        fontSize,
      });
    }

    setParticles((prev) => {
      const combined = [...prev, ...newParticles];
      return combined.length > MAX_ACTIVE_PARTICLES
        ? combined.slice(combined.length - MAX_ACTIVE_PARTICLES)
        : combined;
    });
  };

  const line1Words = ['Musabaqah', 'Tilawatil', "Qur'an"];
  const line2Words = ['Provinsi', 'Bengkulu'];

  let globalLetterCount = 0;

  return (
    <h1
      ref={containerRef}
      className="relative text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.14] select-none p-0 m-0"
    >
      {/* Line 1: Musabaqah Tilawatil Qur'an */}
      <div className="flex flex-wrap justify-center gap-x-3.5 sm:gap-x-5">
        {line1Words.map((word) => (
          <span key={word} className="inline-flex whitespace-nowrap">
            {word.split('').map((char) => {
              const currentDelay = globalLetterCount++ * 0.035;
              return (
                <motion.span
                  key={`${word}-${char}-${currentDelay}`}
                  initial={{ opacity: 0, y: 35, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{
                    duration: 0.75,
                    delay: currentDelay,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{
                    scale: 1.08,
                    color: '#00FF87',
                    textShadow: '0 0 16px rgba(0, 255, 135, 0.8)',
                    transition: { duration: 0.12 },
                  }}
                  onMouseEnter={triggerBurst}
                  className="inline-block cursor-pointer transition-colors duration-150"
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
        ))}
      </div>

      {/* Line 2: Provinsi Bengkulu (with refined emerald gradient) */}
      <div className="flex flex-wrap justify-center gap-x-3.5 sm:gap-x-5 mt-1 sm:mt-2">
        {line2Words.map((word) => (
          <span key={word} className="inline-flex whitespace-nowrap">
            {word.split('').map((char) => {
              const currentDelay = globalLetterCount++ * 0.035;
              return (
                <motion.span
                  key={`${word}-${char}-${currentDelay}`}
                  initial={{ opacity: 0, y: 35, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{
                    duration: 0.75,
                    delay: 0.3 + currentDelay,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{
                    scale: 1.08,
                    color: '#00FF87',
                    textShadow: '0 0 18px rgba(0, 255, 135, 0.9)',
                    transition: { duration: 0.12 },
                  }}
                  onMouseEnter={triggerBurst}
                  className="inline-block cursor-pointer bg-gradient-to-r from-zinc-100 via-zinc-300 to-[#00FF87] bg-clip-text text-transparent hover:text-[#00FF87] hover:bg-none transition-colors duration-150"
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
        ))}
      </div>

      {/* Active Hijaiyah Particles Layer (Spatial Lock with translate(-50%, -50%) Anchor) */}
      <div
        className="absolute inset-0 pointer-events-none overflow-visible z-30"
        style={{ margin: 0, padding: 0 }}
      >
        <AnimatePresence>
          {particles.map((p) => (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                left: p.originX,
                top: p.originY,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                lineHeight: 1,
              }}
            >
              <motion.span
                initial={{
                  x: 0,
                  y: 0,
                  scale: 1.15,
                  opacity: 0.85,
                  rotateX: 0,
                  rotateY: 0,
                  rotateZ: 0,
                }}
                animate={{
                  x: p.deltaX,
                  y: p.deltaY,
                  scale: 0,
                  opacity: 0,
                  rotateX: p.rotateX,
                  rotateY: p.rotateY,
                  rotateZ: p.rotateZ,
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  duration: 1.2,
                  ease: [0.33, 1, 0.68, 1], // easeOutCubic
                }}
                onAnimationComplete={() => removeParticle(p.id)}
                style={{
                  display: 'inline-block',
                  fontSize: p.fontSize,
                  lineHeight: 1,
                  transformStyle: 'preserve-3d',
                  fontFamily: "'Amiri', 'Traditional Arabic', serif",
                  textShadow:
                    '0 0 10px rgba(0, 255, 135, 0.8), 0 0 20px rgba(0, 255, 135, 0.45)',
                }}
                className="text-[#00FF87] font-bold select-none will-change-transform"
              >
                {p.char}
              </motion.span>
            </div>
          ))}
        </AnimatePresence>
      </div>
    </h1>
  );
};
