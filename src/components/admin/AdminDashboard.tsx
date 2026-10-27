import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DAFTAR_KAFILAH, CABANG_DAN_GOLONGAN } from '../../data/constants';
import type { Peserta, StatusVerifikasi, StatusTampil } from '../../types';
import confetti from 'canvas-confetti';
import {
  BarChart3,
  CheckCircle2,
  XCircle,
  Shuffle,
  Radio,
  FileCheck,
  Eye,
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

  const [filterCabang, setFilterCabang] = useState<string>('');
  const [filterGolongan, setFilterGolongan] = useState<string>('');
  const [filterKafilah, setFilterKafilah] = useState<string>('');
  const [filterStatusVerif, setFilterStatusVerif] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [reviewingPeserta, setReviewingPeserta] = useState<Peserta | null>(null);
  const [catatanTolak, setCatatanTolak] = useState<string>('Berkas scan kurang jelas / foto tidak sesuai ketentuan.');

  const [lotteryCabang, setLotteryCabang] = useState<string>("Tilawah Al-Qur'an");
  const [lotteryGolongan, setLotteryGolongan] = useState<string>('Dewasa Putra');
  const [lotteryResultMsg, setLotteryResultMsg] = useState<string | null>(null);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);

  const totalCalon = calonPesertaList.length;
  const totalPeserta = pesertaList.length;
  const totalTerverifikasi = pesertaList.filter((p) => p.statusVerifikasi === 'Terverifikasi').length;
  const totalMenunggu = pesertaList.filter((p) => p.statusVerifikasi === 'Menunggu Verifikasi').length;
  const totalDitolak = pesertaList.filter((p) => p.statusVerifikasi === 'Ditolak').length;

  const kafilahDistribution: Record<string, number> = {};
  DAFTAR_KAFILAH.forEach((k) => {
    kafilahDistribution[k] = pesertaList.filter((p) => p.asalKafilah === k).length;
  });

  const cabangDistribution: Record<string, number> = {};
  Object.keys(CABANG_DAN_GOLONGAN).forEach((c) => {
    cabangDistribution[c] = pesertaList.filter((p) => p.cabang === c).length;
  });

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

  const handleRunLottery = () => {
    setIsShuffling(true);
    setLotteryResultMsg(null);

    setTimeout(() => {
      const res = acakNomorUrutTampil(lotteryCabang, lotteryGolongan);
      setIsShuffling(false);

      if (res.success) {
        setLotteryResultMsg(
          `Sukses mengacak nomor urut tampil untuk ${res.count} peserta pada ${lotteryCabang} (${lotteryGolongan}).`
        );
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.5 },
        });
      } else {
        setLotteryResultMsg(
          `Belum ada peserta berstatus "Terverifikasi" pada cabang "${lotteryCabang}" golongan "${lotteryGolongan}".`
        );
      }
    }, 700);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Minimalist */}
      <div className="border-b border-white/[0.08] pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-mono tracking-widest uppercase text-emerald-400">
            ROLE 03 • ADMIN PUSAT LPTQ
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Panel Pengendalian & Manajemen Mimbar
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-1.5 leading-relaxed">
          Verifikasi berkas scan KTP/KK, pengundian nomor urut tampil peserta secara acak, dan kontrol live status mimbar perlombaan.
        </p>
      </div>

      {/* Navigation Tabs - Antigravity Pill Bar */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-white/[0.03] rounded-full border border-white/[0.08] w-fit">
        <button
          onClick={() => setActiveTab('rekap')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
            activeTab === 'rekap'
              ? 'bg-white text-black font-semibold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Rekapitulasi Data
        </button>

        <button
          onClick={() => setActiveTab('validasi')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
            activeTab === 'validasi'
              ? 'bg-white text-black font-semibold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          Validasi Berkas ({totalMenunggu})
        </button>

        <button
          onClick={() => setActiveTab('acak')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
            activeTab === 'acak'
              ? 'bg-white text-black font-semibold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Shuffle className="w-3.5 h-3.5" />
          Acak Nomor Tampil
        </button>

        <button
          onClick={() => setActiveTab('status')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
            activeTab === 'status'
              ? 'bg-white text-black font-semibold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          Live Status Mimbar
        </button>
      </div>

      {/* TAB 1: REKAPITULASI DATA */}
      {activeTab === 'rekap' && (
        <div className="space-y-8">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="ag-card p-4 space-y-1">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Calon Official</span>
              <span className="text-xl font-bold font-mono text-white block">{totalCalon}</span>
            </div>
            <div className="ag-card p-4 space-y-1">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Peserta Terdaftar</span>
              <span className="text-xl font-bold font-mono text-white block">{totalPeserta}</span>
            </div>
            <div className="ag-card p-4 space-y-1">
              <span className="text-[10px] font-mono text-emerald-400 uppercase">Terverifikasi</span>
              <span className="text-xl font-bold font-mono text-emerald-400 block">{totalTerverifikasi}</span>
            </div>
            <div className="ag-card p-4 space-y-1">
              <span className="text-[10px] font-mono text-amber-400 uppercase">Menunggu Review</span>
              <span className="text-xl font-bold font-mono text-amber-400 block">{totalMenunggu}</span>
            </div>
            <div className="ag-card p-4 space-y-1">
              <span className="text-[10px] font-mono text-red-400 uppercase">Ditolak</span>
              <span className="text-xl font-bold font-mono text-red-400 block">{totalDitolak}</span>
            </div>
          </div>

          {/* Minimalist Distribution Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Kafilah Sebaran */}
            <div className="ag-card p-6 space-y-4">
              <span className="text-xs font-mono tracking-wider uppercase text-zinc-400 block">
                DISTRIBUSI PESERTA PER KAFILAH (10 KABUPATEN/KOTA)
              </span>

              <div className="space-y-2.5">
                {DAFTAR_KAFILAH.map((kafilah) => {
                  const count = kafilahDistribution[kafilah] || 0;
                  const pct = totalPeserta > 0 ? (count / totalPeserta) * 100 : 0;
                  return (
                    <div key={kafilah} className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-zinc-300">{kafilah}</span>
                        <span className="font-mono text-zinc-400">{count} ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full bg-white/[0.04] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full"
                          style={{ width: `${Math.max(pct, count > 0 ? 5 : 0)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cabang Sebaran */}
            <div className="ag-card p-6 space-y-4">
              <span className="text-xs font-mono tracking-wider uppercase text-zinc-400 block">
                DISTRIBUSI PESERTA PER CABANG LOMBA
              </span>

              <div className="space-y-2.5">
                {Object.keys(CABANG_DAN_GOLONGAN).map((cabang) => {
                  const count = cabangDistribution[cabang] || 0;
                  const pct = totalPeserta > 0 ? (count / totalPeserta) * 100 : 0;
                  return (
                    <div key={cabang} className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-zinc-300">{cabang}</span>
                        <span className="font-mono text-zinc-400">{count} ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full bg-white/[0.04] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-amber-400 h-1.5 rounded-full"
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

      {/* TAB 2: VALIDASI BERKAS */}
      {activeTab === 'validasi' && (
        <div className="ag-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-white/[0.06]">
            <div>
              <h3 className="text-sm font-semibold text-white">
                Validasi Berkas Pendaftaran Peserta
              </h3>
              <p className="text-[11px] text-zinc-400">
                Tinjau scan KTP/KK dan pas foto latar merah
              </p>
            </div>

            <select
              value={filterStatusVerif}
              onChange={(e) => setFilterStatusVerif(e.target.value)}
              className="ag-input py-1.5 text-xs"
            >
              <option value="" className="bg-[#10121a]">Semua Status</option>
              <option value="Menunggu Verifikasi" className="bg-[#10121a]">Menunggu Verifikasi</option>
              <option value="Terverifikasi" className="bg-[#10121a]">Terverifikasi</option>
              <option value="Ditolak" className="bg-[#10121a]">Ditolak</option>
            </select>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] text-zinc-400 font-mono text-[11px] border-b border-white/[0.06]">
                <tr>
                  <th className="py-2.5 px-3">Peserta</th>
                  <th className="py-2.5 px-3">Kafilah & Usia</th>
                  <th className="py-2.5 px-3">Cabang / Golongan</th>
                  <th className="py-2.5 px-3">Dokumen</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredPeserta.length > 0 ? (
                  filteredPeserta.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-10 rounded bg-red-600/90 p-0.5 border border-white/20 shrink-0 overflow-hidden">
                            <img src={p.fotoUrl} alt={p.namaLengkap} className="w-full h-full object-cover rounded" />
                          </div>
                          <div>
                            <div className="font-medium text-white">{p.namaLengkap}</div>
                            <div className="text-[10px] font-mono text-zinc-400">{p.nomorRegistrasi}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-zinc-200">{p.asalKafilah}</div>
                        <div className="text-[10px] font-mono text-zinc-400">{p.usia} Th</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-zinc-200">{p.cabang}</div>
                        <div className="text-[10px] text-zinc-400">{p.golongan}</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-zinc-300">
                        Scan {p.berkasType}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono ${
                            p.statusVerifikasi === 'Terverifikasi'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : p.statusVerifikasi === 'Ditolak'
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {p.statusVerifikasi}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setReviewingPeserta(p);
                            setCatatanTolak('Berkas scan kurang jelas / foto tidak sesuai ketentuan.');
                          }}
                          className="px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-zinc-200 text-xs font-medium border border-white/10 transition-colors inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3 h-3 text-zinc-400" />
                          Tinjau
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-zinc-400 text-xs">
                      Tidak ada peserta yang cocok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ACAK URUTAN TAMPIL */}
      {activeTab === 'acak' && (
        <div className="ag-card p-6 space-y-6">
          <div className="max-w-xl">
            <h3 className="text-sm font-semibold text-white">
              Pengundian Acak Nomor Urut Tampil
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Mengacak nomor urut tampil (1, 2, 3...) secara otomatis untuk seluruh peserta berstatus "Terverifikasi".
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.08] p-5 rounded-xl space-y-4 max-w-lg">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Cabang</label>
                <select
                  value={lotteryCabang}
                  onChange={(e) => {
                    const c = e.target.value;
                    setLotteryCabang(c);
                    setLotteryGolongan(CABANG_DAN_GOLONGAN[c]?.[0] || '');
                  }}
                  className="w-full ag-input"
                >
                  {Object.keys(CABANG_DAN_GOLONGAN).map((c) => (
                    <option key={c} value={c} className="bg-[#10121a]">{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Golongan</label>
                <select
                  value={lotteryGolongan}
                  onChange={(e) => setLotteryGolongan(e.target.value)}
                  className="w-full ag-input"
                >
                  {CABANG_DAN_GOLONGAN[lotteryCabang]?.map((g) => (
                    <option key={g} value={g} className="bg-[#10121a]">{g}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleRunLottery}
              disabled={isShuffling}
              className={`w-full py-2.5 px-4 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                isShuffling
                  ? 'bg-amber-400 text-black cursor-wait'
                  : 'bg-white text-black hover:bg-zinc-200'
              }`}
            >
              <Shuffle className={`w-3.5 h-3.5 ${isShuffling ? 'animate-spin' : ''}`} />
              {isShuffling ? 'Mengundi Nomor Tampil...' : 'Acak Nomor Tampil Otomatis'}
            </button>

            {lotteryResultMsg && (
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-zinc-300">
                {lotteryResultMsg}
              </div>
            )}
          </div>

          {/* Roster Preview */}
          <div className="space-y-3 pt-2">
            <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 block">
              DAFTAR NOMOR TAMPIL ({lotteryCabang} - {lotteryGolongan})
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {pesertaList
                .filter((p) => p.cabang === lotteryCabang && p.golongan === lotteryGolongan)
                .sort((a, b) => (a.nomorUrutTampil || 999) - (b.nomorUrutTampil || 999))
                .map((p) => (
                  <div key={p.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-white/[0.06] font-mono font-bold text-xs text-white flex items-center justify-center shrink-0">
                      {p.nomorUrutTampil || '-'}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium text-white truncate">{p.namaLengkap}</div>
                      <div className="text-[10px] text-zinc-400 truncate">{p.asalKafilah}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MANAJEMEN LIVE STATUS MIMBAR */}
      {activeTab === 'status' && (
        <div className="ag-card p-6 space-y-4">
          <div className="max-w-xl pb-2">
            <h3 className="text-sm font-semibold text-white">
              Manajemen Status Mimbar Penampilan
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              "Sedang Tampil" mengaktifkan lembar nilai Dewan Hakim. Mengubah ke "Sudah Tampil" otomatis mengunci nilai secara permanen.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] text-zinc-400 font-mono text-[11px] border-b border-white/[0.06]">
                <tr>
                  <th className="py-2.5 px-3">No & Peserta</th>
                  <th className="py-2.5 px-3">Cabang / Golongan</th>
                  <th className="py-2.5 px-3">Status Saat Ini</th>
                  <th className="py-2.5 px-3 text-right">Ubah Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {pesertaList
                  .filter((p) => p.statusVerifikasi === 'Terverifikasi')
                  .sort((a, b) => (a.nomorUrutTampil || 999) - (b.nomorUrutTampil || 999))
                  .map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-zinc-400 text-xs w-6">
                            {p.nomorUrutTampil || '-'}
                          </span>
                          <div>
                            <div className="font-medium text-white">{p.namaLengkap}</div>
                            <div className="text-[10px] text-zinc-400">{p.asalKafilah}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-zinc-200">{p.cabang}</div>
                        <div className="text-[10px] text-zinc-400">{p.golongan}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono ${
                            p.statusTampil === 'Sedang Tampil'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : p.statusTampil === 'Sudah Tampil'
                              ? 'bg-white/[0.06] text-zinc-300 border border-white/10'
                              : 'bg-white/[0.02] text-zinc-400 border border-white/[0.06]'
                          }`}
                        >
                          {p.statusTampil}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex rounded-full bg-white/[0.03] border border-white/10 p-0.5">
                          <button
                            onClick={() => updateStatusTampil(p.id, 'Belum Tampil')}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-mono transition-colors ${
                              p.statusTampil === 'Belum Tampil'
                                ? 'bg-white/[0.1] text-white font-bold'
                                : 'text-zinc-400 hover:text-white'
                            }`}
                          >
                            Belum
                          </button>
                          <button
                            onClick={() => updateStatusTampil(p.id, 'Sedang Tampil')}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-mono transition-colors ${
                              p.statusTampil === 'Sedang Tampil'
                                ? 'bg-emerald-500 text-black font-bold'
                                : 'text-emerald-400 hover:text-emerald-300'
                            }`}
                          >
                            Sedang
                          </button>
                          <button
                            onClick={() => updateStatusTampil(p.id, 'Sudah Tampil')}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-mono transition-colors ${
                              p.statusTampil === 'Sudah Tampil'
                                ? 'bg-white text-black font-bold'
                                : 'text-zinc-400 hover:text-white'
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

      {/* Review Modal */}
      {reviewingPeserta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#10121a] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-white/10 space-y-5 text-zinc-200">
            <div className="flex justify-between items-start pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 block">
                  VERIFIKASI BERKAS
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {reviewingPeserta.namaLengkap}
                </h3>
              </div>
              <button
                onClick={() => setReviewingPeserta(null)}
                className="text-zinc-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.06] p-3 rounded-xl">
                <div className="w-16 h-20 rounded bg-red-600/90 p-0.5 border border-white/20 shrink-0 overflow-hidden">
                  <img src={reviewingPeserta.fotoUrl} alt={reviewingPeserta.namaLengkap} className="w-full h-full object-cover rounded" />
                </div>
                <div className="space-y-1 text-zinc-300">
                  <div>NIK: <span className="font-mono text-white">{reviewingPeserta.nik}</span></div>
                  <div>Usia: <span className="font-mono text-white">{reviewingPeserta.usia} Tahun</span></div>
                  <div>Cabang: <span className="text-white">{reviewingPeserta.cabang} - {reviewingPeserta.golongan}</span></div>
                </div>
              </div>

              <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl flex items-center justify-between">
                <span className="font-mono text-zinc-300">Dokumen: Scan {reviewingPeserta.berkasType} (.pdf)</span>
                <span className="text-[10px] font-mono text-emerald-400">Valid</span>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Catatan Penolakan (Jika ditolak):</label>
                <input
                  type="text"
                  value={catatanTolak}
                  onChange={(e) => setCatatanTolak(e.target.value)}
                  className="w-full ag-input"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => {
                    updateVerifikasi(reviewingPeserta.id, 'Ditolak', catatanTolak);
                    setReviewingPeserta(null);
                  }}
                  className="flex-1 py-2 px-4 rounded-full border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/10 transition-colors"
                >
                  Tolak Berkas
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
                  className="flex-1 py-2 px-4 rounded-full bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-colors"
                >
                  Setujui & Verifikasi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
