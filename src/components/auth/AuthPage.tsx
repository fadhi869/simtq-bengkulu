import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { signInWithGoogleService } from '../../services/firebase';
import { TiltCard3D } from './TiltCard3D';
import { AuthTitleBurst } from './AuthTitleBurst';
import { MagneticButton } from './MagneticButton';
import {
  Lock,
  User,
  KeyRound,
  Eye,
  EyeOff,
  RefreshCw,
  XCircle,
  CheckCircle2,
  AlertCircle,
  LogIn,
  ShieldCheck,
  Users,
  Award,
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const {
    setRole,
    loginAdmin,
    loginOfficial,
    loginHakim,
    loginPesertaWithGoogle,
    calonPesertaList,
  } = useApp();

  // Form Fields
  const [username, setUsername] = useState('adminBengkulu');
  const [password, setPassword] = useState('rahasiaAdmin2026');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('Ps ds');

  // UI States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Generate random captcha
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let code1 = '';
    let code2 = '';
    for (let i = 0; i < 2; i++) {
      code1 += chars.charAt(Math.floor(Math.random() * chars.length));
      code2 += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(`${code1} ${code2}`);
    setCaptchaInput('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validate captcha (case-insensitive, ignore spaces)
    const cleanInput = captchaInput.replace(/\s+/g, '').toLowerCase();
    const cleanTarget = captchaCode.replace(/\s+/g, '').toLowerCase();

    if (cleanInput !== cleanTarget) {
      setErrorMsg('Kode Captcha salah! Silakan masukkan huruf yang tertera pada kotak verifikasi.');
      generateCaptcha();
      return;
    }

    if (!username.trim() || !password) {
      setErrorMsg('Harap masukkan Username dan Password.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // 1. Try Admin
      const adminRes = loginAdmin(username.trim(), password);
      if (adminRes.success) {
        setSuccessMsg(adminRes.message);
        setTimeout(() => setRole('admin'), 600);
        setLoading(false);
        return;
      }

      // 2. Try Official
      const officialRes = loginOfficial(username.trim(), password);
      if (officialRes.success) {
        setSuccessMsg(officialRes.message);
        setTimeout(() => setRole('official'), 600);
        setLoading(false);
        return;
      }

      // 3. Try Hakim
      const hakimRes = loginHakim(username.trim(), password);
      if (hakimRes.success) {
        setSuccessMsg(hakimRes.message);
        setTimeout(() => setRole('escoring'), 600);
        setLoading(false);
        return;
      }

      setErrorMsg('Kredensial tidak valid. Silakan cek kembali username dan password Anda.');
      setLoading(false);
      generateCaptcha();
    }, 400);
  };

  const handleGoogleLoginPeserta = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const googleResult = await signInWithGoogleService();
      const validation = loginPesertaWithGoogle(
        googleResult.email,
        googleResult.displayName,
        googleResult.photoURL
      );

      if (validation.success) {
        setSuccessMsg(validation.message);
        setTimeout(() => setRole('peserta'), 800);
      } else {
        setErrorMsg(validation.message);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal melakukan login Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 sm:py-12 flex flex-col items-center justify-center min-h-[82vh]">
      {/* 3D Tilt Card Wrapping the Exact Split Layout of Gambar 4 */}
      <TiltCard3D className="w-full max-w-4xl shadow-2xl rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0e1017]">
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
          {/* SISI KIRI: MTQ LOGO EMBLEM & ISLAMIC ORNAMENT (GAMBAR 4) */}
          <div className="md:col-span-5 bg-gradient-to-br from-[#044e31] via-[#065f3d] to-[#033621] p-8 flex flex-col items-center justify-center relative overflow-hidden text-center text-white select-none">
            {/* Geometric Background Overlay */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
              }}
            />

            {/* Glowing Aura Ring */}
            <div className="absolute w-72 h-72 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />

            {/* Emblem MTQ Vector Graphics (Gambar 4) */}
            <div className="relative z-10 space-y-4">
              <div className="w-48 h-56 mx-auto relative flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-emerald-300/30 backdrop-blur-md shadow-[0_0_35px_rgba(0,255,135,0.25)]">
                {/* SVG MTQ Emblem */}
                <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-xl" fill="none">
                  {/* Outer Shield Outline */}
                  <path
                    d="M100 10 L180 80 L180 160 C180 200 100 230 100 230 C100 230 20 200 20 160 L20 80 Z"
                    stroke="#f59e0b"
                    strokeWidth="4"
                    fill="#044e31"
                  />
                  <path
                    d="M100 22 L168 83 L168 155 C168 190 100 216 100 216 C100 216 32 190 32 155 L32 83 Z"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    fill="#033621"
                  />

                  {/* Mosque Dome & Star */}
                  <path d="M100 45 C85 65 75 80 100 95 C125 80 115 65 100 45 Z" fill="#fbbf24" />
                  <circle cx="100" cy="38" r="4" fill="#fbbf24" />

                  {/* Open Al-Qur'an Rehal */}
                  <path
                    d="M60 115 Q100 130 100 155 Q100 130 140 115 L140 140 Q100 155 100 175 Q100 155 60 140 Z"
                    fill="#34d399"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />

                  {/* Ribbon Banner with MTQ text */}
                  <path
                    d="M40 185 L100 178 L160 185 L150 205 L100 198 L50 205 Z"
                    fill="#f59e0b"
                    stroke="#b45309"
                    strokeWidth="1.5"
                  />
                  <text
                    x="100"
                    y="196"
                    textAnchor="middle"
                    fill="#064e3b"
                    fontSize="16"
                    fontWeight="900"
                    fontFamily="serif"
                    letterSpacing="3"
                  >
                    MTQ
                  </text>
                </svg>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono tracking-widest uppercase text-emerald-300 font-bold">
                  SISTEM INFORMASI TERPADU
                </span>
                <h3 className="text-xl font-bold font-serif tracking-tight text-white">
                  LPTQ PROVINSI BENGKULU
                </h3>
                <p className="text-xs text-emerald-100/80 max-w-[220px] mx-auto leading-relaxed">
                  Musabaqah Tilawatil Qur'an Tingkat Provinsi Bengkulu 2026
                </p>
              </div>
            </div>
          </div>

          {/* SISI KANAN: FORM LOGIN & CAPTCHA (GAMBAR 4) */}
          <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-white dark:bg-[#0e1017]">
            {/* 3 Header Logos (Kemenag, Pemprov Bengkulu, LPTQ) */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-xs font-bold text-emerald-700 shadow-sm">
                🏛️
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-xs font-bold text-amber-700 shadow-sm">
                ⭐
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-xs font-bold text-emerald-600 shadow-sm">
                📖
              </div>
            </div>

            {/* Sacred Typography Burst on Title */}
            <div className="text-center mb-6 space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                <AuthTitleBurst text="e-MTQ Nasional 2026" />
              </h2>
              <div className="text-xs text-slate-500 dark:text-zinc-400 leading-snug space-y-0.5">
                <p>Pendaftaran Online Dewan Hakim</p>
                <p>Pendaftaran Online Peserta</p>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                  MTQ Tingkat Nasional XXXI & Provinsi Bengkulu
                </p>
              </div>
            </div>

            {/* Alert Message */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}

              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Inputs (Gambar 4) */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Field 1: Username with green user icon */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded bg-[#10b981] text-white flex items-center justify-center">
                  <User className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="adminBengkulu"
                  className="w-full pl-11 pr-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  required
                />
              </div>

              {/* Field 2: Password with key icon and toggle eye */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded bg-[#10b981] text-white flex items-center justify-center">
                  <KeyRound className="w-3.5 h-3.5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-11 pr-10 py-2.5 rounded-lg border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] text-xs font-mono text-slate-800 dark:text-white outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Field 3: Captcha Box (Wavy lines & refresh button, Gambar 4) */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 h-11 bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-lg overflow-hidden flex items-center justify-center select-none shadow-inner">
                  {/* Decorative wavy lines */}
                  <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
                    <path
                      d="M0 15 Q 40 30, 80 15 T 160 15 T 240 15"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                    />
                    <path
                      d="M0 25 Q 50 10, 100 25 T 200 25 T 300 25"
                      fill="none"
                      stroke="#64748b"
                      strokeWidth="1.5"
                    />
                  </svg>
                  <span className="font-serif italic font-bold text-2xl tracking-widest text-slate-800 dark:text-zinc-100 select-all">
                    {captchaCode}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-slate-300 dark:border-white/10 text-xs font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="hidden sm:inline">Refresh Captcha</span>
                </button>
              </div>

              {/* Field 4: Captcha Input */}
              <div>
                <input
                  type="text"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  placeholder="Ketik kode Captcha di atas..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-emerald-500 focus:bg-white transition-all text-center tracking-wider"
                  required
                />
              </div>

              {/* Buttons: Batal & MASUK (Gambar 4) */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRole('public')}
                  className="w-full py-2.5 rounded-lg bg-[#ef4444] hover:bg-[#dc2626] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Batal</span>
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-[#065f3d] hover:bg-[#044e31] text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{loading ? 'Memvalidasi...' : 'MASUK'}</span>
                </button>
              </div>
            </form>

            {/* Quick Test Accounts Switcher */}
            <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/10 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block text-center">
                PILIHAN AKUN UJI COBA CEPAT (1-KLIK ISI):
              </span>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setUsername('adminBengkulu');
                    setPassword('rahasiaAdmin2026');
                    setCaptchaInput(captchaCode);
                  }}
                  className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 text-[11px] font-medium text-center transition-all flex flex-col items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>1. Admin Bengkulu</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUsername('official_bengkulu');
                    setPassword('officialSmtq2026');
                    setCaptchaInput(captchaCode);
                  }}
                  className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 hover:bg-blue-500/20 text-[11px] font-medium text-center transition-all flex flex-col items-center gap-1"
                >
                  <Users className="w-3.5 h-3.5 text-blue-500" />
                  <span>2. Official Kafilah</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUsername('hakim_bengkulu');
                    setPassword('hakimSmtq2026');
                    setCaptchaInput(captchaCode);
                  }}
                  className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20 text-[11px] font-medium text-center transition-all flex flex-col items-center gap-1"
                >
                  <Award className="w-3.5 h-3.5 text-purple-500" />
                  <span>3. Dewan Hakim</span>
                </button>
              </div>

              {/* Login Peserta with Google Auth */}
              <div className="pt-2 text-center">
                <MagneticButton
                  onClick={handleGoogleLoginPeserta}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-white/10 hover:border-emerald-500/50 bg-slate-50 dark:bg-white/[0.04] text-xs font-semibold text-slate-700 dark:text-zinc-200 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                  <span>Khusus Peserta: Masuk dengan Google</span>
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </TiltCard3D>
    </div>
  );
};
