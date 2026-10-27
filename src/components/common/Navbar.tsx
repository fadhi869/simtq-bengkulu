import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { UserRole } from '../../types';
import {
  Radio,
  Users,
  UserCheck,
  ShieldCheck,
  Gavel,
  RotateCcw,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { role, setRole, getActivePesertaTampil, resetAllData } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const activePeserta = getActivePesertaTampil();

  const roleNavItems: { id: UserRole; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'public',
      label: 'Live Arena & Skor',
      icon: <Radio className="w-3.5 h-3.5" />,
      badge: activePeserta.length > 0 ? `${activePeserta.length} LIVE` : undefined,
    },
    {
      id: 'official',
      label: 'Official Kafilah',
      icon: <Users className="w-3.5 h-3.5" />,
    },
    {
      id: 'peserta',
      label: 'Pendaftaran Peserta',
      icon: <UserCheck className="w-3.5 h-3.5" />,
    },
    {
      id: 'admin',
      label: 'Admin Pusat',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
    },
    {
      id: 'juri',
      label: 'Dewan Hakim',
      icon: <Gavel className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <>
      {/* Sleek Floating / Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#07080c]/80 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Brand Logo & Title */}
            <div
              onClick={() => setRole('public')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center group-hover:border-emerald-500/40 transition-colors">
                <span className="text-emerald-400 font-serif font-bold text-lg">م</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white tracking-tight font-sans">
                    SIMTQ
                  </span>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-400/90 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">
                    BENGKULU
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 hidden sm:block font-normal">
                  Sistem Pendaftaran & Penilaian Lomba MTQ
                </span>
              </div>
            </div>

            {/* Desktop Navigation - Minimalist Segmented Pill */}
            <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] p-1 rounded-full border border-white/[0.08]">
              {roleNavItems.map((item) => {
                const isActive = role === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setRole(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-white text-black font-semibold shadow-sm'
                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className={isActive ? 'text-emerald-700' : 'text-zinc-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 text-[9px] font-mono px-1.5 py-0.2 rounded-full border border-emerald-500/30">
                        <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowResetConfirm(true)}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition-colors"
                title="Reset ke Mock Data Awal"
              >
                <RotateCcw className="w-3 h-3 text-zinc-400" />
                <span className="font-mono text-[11px]">Reset Data</span>
              </button>

              {/* Mobile Role Dropdown */}
              <div className="relative lg:hidden">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="text-xs bg-[#10121a] text-zinc-200 border border-white/10 rounded-full px-3 py-1.5 pr-7 appearance-none focus:outline-none"
                >
                  <option value="public">🌐 Publik / Skor</option>
                  <option value="official">🏢 1. Official</option>
                  <option value="peserta">👤 2. Peserta</option>
                  <option value="admin">⚙️ 3. Admin</option>
                  <option value="juri">⚖️ 4. Juri</option>
                </select>
                <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] lg:hidden"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/[0.08] bg-[#0c0e14] px-4 py-4 space-y-1.5">
            <p className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase mb-2">
              PILIH MODUL / PERAN:
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
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-white text-black font-semibold'
                      : 'text-zinc-300 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#10121a] rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-white/10">
            <h3 className="text-base font-semibold text-white mb-2">
              Reset Semua Data Demo?
            </h3>
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
              Tindakan ini akan mengembalikan data calon peserta, berkas, status mimbar, dan lembar nilai ke kondisi awal simulasi.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 rounded-full border border-white/10 text-zinc-300 font-medium text-xs hover:bg-white/[0.06] transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  resetAllData();
                  setShowResetConfirm(false);
                }}
                className="flex-1 px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-colors"
              >
                Ya, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
