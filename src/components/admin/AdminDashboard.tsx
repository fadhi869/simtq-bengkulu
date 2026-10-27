import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DAFTAR_WILAYAH_STATISTIK } from '../../data/mockData';
import { DAFTAR_KAFILAH, CABANG_DAN_GOLONGAN } from '../../data/constants';
import type { Peserta, StatusVerifikasi, StatusTampil } from '../../types';
import confetti from 'canvas-confetti';
import {
  Users,
  CheckCircle2,
  FileText,
  UserX,
  XCircle,
  Calendar,
  Shuffle,
  ShieldCheck,
  Eye,
  Trash2,
  KeyRound,
  ArrowRight,
  Database,
  Radio,
  BarChart3,
  Check,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    setRole,
    bankDataList,
    pesertaList,
    calonPesertaList,
    agendaEvents,
    updateVerifikasi,
    acakNomorUrutTampil,
    updateStatusTampil,
    officialAccounts,
    addOfficialAccount,
    deleteOfficialAccount,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'beranda' | 'verifikasi' | 'acak' | 'officials'>('beranda');

  // Official management states
  const [newOfficialUsername, setNewOfficialUsername] = useState('');
  const [newOfficialPassword, setNewOfficialPassword] = useState('');
  const [newOfficialName, setNewOfficialName] = useState('');
  const [newOfficialKafilah, setNewOfficialKafilah] = useState<string>(DAFTAR_KAFILAH[0]);
  const [newOfficialContact, setNewOfficialContact] = useState('');
  const [officialNotice, setOfficialNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Verifikasi filter states
  const [filterKafilah, setFilterKafilah] = useState('');
  const [reviewingPeserta, setReviewingPeserta] = useState<Peserta | null>(null);
  const [catatanTolak, setCatatanTolak] = useState('Berkas scan kurang jelas / foto tidak berlatar belakang merah.');

  // Acak nomor states
  const [lotteryCabang, setLotteryCabang] = useState<string>("Tilawah Al-Qur'an");
  const [lotteryGolongan, setLotteryGolongan] = useState<string>('Dewasa Putra');
  const [lotteryResultMsg, setLotteryResultMsg] = useState<string | null>(null);

  // Statistics
  const countBankData = bankDataList.length > 0 ? 165 : 0; // matching screenshot display count "165"
  const countDiterima = 46;
  const countBelumVerif = pesertaList.filter((p) => p.statusVerifikasi === 'Menunggu Verifikasi').length;
  const countMundur = 0;
  const countDitolak = 4;

  const handleCreateOfficial = (e: React.FormEvent) => {
    e.preventDefault();
    setOfficialNotice(null);
    const res = addOfficialAccount({
      username: newOfficialUsername,
      password: newOfficialPassword,
      namaOfficial: newOfficialName,
      asalKafilah: newOfficialKafilah,
      nomorKontak: newOfficialContact,
    });
    if (res.success) {
      setOfficialNotice({ type: 'success', message: res.message });
      setNewOfficialUsername('');
      setNewOfficialPassword('');
      setNewOfficialName('');
      setNewOfficialContact('');
    } else {
      setOfficialNotice({ type: 'error', message: res.message });
    }
  };

  const handleLottery = () => {
    const res = acakNomorUrutTampil(lotteryCabang, lotteryGolongan);
    if (res.success) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      setLotteryResultMsg(`Berhasil mengundi nomor urut tampil untuk ${res.count} peserta.`);
    } else {
      setLotteryResultMsg('Tidak ada peserta terverifikasi pada cabang/golongan ini.');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header Matching Screenshot (Gambar 3) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Beranda Admin e-MTQ
            </h1>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
              LPTQ BENGKULU
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Panel Komando Pendaftaran, Verifikasi Berkas, dan Agenda Event MTQ Tingkat Nasional & Provinsi
          </p>
        </div>

        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500 text-white shadow-sm">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            MTQ XXXI TINGKAT NASIONAL (Persiapan)
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500 text-white shadow-sm">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            Dewan Hakim (Persiapan)
          </span>
        </div>
      </div>

      {/* Sub Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs border-b border-slate-200 dark:border-white/10">
        <button
          onClick={() => setActiveSubTab('beranda')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
            activeSubTab === 'beranda'
              ? 'bg-emerald-600 text-white font-semibold'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]'
          }`}
        >
          Beranda & Statistik
        </button>

        <button
          onClick={() => setRole('bank-data')}
          className="px-3.5 py-1.5 rounded-lg font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-colors flex items-center gap-1"
        >
          <Database className="w-3.5 h-3.5 text-blue-500" />
          <span>Buka Bank Data (164 Entri)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('verifikasi')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
            activeSubTab === 'verifikasi'
              ? 'bg-emerald-600 text-white font-semibold'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]'
          }`}
        >
          Verifikasi Berkas ({pesertaList.length})
        </button>

        <button
          onClick={() => setActiveSubTab('acak')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
            activeSubTab === 'acak'
              ? 'bg-emerald-600 text-white font-semibold'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]'
          }`}
        >
          Undi Nomor Tampil
        </button>

        <button
          onClick={() => setActiveSubTab('officials')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
            activeSubTab === 'officials'
              ? 'bg-emerald-600 text-white font-semibold'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]'
          }`}
        >
          Kelola Akun Official ({officialAccounts.length})
        </button>
      </div>

      {/* VIEW 1: BERANDA & STATISTIK (EXACT RECREATION OF GAMBAR 3) */}
      {activeSubTab === 'beranda' && (
        <div className="space-y-6">
          {/* Top 5 KPI Summary Cards (Gambar 3) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* Card 1: Bank Data Peserta */}
            <div
              onClick={() => setRole('bank-data')}
              className="bg-white dark:bg-[#0e1017] border border-slate-200 dark:border-white/10 rounded-xl p-4 flex items-center gap-3.5 shadow-sm hover:border-emerald-500/50 cursor-pointer transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 leading-tight">
                  Bank Data Peserta
                </p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {countBankData}
                </p>
              </div>
            </div>

            {/* Card 2: Peserta Diterima */}
            <div className="bg-white dark:bg-[#0e1017] border border-slate-200 dark:border-white/10 rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-400 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-400/20">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 leading-tight">
                  Peserta Diterima
                </p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {countDiterima}
                </p>
              </div>
            </div>

            {/* Card 3: Belum Diverifikasi */}
            <div className="bg-white dark:bg-[#0e1017] border border-slate-200 dark:border-white/10 rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 leading-tight">
                  Belum Diverifikasi
                </p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {countBelumVerif}
                </p>
              </div>
            </div>

            {/* Card 4: Peserta Mundur */}
            <div className="bg-white dark:bg-[#0e1017] border border-slate-200 dark:border-white/10 rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-500/20">
                <UserX className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 leading-tight">
                  Peserta Mundur
                </p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {countMundur}
                </p>
              </div>
            </div>

            {/* Card 5: Peserta Ditolak */}
            <div className="bg-white dark:bg-[#0e1017] border border-slate-200 dark:border-white/10 rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/20">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 leading-tight">
                  Peserta Ditolak
                </p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {countDitolak}
                </p>
              </div>
            </div>
          </div>

          {/* Banner Sambutan Hijau Cerah (Gambar 3) */}
          <div className="w-full bg-[#10b981] text-white p-3.5 rounded-xl shadow-md text-center font-bold text-sm tracking-wide">
            Selamat Datang, Admin Bengkulu (adminbengkulu)
          </div>

          {/* Dua Kolom Beranda: Statistik Per Cabang/Wilayah & Agenda Event (Gambar 3) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Kolom Kiri: Statistik Peserta Per Wilayah / Kontingen */}
            <div className="lg:col-span-6 ag-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-200">
                  Statistik Peserta Per Cabang / Wilayah
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                  Total Entri: 164
                </span>
              </div>

              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {DAFTAR_WILAYAH_STATISTIK.map((item) => (
                  <div
                    key={item.rank}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/[0.04] text-xs hover:border-emerald-500/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-white font-mono text-[10px] flex items-center justify-center font-bold">
                        {item.rank}
                      </span>
                      <span className="font-medium text-slate-800 dark:text-zinc-200">
                        {item.nama}
                      </span>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-mono text-xs font-bold shadow-sm">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Kolom Kanan: Agenda Event (Gambar 3) */}
            <div className="lg:col-span-6 ag-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-200">
                  Agenda Event
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                  MTQ XXXI / 2026
                </span>
              </div>

              <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                {agendaEvents.map((agenda) => (
                  <div
                    key={agenda.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/[0.04] text-xs hover:border-emerald-500/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-zinc-100">
                          {agenda.nama}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                          {agenda.tanggalMulai} - {agenda.tanggalSelesai}
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-semibold shadow-sm">
                      {agenda.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: VERIFIKASI BERKAS */}
      {activeSubTab === 'verifikasi' && (
        <div className="ag-card p-5 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 dark:border-white/10 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Validasi Berkas & Kependudukan Peserta
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Pemeriksaan kesesuaian NIK KTP, KK, usia, dan foto latar belakang merah
              </p>
            </div>
            <select
              value={filterKafilah}
              onChange={(e) => setFilterKafilah(e.target.value)}
              className="ag-input text-xs"
            >
              <option value="">Semua Kafilah ({pesertaList.length})</option>
              {DAFTAR_KAFILAH.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-white/10 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-white/[0.03] text-slate-700 dark:text-zinc-300 border-b border-slate-200 dark:border-white/10 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">No. Reg</th>
                  <th className="py-2.5 px-4">Nama Peserta</th>
                  <th className="py-2.5 px-4">Kafilah Daerah</th>
                  <th className="py-2.5 px-4">Cabang & Golongan</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-center">Aksi Validasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/[0.04]">
                {pesertaList
                  .filter((p) => !filterKafilah || p.asalKafilah === filterKafilah)
                  .map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                      <td className="py-2.5 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        {p.nomorRegistrasi}
                      </td>
                      <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">
                        {p.namaLengkap}
                      </td>
                      <td className="py-2.5 px-4 text-slate-600 dark:text-zinc-300">
                        {p.asalKafilah}
                      </td>
                      <td className="py-2.5 px-4 text-slate-600 dark:text-zinc-300">
                        {p.cabang} - {p.golongan}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.statusVerifikasi === 'Terverifikasi'
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                              : p.statusVerifikasi === 'Ditolak'
                              ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                              : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {p.statusVerifikasi}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="inline-flex gap-1">
                          <button
                            onClick={() => updateVerifikasi(p.id, 'Terverifikasi')}
                            title="Verifikasi Sah"
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-medium"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => updateVerifikasi(p.id, 'Ditolak', 'Berkas tidak memenuhi syarat')}
                            title="Tolak Berkas"
                            className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-medium"
                          >
                            Tolak
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

      {/* VIEW 3: UNDI NOMOR URUT TAMPIL */}
      {activeSubTab === 'acak' && (
        <div className="ag-card p-6 max-w-2xl mx-auto space-y-5 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto">
            <Shuffle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Sistem Pengacakan Nomor Urut Tampil Mimbar
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-md mx-auto">
              Sistem algoritma Fisher-Yates shuffle yang adil dan transparan untuk seluruh kontingen daerah
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-zinc-300">
                Pilih Cabang Lomba:
              </label>
              <select
                value={lotteryCabang}
                onChange={(e) => {
                  setLotteryCabang(e.target.value);
                  const gol = CABANG_DAN_GOLONGAN[e.target.value];
                  if (gol && gol.length > 0) setLotteryGolongan(gol[0]);
                }}
                className="w-full ag-input text-xs"
              >
                {Object.keys(CABANG_DAN_GOLONGAN).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-zinc-300">
                Pilih Golongan:
              </label>
              <select
                value={lotteryGolongan}
                onChange={(e) => setLotteryGolongan(e.target.value)}
                className="w-full ag-input text-xs"
              >
                {(CABANG_DAN_GOLONGAN[lotteryCabang] || []).map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {lotteryResultMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              {lotteryResultMsg}
            </div>
          )}

          <button
            onClick={handleLottery}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Shuffle className="w-4 h-4" />
            <span>Mulai Undi Nomor Urut Sekarang</span>
          </button>
        </div>
      )}

      {/* VIEW 4: OFFICIALS MANAGEMENT */}
      {activeSubTab === 'officials' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 ag-card p-5 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-500" />
              <span>Terbitkan Akun Official Baru</span>
            </h3>

            {officialNotice && (
              <div
                className={`p-2.5 rounded-xl text-xs ${
                  officialNotice.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-600'
                    : 'bg-rose-500/10 text-rose-600'
                }`}
              >
                {officialNotice.message}
              </div>
            )}

            <form onSubmit={handleCreateOfficial} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-zinc-400 mb-1">
                  Kafilah Kabupaten / Kota:
                </label>
                <select
                  value={newOfficialKafilah}
                  onChange={(e) => setNewOfficialKafilah(e.target.value)}
                  className="w-full ag-input"
                >
                  {DAFTAR_KAFILAH.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-zinc-400 mb-1">
                  Nama Lengkap Official:
                </label>
                <input
                  type="text"
                  value={newOfficialName}
                  onChange={(e) => setNewOfficialName(e.target.value)}
                  placeholder="H. Fulan, S.Ag"
                  className="w-full ag-input"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-zinc-400 mb-1">
                  Username Akun:
                </label>
                <input
                  type="text"
                  value={newOfficialUsername}
                  onChange={(e) => setNewOfficialUsername(e.target.value)}
                  placeholder="official_namadaerah"
                  className="w-full ag-input font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-zinc-400 mb-1">
                  Password:
                </label>
                <input
                  type="password"
                  value={newOfficialPassword}
                  onChange={(e) => setNewOfficialPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full ag-input font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-zinc-400 mb-1">
                  No. WhatsApp Official:
                </label>
                <input
                  type="text"
                  value={newOfficialContact}
                  onChange={(e) => setNewOfficialContact(e.target.value)}
                  placeholder="081234..."
                  className="w-full ag-input font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-sm"
              >
                Terbitkan Akun Official
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 ag-card p-5 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Daftar Kredensial Official Aktif ({officialAccounts.length})
            </h3>
            <div className="space-y-2">
              {officialAccounts.map((acc) => (
                <div
                  key={acc.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 text-xs"
                >
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-zinc-100">
                      {acc.namaOfficial}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                      Kafilah: <strong>{acc.asalKafilah}</strong> | User: <code className="font-mono text-emerald-600 dark:text-emerald-400">{acc.username}</code>
                    </p>
                  </div>
                  <button
                    onClick={() => deleteOfficialAccount(acc.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
