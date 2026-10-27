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
import { JuriDashboard } from './components/juri/JuriDashboard';
import { Radio, Users, UserCheck, ShieldCheck, Gavel } from 'lucide-react';

const MainContent: React.FC = () => {
  const { role, setRole } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#07080c] text-zinc-100 relative selection:bg-[#00FF87]/20 selection:text-[#00FF87] overflow-x-hidden">
      {/* Feature 1: Super Smooth Custom Cursor with Damping Lag */}
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
            <span>SIMULASI 4 PERAN PENGGUNA:</span>
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
              1. Official Kafilah
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
              2. Peserta
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
              3. Admin Pusat
            </button>
            <button
              onClick={() => setRole('juri')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                role === 'juri'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Gavel className="w-3 h-3 text-zinc-400" />
              4. Dewan Hakim
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {role === 'public' && <PublicHome />}
        {role === 'official' && <OfficialDashboard />}
        {role === 'peserta' && <PesertaRegistration />}
        {role === 'admin' && <AdminDashboard />}
        {role === 'juri' && <JuriDashboard />}
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
