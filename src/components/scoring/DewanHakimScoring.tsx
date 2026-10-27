import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MIMBAR_LIST, CABANG_DAN_GOLONGAN } from '../../data/constants';
import type { Peserta } from '../../types';
import confetti from 'canvas-confetti';
import {
  Award,
  Radio,
  Lock,
  Save,
  CheckCircle2,
  Clock,
  Sparkles,
  Trophy,
  User,
  Sliders,
  ShieldCheck,
} from 'lucide-react';

export const DewanHakimScoring: React.FC = () => {
  const {
    pesertaList,
    penilaianList,
    updatePenilaianHakim,
    updateStatusTampil,
  } = useApp();

  const [selectedMimbar, setSelectedMimbar] = useState(MIMBAR_LIST[0]);
  const [selectedCabang, setSelectedCabang] = useState<string>("Tilawah Al-Qur'an");

  // Selected participant to grade
  const [activePesertaId, setActivePesertaId] = useState<string>(
    pesertaList.find((p) => p.statusTampil === 'Sedang Tampil')?.id || pesertaList[0]?.id || ''
  );

  const activePeserta = pesertaList.find((p) => p.id === activePesertaId);
  const activePenilaian = penilaianList.find((n) => n.pesertaId === activePesertaId);

  // Scoring form states
  const [bidang1, setBidang1] = useState<number>(activePenilaian?.komponen?.bidang1.nilai || 45);
  const [bidang2, setBidang2] = useState<number>(activePenilaian?.komponen?.bidang2.nilai || 28);
  const [bidang3, setBidang3] = useState<number>(activePenilaian?.komponen?.bidang3.nilai || 19);
  const [catatan, setCatatan] = useState<string>(
    activePenilaian?.catatan || 'Makharijul huruf sangat fasih, variasi lagu rapi.'
  );
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const totalNilai = parseFloat((bidang1 + bidang2 + bidang3).toFixed(2));

  const handleSelectPeserta = (p: Peserta) => {
    setActivePesertaId(p.id);
    const existing = penilaianList.find((n) => n.pesertaId === p.id);
    if (existing) {
      setBidang1(existing.komponen?.bidang1.nilai || 45);
      setBidang2(existing.komponen?.bidang2.nilai || 28);
      setBidang3(existing.komponen?.bidang3.nilai || 18);
      setCatatan(existing.catatan || '');
    } else {
      setBidang1(45);
      setBidang2(27);
      setBidang3(18);
      setCatatan('Penampilan sangat baik dan tartil.');
    }
  };

  const handleSaveScore = (lock: boolean = false) => {
    if (!activePeserta) return;
    updatePenilaianHakim(activePeserta.id, bidang1, bidang2, bidang3, catatan, lock);

    if (lock) {
      updateStatusTampil(activePeserta.id, 'Sudah Tampil', selectedMimbar);
      confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
      setSuccessNotice(`Nilai Peserta ${activePeserta.namaLengkap} (${totalNilai}) BERHASIL DISAHKAN & DIKUNCI!`);
    } else {
      setSuccessNotice(`Nilai draft untuk ${activePeserta.namaLengkap} tersimpan.`);
    }

    setTimeout(() => setSuccessNotice(null), 3500);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Portal e-Scoring Dewan Hakim
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Penilaian digital langsung terintegrasi untuk Dewan Hakim & Panitia Panitera MTQ Provinsi Bengkulu
          </p>
        </div>

        {/* Mimbar selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Mimbar:</span>
          <select
            value={selectedMimbar}
            onChange={(e) => setSelectedMimbar(e.target.value)}
            className="ag-input text-xs font-semibold"
          >
            {MIMBAR_LIST.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {successNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Main Grid: Peserta List on Left, Grading Pad on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Peserta Queue on this Stage */}
        <div className="lg:col-span-5 ag-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
            <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-200 flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-500" />
              <span>Daftar Peserta Mimbar</span>
            </h3>
            <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">
              LIVE ARENA
            </span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {pesertaList.map((p) => {
              const isSelected = p.id === activePesertaId;
              const n = penilaianList.find((item) => item.pesertaId === p.id);

              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectPeserta(p)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500 dark:border-emerald-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 hover:border-emerald-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-slate-500 dark:text-zinc-400">
                      {p.nomorRegistrasi}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        p.statusTampil === 'Sedang Tampil'
                          ? 'bg-emerald-500 text-white animate-pulse'
                          : p.statusTampil === 'Sudah Tampil'
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-zinc-300'
                      }`}
                    >
                      {p.statusTampil}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-800 dark:text-zinc-100">
                    {p.namaLengkap}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
                    <span>{p.asalKafilah}</span>
                    {n && (
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        Skor: {n.totalNilai}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Digital Grading Pad */}
        <div className="lg:col-span-7 ag-card p-6 space-y-5">
          {activePeserta ? (
            <>
              {/* Peserta Identity Banner */}
              <div className="flex items-start justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                      {activePeserta.nomorRegistrasi}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                      {activePeserta.asalKafilah}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {activePeserta.namaLengkap}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Cabang: <strong>{activePeserta.cabang}</strong> | Golongan: <strong>{activePeserta.golongan}</strong>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Total Nilai Akhir
                  </span>
                  <span className="text-3xl font-mono font-extrabold text-emerald-600 dark:text-[#00FF87] tracking-tight">
                    {totalNilai.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Scoring Sliders */}
              <div className="space-y-4">
                {/* Bidang 1: Tajwid & Makhraj (Maks 50) */}
                <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700 dark:text-zinc-200">
                      1. Tajwid & Makharijul Huruf (Maks. 50)
                    </span>
                    <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                      {bidang1}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="50"
                    step="0.5"
                    value={bidang1}
                    onChange={(e) => setBidang1(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Min: 20</span>
                    <span>Standar: 40</span>
                    <span>Maks: 50</span>
                  </div>
                </div>

                {/* Bidang 2: Suara & Irama Lagu (Maks 30) */}
                <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700 dark:text-zinc-200">
                      2. Fashohah & Irama Suara (Maks. 30)
                    </span>
                    <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                      {bidang2}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="30"
                    step="0.5"
                    value={bidang2}
                    onChange={(e) => setBidang2(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Min: 10</span>
                    <span>Standar: 25</span>
                    <span>Maks: 30</span>
                  </div>
                </div>

                {/* Bidang 3: Adab & Ketertiban (Maks 20) */}
                <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700 dark:text-zinc-200">
                      3. Adab Tilawah & Ketertiban (Maks. 20)
                    </span>
                    <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                      {bidang3}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    step="0.5"
                    value={bidang3}
                    onChange={(e) => setBidang3(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Min: 5</span>
                    <span>Standar: 17</span>
                    <span>Maks: 20</span>
                  </div>
                </div>

                {/* Catatan Dewan Hakim */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                    Catatan Khusus Dewan Hakim:
                  </label>
                  <textarea
                    rows={2}
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Catatan kelebihan, kekurangan makhraj, atau intonasi..."
                    className="w-full ag-input text-xs resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => handleSaveScore(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Sementara (Draft)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveScore(true)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Kunci & Sahkan Nilai (Final)</span>
                </button>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400">
              Pilih peserta di panel sebelah kiri untuk memulai penilaian.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
