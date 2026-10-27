import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CustomCursor } from './components/common/CustomCursor';
import { MouseSpotlight } from './components/common/MouseSpotlight';
import { PublicHome } from './components/public/PublicHome';
import { OfficialDashboard } from './components/official/OfficialDashboard';
import { PesertaRegistration } from './components/peserta/PesertaRegistration';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthPage } from './components/auth/AuthPage';
import {
  Radio,
  Users,
  UserCheck,
  ShieldCheck,
  LogIn,
  Lock,
  Sparkles,
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { role, setRole, currentUser } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#07080c] text-zinc-100 relative selection:bg-[#00FF87]/20 selection:text-[#00FF87] overflow-x-hidden">
      {/* Feature 1: Smooth Custom Cursor with Damping Lag */}
      <CustomCursor />

      {/* Feature 2: Interactive Mouse-Tracking Background Spotlight */}
      <MouseSpotlight />

      {/* Background Subtle Dot Grid */}
      <div className="fixed inset-0 antigravity-grid opacity-50 pointer-events-none z-0" />

      {/* Main Navbar */}
      <Navbar />

      {/* Antigravity Minimalist Role Switcher Bar */}
      <div className="relative z-10 border-b border-white/[0.06] bg-[#07080c]/60 backdrop-blur-md py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87] shadow-[0_0_8px_#00FF87]" />
            <span>ALUR AUTENTIKASI PERAN (SIMTQ BENGKULU):</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setRole('public')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                role === 'public'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Radio className="w-3 h-3 text-emerald-600" />
              Laman Publik & Skor
            </button>

            <button
              onClick={() => setRole('official')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                role === 'official'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Users className="w-3 h-3 text-zinc-400" />
              1. Official Kafilah (User/Pass)
            </button>

            <button
              onClick={() => setRole('peserta')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                role === 'peserta'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <UserCheck className="w-3 h-3 text-zinc-400" />
              2. Peserta (Google Auth)
            </button>

            <button
              onClick={() => setRole('admin')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                role === 'admin'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-zinc-400" />
              3. Admin Pusat (User/Pass)
            </button>

            <button
              onClick={() => setRole('auth')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                role === 'auth'
                  ? 'bg-[#00FF87] text-black font-semibold shadow-[0_0_12px_rgba(0,255,135,0.4)]'
                  : 'text-zinc-400 hover:text-[#00FF87] hover:bg-white/[0.04]'
              }`}
            >
              <LogIn className="w-3 h-3 text-[#00FF87]" />
              🔐 Portal Autentikasi
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {role === 'public' && <PublicHome />}
        {role === 'auth' && <AuthPage />}

        {/* ROLE 1: OFFICIAL KAFILAH - Protected Route */}
        {role === 'official' &&
          (currentUser?.role === 'official' ? (
            <OfficialDashboard />
          ) : (
            <div className="ag-card p-8 sm:p-12 max-w-md mx-auto text-center space-y-5 border border-white/10 mt-10">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                <Lock className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Otentikasi Official Diperlukan
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Modul ini dilindungi. Masuk menggunakan <strong>Username & Password Official</strong> yang telah diterbitkan oleh Admin Pusat.
                </p>
              </div>
              <button
                onClick={() => setRole('auth')}
                className="w-full py-2.5 px-4 rounded-full bg-[#00FF87] hover:bg-[#00FF87]/90 text-black font-semibold text-xs transition-all shadow-[0_0_15px_rgba(0,255,135,0.3)] flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Buka Login Official</span>
              </button>
            </div>
          ))}

        {/* ROLE 2: PESERTA - Registrasi */}
        {role === 'peserta' && <PesertaRegistration />}

        {/* ROLE 3: ADMIN PUSAT - Protected Route */}
        {role === 'admin' &&
          (currentUser?.role === 'admin' ? (
            <AdminDashboard />
          ) : (
            <div className="ag-card p-8 sm:p-12 max-w-md mx-auto text-center space-y-5 border border-white/10 mt-10">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Akses Khusus Admin Pusat LPTQ
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Silakan masuk menggunakan <strong>Username & Password Admin</strong> (admin_smtq / rahasiaAdmin2026) untuk mengelola data resmi.
                </p>
              </div>
              <button
                onClick={() => setRole('auth')}
                className="w-full py-2.5 px-4 rounded-full bg-[#00FF87] hover:bg-[#00FF87]/90 text-black font-semibold text-xs transition-all shadow-[0_0_15px_rgba(0,255,135,0.3)] flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Buka Login Admin</span>
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
