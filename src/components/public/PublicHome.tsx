import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { CABANG_DAN_GOLONGAN, DAFTAR_KAFILAH, MIMBAR_LIST } from '../../data/constants';
import { LiveParticipantCard3D } from './LiveParticipantCard3D';
import {
  Radio,
  Filter,
  Lock,
  ChevronRight,
  Search,
  Volume2,
  Sparkles,
} from 'lucide-react';

export const PublicHome: React.FC = () => {
  const { getLeaderboard, getActivePesertaTampil, setRole } = useApp();

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

  // Staggered words for Feature 4: "Musabaqah Tilawatil Qur'an Provinsi Bengkulu"
  const line1Words = ['Musabaqah', 'Tilawatil', "Qur'an"];
  const line2Words = ['Provinsi', 'Bengkulu'];

  return (
    <div className="space-y-24 pb-24">
      {/* 1. HERO SECTION WITH QUANTUM ZERO-GRAVITY STAGGERED REVEAL & INTERACTIVE BUTTONS */}
      <section className="relative pt-12 sm:pt-16 pb-6 text-center max-w-4xl mx-auto space-y-7">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#00FF87]/[0.06] blur-[130px] rounded-full pointer-events-none -z-10" />

        {/* Overline Tag with smooth fade-in */}
        <motion.div
          initial={{ opacity: 0, y: -15, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-zinc-300 text-[11px] font-mono tracking-wider uppercase backdrop-blur-md"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87] shadow-[0_0_8px_#00FF87]" />
          <span>MTQ Ke-XXXVI Tingkat Provinsi Bengkulu</span>
        </motion.div>

        {/* FEATURE 4: STAGGERED REVEAL ON LOAD WITH BLUR FILTER (10px -> 0px) */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12]">
          {/* Line 1: Musabaqah Tilawatil Qur'an */}
          <div className="flex flex-wrap justify-center gap-x-3 sm:gap-x-4">
            {line1Words.map((word, index) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block"
              >
                {word}
              </motion.span>
            ))}
          </div>

          {/* Line 2: Provinsi Bengkulu (with refined gradient) */}
          <div className="flex flex-wrap justify-center gap-x-3 sm:gap-x-4 mt-1">
            {line2Words.map((word, index) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.8,
                  delay: 0.36 + index * 0.14,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block bg-gradient-to-r from-zinc-100 via-zinc-300 to-[#00FF87] bg-clip-text text-transparent"
              >
                {word}
              </motion.span>
            ))}
          </div>
        </h1>

        {/* Subtitle with soft fade in */}
        <motion.p
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal"
        >
          Portal terpadu pendaftaran kafilah 10 kabupaten/kota, verifikasi berkas berjenjang, pengundian nomor urut tampil transparan, dan penilaian real-time Dewan Hakim.
        </motion.p>

        {/* FEATURE 5: EFEK INTERACTIVE HOVER TOMBOL (LIFT UP, SCALE, NEON GREEN GLOW) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-3.5 pt-3"
        >
          {/* Button 1: Live Arena Mimbar */}
          <motion.button
            whileHover={{
              y: -4,
              scale: 1.04,
              boxShadow: '0 0 30px rgba(0, 255, 135, 0.45)',
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={() => {
              document.getElementById('live-arena')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold text-xs transition-colors"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Live Arena Mimbar</span>
          </motion.button>

          {/* Button 2: Papan Skor Terkini */}
          <motion.button
            whileHover={{
              y: -4,
              scale: 1.04,
              boxShadow: '0 0 25px rgba(0, 255, 135, 0.35)',
              borderColor: 'rgba(0, 255, 135, 0.6)',
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={() => {
              document.getElementById('papan-skor')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.05] text-zinc-200 hover:text-white hover:bg-white/[0.1] font-medium text-xs border border-white/10 backdrop-blur-md transition-colors"
          >
            <span>Papan Skor Terkini</span>
          </motion.button>

          {/* Button 3: Registrasi Peserta */}
          <motion.button
            whileHover={{
              y: -4,
              scale: 1.04,
              boxShadow: '0 0 25px rgba(0, 255, 135, 0.35)',
              borderColor: 'rgba(0, 255, 135, 0.6)',
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={() => setRole('peserta')}
            className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-white/[0.03] text-zinc-300 hover:text-white border border-white/[0.08] font-medium text-xs backdrop-blur-md transition-colors"
          >
            <span>Registrasi Peserta</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#00FF87]" />
          </motion.button>
        </motion.div>
      </section>

      {/* 2. LIVE DASHBOARD ARENA WITH FEATURE 3: 3D TILT EFFECT & GLASS SHEEN */}
      <section id="live-arena" className="scroll-mt-28 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/[0.08] pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#00FF87] animate-pulse shadow-[0_0_8px_#00FF87]" />
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#00FF87]">
                PANGGUNG UTAMA / LIVE ARENA
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Peserta Sedang Tampil
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-white/[0.02] border border-white/10 px-3.5 py-1.5 rounded-full">
            <Volume2 className="w-3.5 h-3.5 text-[#00FF87]" />
            <span>Audio & Penilaian Majelis Aktif (60fps Interactive)</span>
          </div>
        </div>

        {activePesertaList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activePesertaList.map((peserta) => (
              <LiveParticipantCard3D
                key={peserta.id}
                peserta={peserta}
                onOpenJuri={() => setRole('juri')}
              />
            ))}
          </div>
        ) : (
          <div className="ag-card p-12 text-center max-w-lg mx-auto space-y-3">
            <Radio className="w-8 h-8 text-zinc-600 mx-auto" />
            <h4 className="text-sm font-semibold text-zinc-300">
              Tidak Ada Peserta di Atas Mimbar
            </h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Majelis Hakim sedang menunggu panggilan sesi berikutnya oleh Admin Pusat atau mimbar sedang dalam jeda istirahat.
            </p>
          </div>
        )}
      </section>

      {/* 3. PAPAN SKOR / LEADERBOARD (TERURUT NILAI TERTINGGI KE TERENDAH) */}
      <section id="papan-skor" className="scroll-mt-28 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/[0.08] pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-400">
                PAPAN SKOR RESMI
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Leaderboard Penilaian MTQ
            </h2>
          </div>

          <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Urutan Real-Time Nilai Tertinggi</span>
          </div>
        </div>

        {/* Minimalist Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Cabang */}
          <div>
            <select
              value={selectedCabang}
              onChange={(e) => {
                setSelectedCabang(e.target.value);
                setSelectedGolongan('');
              }}
              className="w-full ag-input text-xs"
            >
              <option value="" className="bg-[#10121a]">Semua Cabang Lomba</option>
              {Object.keys(CABANG_DAN_GOLONGAN).map((cabang) => (
                <option key={cabang} value={cabang} className="bg-[#10121a]">
                  {cabang}
                </option>
              ))}
            </select>
          </div>

          {/* Golongan */}
          <div>
            <select
              value={selectedGolongan}
              onChange={(e) => setSelectedGolongan(e.target.value)}
              disabled={!selectedCabang}
              className="w-full ag-input text-xs disabled:opacity-50"
            >
              <option value="" className="bg-[#10121a]">
                {selectedCabang ? 'Semua Golongan' : 'Pilih Cabang Terlebih Dahulu'}
              </option>
              {selectedCabang &&
                CABANG_DAN_GOLONGAN[selectedCabang]?.map((gol) => (
                  <option key={gol} value={gol} className="bg-[#10121a]">
                    {gol}
                  </option>
                ))}
            </select>
          </div>

          {/* Kafilah */}
          <div>
            <select
              value={selectedKafilah}
              onChange={(e) => setSelectedKafilah(e.target.value)}
              className="w-full ag-input text-xs"
            >
              <option value="" className="bg-[#10121a]">Semua 10 Kafilah Bengkulu</option>
              {DAFTAR_KAFILAH.map((kafilah) => (
                <option key={kafilah} value={kafilah} className="bg-[#10121a]">
                  {kafilah}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama peserta..."
              className="w-full ag-input pl-8 text-xs"
            />
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Leaderboard Table / Cards */}
        <div className="ag-card overflow-hidden divide-y divide-white/[0.04]">
          {leaderboard.length > 0 ? (
            leaderboard.map((item) => {
              const isTop1 = item.peringkat === 1;
              const isTop2 = item.peringkat === 2;
              const isTop3 = item.peringkat === 3;

              return (
                <motion.div
                  key={item.peserta.id}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                  className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors"
                >
                  {/* Left: Rank, Photo, Name & Kafilah */}
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Rank Badge */}
                    <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0">
                      <span
                        className={`font-mono text-sm font-bold ${
                          isTop1
                            ? 'text-amber-400'
                            : isTop2
                            ? 'text-zinc-200'
                            : isTop3
                            ? 'text-amber-600'
                            : 'text-zinc-400'
                        }`}
                      >
                        {String(item.peringkat).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Photo with red background */}
                    <div className="w-11 h-14 rounded-lg bg-red-600/90 p-0.5 border border-white/20 shrink-0 overflow-hidden shadow">
                      <img
                        src={item.peserta.fotoUrl}
                        alt={item.peserta.namaLengkap}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>

                    {/* Participant Details */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-white truncate">
                          {item.peserta.namaLengkap}
                        </h4>
                        <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">
                          {item.peserta.asalKafilah}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-400 mt-0.5 truncate">
                        {item.peserta.cabang} •{' '}
                        <span className="text-zinc-300 font-medium">{item.peserta.golongan}</span>
                      </p>

                      <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">
                        No. Tampil: {item.peserta.nomorUrutTampil || '-'}
                      </span>
                    </div>
                  </div>

                  {/* Right: Scores breakdown & Final Score */}
                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-white/[0.04]">
                    {item.penilaian && (
                      <div className="hidden sm:flex items-center gap-3 text-right font-mono text-[11px] text-zinc-400">
                        <div>
                          <span className="text-[9px] text-zinc-400 block uppercase">B1</span>
                          <span>{item.penilaian.komponen.bidang1.nilai.toFixed(1)}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-400 block uppercase">B2</span>
                          <span>{item.penilaian.komponen.bidang2.nilai.toFixed(1)}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-400 block uppercase">B3</span>
                          <span>{item.penilaian.komponen.bidang3.nilai.toFixed(1)}</span>
                        </div>
                      </div>
                    )}

                    <div className="text-right">
                      <span className="text-[9px] font-mono tracking-widest text-zinc-400 block uppercase">
                        NILAI AKHIR
                      </span>
                      <span className="text-2xl font-bold font-mono tracking-tight text-white">
                        {item.nilaiAkhir.toFixed(2)}
                      </span>
                      <div className="flex items-center justify-end gap-1 text-[10px] font-mono text-[#00FF87]/80 mt-0.5">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Sah & Terkunci</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="p-12 text-center text-zinc-400 text-xs">
              Belum ada peserta yang selesai dinilai pada kategori ini.
            </div>
          )}
        </div>
      </section>

      {/* 4. Lokasi Mimbar MTQ Bengkulu */}
      <section className="space-y-4">
        <h3 className="text-sm font-mono tracking-widest uppercase text-zinc-400">
          LOKASI MIMBAR MUSABAQAH PROVINSI BENGKULU
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {MIMBAR_LIST.slice(0, 3).map((mimbar, idx) => (
            <motion.div
              key={mimbar}
              whileHover={{ y: -3, borderColor: 'rgba(0, 255, 135, 0.3)' }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="ag-card p-4 space-y-2 cursor-default"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span>VENUE 0{idx + 1}</span>
                <span className="text-[#00FF87] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87] animate-pulse" /> Aktif
                </span>
              </div>
              <h4 className="text-xs font-semibold text-zinc-200">{mimbar}</h4>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
