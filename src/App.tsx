import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { PublicHome } from './components/public/PublicHome';
import { OfficialDashboard } from './components/official/OfficialDashboard';
import { PesertaRegistration } from './components/peserta/PesertaRegistration';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { JuriDashboard } from './components/juri/JuriDashboard';
import type { UserRole } from './types';
import { Radio, Users, UserCheck, ShieldCheck, Gavel, HelpCircle } from 'lucide-react';

const MainContent: React.FC = () => {
  const { role, setRole } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />

      {/* Role Switcher Pill Bar for Quick Evaluation */}
      <div className="bg-emerald-900/10 border-b border-emerald-900/15 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>SIMULASI 4 ROLE USER:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setRole('public')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                role === 'public'
                  ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-600'
                  : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              Laman Publik & Skor
            </button>
            <button
              onClick={() => setRole('official')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                role === 'official'
                  ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-600'
                  : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-amber-600" />
              Role 1: Official Kafilah
            </button>
            <button
              onClick={() => setRole('peserta')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                role === 'peserta'
                  ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-600'
                  : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
              Role 2: Peserta
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                role === 'admin'
                  ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-600'
                  : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
              Role 3: Admin Pusat
            </button>
            <button
              onClick={() => setRole('juri')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                role === 'juri'
                  ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-600'
                  : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
              }`}
            >
              <Gavel className="w-3.5 h-3.5 text-amber-600" />
              Role 4: Dewan Hakim
            </button>
          </div>
        </div>
      </div>

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {role === 'public' && <PublicHome />}
        {role === 'official' && <OfficialDashboard />}
        {role === 'peserta' && <PesertaRegistration />}
        {role === 'admin' && <AdminDashboard />}
        {role === 'juri' && <JuriDashboard />}
      </main>

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
