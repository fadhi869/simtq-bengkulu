import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { Peserta } from '../../types';
import { Clock, MapPin, Sparkles } from 'lucide-react';

interface Props {
  peserta: Peserta;
}

export const LiveParticipantCard3D: React.FC<Props> = ({ peserta }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Normalized mouse coordinates from -0.5 to 0.5
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring damping for ultra-smooth 60fps physics
  const mouseXSpring = useSpring(x, { stiffness: 260, damping: 22 });
  const mouseYSpring = useSpring(y, { stiffness: 260, damping: 22 });

  // Map to tilt angles (-14 to 14 deg)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [14, -14]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-14, 14]);

  // Glass sheen position
  const sheenX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
  const sheenY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]);

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
      className="w-full flex justify-center py-2"
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
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="w-full relative overflow-hidden rounded-3xl bg-[#0d0f17]/90 backdrop-blur-2xl border border-white/10 hover:border-[#00FF87]/40 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.08)] p-6 sm:p-7 transition-colors duration-300 group"
      >
        {/* Dynamic Glass Sheen Overlay sweeping across the surface */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(450px circle at ${sheenX.get()}% ${sheenY.get()}%, rgba(255, 255, 255, 0.14) 0%, rgba(0, 255, 135, 0.08) 25%, transparent 65%)`,
          }}
        />

        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#00FF87]/[0.08] blur-3xl pointer-events-none -z-10" />

        {/* Top Live Bar with 3D Depth */}
        <div
          style={{ transform: 'translateZ(25px)' }}
          className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00FF87]/10 border border-[#00FF87]/30 text-[#00FF87] text-[11px] font-mono tracking-wider shadow-[0_0_15px_rgba(0,255,135,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87] animate-ping" />
            <span>SEDANG TAMPIL</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>{peserta.waktuMulaiTampil || 'Sesi Sedang Berlangsung'}</span>
          </div>
        </div>

        {/* Main Card Content with 3D Parallax Depth */}
        <div
          style={{ transform: 'translateZ(40px)' }}
          className="flex flex-col sm:flex-row gap-6 items-center sm:items-start"
        >
          {/* Photo with Official Red Background */}
          <div className="relative shrink-0 group-hover:scale-105 transition-transform duration-300">
            <div className="w-24 h-32 rounded-2xl bg-red-600 p-1 border border-white/20 shadow-xl overflow-hidden">
              <img
                src={peserta.fotoUrl}
                alt={peserta.namaLengkap}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <span className="absolute -bottom-2 -right-1 text-[9px] font-mono tracking-wider bg-black/90 text-zinc-200 border border-white/10 px-2 py-0.5 rounded-full shadow">
              NO.{peserta.nomorUrutTampil || '-'}
            </span>
          </div>

          {/* Participant Details */}
          <div className="flex-1 min-w-0 text-center sm:text-left space-y-3">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">
                {peserta.namaLengkap}
              </h3>
              <p className="text-xs text-[#00FF87] font-medium mt-0.5 flex items-center justify-center sm:justify-start gap-1">
                <Sparkles className="w-3 h-3 text-[#00FF87]" />
                Kafilah {peserta.asalKafilah}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-white/[0.02] border border-white/[0.06] p-3 rounded-xl">
              <div>
                <span className="text-[10px] text-zinc-400 block uppercase">Cabang</span>
                <span className="text-zinc-200 truncate block font-sans font-medium">
                  {peserta.cabang}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block uppercase">Golongan</span>
                <span className="text-zinc-200 truncate block font-sans font-medium">
                  {peserta.golongan}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-zinc-400">
              <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span className="truncate">{peserta.mimbar || 'Mimbar Utama MTQ Bengkulu'}</span>
            </div>
          </div>
        </div>

        {/* Bottom Action Footer with 3D Depth */}
        <div
          style={{ transform: 'translateZ(20px)' }}
          className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between"
        >
          <span className="text-[11px] font-mono text-zinc-400">
            ID: {peserta.nomorRegistrasi}
          </span>
          <span className="text-xs text-[#00FF87] font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87] animate-pulse" />
            <span>Sesi Mimbar Aktif</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
};
