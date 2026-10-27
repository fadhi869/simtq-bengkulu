import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KRITERIA_PENILAIAN_CABANG } from '../../data/constants';
import type { Peserta, PenilaianPeserta } from '../../types';
import confetti from 'canvas-confetti';
import {
  Gavel,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Radio,
  Sliders,
  FileText,
  UserCheck,
  Shield,
  Send,
} from 'lucide-react';

export const JuriDashboard: React.FC = () => {
  const { pesertaList, penilaianList, simpanNilai, setRole } = useApp();

  // Judge Identity
  const [juriNama, setJuriNama] = useState<string>(
    'K.H. Dr. Ahmad Dahlan, M.A (Ketua Majelis Hakim)'
  );
  const [juriId, setJuriId] = useState<string>('JURI-BKL-01');

  // Selected participant to judge
  const [selectedPesertaId, setSelectedPesertaId] = useState<string>('');

  // Find the selected participant
  const currentPeserta = pesertaList.find((p) => p.id === selectedPesertaId) || null;

  // Active participants on stage
  const livePesertaList = pesertaList.filter((p) => p.statusTampil === 'Sedang Tampil');

  // Auto-select first live participant if none selected
  React.useEffect(() => {
    if (!selectedPesertaId && livePesertaList.length > 0) {
      setSelectedPesertaId(livePesertaList[0].id);
    }
  }, [livePesertaList, selectedPesertaId]);

  // Existing score for this participant if any
  const existingScore = currentPeserta
    ? penilaianList.find((n) => n.pesertaId === currentPeserta.id)
    : null;

  // Criteria according to the branch
  const criteria = currentPeserta
    ? KRITERIA_PENILAIAN_CABANG[currentPeserta.cabang] || {
        bidang1: { nama: 'Tajwid / Ketepatan', maks: 40 },
        bidang2: { nama: 'Fashohah / Kelancaran', maks: 30 },
        bidang3: { nama: 'Irama & Adab', maks: 30 },
      }
    : {
        bidang1: { nama: 'Tajwid / Ketepatan', maks: 40 },
        bidang2: { nama: 'Fashohah / Kelancaran', maks: 30 },
        bidang3: { nama: 'Irama & Adab', maks: 30 },
      };

  // Form scores state
  const [nilai1, setNilai1] = useState<number>(30);
  const [nilai2, setNilai2] = useState<number>(25);
  const [nilai3, setNilai3] = useState<number>(35);
  const [catatan, setCatatan] = useState<string>('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Sync state when participant selection changes
  React.useEffect(() => {
    if (existingScore) {
      setNilai1(existingScore.komponen.bidang1.nilai);
      setNilai2(existingScore.komponen.bidang2.nilai);
      setNilai3(existingScore.komponen.bidang3.nilai);
      setCatatan(existingScore.catatanDewanHakim);
    } else if (currentPeserta) {
      // Default initial reasonable test values
      setNilai1(Math.round(criteria.bidang1.maks * 0.9 * 10) / 10);
      setNilai2(Math.round(criteria.bidang2.maks * 0.9 * 10) / 10);
      setNilai3(Math.round(criteria.bidang3.maks * 0.9 * 10) / 10);
      setCatatan('');
    }
    setNotification(null);
  }, [selectedPesertaId, existingScore, currentPeserta]);

  const totalCalculated = Number((nilai1 + nilai2 + nilai3).toFixed(2));

  // Determine lock conditions strictly as required in prompt:
  // "Juri hanya dapat menginput nilai kepada peserta yang statusnya diubah Admin menjadi 'Sedang Tampil'."
  // "Jika status peserta sudah diubah menjadi 'Sudah Tampil', form input nilai otomatis TERKUNCI dan Juri tidak bisa lagi mengubah nilai tersebut."
  const isCurrentlyLive = currentPeserta?.statusTampil === 'Sedang Tampil';
  const isAlreadyFinished = currentPeserta?.statusTampil === 'Sudah Tampil';
  const isLocked = isAlreadyFinished || (existingScore?.isLocked ?? false);

  const handleSubmitScore = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPeserta) return;

    if (!isCurrentlyLive) {
      setNotification({
        type: 'error',
        message:
          'PROTEKSI PENILAIAN: Nilai hanya dapat diinput kepada peserta yang sedang aktif tampil di mimbar ("Sedang Tampil").',
      });
      return;
    }

    if (isLocked) {
      setNotification({
        type: 'error',
        message:
          'PROTEKSI NILAI: Form penilaian telah TERKUNCI secara permanen karena status peserta sudah diubah menjadi "Sudah Tampil".',
      });
      return;
    }

    const res = simpanNilai({
      pesertaId: currentPeserta.id,
      juriId,
      juriNama,
      komponen: {
        bidang1: { nama: criteria.bidang1.nama, nilai: nilai1, maks: criteria.bidang1.maks },
        bidang2: { nama: criteria.bidang2.nama, nilai: nilai2, maks: criteria.bidang2.maks },
        bidang3: { nama: criteria.bidang3.nama, nilai: nilai3, maks: criteria.bidang3.maks },
      },
      totalNilai: totalCalculated,
      catatanDewanHakim: catatan,
    });

    if (res.success) {
      setNotification({
        type: 'success',
        message: res.message,
      });
      confetti({
        particleCount: 60,
        spread: 55,
        origin: { y: 0.6 },
      });
    } else {
      setNotification({
        type: 'error',
        message: res.message,
      });
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 border border-amber-400/30">
            <Gavel className="w-3.5 h-3.5" />
            ROLE 4: MAJELIS DEWAN HAKIM / JURI
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Lembar Penilaian Digital Dewan Hakim
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-normal">
            Sistem penilaian terproteksi standar LPTQ Nasional.
            <strong className="text-amber-300 font-bold ml-1">
              Form nilai hanya aktif saat peserta berstatus "Sedang Tampil", dan otomatis terkunci permanen saat peserta berstatus "Sudah Tampil".
            </strong>
          </p>
        </div>
      </div>

      {/* Identity Selector */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-600 block">
              Dewan Hakim Bertugas:
            </label>
            <input
              type="text"
              value={juriNama}
              onChange={(e) => setJuriNama(e.target.value)}
              className="text-sm font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">ID Hakim:</span>
          <span className="font-mono text-xs bg-slate-100 px-2.5 py-1 rounded font-bold text-slate-700">
            {juriId}
          </span>
        </div>
      </div>

      {/* Main Grid: Participant Selector & Active Judging Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col (4 Cols): Mimbar Roster & Selector */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Daftar Peserta di Mimbar
              </h3>
              <p className="text-[11px] text-slate-600">
                Pilih peserta untuk membuka lembar nilai
              </p>
            </div>
            {livePesertaList.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[10px] animate-pulse">
                {livePesertaList.length} Live
              </span>
            )}
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {pesertaList
              .filter((p) => p.statusVerifikasi === 'Terverifikasi')
              .map((p) => {
                const isSelected = selectedPesertaId === p.id;
                const isLive = p.statusTampil === 'Sedang Tampil';
                const isFinished = p.statusTampil === 'Sudah Tampil';

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPesertaId(p.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-500'
                        : isLive
                        ? 'border-red-400 bg-red-50/50 hover:bg-red-50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 rounded-lg bg-red-600 p-0.5 border border-red-700 shrink-0 overflow-hidden shadow-sm">
                        <img
                          src={p.fotoUrl}
                          alt={p.namaLengkap}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold font-mono text-slate-600">
                            No. {p.nomorUrutTampil || '-'}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              isLive
                                ? 'bg-red-600 text-white animate-pulse'
                                : isFinished
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {p.statusTampil}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                          {p.namaLengkap}
                        </h4>
                        <p className="text-[10px] text-slate-600 truncate">
                          {p.asalKafilah} • {p.cabang}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-600">
            <span className="block mb-1">
              💡 <em>Ingin mengganti peserta yang tampil?</em>
            </span>
            <button
              onClick={() => setRole('admin')}
              className="text-emerald-800 hover:text-emerald-950 font-bold underline text-xs"
            >
              Buka Manajemen Status di Admin Pusat →
            </button>
          </div>
        </div>

        {/* Right Col (8 Cols): Formulir Penilaian & Proteksi Status */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6 relative">
          {currentPeserta ? (
            <>
              {/* Header Participant Info & Lock Banner */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-18 rounded-xl bg-red-600 p-1 border-2 border-red-700 shadow shrink-0 overflow-hidden">
                    <img
                      src={currentPeserta.fotoUrl}
                      alt={currentPeserta.namaLengkap}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black text-slate-900">
                        {currentPeserta.namaLengkap}
                      </h2>
                      <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300">
                        {currentPeserta.asalKafilah}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">
                      {currentPeserta.cabang} •{' '}
                      <span className="text-emerald-800 font-bold">
                        {currentPeserta.golongan}
                      </span>
                    </p>
                    <div className="text-[10px] text-slate-600 mt-1 flex items-center gap-2">
                      <span>No. Registrasi: {currentPeserta.nomorRegistrasi}</span>
                      <span>•</span>
                      <span>No. Tampil: {currentPeserta.nomorUrutTampil || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* Status Indicator Badge */}
                <div className="text-right">
                  {isCurrentlyLive ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold uppercase tracking-wider animate-pulse shadow-md">
                      <Radio className="w-4 h-4" />
                      Sedang Tampil (Form Terbuka)
                    </div>
                  ) : isAlreadyFinished ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400 shadow-md">
                      <Lock className="w-4 h-4 text-amber-300" />
                      Sudah Tampil (Form Terkunci)
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider border border-slate-300">
                      <Clock className="w-4 h-4" />
                      Belum Tampil (Menunggu)
                    </div>
                  )}
                </div>
              </div>

              {/* Status Warning Banner */}
              {!isCurrentlyLive && (
                <div
                  className={`p-4 rounded-2xl text-xs flex items-start gap-3 ${
                    isAlreadyFinished
                      ? 'bg-amber-50 border-2 border-amber-300 text-amber-950'
                      : 'bg-slate-100 border border-slate-300 text-slate-700'
                  }`}
                >
                  {isAlreadyFinished ? (
                    <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <Clock className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                  )}
                  <div className="leading-relaxed">
                    <h4 className="font-extrabold text-sm mb-1">
                      {isAlreadyFinished
                        ? 'FORM PENILAIAN TERKUNCI SECARA PERMANEN'
                        : 'FORM PENILAIAN BELUM DIBUKA'}
                    </h4>
                    <p>
                      {isAlreadyFinished
                        ? 'Status peserta telah diubah menjadi "Sudah Tampil". Sesuai regulasi sistem, seluruh lembar nilai telah disahkan dan dikunci sehingga tidak dapat lagi diedit oleh Dewan Hakim.'
                        : 'Peserta belum dipanggil ke atas mimbar lomba ("Belum Tampil"). Dewan Hakim hanya dapat menginput nilai setelah Admin Pusat mengubah status menjadi "Sedang Tampil".'}
                    </p>
                  </div>
                </div>
              )}

              {notification && (
                <div
                  className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                    notification.type === 'success'
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-red-50 text-red-900 border border-red-200'
                  }`}
                >
                  {notification.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <span className="font-medium">{notification.message}</span>
                </div>
              )}

              {/* Judging Input Form */}
              <form onSubmit={handleSubmitScore} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-emerald-700" />
                      Komponen Penilaian Cabang: {currentPeserta.cabang}
                    </h3>
                    <span className="text-[11px] text-slate-600">Skala Standar LPTQ (0 - 100)</span>
                  </div>

                  {/* Bidang 1 */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800">
                        1. {criteria.bidang1.nama}
                      </span>
                      <span className="font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        Maks. {criteria.bidang1.maks} Poin
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max={criteria.bidang1.maks}
                        step="0.5"
                        value={nilai1}
                        disabled={isLocked || !isCurrentlyLive}
                        onChange={(e) => setNilai1(parseFloat(e.target.value) || 0)}
                        className="flex-1 accent-emerald-700 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <input
                        type="number"
                        min="0"
                        max={criteria.bidang1.maks}
                        step="0.5"
                        value={nilai1}
                        disabled={isLocked || !isCurrentlyLive}
                        onChange={(e) => setNilai1(Math.min(criteria.bidang1.maks, Math.max(0, parseFloat(e.target.value) || 0)))}
                        className="w-20 text-center text-sm font-black text-slate-900 bg-white border border-slate-300 rounded-xl py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 disabled:text-slate-600"
                      />
                    </div>
                  </div>

                  {/* Bidang 2 */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800">
                        2. {criteria.bidang2.nama}
                      </span>
                      <span className="font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        Maks. {criteria.bidang2.maks} Poin
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max={criteria.bidang2.maks}
                        step="0.5"
                        value={nilai2}
                        disabled={isLocked || !isCurrentlyLive}
                        onChange={(e) => setNilai2(parseFloat(e.target.value) || 0)}
                        className="flex-1 accent-emerald-700 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <input
                        type="number"
                        min="0"
                        max={criteria.bidang2.maks}
                        step="0.5"
                        value={nilai2}
                        disabled={isLocked || !isCurrentlyLive}
                        onChange={(e) => setNilai2(Math.min(criteria.bidang2.maks, Math.max(0, parseFloat(e.target.value) || 0)))}
                        className="w-20 text-center text-sm font-black text-slate-900 bg-white border border-slate-300 rounded-xl py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 disabled:text-slate-600"
                      />
                    </div>
                  </div>

                  {/* Bidang 3 */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800">
                        3. {criteria.bidang3.nama}
                      </span>
                      <span className="font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        Maks. {criteria.bidang3.maks} Poin
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max={criteria.bidang3.maks}
                        step="0.5"
                        value={nilai3}
                        disabled={isLocked || !isCurrentlyLive}
                        onChange={(e) => setNilai3(parseFloat(e.target.value) || 0)}
                        className="flex-1 accent-emerald-700 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <input
                        type="number"
                        min="0"
                        max={criteria.bidang3.maks}
                        step="0.5"
                        value={nilai3}
                        disabled={isLocked || !isCurrentlyLive}
                        onChange={(e) => setNilai3(Math.min(criteria.bidang3.maks, Math.max(0, parseFloat(e.target.value) || 0)))}
                        className="w-20 text-center text-sm font-black text-slate-900 bg-white border border-slate-300 rounded-xl py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 disabled:text-slate-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Feedback / Catatan Juri */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Catatan Evaluasi / Catatan Dewan Hakim:
                  </label>
                  <textarea
                    rows={3}
                    value={catatan}
                    disabled={isLocked || !isCurrentlyLive}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Catatan tajwid, waqaf ibtida', keutuhan lagu maqam, atau kelancaran hafalan..."
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium disabled:bg-slate-100 disabled:text-slate-600"
                  />
                </div>

                {/* Score Summary Box */}
                <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 rounded-2xl p-6 text-white shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                      TOTAL NILAI TERHITUNG
                    </span>
                    <span className="text-3xl sm:text-4xl font-black font-sans text-white">
                      {totalCalculated.toFixed(2)}
                      <span className="text-lg font-normal text-emerald-300 ml-1">/ 100</span>
                    </span>
                  </div>

                  {/* Submission Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={isLocked || !isCurrentlyLive}
                      className={`py-3.5 px-6 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center gap-2 ${
                        isCurrentlyLive && !isLocked
                          ? 'bg-amber-500 hover:bg-amber-400 text-emerald-950 cursor-pointer hover:scale-105'
                          : 'bg-slate-700 text-slate-400 cursor-not-allowed border border-slate-600'
                      }`}
                    >
                      {isLocked ? (
                        <>
                          <Lock className="w-4 h-4 text-amber-400" />
                          Nilai Telah Terkunci
                        </>
                      ) : isCurrentlyLive ? (
                        <>
                          <Send className="w-4 h-4" />
                          Simpan & Sahkan Nilai
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4" />
                          Menunggu Status "Sedang Tampil"
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </>
          ) : (
            <div className="p-12 text-center text-slate-600">
              <Gavel className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-700">Pilih Peserta untuk Dinilai</h4>
              <p className="text-xs text-slate-600 mt-1">
                Pilih salah satu peserta dari daftar mimbar di sebelah kiri.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
