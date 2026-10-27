import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CABANG_DAN_GOLONGAN, DAFTAR_KAFILAH, MIMBAR_LIST } from '../../data/constants';
import {
  Radio,
  Clock,
  MapPin,
  Filter,
  Lock,
  ChevronRight,
  Search,
  Volume2,
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

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Antigravity Hero Section: Ultra-clean, spacious, minimal */}
      <section className="relative pt-12 pb-8 text-center max-w-4xl mx-auto space-y-6">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/[0.07] blur-[120px] rounded-full pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-zinc-300 text-[11px] font-mono tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>MTQ Ke-XXXVI Tingkat Provinsi Bengkulu</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.15]">
          Musabaqah Tilawatil Qur'an <br />
          <span className="bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-500 bg-clip-text text-transparent">
            Provinsi Bengkulu
          </span>
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal">
          Portal terpadu pendaftaran kafilah 10 kabupaten/kota, verifikasi berkas berjenjang, pengundian nomor urut tampil, dan sistem penilaian real-time Dewan Hakim.
        </p>

        {/* Minimalist Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              document.getElementById('live-arena')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all shadow-sm"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-600" />
            Live Arena Mimbar
          </button>

          <button
            onClick={() => {
              document.getElementById('papan-skor')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.05] text-zinc-200 hover:text-white hover:bg-white/[0.1] font-medium text-xs border border-white/10 transition-all"
          >
            Papan Skor Terkini
          </button>

          <button
            onClick={() => setRole('peserta')}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-zinc-400 hover:text-zinc-200 font-medium text-xs transition-colors"
          >
            Registrasi Peserta
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 2. LIVE DASHBOARD ARENA: PESERTA SEDANG TAMPIL */}
      <section id="live-arena" className="scroll-mt-28 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/[0.08] pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-mono tracking-widest uppercase text-emerald-400">
                PANGGUNG UTAMA / LIVE ARENA
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Peserta Sedang Tampil
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-white/[0.02] border border-white/10 px-3 py-1.5 rounded-full">
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Audio & Penilaian Majelis Aktif</span>
          </div>
        </div>

        {activePesertaList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activePesertaList.map((peserta) => (
              <div
                key={peserta.id}
                className="ag-card-glow p-6 sm:p-7 relative overflow-hidden"
              >
                {/* Header Card Status */}
                <div className="flex items-center justify-between pb-5 border-b border-white/[0.06] mb-6">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    SEDANG TAMPIL
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
                    <Clock className="w-3 h-3 text-zinc-500" />
                    <span>{peserta.waktuMulaiTampil || 'Sesi Sedang Berlangsung'}</span>
                  </div>
                </div>

                {/* Participant Content */}
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                  {/* Photo with red background frame */}
                  <div className="relative shrink-0">
                    <div className="w-24 h-32 rounded-xl bg-red-600/90 p-1 border border-white/20 shadow-lg overflow-hidden">
                      <img
                        src={peserta.fotoUrl}
                        alt={peserta.namaLengkap}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <span className="absolute -bottom-2 -right-1 text-[9px] font-mono tracking-wider bg-black/90 text-zinc-300 border border-white/10 px-1.5 py-0.5 rounded-full">
                      NO.{peserta.nomorUrutTampil || '-'}
                    </span>
                  </div>

                  {/* Information Details */}
                  <div className="flex-1 min-w-0 text-center sm:text-left space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight truncate">
                        {peserta.namaLengkap}
                      </h3>
                      <p className="text-xs text-emerald-400 font-medium mt-0.5">
                        Kafilah {peserta.asalKafilah}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-white/[0.02] border border-white/[0.06] p-3 rounded-xl">
                      <div>
                        <span className="text-[10px] text-zinc-500 block uppercase">Cabang</span>
                        <span className="text-zinc-200 truncate block font-sans font-medium">{peserta.cabang}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 block uppercase">Golongan</span>
                        <span className="text-zinc-200 truncate block font-sans font-medium">{peserta.golongan}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-zinc-400">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="truncate">{peserta.mimbar || 'Mimbar Utama MTQ Bengkulu'}</span>
                    </div>
                  </div>
                </div>

                {/* Action Footnote */}
                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-500">
                    ID: {peserta.nomorRegistrasi}
                  </span>
                  <button
                    onClick={() => setRole('juri')}
                    className="text-xs text-zinc-300 hover:text-white font-medium hover:underline flex items-center gap-1"
                  >
                    Buka Lembar Penilaian Juri →
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="ag-card p-10 text-center max-w-lg mx-auto space-y-3">
            <Radio className="w-8 h-8 text-zinc-600 mx-auto" />
            <h4 className="text-sm font-semibold text-zinc-300">
              Tidak Ada Peserta di Atas Mimbar
            </h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Majelis Hakim sedang menunggu panggilan sesi berikutnya oleh Admin Pusat atau mimbar sedang dalam jeda.
            </p>
          </div>
        )}
      </section>

      {/* 3. PAPAN SKOR / LEADERBOARD INTERAKTIF (TERURUT NILAI TERTINGGI KE TERENDAH) */}
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

          <div className="text-xs font-mono text-zinc-400">
            Terurut Otomatis Berdasarkan Nilai Tertinggi
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
                <div
                  key={item.peserta.id}
                  className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
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
                    <div className="w-11 h-14 rounded-lg bg-red-600/90 p-0.5 border border-white/20 shrink-0 overflow-hidden">
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
                      <div className="flex items-center justify-end gap-1 text-[10px] font-mono text-emerald-400/80 mt-0.5">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Sah & Terkunci</span>
                      </div>
                    </div>
                  </div>
                </div>
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
            <div key={mimbar} className="ag-card p-4 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span>VENUE 0{idx + 1}</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-400"></span> Aktif
                </span>
              </div>
              <h4 className="text-xs font-semibold text-zinc-200">{mimbar}</h4>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
