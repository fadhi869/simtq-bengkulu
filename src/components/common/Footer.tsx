import React from 'react';
import { DAFTAR_KAFILAH } from '../../data/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.08] mt-24 py-12 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold tracking-tight text-sm">SIMTQ BENGKULU</span>
              <span className="text-zinc-600">/</span>
              <span className="text-xs text-zinc-400">LPTQ Provinsi Bengkulu</span>
            </div>
            <p className="text-xs text-zinc-400 max-w-md">
              Sistem Pendaftaran, Verifikasi Berkas, dan Penilaian Musabaqah Tilawatil Qur'an Tingkat Provinsi.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/10 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Sistem Aktif & Terverifikasi
            </span>
            <span className="font-mono text-[10px]">Standar MTQ Nasional</span>
          </div>
        </div>

        {/* 10 Kafilah Badges */}
        <div className="pt-4 border-t border-white/[0.04]">
          <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 block mb-2.5">
            10 Kafilah Kontingen Daerah:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {DAFTAR_KAFILAH.map((k) => (
              <span
                key={k}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.03] text-zinc-400 border border-white/[0.06] hover:border-white/20 transition-colors"
              >
                {k}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center text-[11px] text-zinc-400 gap-2 pt-2">
          <p>© {new Date().getFullYear()} LPTQ Provinsi Bengkulu. Hak Cipta Dilindungi.</p>
          <p className="font-serif italic text-zinc-400">"Bumi Rafflesia yang Qur'ani"</p>
        </div>
      </div>
    </footer>
  );
};
