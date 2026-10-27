import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { CABANG_DAN_GOLONGAN, DAFTAR_KAFILAH, MIMBAR_LIST } from '../../data/constants';
import { LiveParticipantCard3D } from './LiveParticipantCard3D';
import { SacredTypographyBurst } from './SacredTypographyBurst';
import {
  Radio,
  Filter,
  Lock,
  ChevronRight,
  Search,
  Volume2,
  Sparkles,
  LogIn,
  Flag,
  MessageCircle,
  Calendar,
  Building,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  Monitor,
} from 'lucide-react';

export const PublicHome: React.FC = () => {
  const { getLeaderboard, getActivePesertaTampil, setRole, mtqEvents, setSelectedEvent } = useApp();

  // Filters for Pilih Event (Gambar 5)
  const [eventSearch, setEventSearch] = useState('');
  const [filterTingkat, setFilterTingkat] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');

  // Filters for Leaderboard
  const [selectedCabang, setSelectedCabang] = useState<string>('');
  const [selectedGolongan, setSelectedGolongan] = useState<string>('');
  const [selectedKafilah, setSelectedKafilah] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activePesertaList = getActivePesertaTampil();
  const rawLeaderboard = getLeaderboard(
    selectedCabang || undefined,
    selectedGolongan || undefined,
    selectedKafilah || undefined
  );

  const leaderboard = rawLeaderboard.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.peserta.namaLengkap.toLowerCase().includes(q) ||
      item.peserta.asalKafilah.toLowerCase().includes(q) ||
      item.peserta.cabang.toLowerCase().includes(q) ||
      item.peserta.golongan.toLowerCase().includes(q)
    );
  });

  const filteredEvents = mtqEvents.filter((evt) => {
    if (filterTingkat && evt.tingkat !== filterTingkat) return false;
    if (filterStatus !== 'Semua' && evt.status !== filterStatus) return false;
    if (eventSearch.trim()) {
      const q = eventSearch.toLowerCase();
      return evt.nama.toLowerCase().includes(q) || evt.wilayah.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-20 pb-24">
      {/* 1. HERO SECTION (GAMBAR 5) WITH QUANTUM ZERO-GRAVITY AESTHETICS */}
      <section className="relative pt-6 sm:pt-12 pb-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#022c22] text-white p-8 sm:p-14 shadow-2xl relative overflow-hidden border border-emerald-400/20">
          {/* Subtle Ambient Radial Lighting & Pattern */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00FF87]/15 blur-[120px] rounded-full pointer-events-none" />
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Typography Burst & CTAs */}
            <div className="lg:col-span-8 space-y-6 text-left">
              {/* Badge Kemenag */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-emerald-200 text-xs font-medium backdrop-blur-md"
              >
                <span className="w-2 h-2 rounded-full bg-[#fbbf24] shadow-[0_0_8px_#fbbf24]" />
                <span>Kementerian Agama RI • LPTQ Bengkulu</span>
              </motion.div>

              {/* Title with Sacred Typography Burst */}
              <div className="space-y-2">
                <SacredTypographyBurst />
              </div>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-emerald-100/90 max-w-xl leading-relaxed">
                Satu platform terintegrasi untuk pendaftaran peserta, verifikasi dokumen kependudukan, penilaian digital dewan hakim, dan live scoring MTQ seluruh Indonesia.
              </p>

              {/* CTAs matching Gambar 5 */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    document.getElementById('pilih-event')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-slate-900 font-bold text-xs shadow-lg transition-all flex items-center gap-2"
                >
                  <Flag className="w-4 h-4 fill-slate-900" />
                  <span>MTQ Nasional & Bengkulu</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setRole('auth')}
                  className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs backdrop-blur-md transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Portal Masuk Official</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    document.getElementById('live-arena')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-3 rounded-full bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-400/30 font-semibold text-xs backdrop-blur-md transition-all flex items-center gap-2"
                >
                  <Radio className="w-4 h-4 animate-pulse text-[#00FF87]" />
                  <span>Live Arena Skor</span>
                </motion.button>
              </div>
            </div>

            {/* Right Column: Poster Graphic (Gambar 5) */}
            <div className="lg:col-span-4 flex justify-center">
              <motion.div
                whileHover={{ rotateY: 8, rotateX: -6, scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-64 h-80 rounded-2xl bg-gradient-to-b from-[#032d1e] to-[#011a11] border-2 border-amber-400/40 p-4 shadow-2xl flex flex-col items-center justify-between text-center relative select-none"
              >
                <div className="text-[10px] font-mono tracking-widest text-amber-300 uppercase">
                  مسابقة تلاوة القرآن
                </div>

                {/* Calligraphy Ornament */}
                <div className="w-40 h-40 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center p-3 shadow-inner">
                  <div className="text-center space-y-1">
                    <span className="font-serif text-3xl font-bold text-amber-400 block drop-shadow-md">
                      القرآن الكريم
                    </span>
                    <span className="text-[10px] tracking-widest font-mono text-emerald-300 uppercase block font-bold">
                      MUSABAQAH
                    </span>
                    <span className="text-xs font-bold text-white tracking-wider block">
                      TILAWATIL QUR'AN
                    </span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <p className="font-mono text-xs font-bold text-amber-300 tracking-wider">
                    2026 • 1447 H
                  </p>
                  <p className="text-[10px] text-zinc-300">
                    Bumi Rafflesia yang Qur'ani
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION: PILIH EVENT (EXACT RECREATION OF GAMBAR 5) */}
      <section id="pilih-event" className="scroll-mt-24 space-y-6">
        <div className="text-center space-y-1.5 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Pilih Event
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
            Temukan dan masuk ke portal event MTQ Anda
          </p>
        </div>

        {/* Filter Card (Gambar 5) */}
        <div className="ag-card p-5 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Cari Event */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider">
                CARI EVENT
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  placeholder="Ketik nama event..."
                  className="w-full pl-9 ag-input"
                />
              </div>
            </div>

            {/* Tingkat */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider">
                TINGKAT
              </label>
              <select
                value={filterTingkat}
                onChange={(e) => setFilterTingkat(e.target.value)}
                className="w-full ag-input"
              >
                <option value="">Semua Tingkat</option>
                <option value="Nasional">Nasional</option>
                <option value="Provinsi">Provinsi</option>
                <option value="Kab/Kota">Kab/Kota</option>
              </select>
            </div>

            {/* Tahun */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider">
                TAHUN
              </label>
              <select className="w-full ag-input">
                <option value="2026">2026</option>
                <option value="2025">2025</option>
              </select>
            </div>

            {/* Wilayah */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider">
                WILAYAH
              </label>
              <select className="w-full ag-input">
                <option value="">Semua Wilayah</option>
                <option value="Bengkulu">Bengkulu</option>
                <option value="Sumatera">Sumatera</option>
                <option value="Jawa">Jawa</option>
              </select>
            </div>
          </div>

          {/* Status Tab Pills (Gambar 5) */}
          <div className="pt-2 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 uppercase mr-1">
              STATUS:
            </span>
            {['Semua', 'Berlangsung', 'Persiapan', 'Selesai'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  filterStatus === s
                    ? 'bg-[#064e3b] text-white font-semibold'
                    : 'bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Event Cards List (Gambar 5) */}
        <div className="space-y-3">
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
            {filteredEvents.length} event ditemukan
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map((evt) => (
              <motion.div
                key={evt.id}
                whileHover={{ y: -3 }}
                className="ag-card p-5 space-y-4 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold font-serif">
                      🕌
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                        {evt.nama}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono mt-0.5">
                        {evt.tanggal}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/[0.04] text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase">
                      {evt.tingkat}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        evt.status === 'Berlangsung'
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : evt.status === 'Persiapan'
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                          : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-zinc-400'
                      }`}
                    >
                      {evt.status}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedEvent(evt);
                      document.getElementById('live-arena')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 3 Core Features (Gambar 5 Bottom) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6">
          {/* Feature 1 */}
          <div
            onClick={() => setRole('peserta')}
            className="ag-card p-6 text-center space-y-3 cursor-pointer hover:border-emerald-500/50 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <UserCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Pendaftaran</h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              Registrasi peserta & dewan hakim dengan verifikasi NIK dan berkas terintegrasi.
            </p>
          </div>

          {/* Feature 2 */}
          <div
            onClick={() => setRole('escoring')}
            className="ag-card p-6 text-center space-y-3 cursor-pointer hover:border-emerald-500/50 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Monitor className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">e-Scoring</h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              Penilaian digital langsung dari perangkat hakim per bidang dan mimbar.
            </p>
          </div>

          {/* Feature 3 */}
          <div
            onClick={() => {
              document.getElementById('papan-skor')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="ag-card p-6 text-center space-y-3 cursor-pointer hover:border-emerald-500/50 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Radio className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Live Score</h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              Hasil penilaian real-time transparan untuk penonton, official, dan media.
            </p>
          </div>
        </div>
      </section>

      {/* 3. LIVE DASHBOARD ARENA WITH 3D TILT EFFECT & GLASS SHEEN */}
      <section id="live-arena" className="scroll-mt-28 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 dark:border-white/[0.08] pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#00FF87] animate-pulse shadow-[0_0_8px_#00FF87]" />
              <span className="text-[11px] font-mono tracking-widest uppercase text-emerald-600 dark:text-[#00FF87] font-bold">
                PANGGUNG UTAMA / LIVE ARENA MIMBAR
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Peserta Sedang Tampil
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 px-3.5 py-1.5 rounded-full">
            <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00FF87]" />
            <span>Audio & Penilaian Majelis Aktif (60fps Quantum Interactive)</span>
          </div>
        </div>

        {activePesertaList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activePesertaList.map((peserta) => (
              <LiveParticipantCard3D key={peserta.id} peserta={peserta} />
            ))}
          </div>
        ) : (
          <div className="ag-card p-12 text-center max-w-lg mx-auto space-y-3">
            <Radio className="w-8 h-8 text-slate-400 dark:text-zinc-600 mx-auto" />
            <h4 className="text-sm font-semibold text-slate-800 dark:text-zinc-300">
              Tidak Ada Peserta di Atas Mimbar
            </h4>
            <p className="text-xs text-slate-500 dark:text-zinc-500 leading-relaxed">
              Majelis Hakim sedang menunggu panggilan sesi berikutnya oleh Admin atau mimbar sedang dalam jeda istirahat.
            </p>
          </div>
        )}
      </section>

      {/* 4. PAPAN SKOR / LEADERBOARD */}
      <section id="papan-skor" className="scroll-mt-28 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-white/[0.08] pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono tracking-widest uppercase text-slate-500 dark:text-zinc-400">
                PAPAN SKOR RESMI
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Leaderboard Penilaian MTQ Bengkulu
            </h2>
          </div>

          <div className="text-xs font-mono text-slate-500 dark:text-zinc-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Urutan Real-Time Nilai Tertinggi</span>
          </div>
        </div>

        {/* Minimalist Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <div>
            <select
              value={selectedCabang}
              onChange={(e) => {
                setSelectedCabang(e.target.value);
                setSelectedGolongan('');
              }}
              className="w-full ag-input text-xs"
            >
              <option value="">Semua Cabang Lomba</option>
              {Object.keys(CABANG_DAN_GOLONGAN).map((cabang) => (
                <option key={cabang} value={cabang}>
                  {cabang}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedGolongan}
              onChange={(e) => setSelectedGolongan(e.target.value)}
              disabled={!selectedCabang}
              className="w-full ag-input text-xs disabled:opacity-50"
            >
              <option value="">
                {selectedCabang ? 'Semua Golongan' : 'Pilih Cabang Dahulu'}
              </option>
              {selectedCabang &&
                CABANG_DAN_GOLONGAN[selectedCabang]?.map((gol) => (
                  <option key={gol} value={gol}>
                    {gol}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <select
              value={selectedKafilah}
              onChange={(e) => setSelectedKafilah(e.target.value)}
              className="w-full ag-input text-xs"
            >
              <option value="">Semua Kafilah Daerah</option>
              {DAFTAR_KAFILAH.map((kafilah) => (
                <option key={kafilah} value={kafilah}>
                  {kafilah}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari peserta / kafilah..."
              className="w-full pl-9 ag-input text-xs"
            />
          </div>
        </div>

        {/* Leaderboard Table List */}
        <div className="space-y-2.5">
          {leaderboard.length > 0 ? (
            leaderboard.map((item) => (
              <div
                key={item.peserta.id}
                className="ag-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-500/40 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0 ${
                      item.peringkat === 1
                        ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : item.peringkat === 2
                        ? 'bg-slate-300/20 text-slate-400 border border-slate-300/30'
                        : item.peringkat === 3
                        ? 'bg-amber-700/20 text-amber-600 border border-amber-700/30'
                        : 'bg-slate-100 dark:bg-white/[0.04] text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-white/5'
                    }`}
                  >
                    #{item.peringkat}
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {item.peserta.namaLengkap}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Kafilah: <strong>{item.peserta.asalKafilah}</strong> • Cabang: {item.peserta.cabang} ({item.peserta.golongan})
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-white/[0.04]">
                  {item.penilaian?.catatan && (
                    <div className="hidden sm:block text-right font-mono text-[10px] text-slate-500 dark:text-zinc-400 max-w-[220px] truncate">
                      <span className="text-slate-400 dark:text-zinc-500 block text-[9px] uppercase">Catatan Lomba:</span>
                      <span className="text-slate-700 dark:text-zinc-300 italic">"{item.penilaian.catatan}"</span>
                    </div>
                  )}

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase block">
                      Total Nilai
                    </span>
                    <span className="text-xl sm:text-2xl font-mono font-bold text-emerald-600 dark:text-[#00FF87]">
                      {item.nilaiAkhir.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="ag-card p-10 text-center text-xs text-slate-500 dark:text-zinc-500">
              Tidak ada data penilaian yang cocok dengan filter yang dipilih.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
