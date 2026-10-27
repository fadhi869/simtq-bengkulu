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

interface AuthTitleBurstProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

export const AuthTitleBurst: React.FC<AuthTitleBurstProps> = ({
  title,
  subtitle,
  badge = 'AUTHENTICATION GATEWAY',
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const nextIdRef = useRef(0);

  const MAX_ACTIVE_PARTICLES = 40;

  const removeParticle = useCallback((id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const triggerBurst = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (!containerRef.current) return;

    const parentRect = containerRef.current.getBoundingClientRect();
    const rect = e.currentTarget.getBoundingClientRect();

    // Spatial Lock: Physical midpoint of the hovered glyph relative to parent
    const originX = rect.left + rect.width / 2 - parentRect.left;
    const originY = rect.top + rect.height / 2 - parentRect.top;

    const burstCount = Math.floor(Math.random() * 3) + 3; // 3 to 5 particles
    const newParticles: Particle[] = [];

    for (let i = 0; i < burstCount; i++) {
      const char = HIJAIYAH_LETTERS[Math.floor(Math.random() * HIJAIYAH_LETTERS.length)];
      const angle = Math.random() * Math.PI * 2;
      const distance = 20 + Math.random() * 40; // 20px - 60px
      const deltaX = Math.cos(angle) * distance;
      const deltaY = Math.sin(angle) * distance;

      const rotateX = (Math.random() - 0.5) * 360;
      const rotateY = (Math.random() - 0.5) * 360;
      const rotateZ = (Math.random() - 0.5) * 240;
      const fontSize = 14 + Math.floor(Math.random() * 8);

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

  const words = title.split(' ');
  let letterIndex = 0;

  return (
    <div className="flex flex-col items-center text-center select-none">
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00FF87]/10 border border-[#00FF87]/30 text-[#00FF87] text-[10px] font-mono tracking-widest uppercase mb-3 shadow-[0_0_12px_rgba(0,255,135,0.15)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87] shadow-[0_0_6px_#00FF87] animate-pulse" />
          <span>{badge}</span>
        </motion.div>
      )}

      <h2
        ref={containerRef}
        className="relative text-2xl sm:text-3xl font-extrabold tracking-tight text-white m-0 p-0"
      >
        <span className="inline-flex flex-wrap justify-center items-center gap-x-2 gap-y-1">
          {words.map((word, wIdx) => (
            <span key={wIdx} className="inline-block whitespace-nowrap">
              {word.split('').map((char, cIdx) => {
                const currentIdx = letterIndex++;
                return (
                  <motion.span
                    key={cIdx}
                    onMouseEnter={triggerBurst}
                    initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{
                      duration: 0.5,
                      delay: currentIdx * 0.025,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="inline-block text-white hover:text-[#00FF87] transition-colors duration-150 cursor-pointer"
                  >
                    {char}
                  </motion.span>
                );
              })}
            </span>
          ))}
        </span>

        {/* Sacred Particle Typography Burst Layer with Spatial Centering */}
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          <AnimatePresence>
            {particles.map((p) => (
              <div
                key={p.id}
                style={{
                  position: 'absolute',
                  left: `${p.originX}px`,
                  top: `${p.originY}px`,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                }}
              >
                <motion.span
                  initial={{
                    x: 0,
                    y: 0,
                    opacity: 0.9,
                    scale: 1.1,
                    rotateX: 0,
                    rotateY: 0,
                    rotateZ: 0,
                  }}
                  animate={{
                    x: p.deltaX,
                    y: p.deltaY,
                    opacity: 0,
                    scale: 0.15,
                    rotateX: p.rotateX,
                    rotateY: p.rotateY,
                    rotateZ: p.rotateZ,
                  }}
                  transition={{
                    duration: 1.1,
                    ease: [0.215, 0.61, 0.355, 1],
                  }}
                  onAnimationComplete={() => removeParticle(p.id)}
                  style={{
                    fontSize: `${p.fontSize}px`,
                    color: 'rgba(0, 255, 135, 0.85)',
                    textShadow:
                      '0 0 10px rgba(0, 255, 135, 0.8), 0 0 20px rgba(0, 255, 135, 0.4)',
                    fontFamily:
                      "'Amiri', 'Scheherazade New', 'Traditional Arabic', serif",
                    fontWeight: 700,
                  }}
                  className="block select-none pointer-events-none will-change-transform"
                >
                  {p.char}
                </motion.span>
              </div>
            ))}
          </AnimatePresence>
        </div>
      </h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xs text-zinc-400 mt-2 max-w-sm font-normal"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};
