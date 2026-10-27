import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DAFTAR_KAFILAH, CABANG_DAN_GOLONGAN, MIMBAR_LIST } from '../../data/constants';
import type { Peserta, StatusVerifikasi, StatusTampil } from '../../types';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  BarChart3,
  CheckCircle2,
  XCircle,
  Shuffle,
  Radio,
  FileCheck,
  Search,
  Filter,
  Eye,
  AlertCircle,
  Sparkles,
  Layers,
  MapPin,
  Clock,
  User,
  FileText,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    pesertaList,
    calonPesertaList,
    updateVerifikasi,
    acakNomorUrutTampil,
    updateStatusTampil,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'rekap' | 'validasi' | 'acak' | 'status'>('rekap');

  // Filter states
  const [filterCabang, setFilterCabang] = useState<string>('');
  const [filterGolongan, setFilterGolongan] = useState<string>('');
  const [filterKafilah, setFilterKafilah] = useState<string>('');
  const [filterStatusVerif, setFilterStatusVerif] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Review Modal State
  const [reviewingPeserta, setReviewingPeserta] = useState<Peserta | null>(null);
  const [catatanTolak, setCatatanTolak] = useState<string>('Berkas scan kurang jelas / foto tidak sesuai ketentuan.');

  // Lottery Modal State
  const [lotteryCabang, setLotteryCabang] = useState<string>("Tilawah Al-Qur'an");
  const [lotteryGolongan, setLotteryGolongan] = useState<string>('Dewasa Putra');
  const [lotteryResultMsg, setLotteryResultMsg] = useState<string | null>(null);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);

  // Statistics
  const totalCalon = calonPesertaList.length;
  const totalPeserta = pesertaList.length;
  const totalTerverifikasi = pesertaList.filter((p) => p.statusVerifikasi === 'Terverifikasi').length;
  const totalMenunggu = pesertaList.filter((p) => p.statusVerifikasi === 'Menunggu Verifikasi').length;
  const totalDitolak = pesertaList.filter((p) => p.statusVerifikasi === 'Ditolak').length;

  // Breakdown by Kafilah
  const kafilahDistribution: Record<string, number> = {};
  DAFTAR_KAFILAH.forEach((k) => {
    kafilahDistribution[k] = pesertaList.filter((p) => p.asalKafilah === k).length;
  });

  // Breakdown by Cabang
  const cabangDistribution: Record<string, number> = {};
  Object.keys(CABANG_DAN_GOLONGAN).forEach((c) => {
    cabangDistribution[c] = pesertaList.filter((p) => p.cabang === c).length;
  });

  // Filtered Peserta for Tables
  const filteredPeserta = pesertaList.filter((p) => {
    if (filterCabang && p.cabang !== filterCabang) return false;
    if (filterGolongan && p.golongan !== filterGolongan) return false;
    if (filterKafilah && p.asalKafilah !== filterKafilah) return false;
    if (filterStatusVerif && p.statusVerifikasi !== filterStatusVerif) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.namaLengkap.toLowerCase().includes(q) ||
        p.nomorRegistrasi.toLowerCase().includes(q) ||
        p.nik.includes(q)
      );
    }
    return true;
  });

  // Handle Lottery Drawing Action
  const handleRunLottery = () => {
    setIsShuffling(true);
    setLotteryResultMsg(null);

    setTimeout(() => {
      const res = acakNomorUrutTampil(lotteryCabang, lotteryGolongan);
      setIsShuffling(false);

      if (res.success) {
        setLotteryResultMsg(
          `Sukses! Berhasil mengacak nomor urut tampil untuk ${res.count} peserta terverifikasi pada ${lotteryCabang} (${lotteryGolongan}).`
        );
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.5 },
        });
      } else {
        setLotteryResultMsg(
          `Gagal mengacak nomor: Belum ada peserta terverifikasi pada cabang "${lotteryCabang}" golongan "${lotteryGolongan}". Silakan verifikasi berkas peserta terlebih dahulu.`
        );
      }
    }, 800);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Banner Admin Pusat */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 border border-amber-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            ROLE 3: ADMIN PUSAT (LPTQ PROVINSI BENGKULU)
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Panel Pengendalian, Verifikasi & Manajemen Mimbar MTQ
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-normal">
            Pusat operasional MTQ Provinsi Bengkulu. Pantau rekapitulasi kafilah 10 kabupaten/kota, verifikasi berkas scan KTP/KK dan foto, lakukan pengundian nomor urut tampil otomatis, serta kendalikan live status mimbar.
          </p>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveTab('rekap')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'rekap'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          1. Dashboard Rekapitulasi Data
        </button>
        <button
          onClick={() => setActiveTab('validasi')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'validasi'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          2. Validasi & Review Berkas ({totalMenunggu} Menunggu)
        </button>
        <button
          onClick={() => setActiveTab('acak')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'acak'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <Shuffle className="w-4 h-4" />
          3. Fitur Acak Urutan Tampil
        </button>
        <button
          onClick={() => setActiveTab('status')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'status'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <Radio className="w-4 h-4" />
          4. Manajemen Live Status Mimbar
        </button>
      </div>

      {/* TAB 1: DASHBOARD REKAPITULASI DATA */}
      {activeTab === 'rekap' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Key Metrics Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold uppercase text-slate-600 block">Total Calon Official</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{totalCalon}</span>
              <span className="text-[10px] text-slate-600 mt-1 block">Rekomendasi Kafilah</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold uppercase text-slate-600 block">Peserta Terdaftar</span>
              <span className="text-2xl font-black text-emerald-900 mt-1 block">{totalPeserta}</span>
              <span className="text-[10px] text-emerald-800 mt-1 block">Formulir Lengkap</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-emerald-300 bg-emerald-50/50 shadow-sm">
              <span className="text-[11px] font-bold uppercase text-emerald-800 block">Terverifikasi</span>
              <span className="text-2xl font-black text-emerald-700 mt-1 block">{totalTerverifikasi}</span>
              <span className="text-[10px] text-emerald-800 mt-1 block">Siap Undian Tampil</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-amber-300 bg-amber-50/50 shadow-sm">
              <span className="text-[11px] font-bold uppercase text-amber-800 block">Menunggu Review</span>
              <span className="text-2xl font-black text-amber-700 mt-1 block">{totalMenunggu}</span>
              <span className="text-[10px] text-amber-800 mt-1 block">Perlu Verifikasi</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-red-200 bg-red-50/50 shadow-sm">
              <span className="text-[11px] font-bold uppercase text-red-800 block">Ditolak</span>
              <span className="text-2xl font-black text-red-600 mt-1 block">{totalDitolak}</span>
              <span className="text-[10px] text-red-800 mt-1 block">Berkas Bermasalah</span>
            </div>
          </div>

          {/* Graphical / Visual Distributions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Visual 1: Distribusi 10 Kabupaten/Kota Bengkulu */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Pengelompokan Peserta Berdasarkan Kabupaten/Kota
                  </h3>
                  <p className="text-[11px] text-slate-600">
                    Sebaran kontingen 10 Kafilah se-Provinsi Bengkulu
                  </p>
                </div>
                <MapPin className="w-4 h-4 text-emerald-700" />
              </div>

              <div className="space-y-2.5 pt-2">
                {DAFTAR_KAFILAH.map((kafilah) => {
                  const count = kafilahDistribution[kafilah] || 0;
                  const pct = totalPeserta > 0 ? (count / totalPeserta) * 100 : 0;
                  return (
                    <div key={kafilah} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-700">{kafilah}</span>
                        <span className="font-bold text-slate-900">
                          {count} Peserta ({pct.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(pct, count > 0 ? 5 : 0)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Visual 2: Distribusi 7 Cabang Perlombaan MTQ */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Pengelompokan Peserta Berdasarkan Cabang Perlombaan
                  </h3>
                  <p className="text-[11px] text-slate-600">
                    Sebaran cabang Tilawah, Hifzhil, Kaligrafi, Syarhil, Fahmil, dll.
                  </p>
                </div>
                <Layers className="w-4 h-4 text-amber-600" />
              </div>

              <div className="space-y-3 pt-2">
                {Object.keys(CABANG_DAN_GOLONGAN).map((cabang) => {
                  const count = cabangDistribution[cabang] || 0;
                  const pct = totalPeserta > 0 ? (count / totalPeserta) * 100 : 0;
                  return (
                    <div key={cabang} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-700">{cabang}</span>
                        <span className="font-bold text-slate-900">
                          {count} Peserta ({pct.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(pct, count > 0 ? 5 : 0)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FITUR VALIDASI DATA & REVIEW BERKAS (KTP/KK & FOTO) */}
      {activeTab === 'validasi' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Tinjau & Validasi Berkas Pendaftaran Peserta
              </h3>
              <p className="text-xs text-slate-600">
                Periksa kesesuaian dokumen scan KTP / Kartu Keluarga dan Pas Foto resmi latar merah
              </p>
            </div>

            {/* Quick Filter */}
            <div className="flex items-center gap-2">
              <select
                value={filterStatusVerif}
                onChange={(e) => setFilterStatusVerif(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium"
              >
                <option value="">Semua Status Verifikasi</option>
                <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                <option value="Terverifikasi">Terverifikasi</option>
                <option value="Ditolak">Ditolak</option>
              </select>
            </div>
          </div>

          {/* Peserta Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Peserta & Foto</th>
                  <th className="py-3 px-4">Kafilah & Usia</th>
                  <th className="py-3 px-4">Cabang & Golongan</th>
                  <th className="py-3 px-4">Dokumen Wajib</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Tindakan Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPeserta.length > 0 ? (
                  filteredPeserta.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-12 rounded-lg bg-red-600 p-0.5 border border-red-700 shrink-0 overflow-hidden shadow-sm">
                            <img
                              src={p.fotoUrl}
                              alt={p.namaLengkap}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{p.namaLengkap}</div>
                            <div className="text-[10px] font-mono text-slate-600">
                              {p.nomorRegistrasi}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{p.asalKafilah}</div>
                        <div className="text-[10px] text-slate-600">
                          {p.usia} Tahun ({p.jenisKelamin})
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{p.cabang}</div>
                        <div className="text-[10px] text-emerald-800 font-bold">{p.golongan}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-700">
                          <FileText className="w-3 h-3 text-emerald-700" />
                          {p.berkasType} ({p.berkasFileName || `${p.berkasType}.pdf`})
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            p.statusVerifikasi === 'Terverifikasi'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : p.statusVerifikasi === 'Ditolak'
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}
                        >
                          {p.statusVerifikasi}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setReviewingPeserta(p);
                            setCatatanTolak('Berkas scan kurang jelas / foto tidak sesuai ketentuan.');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 ml-auto shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-300" />
                          Tinjau Berkas
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-600">
                      Tidak ada data peserta sesuai filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: FITUR ACAK URUTAN TAMPIL PESERTA (LOTTERY NUMBER) */}
      {activeTab === 'acak' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="max-w-2xl">
            <h3 className="text-base font-bold text-slate-900">
              Pengundian Acak Nomor Urut Tampil Peserta
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Sistem akan mengacak nomor undian tampil (1, 2, 3...) secara otomatis dan adil kepada peserta yang telah berstatus <strong>"Terverifikasi"</strong> pada cabang & golongan terkait.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pilih Cabang Lomba:
                </label>
                <select
                  value={lotteryCabang}
                  onChange={(e) => {
                    const c = e.target.value;
                    setLotteryCabang(c);
                    setLotteryGolongan(CABANG_DAN_GOLONGAN[c]?.[0] || '');
                  }}
                  className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-2.5 font-semibold text-slate-800"
                >
                  {Object.keys(CABANG_DAN_GOLONGAN).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pilih Golongan:
                </label>
                <select
                  value={lotteryGolongan}
                  onChange={(e) => setLotteryGolongan(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-2.5 font-semibold text-slate-800"
                >
                  {CABANG_DAN_GOLONGAN[lotteryCabang]?.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleRunLottery}
              disabled={isShuffling}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                isShuffling
                  ? 'bg-amber-500 text-white animate-pulse cursor-wait'
                  : 'bg-emerald-800 hover:bg-emerald-900 text-white cursor-pointer hover:scale-[1.01]'
              }`}
            >
              <Shuffle className={`w-4 h-4 text-amber-300 ${isShuffling ? 'animate-spin' : ''}`} />
              {isShuffling ? 'Sedang Mengundi Acak Nomor Tampil...' : 'Acak Nomor Urut Tampil Otomatis'}
            </button>

            {lotteryResultMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium leading-relaxed">
                {lotteryResultMsg}
              </div>
            )}
          </div>

          {/* Preview Roster for Selected Category */}
          <div className="pt-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Daftar Peserta & Nomor Urut Tampil ({lotteryCabang} - {lotteryGolongan})
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pesertaList
                .filter((p) => p.cabang === lotteryCabang && p.golongan === lotteryGolongan)
                .sort((a, b) => (a.nomorUrutTampil || 999) - (b.nomorUrutTampil || 999))
                .map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex flex-col items-center justify-center font-black border border-emerald-300">
                      <span className="text-[9px] uppercase font-bold text-emerald-700">NO</span>
                      <span className="text-base">{p.nomorUrutTampil || '-'}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs text-slate-900 truncate">
                        {p.namaLengkap}
                      </div>
                      <div className="text-[10px] text-slate-600 truncate">
                        {p.asalKafilah}
                      </div>
                      <div className="text-[10px] font-semibold text-emerald-800 mt-0.5">
                        Status: {p.statusVerifikasi}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MANAJEMEN LIVE STATUS MIMBAR ("Belum Tampil", "Sedang Tampil", "Sudah Tampil") */}
      {activeTab === 'status' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="max-w-2xl">
            <h3 className="text-base font-bold text-slate-900">
              Pengaturan Live Status Penampilan Peserta di Mimbar MTQ
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Ubah status peserta untuk mengendalikan jalannya lomba.
              <span className="text-red-700 font-bold ml-1">
                "Sedang Tampil" akan mengaktifkan formulir penilaian Dewan Hakim. Mengubah ke "Sudah Tampil" akan mengunci nilai secara permanen.
              </span>
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">No. Tampil & Peserta</th>
                  <th className="py-3 px-4">Cabang & Golongan</th>
                  <th className="py-3 px-4">Mimbar Perlombaan</th>
                  <th className="py-3 px-4">Status Tampil Saat Ini</th>
                  <th className="py-3 px-4 text-right">Ubah Status Live</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pesertaList
                  .filter((p) => p.statusVerifikasi === 'Terverifikasi')
                  .sort((a, b) => (a.nomorUrutTampil || 999) - (b.nomorUrutTampil || 999))
                  .map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-900 font-black text-xs flex items-center justify-center shrink-0">
                            {p.nomorUrutTampil || '-'}
                          </span>
                          <div>
                            <div className="font-bold text-slate-900">{p.namaLengkap}</div>
                            <div className="text-[10px] text-slate-600">{p.asalKafilah}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{p.cabang}</div>
                        <div className="text-[10px] text-emerald-800 font-bold">{p.golongan}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-slate-700">
                          {p.mimbar || 'Mimbar Utama MTQ Bengkulu'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                            p.statusTampil === 'Sedang Tampil'
                              ? 'bg-red-600 text-white animate-pulse'
                              : p.statusTampil === 'Sudah Tampil'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-slate-100 text-slate-700 border border-slate-300'
                          }`}
                        >
                          {p.statusTampil === 'Sedang Tampil' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                          )}
                          {p.statusTampil}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex rounded-xl shadow-sm border border-slate-300 overflow-hidden">
                          <button
                            onClick={() => updateStatusTampil(p.id, 'Belum Tampil')}
                            className={`px-2.5 py-1 text-[11px] font-bold transition-colors ${
                              p.statusTampil === 'Belum Tampil'
                                ? 'bg-slate-800 text-white'
                                : 'bg-white text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            Belum
                          </button>
                          <button
                            onClick={() => updateStatusTampil(p.id, 'Sedang Tampil')}
                            className={`px-2.5 py-1 text-[11px] font-bold transition-colors ${
                              p.statusTampil === 'Sedang Tampil'
                                ? 'bg-red-600 text-white'
                                : 'bg-white text-red-700 hover:bg-red-50'
                            }`}
                          >
                            Sedang Tampil
                          </button>
                          <button
                            onClick={() => updateStatusTampil(p.id, 'Sudah Tampil')}
                            className={`px-2.5 py-1 text-[11px] font-bold transition-colors ${
                              p.statusTampil === 'Sudah Tampil'
                                ? 'bg-emerald-700 text-white'
                                : 'bg-white text-emerald-800 hover:bg-emerald-50'
                            }`}
                          >
                            Sudah
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL REVIEW & VERIFIKASI BERKAS DATA */}
      {reviewingPeserta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded uppercase">
                  Verifikasi Berkas Calon
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Tinjau Berkas: {reviewingPeserta.namaLengkap}
                </h3>
                <p className="text-xs text-slate-600">
                  {reviewingPeserta.nomorRegistrasi} • {reviewingPeserta.asalKafilah}
                </p>
              </div>
              <button
                onClick={() => setReviewingPeserta(null)}
                className="text-slate-600 hover:text-slate-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 text-xs">
              {/* Photo & Identity Review */}
              <div className="flex flex-col sm:flex-row gap-5 items-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="w-24 h-32 rounded-xl bg-red-600 p-1 border-2 border-red-700 shadow shrink-0 overflow-hidden">
                  <img
                    src={reviewingPeserta.fotoUrl}
                    alt={reviewingPeserta.namaLengkap}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-1.5 flex-1 text-slate-700">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600">NIK:</span>
                    <span className="font-mono font-bold">{reviewingPeserta.nik}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600">Tempat, Tgl Lahir:</span>
                    <span className="font-bold">
                      {reviewingPeserta.tempatLahir}, {reviewingPeserta.tanggalLahir}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600">Usia Terverifikasi:</span>
                    <span className="font-bold text-emerald-800">
                      {reviewingPeserta.usia} Tahun (
                      {reviewingPeserta.usia >= 17 ? 'Wajib KTP' : 'Wajib KK'})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600">Cabang & Golongan:</span>
                    <span className="font-bold text-slate-900">
                      {reviewingPeserta.cabang} - {reviewingPeserta.golongan}
                    </span>
                  </div>
                </div>
              </div>

              {/* Document Review Preview */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">
                    Dokumen Identitas: Scan {reviewingPeserta.berkasType}
                  </span>
                  <span className="font-mono text-[10px] text-slate-600">
                    {reviewingPeserta.berkasFileName || `${reviewingPeserta.berkasType}.pdf`}
                  </span>
                </div>

                <div className="h-28 rounded-xl bg-slate-100 border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-600 text-xs">
                  <FileText className="w-8 h-8 text-emerald-700 mb-1" />
                  <span className="font-semibold text-slate-700">
                    Pratinjau Dokumen PDF Valid ({reviewingPeserta.berkasType})
                  </span>
                  <span className="text-[10px] text-slate-600">
                    Format resmi LPTQ terenkripsi aman
                  </span>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Catatan Verifikator Admin (Jika ditolak):
                  </label>
                  <input
                    type="text"
                    value={catatanTolak}
                    onChange={(e) => setCatatanTolak(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    onClick={() => {
                      updateVerifikasi(reviewingPeserta.id, 'Ditolak', catatanTolak);
                      setReviewingPeserta(null);
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 font-bold text-xs border border-red-300 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4 text-red-600" />
                    Tolak Pendaftaran
                  </button>
                  <button
                    onClick={() => {
                      updateVerifikasi(
                        reviewingPeserta.id,
                        'Terverifikasi',
                        'Berkas lengkap dan sesuai ketentuan LPTQ Bengkulu.'
                      );
                      setReviewingPeserta(null);
                      confetti({
                        particleCount: 50,
                        spread: 50,
                        origin: { y: 0.6 },
                      });
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    Setujui & Verifikasi Berkas
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
