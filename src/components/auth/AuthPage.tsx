import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import {
  signInWithGoogleService,
  signInWithEmailService,
  signUpWithEmailService,
  isFirebaseConfigured,
} from '../../services/firebase';
import type { UserRole, AuthUser } from '../../types';
import { TiltCard3D } from './TiltCard3D';
import { AuthTitleBurst } from './AuthTitleBurst';
import { MagneticButton } from './MagneticButton';
import {
  Mail,
  Lock,
  User,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Eye,
  EyeOff,
  Radio,
} from 'lucide-react';
import { DAFTAR_KAFILAH } from '../../data/constants';

export const AuthPage: React.FC = () => {
  const { setRole, currentUser, setCurrentUser } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    user: AuthUser;
    isGoogle: boolean;
  } | null>(null);

  // Sign In Form States
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up Form States
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState<UserRole>('peserta');
  const [signUpKafilah, setSignUpKafilah] = useState(DAFTAR_KAFILAH[0]);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Handle Google Login
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const result = await signInWithGoogleService();

      const authenticatedUser: AuthUser = {
        uid: result.uid,
        email: result.email,
        displayName: result.displayName,
        photoURL: result.photoURL || null,
        role: signUpRole !== 'auth' ? signUpRole : 'peserta',
        asalKafilah: signUpKafilah,
        provider: 'google',
        createdAt: new Date().toISOString(),
      };

      setCurrentUser(authenticatedUser);
      setSuccessData({ user: authenticatedUser, isGoogle: true });
    } catch (err: unknown) {
      const e = err as { message?: string };
      setErrorMsg(e.message || 'Gagal masuk menggunakan Google.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Email Sign In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail || !signInPassword) {
      setErrorMsg('Harap lengkapi email dan kata sandi.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);

      const result = await signInWithEmailService(signInEmail, signInPassword);

      // Deduce role based on email hint if applicable
      let determinedRole: UserRole = 'peserta';
      const emailLower = signInEmail.toLowerCase();
      if (emailLower.includes('official') || emailLower.includes('kafilah')) {
        determinedRole = 'official';
      } else if (emailLower.includes('admin') || emailLower.includes('panitia')) {
        determinedRole = 'admin';
      } else if (emailLower.includes('juri') || emailLower.includes('hakim')) {
        determinedRole = 'juri';
      }

      const authenticatedUser: AuthUser = {
        uid: result.uid,
        email: result.email,
        displayName: result.displayName,
        photoURL: null,
        role: determinedRole,
        provider: 'password',
        createdAt: new Date().toISOString(),
      };

      setCurrentUser(authenticatedUser);
      setSuccessData({ user: authenticatedUser, isGoogle: false });
    } catch (err: unknown) {
      const e = err as { message?: string };
      setErrorMsg(e.message || 'Kombinasi email dan kata sandi tidak valid.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Email Sign Up
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpName || !signUpEmail || !signUpPassword) {
      setErrorMsg('Harap isi seluruh formulir pendaftaran.');
      return;
    }
    if (signUpPassword.length < 6) {
      setErrorMsg('Kata sandi minimal 6 karakter.');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('Anda harus menyetujui ketentuan dan regulasi MTQ.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);

      const result = await signUpWithEmailService(signUpEmail, signUpPassword, signUpName);

      const authenticatedUser: AuthUser = {
        uid: result.uid,
        email: result.email,
        displayName: signUpName,
        photoURL: null,
        role: signUpRole,
        asalKafilah: signUpKafilah,
        provider: 'password',
        createdAt: new Date().toISOString(),
      };

      setCurrentUser(authenticatedUser);
      setSuccessData({ user: authenticatedUser, isGoogle: false });
    } catch (err: unknown) {
      const e = err as { message?: string };
      setErrorMsg(e.message || 'Pendaftaran akun gagal. Silakan coba kembali.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Fill
  const handleQuickDemo = (roleChoice: UserRole, emailHint: string, name: string) => {
    setMode('signin');
    setSignInEmail(emailHint);
    setSignInPassword('simtq2026!');
    setErrorMsg(null);
  };

  return (
    <div className="relative min-h-[82vh] flex flex-col justify-center items-center py-6 sm:py-10 px-4">
      {/* Top Breadcrumb / Return Pill */}
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

      {/* Main 3D Tilt Card Wrapper */}
      <div className="w-full max-w-lg">
        <TiltCard3D className="p-6 sm:p-9">
          {/* Header Title with Sacred Particle Typography Burst */}
          <div className="mb-8">
            <AuthTitleBurst
              title={mode === 'signin' ? 'Masuk ke SIMTQ' : 'Daftar Akun Baru'}
              subtitle={
                mode === 'signin'
                  ? 'Akses terpadu pendaftaran, verifikasi, dan penilaian MTQ Provinsi Bengkulu'
                  : 'Buat akun Anda untuk berpartisipasi dalam ajang Musabaqah MTQ Bengkulu'
              }
              badge={
                mode === 'signin'
                  ? 'QUANTUM AUTH GATEWAY'
                  : 'REGISTRATION PORTAL'
              }
            />
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex p-1 bg-white/[0.04] rounded-full border border-white/[0.08] mb-7">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-medium rounded-full transition-all relative ${
                mode === 'signin' ? 'text-black font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {mode === 'signin' && (
                <motion.div
                  layoutId="auth-tab-pill"
                  className="absolute inset-0 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}
              <span className="relative z-10">1. Masuk (Sign In)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-medium rounded-full transition-all relative ${
                mode === 'signup' ? 'text-black font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {mode === 'signup' && (
                <motion.div
                  layoutId="auth-tab-pill"
                  className="absolute inset-0 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}
              <span className="relative z-10">2. Buat Akun (Sign Up)</span>
            </button>
          </div>

          {/* Error Banner */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 p-3 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-xs"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span className="flex-1">{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 1. Feature 4: Magnetic "Sign in with Google" Button */}
          <div className="mb-6 flex justify-center">
            <MagneticButton
              type="button"
              disabled={loading}
              onClick={handleGoogleSignIn}
              strength={0.3}
              className="w-full py-3.5 px-5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-[#00FF87]/50 text-white font-medium text-xs sm:text-sm shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all group overflow-hidden"
            >
              {/* Subtle neon glow trace */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-[#00FF87]/10 to-transparent transition-opacity pointer-events-none" />

              <div className="flex items-center justify-center gap-3 relative z-10">
                {/* Official Google 'G' SVG Logo */}
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
                  {loading ? 'Memproses Akun Google...' : 'Lanjutkan dengan Google'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00FF87]/15 text-[#00FF87] border border-[#00FF87]/30 hidden sm:inline-block">
                  INSTANT
                </span>
              </div>
            </MagneticButton>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <span className="relative z-10 px-3 bg-[#0d0f17] text-[11px] font-mono uppercase tracking-widest text-zinc-400">
              atau gunakan surel
            </span>
          </div>

          {/* Form Content */}
          <AnimatePresence mode="wait">
            {mode === 'signin' ? (
              <motion.form
                key="signin-form"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleEmailSignIn}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="nama@kafilah.bengkulu.go.id"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#00FF87]/60 focus:bg-white/[0.07] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-medium text-zinc-300">Kata Sandi</label>
                    <button
                      type="button"
                      onClick={() =>
                        alert(
                          'Untuk keamanan simulasi demo, gunakan kata sandi apapun dengan panjang minimal 6 karakter, atau pilih salah satu demo login di bawah.'
                        )
                      }
                      className="text-[11px] text-[#00FF87] hover:underline"
                    >
                      Lupa kata sandi?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#00FF87]/60 focus:bg-white/[0.07] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-zinc-400 hover:text-zinc-300">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-[#00FF87]"
                    />
                    <span>Ingat sesi masuk di perangkat ini</span>
                  </label>
                </div>

                {/* Magnetic Submit Button */}
                <div className="pt-2">
                  <MagneticButton
                    type="submit"
                    disabled={loading}
                    strength={0.35}
                    className="w-full py-3 px-5 rounded-xl bg-[#00FF87] hover:bg-[#00FF87]/90 text-black font-semibold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(0,255,135,0.4)] transition-all flex items-center justify-center gap-2"
                  >
                    <span>{loading ? 'Memverifikasi...' : 'Masuk ke Portal SIMTQ'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </MagneticButton>
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="signup-form"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleEmailSignUp}
                className="space-y-3.5"
              >
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Nama Lengkap (Sesuai KTP/KK)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      placeholder="Ahmad Fauzan Rabbani"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#00FF87]/60 focus:bg-white/[0.07] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Alamat Email Aktif
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="peserta@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#00FF87]/60 focus:bg-white/[0.07] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Peran Pengguna
                    </label>
                    <select
                      value={signUpRole}
                      onChange={(e) => setSignUpRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#12151e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#00FF87]/60"
                    >
                      <option value="peserta">👤 Peserta MTQ</option>
                      <option value="official">🏢 Official Kafilah</option>
                      <option value="juri">⚖️ Dewan Hakim</option>
                      <option value="admin">⚙️ Admin Pusat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Asal Kafilah
                    </label>
                    <select
                      value={signUpKafilah}
                      onChange={(e) => setSignUpKafilah(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#12151e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#00FF87]/60"
                    >
                      {DAFTAR_KAFILAH.map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Kata Sandi Akun
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#00FF87]/60 focus:bg-white/[0.07] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-zinc-400 leading-snug">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-3.5 h-3.5 mt-0.5 rounded border-white/20 bg-white/5 accent-[#00FF87]"
                    />
                    <span>
                      Saya menyetujui integritas data dan peraturan Lomba MTQ Tingkat Provinsi Bengkulu 2026.
                    </span>
                  </label>
                </div>

                {/* Magnetic Submit Button */}
                <div className="pt-2">
                  <MagneticButton
                    type="submit"
                    disabled={loading}
                    strength={0.35}
                    className="w-full py-3 px-5 rounded-xl bg-[#00FF87] hover:bg-[#00FF87]/90 text-black font-semibold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(0,255,135,0.4)] transition-all flex items-center justify-center gap-2"
                  >
                    <span>{loading ? 'Mendaftarkan...' : 'Daftarkan Akun SIMTQ'}</span>
                    <Sparkles className="w-4 h-4" />
                  </MagneticButton>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Quick Demo Acccount Pill Buttons */}
          <div className="mt-8 pt-6 border-t border-white/[0.06]">
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-2.5 text-center">
              AKSES CEPAT DEMO ROLE:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() =>
                  handleQuickDemo(
                    'official',
                    'official.bengkulu@simtq.id',
                    'H. Rahmat Hidayat (Official Kota)'
                  )
                }
                className="px-2 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-[11px] text-zinc-300 hover:text-white transition-colors"
              >
                🏢 Official
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickDemo(
                    'peserta',
                    'peserta.tilawah@simtq.id',
                    'Ahmad Fauzan Rabbani'
                  )
                }
                className="px-2 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-[11px] text-zinc-300 hover:text-white transition-colors"
              >
                👤 Peserta
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickDemo(
                    'admin',
                    'admin.lptq@bengkulu.go.id',
                    'Admin Sekretariat LPTQ'
                  )
                }
                className="px-2 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-[11px] text-zinc-300 hover:text-white transition-colors"
              >
                ⚙️ Admin
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickDemo(
                    'juri',
                    'dewan.hakim@simtq.id',
                    'KH. Mahmud Syakir (Dewan Hakim)'
                  )
                }
                className="px-2 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-[11px] text-zinc-300 hover:text-white transition-colors"
              >
                ⚖️ Hakim
              </button>
            </div>
          </div>
        </TiltCard3D>
      </div>

      {/* Success Modal Notification with Auto-redirect */}
      <AnimatePresence>
        {successData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm rounded-3xl bg-[#0d0f17] border border-[#00FF87]/40 shadow-[0_20px_60px_rgba(0,255,135,0.2)] p-6 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#00FF87]/15 border border-[#00FF87]/30 text-[#00FF87] flex items-center justify-center mx-auto mb-4 shadow-[0_0_25px_rgba(0,255,135,0.4)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <span className="inline-block px-3 py-1 rounded-full bg-[#00FF87]/10 text-[#00FF87] text-[10px] font-mono tracking-wider uppercase mb-2">
                OTENTIKASI BERHASIL
              </span>

              <h3 className="text-lg font-bold text-white mb-1">
                Selamat Datang, {successData.user.displayName}!
              </h3>

              <p className="text-xs text-zinc-400 mb-6">
                {successData.isGoogle
                  ? 'Akun Google Anda berhasil diverifikasi. Mengarahkan Anda ke modul sistem...'
                  : 'Sesi masuk aktif. Menuju dashboard terpilih...'}
              </p>

              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3.5 mb-6 text-left space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Email:</span>
                  <span className="text-zinc-200 font-mono text-[11px]">
                    {successData.user.email}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Peran Sistem:</span>
                  <span className="text-[#00FF87] uppercase font-mono text-[11px] font-bold">
                    {successData.user.role}
                  </span>
                </div>
                {successData.user.asalKafilah && (
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Kafilah:</span>
                    <span className="text-zinc-200 text-[11px]">
                      {successData.user.asalKafilah}
                    </span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setRole(successData.user.role || 'public');
                  setSuccessData(null);
                }}
                className="w-full py-3 rounded-full bg-[#00FF87] hover:bg-[#00FF87]/90 text-black font-bold text-xs uppercase tracking-wider transition-colors shadow-[0_0_20px_rgba(0,255,135,0.4)]"
              >
                Buka Modul Sekarang
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
