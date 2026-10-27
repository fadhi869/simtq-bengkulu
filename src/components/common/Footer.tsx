import React from 'react';
import { DAFTAR_KAFILAH } from '../../data/constants';
import { MapPin, Phone, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-white/[0.08] mt-24 py-12 text-slate-600 dark:text-zinc-400 bg-white/50 dark:bg-[#07080c]/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Column 1: Subdit MTQ Kemenag & LPTQ (Gambar 5) */}
          <div className="md:col-span-6 space-y-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-slate-900 dark:text-white font-bold tracking-tight text-sm">
                  e-MTQ NASIONAL & BENGKULU
                </span>
                <span className="text-slate-400">/</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  LPTQ Provinsi Bengkulu
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                Subdit Lembaga Tilawah dan Musabaqah Al-Qur'an
              </h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md leading-relaxed">
                Kementerian Agama RI • Direktorat Penerangan Agama Islam • Ditjen Bimbingan Masyarakat Islam. Platform terpadu pendaftaran, verifikasi dokumen, dan penilaian digital terintegrasi.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Sistem Resmi Aktif
              </span>
              <span className="font-mono text-[10px] text-slate-500 dark:text-zinc-400">
                Standar MTQ Nasional 2026
              </span>
            </div>
          </div>

          {/* Column 2: Kontak Sekretariat (Gambar 5) */}
          <div className="md:col-span-6 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Kontak & Informasi Sekretariat
            </h4>
            <div className="space-y-1.5 text-slate-600 dark:text-zinc-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Jl. Basuki Rahmat No. 1, Padang Jati, Kota Bengkulu (Gedung LPTQ / Kanwil Kemenag Bengkulu)</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>(0736) 21544 / (021) 3514067</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>lptq.bengkulu@kemenag.go.id • bimasislam@kemenag.go.id</span>
              </p>
            </div>
          </div>
        </div>

        {/* 10 Kafilah Badges */}
        <div className="pt-4 border-t border-slate-200 dark:border-white/[0.04]">
          <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 dark:text-zinc-400 block mb-2.5">
            10 Kafilah Kontingen Daerah Bengkulu:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {DAFTAR_KAFILAH.map((k) => (
              <span
                key={k}
                className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/[0.03] text-slate-700 dark:text-zinc-400 border border-slate-200 dark:border-white/[0.06] hover:border-emerald-500/30 transition-colors"
              >
                {k}
              </span>
            ))}
          </div>
        </div>

        {/* Copyright and Motto */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500 dark:text-zinc-400 gap-2 pt-2 border-t border-slate-200 dark:border-white/[0.04]">
          <p>© {new Date().getFullYear()} Subdit MTQ - Ditjen Bimas Islam & LPTQ Provinsi Bengkulu. Versi 2026.</p>
          <p className="font-serif italic text-emerald-700 dark:text-emerald-400 font-medium">"Bumi Rafflesia yang Qur'ani"</p>
        </div>
      </div>
    </footer>
  );
};
