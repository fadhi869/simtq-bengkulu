import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CABANG_DAN_GOLONGAN, DAFTAR_KAFILAH, MIMBAR_LIST } from '../../data/constants';
import {
  Trophy,
  Radio,
  Clock,
  Sparkles,
  MapPin,
  CheckCircle2,
  Filter,
  Volume2,
  Lock,
  ChevronRight,
  Search,
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

  // Search filter
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

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner Bengkulu MTQ */}
      <section className="relative overflow-hidden rounded-3xl bg-mtq-gradient text-white shadow-2xl border border-emerald-600/30">
        {/* Background Islamic Arabesque & Glow */}
        <div className="absolute inset-0 islamic-pattern opacity-30 pointer-events-none"></div>
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-6xl mx-auto px-6 py-14 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/80 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>MTQ Tingkat Provinsi Bengkulu Ke-XXXVI Tahun 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight font-sans">
            Gema Wahyu Ilahi di <br className="hidden sm:inline" />
            <span className="text-gold-gradient font-serif">Bumi Rafflesia yang Qur'ani</span>
          </h1>

          <p className="max-w-3xl mx-auto text-emerald-100 text-sm sm:text-base mb-8 leading-relaxed font-normal">
            Selamat datang di Portal Informasi Resmi Musabaqah Tilawatil Qur'an Provinsi Bengkulu.
            Saksikan live penampilan kafilah terbaik dari 9 Kabupaten & 1 Kota dan pantau papan skor real-time Dewan Hakim terverifikasi.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById('live-arena');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 font-bold text-sm shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500 transition-all hover:scale-105"
            >
              <Radio className="w-4 h-4 animate-pulse text-red-600" />
              Saksikan Live Arena
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('papan-skor');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-white font-semibold text-sm border border-emerald-500/30 transition-all hover:scale-105"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              Lihat Papan Skor
            </button>
            <button
              onClick={() => setRole('peserta')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-sm border border-white/20 transition-all hover:scale-105"
            >
              Registrasi Peserta Baru
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 1. FITUR LIVE DASHBOARD ARENA: PESERTA SEDANG TAMPIL */}
      <section id="live-arena" className="scroll-mt-28">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
              Live Arena Mimbar MTQ
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              Peserta Sedang Tampil Saat Ini
            </h2>
            <p className="text-xs text-slate-600">
              Penampilan langsung di hadapan Majelis Dewan Hakim MTQ Provinsi Bengkulu
            </p>
          </div>
          {activePesertaList.length > 0 && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-emerald-600 animate-bounce" />
              Mikrofon Mimbar Aktif
            </span>
          )}
        </div>

        {activePesertaList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activePesertaList.map((peserta) => (
              <div
                key={peserta.id}
                className="relative overflow-hidden rounded-3xl bg-white border-2 border-red-500/40 shadow-xl p-6 transition-all hover:shadow-2xl"
              >
                {/* Live Top Badge */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                      SEDANG TAMPIL
                    </span>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                      No. Tampil: {peserta.nomorUrutTampil || '-'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-emerald-800 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{peserta.waktuMulaiTampil || 'Sedang Berlangsung'}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                  {/* Photo with RED BACKGROUND as requested */}
                  <div className="relative shrink-0">
                    <div className="w-28 h-36 rounded-2xl overflow-hidden bg-red-600 p-1 shadow-md border-2 border-red-700">
                      <img
                        src={peserta.fotoUrl}
                        alt={peserta.namaLengkap}
                        className="w-full h-full object-cover rounded-xl"
                        onError={(e) => {
                          // Fallback styled portrait
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <span className="absolute -bottom-2 -right-2 bg-amber-500 text-emerald-950 text-[10px] font-black px-2 py-0.5 rounded-full border border-white shadow">
                      {peserta.jenisKelamin === 'Laki-laki' ? 'Qari / Hafizh' : "Qari'ah / Hafizhah"}
                    </span>
                  </div>

                  {/* Participant Details */}
                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 leading-tight">
                        {peserta.namaLengkap}
                      </h3>
                      <p className="text-xs font-bold text-emerald-800 mt-0.5">
                        Kafilah: {peserta.asalKafilah}
                      </p>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">Cabang:</span>
                        <span className="font-bold text-slate-800">{peserta.cabang}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">Golongan:</span>
                        <span className="font-bold text-emerald-800">{peserta.golongan}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">No. Registrasi:</span>
                        <span className="font-mono font-semibold text-slate-700">
                          {peserta.nomorRegistrasi}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span className="truncate font-medium">{peserta.mimbar || 'Mimbar Utama MTQ Bengkulu'}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-amber-800 font-medium flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Penilaian Juri sedang berlangsung aktif
                  </span>
                  <button
                    onClick={() => setRole('juri')}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white transition-colors"
                  >
                    Buka Panel Juri →
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-sm max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-3">
              <Radio className="w-8 h-8 text-slate-600" />
            </div>
            <h4 className="text-base font-bold text-slate-800 mb-1">
              Saat Ini Tidak Ada Peserta di Mimbar Tampil
            </h4>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Majelis Hakim sedang menunggu Admin Pusat memanggil peserta berikutnya atau sesi lomba sedang dijeda/istirahat.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
              <Clock className="w-3.5 h-3.5" />
              Sesi selanjutnya akan segera dimulai
            </div>
          </div>
        )}
      </section>

      {/* 2. PAPAN SKOR / LEADERBOARD INTERAKTIF (URUTAN TERBESAR KE TERKECIL) */}
      <section id="papan-skor" className="scroll-mt-28 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-1">
                <Trophy className="w-3.5 h-3.5 text-amber-600" />
                Papan Skor Resmi & Terverifikasi
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                Leaderboard Nilai Peserta MTQ
              </h2>
              <p className="text-xs text-slate-600">
                Peringkat otomatis terurut secara real-time dari nilai tertinggi ke terendah berdasarkan penilaian Dewan Hakim.
              </p>
            </div>

            {/* Total count badge */}
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-[10px] text-emerald-800 uppercase font-bold">Peserta Selesai Tampil</p>
                <p className="text-base font-extrabold text-emerald-950">
                  {leaderboard.length} Peserta Dinilai
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Filters */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Filter className="w-4 h-4 text-emerald-700" />
              <span>Filter Papan Skor:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Filter Cabang */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Cabang Lomba:
                </label>
                <select
                  value={selectedCabang}
                  onChange={(e) => {
                    setSelectedCabang(e.target.value);
                    setSelectedGolongan(''); // Reset golongan when cabang changes
                  }}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  <option value="">Semua Cabang Lomba</option>
                  {Object.keys(CABANG_DAN_GOLONGAN).map((cabang) => (
                    <option key={cabang} value={cabang}>
                      {cabang}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Golongan (Dynamic conditional dropdown) */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Golongan Perlombaan:
                </label>
                <select
                  value={selectedGolongan}
                  onChange={(e) => setSelectedGolongan(e.target.value)}
                  disabled={!selectedCabang}
                  className={`w-full text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium ${
                    selectedCabang
                      ? 'bg-slate-50 border border-slate-300 text-slate-800'
                      : 'bg-slate-100 border border-slate-200 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <option value="">
                    {selectedCabang ? 'Semua Golongan' : 'Pilih Cabang Dulu'}
                  </option>
                  {selectedCabang &&
                    CABANG_DAN_GOLONGAN[selectedCabang]?.map((gol) => (
                      <option key={gol} value={gol}>
                        {gol}
                      </option>
                    ))}
                </select>
              </div>

              {/* Filter Kafilah */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Asal Kafilah (Kab/Kota):
                </label>
                <select
                  value={selectedKafilah}
                  onChange={(e) => setSelectedKafilah(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  <option value="">Semua 10 Kafilah Bengkulu</option>
                  {DAFTAR_KAFILAH.map((kafilah) => (
                    <option key={kafilah} value={kafilah}>
                      {kafilah}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search by Name */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Cari Nama Peserta:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ketik nama peserta..."
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                  <Search className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard Table / Cards */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
            {leaderboard.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {leaderboard.map((item) => {
                  const isTop1 = item.peringkat === 1;
                  const isTop2 = item.peringkat === 2;
                  const isTop3 = item.peringkat === 3;

                  let rankBadgeStyle = 'bg-slate-100 text-slate-700 border-slate-300';
                  let rankTitle = `Peringkat ${item.peringkat}`;

                  if (isTop1) {
                    rankBadgeStyle =
                      'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-black shadow-md border-amber-300';
                    rankTitle = 'JUARA I (EMAS)';
                  } else if (isTop2) {
                    rankBadgeStyle =
                      'bg-gradient-to-r from-slate-200 to-slate-300 text-slate-900 font-black border-slate-400';
                    rankTitle = 'JUARA II (PERAK)';
                  } else if (isTop3) {
                    rankBadgeStyle =
                      'bg-gradient-to-r from-amber-700 to-amber-800 text-amber-100 font-black border-amber-600';
                    rankTitle = 'JUARA III (PERUNGGU)';
                  } else if (item.peringkat === 4) {
                    rankTitle = 'HARAPAN I';
                  } else if (item.peringkat === 5) {
                    rankTitle = 'HARAPAN II';
                  }

                  return (
                    <div
                      key={item.peserta.id}
                      className={`p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
                        isTop1 ? 'bg-amber-50/50 hover:bg-amber-50' : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Left: Rank, Photo (RED BACKGROUND), Name & Branch */}
                      <div className="flex items-center gap-4">
                        {/* Rank Badge */}
                        <div className="flex flex-col items-center justify-center min-w-[58px]">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black border ${rankBadgeStyle}`}
                          >
                            {isTop1 ? (
                              <Trophy className="w-6 h-6 text-amber-950" />
                            ) : (
                              item.peringkat
                            )}
                          </div>
                          <span className="text-[9px] font-extrabold uppercase mt-1 tracking-tight text-slate-600">
                            {rankTitle}
                          </span>
                        </div>

                        {/* PAS FOTO (LATAR BELAKANG MERAH) */}
                        <div className="relative shrink-0">
                          <div className="w-16 h-20 rounded-xl overflow-hidden bg-red-600 p-0.5 border-2 border-red-700 shadow-sm">
                            <img
                              src={item.peserta.fotoUrl}
                              alt={item.peserta.namaLengkap}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          </div>
                          <span className="absolute -bottom-1 -right-1 text-[8px] bg-red-800 text-white font-bold px-1 rounded shadow">
                            Latar Merah
                          </span>
                        </div>

                        {/* Details */}
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-extrabold text-slate-900">
                              {item.peserta.namaLengkap}
                            </h4>
                            <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                              {item.peserta.asalKafilah}
                            </span>
                          </div>

                          <p className="text-xs font-semibold text-slate-600 mt-0.5">
                            {item.peserta.cabang} •{' '}
                            <span className="text-emerald-800 font-bold">
                              {item.peserta.golongan}
                            </span>
                          </p>

                          <div className="flex items-center gap-3 text-[11px] text-slate-600 mt-1">
                            <span>No. Reg: {item.peserta.nomorRegistrasi}</span>
                            <span>•</span>
                            <span>No. Tampil: {item.peserta.nomorUrutTampil || '-'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Score Breakdown & Final Score */}
                      <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                        {item.penilaian && (
                          <div className="hidden sm:flex items-center gap-4 text-right">
                            <div className="text-[11px]">
                              <span className="block text-slate-600">Bidang 1:</span>
                              <span className="font-bold text-slate-700">
                                {item.penilaian.komponen.bidang1.nilai.toFixed(1)}
                              </span>
                            </div>
                            <div className="text-[11px]">
                              <span className="block text-slate-600">Bidang 2:</span>
                              <span className="font-bold text-slate-700">
                                {item.penilaian.komponen.bidang2.nilai.toFixed(1)}
                              </span>
                            </div>
                            <div className="text-[11px]">
                              <span className="block text-slate-600">Bidang 3:</span>
                              <span className="font-bold text-slate-700">
                                {item.penilaian.komponen.bidang3.nilai.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Total Final Score */}
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider block">
                            NILAI AKHIR
                          </span>
                          <span
                            className={`text-2xl sm:text-3xl font-black font-sans ${
                              isTop1
                                ? 'text-amber-600'
                                : isTop2
                                ? 'text-slate-700'
                                : 'text-emerald-800'
                            }`}
                          >
                            {item.nilaiAkhir.toFixed(2)}
                          </span>
                          <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-700 font-semibold mt-0.5">
                            <Lock className="w-3 h-3 text-emerald-600" />
                            <span>Sah & Terkunci</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center bg-slate-50">
                <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                <h5 className="text-sm font-bold text-slate-700">
                  Belum Ada Peserta yang Selesai Dinilai pada Kriteria Ini
                </h5>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  Nilai akan otomatis muncul di papan skor setelah status peserta diubah menjadi "Sudah Tampil" oleh Admin Pusat.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. LOKASI 5 MIMBAR PERLOMBAAN DI PROVINSI BENGKULU */}
      <section className="bg-slate-100/80 rounded-3xl p-6 sm:p-8 border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Lokasi Mimbar Musabaqah MTQ Provinsi Bengkulu
            </h3>
            <p className="text-xs text-slate-600">
              Pusat penyelenggaraan 7 Cabang dan puluhan Golongan Perlombaan
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MIMBAR_LIST.slice(0, 3).map((mimbar, idx) => (
            <div
              key={mimbar}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-2 hover:border-emerald-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Venue {idx + 1}
                </span>
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Aktif
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 leading-snug">{mimbar}</h4>
              <p className="text-[11px] text-slate-600">
                {idx === 0
                  ? "Tilawah Al-Qur'an & Qiro'at Dewasa / Remaja"
                  : idx === 1
                  ? "Hifzhil Qur'an 1-30 Juz & Fahmil Qur'an"
                  : "Kaligrafi Al-Qur'an & Karya Tulis Ilmiah (KTIQ)"}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
