import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { signInWithGoogleService } from '../../services/firebase';
import type { UserRole } from '../../types';
import { TiltCard3D } from './TiltCard3D';
import { AuthTitleBurst } from './AuthTitleBurst';
import { MagneticButton } from './MagneticButton';
import {
  Lock,
  User,
  ShieldCheck,
  Users,
  CheckCircle2,
  AlertCircle,
  Radio,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const {
    setRole,
    currentUser,
    loginAdmin,
    loginOfficial,
    loginPesertaWithGoogle,
    calonPesertaList,
  } = useApp();

  // Active Login Channel: 'credentials' (Admin & Official) vs 'google' (Peserta)
  const [activeTab, setActiveTab] = useState<'credentials' | 'google'>('credentials');

  // Sub-selection for credentials: 'admin' vs 'official'
  const [credRole, setCredRole] = useState<'admin' | 'official'>('admin');

  // Username & Password fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // UI States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Handle Username / Password login for Admin & Official
  const handleCredentialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!username.trim() || !password) {
      setErrorMsg('Harap masukkan Username dan Password.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (credRole === 'admin') {
        const res = loginAdmin(username.trim(), password);
        if (res.success) {
          setSuccessMsg(res.message);
          setTimeout(() => setRole('admin'), 700);
        } else {
          setErrorMsg(res.message);
        }
      } else {
        const res = loginOfficial(username.trim(), password);
        if (res.success) {
          setSuccessMsg(res.message);
          setTimeout(() => setRole('official'), 700);
        } else {
          setErrorMsg(res.message);
        }
      }
      setLoading(false);
    }, 400);
  };

  // Handle Google Auth for Peserta
  const handleGoogleLoginPeserta = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const googleResult = await signInWithGoogleService();

      // Validate Google Email against CalonPesertaOfficial list
      const validation = loginPesertaWithGoogle(
        googleResult.email,
        googleResult.displayName,
        googleResult.photoURL
      );

      if (validation.success) {
        setSuccessMsg(validation.message);
        setTimeout(() => setRole('peserta'), 900);
      } else {
        setErrorMsg(validation.message);
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      setErrorMsg(e.message || 'Gagal melakukan otentikasi Google.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Autofill
  const handleAutofill = (type: 'admin' | 'official' | 'peserta') => {
    setErrorMsg(null);
    setSuccessMsg(null);
    if (type === 'admin') {
      setActiveTab('credentials');
      setCredRole('admin');
      setUsername('admin_smtq');
      setPassword('rahasiaAdmin2026');
    } else if (type === 'official') {
      setActiveTab('credentials');
      setCredRole('official');
      setUsername('official_bengkulu');
      setPassword('officialSmtq2026');
    } else if (type === 'peserta') {
      setActiveTab('google');
    }
  };

  return (
    <div className="relative min-h-[82vh] flex flex-col justify-center items-center py-6 sm:py-10 px-4">
      {/* Return to Public Home */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center gap-2"
      >
        <button
          onClick={() => setRole('public')}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors"
        >
          <Radio className="w-3.5 h-3.5 text-[#00FF87]" />
          <span>Kembali ke Laman Publik</span>
        </button>
      </motion.div>

      {/* Main 3D Tilt Card Box */}
      <div className="w-full max-w-lg">
        <TiltCard3D className="p-6 sm:p-9">
          {/* Header Title with Sacred Typography Burst */}
          <div className="mb-8">
            <AuthTitleBurst
              title={
                activeTab === 'credentials'
                  ? credRole === 'admin'
                    ? 'Login Admin Pusat'
                    : 'Login Official Kafilah'
                  : 'Masuk Peserta Lomba'
              }
              subtitle={
                activeTab === 'credentials'
                  ? 'Gunakan Username dan Password yang telah diverifikasi oleh Panitia SIMTQ'
                  : 'Peserta login menggunakan Akun Google yang telah didaftarkan oleh Official'
              }
              badge={
                activeTab === 'credentials'
                  ? 'INTERNAL SECURE ACCESS'
                  : 'PESERTA GOOGLE AUTH'
              }
            />
          </div>

          {/* Primary Channel Tabs: Credentials vs Google */}
          <div className="flex p-1 bg-white/[0.04] rounded-full border border-white/[0.08] mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('credentials');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-medium rounded-full transition-all relative ${
                activeTab === 'credentials'
                  ? 'text-black font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {activeTab === 'credentials' && (
                <motion.div
                  layoutId="auth-tab-pill"
                  className="absolute inset-0 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-1.5">
                <Lock className="w-3 h-3" />
                <span>1. Admin & Official (Kredensial)</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('google');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-medium rounded-full transition-all relative ${
                activeTab === 'google'
                  ? 'text-black font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {activeTab === 'google' && (
                <motion.div
                  layoutId="auth-tab-pill"
                  className="absolute inset-0 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>2. Peserta (Google Auth)</span>
              </span>
            </button>
          </div>

          {/* Error & Success Feedback Banners */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-xs leading-relaxed"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span className="flex-1">{errorMsg}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 p-3.5 rounded-2xl bg-[#00FF87]/15 border border-[#00FF87]/40 flex items-center gap-3 text-[#00FF87] text-xs font-medium"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#00FF87]" />
                <span className="flex-1">{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CHANNEL 1: USERNAME & PASSWORD (ADMIN & OFFICIAL) */}
          {activeTab === 'credentials' && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Role Toggle: Admin Pusat vs Official Kafilah */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setCredRole('admin');
                    setErrorMsg(null);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all flex items-center justify-center gap-2 ${
                    credRole === 'admin'
                      ? 'bg-[#00FF87]/15 text-[#00FF87] border-[#00FF87]/50 shadow-[0_0_12px_rgba(0,255,135,0.2)]'
                      : 'bg-white/[0.02] text-zinc-400 border-white/10 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Pusat</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCredRole('official');
                    setErrorMsg(null);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all flex items-center justify-center gap-2 ${
                    credRole === 'official'
                      ? 'bg-[#00FF87]/15 text-[#00FF87] border-[#00FF87]/50 shadow-[0_0_12px_rgba(0,255,135,0.2)]'
                      : 'bg-white/[0.02] text-zinc-400 border-white/10 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Official Kafilah</span>
                </button>
              </div>

              {/* Credential Form */}
              <form onSubmit={handleCredentialLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Username {credRole === 'admin' ? 'Admin' : 'Official'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={
                        credRole === 'admin'
                          ? 'admin_smtq'
                          : 'official_bengkulu'
                      }
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#00FF87]/60 focus:bg-white/[0.07] transition-all font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#00FF87]/60 focus:bg-white/[0.07] transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Magnetic Submit Button */}
                <div className="pt-2">
                  <MagneticButton
                    type="submit"
                    disabled={loading}
                    strength={0.35}
                    className="w-full py-3 px-5 rounded-xl bg-[#00FF87] hover:bg-[#00FF87]/90 text-black font-semibold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(0,255,135,0.4)] transition-all flex items-center justify-center gap-2"
                  >
                    <span>
                      {loading
                        ? 'Memverifikasi Kredensial...'
                        : credRole === 'admin'
                        ? 'Masuk sebagai Admin Pusat'
                        : 'Masuk sebagai Official Kafilah'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </MagneticButton>
                </div>
              </form>
            </motion.div>
          )}

          {/* CHANNEL 2: GOOGLE AUTH (PESERTA) */}
          {activeTab === 'google' && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-5 text-center"
            >
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#00FF87]">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>Validasi Email Google Peserta</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Sesuai ketentuan, Anda hanya dapat masuk jika <strong>Alamat Email Akun Google</strong> Anda sudah didaftarkan terlebih dahulu oleh <strong>Official Kafilah Kabupaten/Kota</strong> Anda.
                </p>
              </div>

              {/* Magnetic "Sign in with Google" Button */}
              <div className="flex justify-center pt-2">
                <MagneticButton
                  type="button"
                  disabled={loading}
                  onClick={handleGoogleLoginPeserta}
                  strength={0.3}
                  className="w-full py-3.5 px-5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-[#00FF87]/50 text-white font-medium text-xs sm:text-sm shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all group overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-[#00FF87]/10 to-transparent transition-opacity pointer-events-none" />

                  <div className="flex items-center justify-center gap-3 relative z-10">
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span className="tracking-wide">
                      {loading
                        ? 'Memeriksa Pendaftaran Email Google...'
                        : 'Lanjutkan dengan Akun Google'}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00FF87]/15 text-[#00FF87] border border-[#00FF87]/30 hidden sm:inline-block">
                      VERIFIKASI
                    </span>
                  </div>
                </MagneticButton>
              </div>

              <div className="text-[11px] text-zinc-500 font-mono">
                Email demo terdaftar: <span className="text-zinc-300">fadhil.mtq@gmail.com</span>
              </div>
            </motion.div>
          )}

          {/* Quick Demo Autofill Bar */}
          <div className="mt-8 pt-5 border-t border-white/[0.06]">
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2 text-center">
              PILIH CONTOH AKUN UJI COBA (TESTING):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleAutofill('admin')}
                className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-[11px] text-left transition-colors"
              >
                <div className="font-semibold text-white">⚙️ Admin Pusat</div>
                <div className="text-[9px] font-mono text-zinc-400">admin_smtq</div>
              </button>

              <button
                type="button"
                onClick={() => handleAutofill('official')}
                className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-[11px] text-left transition-colors"
              >
                <div className="font-semibold text-white">🏢 Official Kafilah</div>
                <div className="text-[9px] font-mono text-zinc-400">official_bengkulu</div>
              </button>

              <button
                type="button"
                onClick={() => handleAutofill('peserta')}
                className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-[11px] text-left transition-colors"
              >
                <div className="font-semibold text-white">👤 Peserta Lomba</div>
                <div className="text-[9px] font-mono text-zinc-400">Google Auth Mode</div>
              </button>
            </div>
          </div>
        </TiltCard3D>
      </div>
    </div>
  );
};
