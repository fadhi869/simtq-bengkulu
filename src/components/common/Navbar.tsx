import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { UserRole } from '../../types';
import {
  Radio,
  Users,
  UserCheck,
  ShieldCheck,
  Database,
  Award,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  LogIn,
  LogOut,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    currentUser,
    logout,
    theme,
    toggleTheme,
    getActivePesertaTampil,
    resetAllData,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const activePeserta = getActivePesertaTampil();

  const roleNavItems: { id: UserRole; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'public',
      label: 'Portal e-MTQ',
      icon: <Radio className="w-3.5 h-3.5" />,
      badge: activePeserta.length > 0 ? `${activePeserta.length} LIVE` : undefined,
    },
    {
      id: 'bank-data',
      label: 'Bank Data (164)',
      icon: <Database className="w-3.5 h-3.5 text-blue-500" />,
    },
    {
      id: 'admin',
      label: 'Beranda Admin',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
    },
    {
      id: 'official',
      label: 'Official Kafilah',
      icon: <Users className="w-3.5 h-3.5" />,
    },
    {
      id: 'escoring',
      label: 'e-Scoring Hakim',
      icon: <Award className="w-3.5 h-3.5 text-purple-500" />,
    },
  ];

  const wilayahDropdowns = [
    {
      title: 'Sumatera',
      items: [
        'MTQ XXXVI Prov. Bengkulu',
        'MTQ LV Tingkat Prov. Jambi',
        'MTQ XLII Tingkat Kota Payakumbuh',
        'MTQ Tingkat Kab. Agam Ke 42',
        'MTQ XIII Tingkat Kab. Dharmasraya',
      ],
    },
    {
      title: 'Jawa',
      items: ['MTQ Tingkat Prov. Jawa Barat', 'MTQ Tingkat Prov. Jawa Timur', 'MTQ Prov. DKI Jakarta'],
    },
    {
      title: 'Bali - NT',
      items: ['MTQ Prov. Nusa Tenggara Barat', 'MTQ Prov. Bali'],
    },
    {
      title: 'Kalimantan',
      items: ['MTQ Prov. Kalimantan Timur', 'MTQ Prov. Kalimantan Selatan'],
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#07080c]/85 backdrop-blur-xl border-b border-slate-200/90 dark:border-white/[0.08] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo e-MTQ / SIMTQ Bengkulu (Gambar 5) */}
            <div
              onClick={() => setRole('public')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center font-bold font-serif text-xl shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <span>م</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
                    e-MTQ
                  </span>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full font-bold">
                    BENGKULU
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 hidden sm:block font-normal">
                  Kementerian Agama RI & LPTQ Provinsi
                </span>
              </div>
            </div>

            {/* Desktop Center Navigation with Regional Dropdowns (Gambar 5) */}
            <nav className="hidden xl:flex items-center gap-1 text-xs text-slate-600 dark:text-zinc-300 font-medium">
              <button
                onClick={() => setRole('public')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  role === 'public'
                    ? 'text-emerald-600 dark:text-[#00FF87] font-bold'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Beranda
              </button>

              {wilayahDropdowns.map((w) => (
                <div
                  key={w.title}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(w.title)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white transition-colors">
                    <span>{w.title}</span>
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  </button>

                  {activeDropdown === w.title && (
                    <div className="absolute top-full left-0 w-60 py-2 rounded-xl bg-white dark:bg-[#0e1017] border border-slate-200 dark:border-white/10 shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      {w.items.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setRole('public');
                            setActiveDropdown(null);
                          }}
                          className="px-3.5 py-2 text-[11px] text-slate-700 dark:text-zinc-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <button
                onClick={() => setRole('bank-data')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  role === 'bank-data'
                    ? 'text-emerald-600 dark:text-[#00FF87] font-bold'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Bank Data
              </button>
            </nav>

            {/* Right Side: Theme Toggle, Pilih Event Pill, Auth, & Mobile Toggle */}
            <div className="flex items-center gap-2.5">
              {/* THEME TOGGLE: GELAP & TERANG (User Request) */}
              <button
                onClick={toggleTheme}
                title={`Ganti ke Tema ${theme === 'dark' ? 'Terang (Light)' : 'Gelap (Dark)'}`}
                className="w-9 h-9 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] text-slate-700 dark:text-zinc-200 hover:border-emerald-500/50 flex items-center justify-center transition-all shadow-sm"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                ) : (
                  <Moon className="w-4 h-4 text-emerald-600" />
                )}
              </button>

              {/* Yellow Button "Pilih Event" (Gambar 5) */}
              <button
                onClick={() => {
                  setRole('public');
                  setTimeout(() => {
                    document.getElementById('pilih-event')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-bold text-xs shadow-md transition-all hover:scale-105"
              >
                <span>Pilih Event</span>
              </button>

              {/* Auth Portal Button */}
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <span className="hidden md:block text-xs font-semibold text-slate-700 dark:text-zinc-200 font-mono">
                    Hi, {currentUser.displayName?.split(' ')[0]}
                  </span>
                  <button
                    onClick={logout}
                    title="Keluar / Logout"
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Keluar</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setRole('auth')}
                  className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Masuk</span>
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 dark:border-white/10 p-4 space-y-2 bg-white dark:bg-[#07080c]">
            <button
              onClick={() => {
                setRole('public');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5"
            >
              Beranda & Portal Event
            </button>
            <button
              onClick={() => {
                setRole('bank-data');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5"
            >
              Bank Data Peserta
            </button>
            <button
              onClick={() => {
                setRole('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5"
            >
              Beranda Admin Pusat
            </button>
            <button
              onClick={() => {
                setRole('official');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5"
            >
              Official Kafilah
            </button>
            <button
              onClick={() => {
                setRole('escoring');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5"
            >
              e-Scoring Dewan Hakim
            </button>
            <button
              onClick={() => {
                setRole('peserta');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5"
            >
              Pendaftaran Peserta
            </button>
          </div>
        )}
      </header>
    </>
  );
};
