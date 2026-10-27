import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { UserRole } from '../../types';
import {
  Award,
  Users,
  UserCheck,
  ShieldCheck,
  Gavel,
  Radio,
  RotateCcw,
  Menu,
  X,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { role, setRole, getActivePesertaTampil, resetAllData } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const activePeserta = getActivePesertaTampil();

  const roleNavItems: { id: UserRole; label: string; icon: React.ReactNode; desc: string; badge?: string }[] = [
    {
      id: 'public',
      label: 'Laman Utama & Skor',
      icon: <Radio className="w-4 h-4" />,
      desc: 'Live arena & Papan Skor Publik',
      badge: activePeserta.length > 0 ? `${activePeserta.length} Live` : undefined,
    },
    {
      id: 'official',
      label: 'Official Kafilah',
      icon: <Users className="w-4 h-4" />,
      desc: 'Pra-pendaftaran Kontingen Daerah',
    },
    {
      id: 'peserta',
      label: 'Pendaftaran Peserta',
      icon: <UserCheck className="w-4 h-4" />,
      desc: 'Verifikasi & Lengkapi Formulir',
    },
    {
      id: 'admin',
      label: 'Admin Pusat (LPTQ)',
      icon: <ShieldCheck className="w-4 h-4" />,
      desc: 'Rekap, Verifikasi & Acak Tampil',
    },
    {
      id: 'juri',
      label: 'Dewan Hakim',
      icon: <Gavel className="w-4 h-4" />,
      desc: 'Input Nilai Peserta Tampil',
    },
  ];

  return (
    <>
      {/* Top Banner Provinsi Bengkulu */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-amber-950 text-amber-200 text-xs py-1.5 px-4 border-b border-amber-600/30">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-white tracking-wide">
              LEMBAGA PENGEMBANGAN TILAWATIL QUR'AN (LPTQ) PROVINSI BENGKULU
            </span>
            <span className="hidden md:inline text-amber-400/70">|</span>
            <span className="hidden md:inline text-amber-200/90 font-medium">
              Musabaqah Tilawatil Qur'an (MTQ) Ke-XXXVI Tingkat Provinsi
            </span>
          </div>
          <div className="flex items-center gap-3">
            {activePeserta.length > 0 && (
              <span className="bg-red-600/90 text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                {activePeserta.length} Peserta Sedang Tampil
              </span>
            )}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="text-[11px] text-amber-300 hover:text-white flex items-center gap-1 transition-colors px-2 py-0.5 rounded bg-emerald-900/60 hover:bg-emerald-800 border border-amber-500/30"
              title="Reset ke Mock Data Awal"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Demo Data
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-900/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo and Branding */}
            <div
              onClick={() => setRole('public')}
              className="flex items-center gap-3.5 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-800 via-emerald-700 to-amber-600 flex items-center justify-center shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform duration-200 border border-amber-300/40">
                <span className="text-2xl text-amber-200 font-serif font-bold">م</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-emerald-950 font-sans">
                    SIMTQ
                  </span>
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-300">
                    BENGKULU
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  Sistem Pendaftaran & Penilaian MTQ Provinsi Bengkulu
                </p>
              </div>
            </div>

            {/* Desktop Navigation / Role Switcher */}
            <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80">
              {roleNavItems.map((item) => {
                const isActive = role === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setRole(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 relative ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-800 to-emerald-700 text-white shadow-md shadow-emerald-900/20 ring-1 ring-emerald-600'
                        : 'text-slate-700 hover:text-emerald-900 hover:bg-white/80'
                    }`}
                  >
                    <span className={isActive ? 'text-amber-300' : 'text-emerald-700'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-0.5 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick Role Switcher Selector for Mobile & Tablet */}
            <div className="flex items-center gap-2 lg:hidden">
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-lg px-2.5 py-2 pr-7 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="public">🌐 Publik / Leaderboard</option>
                  <option value="official">🏢 Role 1: Official Kafilah</option>
                  <option value="peserta">👤 Role 2: Peserta</option>
                  <option value="admin">⚙️ Role 3: Admin Pusat</option>
                  <option value="juri">⚖️ Role 4: Dewan Hakim</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-800 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
              Pilih Peran / Akses Modul:
            </p>
            {roleNavItems.map((item) => {
              const isActive = role === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setRole(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-800 text-white font-bold'
                      : 'bg-slate-50 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-amber-300' : 'text-emerald-700'}>
                      {item.icon}
                    </span>
                    <div>
                      <div className="font-semibold">{item.label}</div>
                      <div className={`text-xs ${isActive ? 'text-emerald-200' : 'text-slate-600'}`}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">
              Reset Semua Data ke Mock Awal?
            </h3>
            <p className="text-sm text-slate-600 text-center mb-6 leading-relaxed">
              Tindakan ini akan mengembalikan data Calon Peserta, Peserta Terdaftar, Nilai Dewan Hakim, dan Status Arena ke kondisi awal simulasi.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  resetAllData();
                  setShowResetConfirm(false);
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-md"
              >
                Ya, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
