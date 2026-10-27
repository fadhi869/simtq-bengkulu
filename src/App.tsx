import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CustomCursor } from './components/common/CustomCursor';
import { MouseSpotlight } from './components/common/MouseSpotlight';
import { PublicHome } from './components/public/PublicHome';
import { BankDataPage } from './components/bankdata/BankDataPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { OfficialDashboard } from './components/official/OfficialDashboard';
import { DewanHakimScoring } from './components/scoring/DewanHakimScoring';
import { PesertaRegistration } from './components/peserta/PesertaRegistration';
import { AuthPage } from './components/auth/AuthPage';
import {
  Radio,
  Users,
  UserCheck,
  ShieldCheck,
  Database,
  Award,
  LogIn,
  Lock,
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { role, setRole, currentUser } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#07080c] text-slate-900 dark:text-zinc-100 relative selection:bg-[#00FF87]/20 selection:text-emerald-700 dark:selection:text-[#00FF87] overflow-x-hidden transition-colors duration-300">
      {/* Feature 1: Smooth Custom Cursor with Damping Lag */}
      <CustomCursor />

      {/* Feature 2: Interactive Mouse-Tracking Background Spotlight */}
      <MouseSpotlight />

      {/* Background Subtle Dot Grid */}
      <div className="fixed inset-0 antigravity-grid opacity-50 pointer-events-none z-0" />

      {/* Main Navbar */}
      <Navbar />

      {/* Role Navigation Bar (Clean & Responsive for e-MTQ) */}
      <div className="relative z-10 border-b border-slate-200 dark:border-white/[0.06] bg-white/70 dark:bg-[#07080c]/60 backdrop-blur-md py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <span>MODUL RESMI e-MTQ:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setRole('public')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                role === 'public'
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]'
              }`}
            >
              <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
              Portal e-MTQ & Event
            </button>

            <button
              onClick={() => setRole('bank-data')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                role === 'bank-data'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]'
              }`}
            >
              <Database className="w-3 h-3 text-blue-400" />
              Bank Data (164)
            </button>

            <button
              onClick={() => setRole('admin')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                role === 'admin'
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]'
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Beranda Admin
            </button>

            <button
              onClick={() => setRole('official')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                role === 'official'
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]'
              }`}
            >
              <Users className="w-3 h-3 text-cyan-400" />
              Official Kafilah
            </button>

            <button
              onClick={() => setRole('escoring')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                role === 'escoring'
                  ? 'bg-purple-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]'
              }`}
            >
              <Award className="w-3 h-3 text-purple-400" />
              e-Scoring Hakim
            </button>

            <button
              onClick={() => setRole('peserta')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                role === 'peserta'
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]'
              }`}
            >
              <UserCheck className="w-3 h-3 text-emerald-400" />
              Pendaftaran Peserta
            </button>

            <button
              onClick={() => setRole('auth')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                role === 'auth'
                  ? 'bg-[#00FF87] text-slate-950 font-bold shadow-[0_0_12px_rgba(0,255,135,0.4)]'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-[#00FF87] hover:bg-slate-100 dark:hover:bg-white/[0.04]'
              }`}
            >
              <LogIn className="w-3 h-3 text-emerald-600 dark:text-[#00FF87]" />
              🔐 Portal Masuk
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {role === 'public' && <PublicHome />}
        {role === 'bank-data' && <BankDataPage />}
        {role === 'auth' && <AuthPage />}

        {/* ROLE: OFFICIAL KAFILAH - Protected Route */}
        {role === 'official' &&
          (currentUser?.role === 'official' ? (
            <OfficialDashboard />
          ) : (
            <div className="ag-card p-8 sm:p-12 max-w-md mx-auto text-center space-y-5 border border-slate-200 dark:border-white/10 mt-10">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                <Lock className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Otentikasi Official Diperlukan
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                  Modul ini dilindungi. Masuk menggunakan <strong>Username & Password Official</strong> (official_bengkulu / officialSmtq2026).
                </p>
              </div>
              <button
                onClick={() => setRole('auth')}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Buka Portal Masuk</span>
              </button>
            </div>
          ))}

        {/* ROLE: DEWAN HAKIM - e-Scoring */}
        {role === 'escoring' && <DewanHakimScoring />}

        {/* ROLE: PESERTA - Registrasi */}
        {role === 'peserta' && <PesertaRegistration />}

        {/* ROLE: ADMIN PUSAT - Protected Route */}
        {role === 'admin' &&
          (currentUser?.role === 'admin' ? (
            <AdminDashboard />
          ) : (
            <div className="ag-card p-8 sm:p-12 max-w-md mx-auto text-center space-y-5 border border-slate-200 dark:border-white/10 mt-10">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Akses Admin Bengkulu
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                  Silakan masuk menggunakan <strong>Username & Password Admin</strong> (adminBengkulu / rahasiaAdmin2026) untuk mengakses Beranda Utama.
                </p>
              </div>
              <button
                onClick={() => setRole('auth')}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Buka Portal Masuk</span>
              </button>
            </div>
          ))}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
