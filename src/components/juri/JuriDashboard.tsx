import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KRITERIA_PENILAIAN_CABANG } from '../../data/constants';
import confetti from 'canvas-confetti';
import {
  Gavel,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sliders,
  Send,
} from 'lucide-react';

export const JuriDashboard: React.FC = () => {
  const { pesertaList, penilaianList, simpanNilai, setRole } = useApp();

  const [juriNama, setJuriNama] = useState<string>(
    'K.H. Dr. Ahmad Dahlan, M.A (Ketua Majelis Hakim)'
  );
  const [juriId] = useState<string>('JURI-BKL-01');

  const [selectedPesertaId, setSelectedPesertaId] = useState<string>('');

  const currentPeserta = pesertaList.find((p) => p.id === selectedPesertaId) || null;
  const livePesertaList = pesertaList.filter((p) => p.statusTampil === 'Sedang Tampil');

  React.useEffect(() => {
    if (!selectedPesertaId && livePesertaList.length > 0) {
      setSelectedPesertaId(livePesertaList[0].id);
    }
  }, [livePesertaList, selectedPesertaId]);

  const existingScore = currentPeserta
    ? penilaianList.find((n) => n.pesertaId === currentPeserta.id)
    : null;

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

  const [nilai1, setNilai1] = useState<number>(30);
  const [nilai2, setNilai2] = useState<number>(25);
  const [nilai3, setNilai3] = useState<number>(35);
  const [catatan, setCatatan] = useState<string>('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  React.useEffect(() => {
    if (existingScore) {
      setNilai1(existingScore.komponen.bidang1.nilai);
      setNilai2(existingScore.komponen.bidang2.nilai);
      setNilai3(existingScore.komponen.bidang3.nilai);
      setCatatan(existingScore.catatanDewanHakim);
    } else if (currentPeserta) {
      setNilai1(Math.round(criteria.bidang1.maks * 0.9 * 10) / 10);
      setNilai2(Math.round(criteria.bidang2.maks * 0.9 * 10) / 10);
      setNilai3(Math.round(criteria.bidang3.maks * 0.9 * 10) / 10);
      setCatatan('');
    }
    setNotification(null);
  }, [selectedPesertaId, existingScore, currentPeserta]);

  const totalCalculated = Number((nilai1 + nilai2 + nilai3).toFixed(2));

  const isCurrentlyLive = currentPeserta?.statusTampil === 'Sedang Tampil';
  const isAlreadyFinished = currentPeserta?.statusTampil === 'Sudah Tampil';
  const isLocked = isAlreadyFinished || (existingScore?.isLocked ?? false);

  const handleSubmitScore = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPeserta) return;

    if (!isCurrentlyLive) {
      setNotification({
        type: 'error',
        message: 'Nilai hanya dapat diinput saat peserta berstatus "Sedang Tampil".',
      });
      return;
    }

    if (isLocked) {
      setNotification({
        type: 'error',
        message: 'Form penilaian telah terkunci karena status peserta sudah "Sudah Tampil".',
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
        particleCount: 50,
        spread: 50,
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
      {/* Header Minimalist */}
      <div className="border-b border-white/[0.08] pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-mono tracking-widest uppercase text-emerald-400">
            ROLE 04 • MAJELIS DEWAN HAKIM
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Lembar Penilaian Digital Dewan Hakim
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-1.5 leading-relaxed">
          Form penilaian hanya aktif saat peserta berada di panggung mimbar ("Sedang Tampil"), dan otomatis terkunci permanen begitu status diubah menjadi "Sudah Tampil".
        </p>
      </div>

      {/* Identity Bar */}
      <div className="ag-card p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <Gavel className="w-4 h-4 text-zinc-400" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-mono">Hakim Bertugas:</span>
            <input
              type="text"
              value={juriNama}
              onChange={(e) => setJuriNama(e.target.value)}
              className="text-xs font-semibold text-white bg-transparent border-b border-white/20 pb-0.5 focus:outline-none"
            />
          </div>
        </div>
        <span className="font-mono text-[11px] text-zinc-400 bg-white/[0.03] px-2.5 py-1 rounded-full border border-white/[0.08]">
          ID: {juriId}
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Mimbar Roster (4 Cols) */}
        <div className="lg:col-span-4 ag-card p-5 space-y-4">
          <div className="pb-3 border-b border-white/[0.06] flex justify-between items-center">
            <span className="text-xs font-mono tracking-wider uppercase text-zinc-400">
              ANTREAN MIMBAR
            </span>
            {livePesertaList.length > 0 && (
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {livePesertaList.length} Live
              </span>
            )}
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
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
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white/[0.08] border-white/30 text-white'
                        : isLive
                        ? 'bg-emerald-500/[0.04] border-emerald-500/30 text-zinc-200'
                        : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-10 rounded bg-red-600/90 p-0.5 border border-white/20 shrink-0 overflow-hidden">
                        <img src={p.fotoUrl} alt={p.namaLengkap} className="w-full h-full object-cover rounded" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span>NO.{p.nomorUrutTampil || '-'}</span>
                          <span className={isLive ? 'text-emerald-400 font-bold' : isFinished ? 'text-zinc-500' : 'text-zinc-500'}>
                            {p.statusTampil}
                          </span>
                        </div>
                        <h4 className="text-xs font-medium text-white truncate mt-0.5">{p.namaLengkap}</h4>
                        <p className="text-[10px] text-zinc-400 truncate">{p.asalKafilah}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          <button
            onClick={() => setRole('admin')}
            className="w-full pt-3 border-t border-white/[0.06] text-left text-[11px] text-zinc-400 hover:text-white transition-colors"
          >
            Kendalikan status mimbar di Admin Pusat →
          </button>
        </div>

        {/* Right: Judging Sheet (8 Cols) */}
        <div className="lg:col-span-8 ag-card p-6 sm:p-7 space-y-6">
          {currentPeserta ? (
            <>
              {/* Header Participant Spotlight */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-16 rounded-xl bg-red-600/90 p-0.5 border border-white/20 shrink-0 overflow-hidden">
                    <img src={currentPeserta.fotoUrl} alt={currentPeserta.namaLengkap} className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white tracking-tight">
                      {currentPeserta.namaLengkap}
                    </h2>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {currentPeserta.asalKafilah} • {currentPeserta.cabang} ({currentPeserta.golongan})
                    </p>
                  </div>
                </div>

                <div>
                  {isCurrentlyLive ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      SEDANG TAMPIL (AKTIF)
                    </span>
                  ) : isAlreadyFinished ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-white/[0.05] text-zinc-400 border border-white/10">
                      <Lock className="w-3 h-3" />
                      SUDAH TAMPIL (TERKUNCI)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-white/[0.02] text-zinc-500 border border-white/[0.06]">
                      <Clock className="w-3 h-3" />
                      BELUM TAMPIL
                    </span>
                  )}
                </div>
              </div>

              {notification && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    notification.type === 'success'
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-300 border border-red-500/20'
                  }`}
                >
                  {notification.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  )}
                  <span>{notification.message}</span>
                </div>
              )}

              {/* Sliders Form */}
              <form onSubmit={handleSubmitScore} className="space-y-5">
                <div className="space-y-3.5">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 block">
                    KOMPONEN PENILAIAN CABANG: {currentPeserta.cabang}
                  </span>

                  {/* Bidang 1 */}
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-200">{criteria.bidang1.nama}</span>
                      <span className="font-mono text-zinc-400">Maks. {criteria.bidang1.maks}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max={criteria.bidang1.maks}
                        step="0.5"
                        value={nilai1}
                        disabled={isLocked || !isCurrentlyLive}
                        onChange={(e) => setNilai1(parseFloat(e.target.value) || 0)}
                        className="flex-1 accent-emerald-500 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <input
                        type="number"
                        min="0"
                        max={criteria.bidang1.maks}
                        step="0.5"
                        value={nilai1}
                        disabled={isLocked || !isCurrentlyLive}
                        onChange={(e) => setNilai1(Math.min(criteria.bidang1.maks, Math.max(0, parseFloat(e.target.value) || 0)))}
                        className="w-16 ag-input py-1 text-center font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* Bidang 2 */}
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-200">{criteria.bidang2.nama}</span>
                      <span className="font-mono text-zinc-400">Maks. {criteria.bidang2.maks}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max={criteria.bidang2.maks}
                        step="0.5"
                        value={nilai2}
                        disabled={isLocked || !isCurrentlyLive}
                        onChange={(e) => setNilai2(parseFloat(e.target.value) || 0)}
                        className="flex-1 accent-emerald-500 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <input
                        type="number"
                        min="0"
                        max={criteria.bidang2.maks}
                        step="0.5"
                        value={nilai2}
                        disabled={isLocked || !isCurrentlyLive}
                        onChange={(e) => setNilai2(Math.min(criteria.bidang2.maks, Math.max(0, parseFloat(e.target.value) || 0)))}
                        className="w-16 ag-input py-1 text-center font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* Bidang 3 */}
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-200">{criteria.bidang3.nama}</span>
                      <span className="font-mono text-zinc-400">Maks. {criteria.bidang3.maks}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max={criteria.bidang3.maks}
                        step="0.5"
                        value={nilai3}
                        disabled={isLocked || !isCurrentlyLive}
                        onChange={(e) => setNilai3(parseFloat(e.target.value) || 0)}
                        className="flex-1 accent-emerald-500 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <input
                        type="number"
                        min="0"
                        max={criteria.bidang3.maks}
                        step="0.5"
                        value={nilai3}
                        disabled={isLocked || !isCurrentlyLive}
                        onChange={(e) => setNilai3(Math.min(criteria.bidang3.maks, Math.max(0, parseFloat(e.target.value) || 0)))}
                        className="w-16 ag-input py-1 text-center font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Catatan Dewan Hakim:</label>
                  <textarea
                    rows={2}
                    value={catatan}
                    disabled={isLocked || !isCurrentlyLive}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Catatan fashohah, makharijul huruf, atau lagu..."
                    className="w-full ag-input"
                  />
                </div>

                {/* Score Summary Box */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 block">
                      TOTAL NILAI TERHITUNG
                    </span>
                    <span className="text-3xl font-bold font-mono text-white">
                      {totalCalculated.toFixed(2)}
                      <span className="text-xs font-normal text-zinc-500 ml-1">/ 100</span>
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLocked || !isCurrentlyLive}
                    className={`px-6 py-2.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
                      isCurrentlyLive && !isLocked
                        ? 'bg-white text-black hover:bg-zinc-200 cursor-pointer'
                        : 'bg-white/[0.05] text-zinc-500 cursor-not-allowed border border-white/[0.06]'
                    }`}
                  >
                    {isLocked ? (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        Nilai Terkunci Permanen
                      </>
                    ) : isCurrentlyLive ? (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Simpan & Sahkan Nilai
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5" />
                        Menunggu Status "Sedang Tampil"
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="p-12 text-center text-zinc-400 text-xs">
              Pilih peserta dari daftar antrean mimbar di sebelah kiri.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
