import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { DAFTAR_KAFILAH, CABANG_DAN_GOLONGAN } from '../../data/constants';
import type { BankDataPeserta } from '../../types';
import {
  X,
  Search,
  Calendar,
  Save,
  User,
  CreditCard,
  MapPin,
  Trophy,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const EditBankDataModal: React.FC = () => {
  const {
    isEditModalOpen,
    setIsEditModalOpen,
    selectedBankDataForEdit,
    setSelectedBankDataForEdit,
    addBankData,
    updateBankData,
  } = useApp();

  const isEditing = Boolean(selectedBankDataForEdit);

  // Form State
  const [nik, setNik] = useState('');
  const [namaPeserta, setNamaPeserta] = useState('');
  const [telepon, setTelepon] = useState('0');
  const [tempatLahir, setTempatLahir] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState<'LAKI-LAKI' | 'PEREMPUAN'>('LAKI-LAKI');

  // Domisili
  const [provinsi, setProvinsi] = useState('Bengkulu');
  const [kabKota, setKabKota] = useState('Kota Bengkulu');
  const [kecamatan, setKecamatan] = useState('SINGARAN PATI');
  const [alamatLengkap, setAlamatLengkap] = useState('');

  // Rekening
  const [nomorRekening, setNomorRekening] = useState('0');
  const [atasNama, setAtasNama] = useState('-');
  const [bank, setBank] = useState('-');

  // Lomba
  const [cabang, setCabang] = useState("FAHM AL QUR'AN");
  const [golongan, setGolongan] = useState("Fahm Al Qur'an Putera");
  const [kategori, setKategori] = useState<'Peserta Inti' | 'Cadangan'>('Peserta Inti');

  // Administrasi
  const [tanggalTerbitKTP, setTanggalTerbitKTP] = useState('2026-03-10');
  const [tanggalTerbitKK, setTanggalTerbitKK] = useState('2026-03-06');

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Initialize form when opening
  useEffect(() => {
    if (selectedBankDataForEdit) {
      setNik(selectedBankDataForEdit.nik);
      setNamaPeserta(selectedBankDataForEdit.namaPeserta);
      setTelepon(selectedBankDataForEdit.telepon || '0');
      setTempatLahir(selectedBankDataForEdit.tempatLahir);
      setTanggalLahir(selectedBankDataForEdit.tanggalLahir);
      setJenisKelamin(selectedBankDataForEdit.jenisKelamin);
      setProvinsi(selectedBankDataForEdit.provinsi || 'Bengkulu');
      setKabKota(selectedBankDataForEdit.kabKota || 'Kota Bengkulu');
      setKecamatan(selectedBankDataForEdit.kecamatan || 'SINGARAN PATI');
      setAlamatLengkap(selectedBankDataForEdit.alamatLengkap || '');
      setNomorRekening(selectedBankDataForEdit.nomorRekening || '0');
      setAtasNama(selectedBankDataForEdit.atasNama || '-');
      setBank(selectedBankDataForEdit.bank || '-');
      setCabang(selectedBankDataForEdit.cabang || "FAHM AL QUR'AN");
      setGolongan(selectedBankDataForEdit.golongan || "Fahm Al Qur'an Putera");
      setKategori(selectedBankDataForEdit.kategori || 'Peserta Inti');
      setTanggalTerbitKTP(selectedBankDataForEdit.tanggalTerbitKTP || '2026-03-10');
      setTanggalTerbitKK(selectedBankDataForEdit.tanggalTerbitKK || '2026-03-06');
    } else {
      // Defaults for new entry
      setNik('177102' + Math.floor(1000000000 + Math.random() * 9000000000));
      setNamaPeserta('');
      setTelepon('0812' + Math.floor(10000000 + Math.random() * 90000000));
      setTempatLahir('BENGKULU');
      setTanggalLahir('2008-12-17');
      setJenisKelamin('LAKI-LAKI');
      setProvinsi('Bengkulu');
      setKabKota('Kota Bengkulu');
      setKecamatan('SINGARAN PATI');
      setAlamatLengkap('JL MANGGIS NO. 19 DUSUN BESAR');
      setNomorRekening('0');
      setAtasNama('-');
      setBank('-');
      setCabang("FAHM AL QUR'AN");
      setGolongan("Fahm Al Qur'an Putera");
      setKategori('Peserta Inti');
      setTanggalTerbitKTP('2026-03-10');
      setTanggalTerbitKK('2026-03-06');
    }
    setFeedback(null);
  }, [selectedBankDataForEdit, isEditModalOpen]);

  // Cabang change handler
  const handleCabangChange = (newCabang: string) => {
    setCabang(newCabang);
    const availableGolongan = CABANG_DAN_GOLONGAN[newCabang];
    if (availableGolongan && availableGolongan.length > 0) {
      setGolongan(availableGolongan[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nik || !namaPeserta || !tempatLahir || !tanggalLahir) {
      setFeedback({ type: 'error', message: 'Harap lengkapi semua kolom bertanda bintang (*)' });
      return;
    }

    if (isEditing && selectedBankDataForEdit) {
      const res = updateBankData(selectedBankDataForEdit.id, {
        nik,
        namaPeserta: namaPeserta.toUpperCase(),
        telepon,
        tempatLahir: tempatLahir.toUpperCase(),
        tanggalLahir,
        jenisKelamin,
        provinsi,
        kabKota,
        kecamatan: kecamatan.toUpperCase(),
        alamatLengkap: alamatLengkap.toUpperCase(),
        nomorRekening,
        atasNama,
        bank,
        cabang,
        golongan,
        kategori,
        tanggalTerbitKTP,
        tanggalTerbitKK,
      });
      setFeedback({ type: 'success', message: res.message });
      setTimeout(() => {
        setIsEditModalOpen(false);
        setSelectedBankDataForEdit(null);
      }, 700);
    } else {
      const res = addBankData({
        nik,
        namaPeserta: namaPeserta.toUpperCase(),
        telepon,
        tempatLahir: tempatLahir.toUpperCase(),
        tanggalLahir,
        jenisKelamin,
        provinsi,
        kabKota,
        kecamatan: kecamatan.toUpperCase(),
        alamatLengkap: alamatLengkap.toUpperCase(),
        nomorRekening,
        atasNama,
        bank,
        cabang,
        golongan,
        kategori,
        tanggalTerbitKTP,
        tanggalTerbitKK,
        berkasLampiran: { ktp: true, kk: true, ijazah: true, suratMandat: false },
      });
      setFeedback({ type: 'success', message: res.message });
      setTimeout(() => {
        setIsEditModalOpen(false);
      }, 700);
    }
  };

  if (!isEditModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-3xl bg-white dark:bg-[#0e1017] text-slate-800 dark:text-zinc-100 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden my-auto"
        >
          {/* Header Modal */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                {isEditing ? 'Edit Bank Data' : 'Tambah Bank Data Peserta'}
              </h2>
            </div>
            <button
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedBankDataForEdit(null);
              }}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Feedback Alert */}
          {feedback && (
            <div
              className={`mx-6 mt-4 p-3 rounded-xl flex items-center gap-2 text-xs font-medium ${
                feedback.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Grid 1: NIK, Nama, Telepon */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-5 space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-zinc-300 flex items-center gap-1">
                  <span>NIK Peserta</span>
                  <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    placeholder="16 Digit NIK KTP/KK"
                    className="flex-1 ag-input font-mono text-xs"
                    required
                  />
                  <button
                    type="button"
                    title="Cek Database Kependudukan"
                    className="px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center transition-colors shadow-sm"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="sm:col-span-4 space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-zinc-300 flex items-center gap-1">
                  <span>Nama Peserta</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={namaPeserta}
                  onChange={(e) => setNamaPeserta(e.target.value)}
                  placeholder="Nama Lengkap Sesuai KTP"
                  className="w-full ag-input uppercase text-xs"
                  required
                />
              </div>

              <div className="sm:col-span-3 space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-zinc-300 flex items-center gap-1">
                  <span>Telepon</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={telepon}
                  onChange={(e) => setTelepon(e.target.value)}
                  placeholder="08..."
                  className="w-full ag-input font-mono text-xs"
                  required
                />
              </div>
            </div>

            {/* Grid 2: Tempat Lahir, Tanggal Lahir, Jenis Kelamin */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-zinc-300 flex items-center gap-1">
                  <span>Tempat Lahir</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={tempatLahir}
                  onChange={(e) => setTempatLahir(e.target.value)}
                  placeholder="KOTA / KABUPATEN"
                  className="w-full ag-input uppercase text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-zinc-300 flex items-center gap-1">
                  <span>Tanggal Lahir</span>
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={tanggalLahir}
                    onChange={(e) => setTanggalLahir(e.target.value)}
                    className="w-full ag-input text-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-zinc-300 flex items-center gap-1">
                  <span>Jenis Kelamin</span>
                  <span className="text-rose-500">*</span>
                </label>
                <select
                  value={jenisKelamin}
                  onChange={(e) => setJenisKelamin(e.target.value as 'LAKI-LAKI' | 'PEREMPUAN')}
                  className="w-full ag-input text-xs"
                >
                  <option value="LAKI-LAKI">LAKI-LAKI</option>
                  <option value="PEREMPUAN">PEREMPUAN</option>
                </select>
              </div>
            </div>

            {/* Section: Alamat Domisili */}
            <div className="pt-2 border-t border-slate-200 dark:border-white/10 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                <span>Alamat Domisili</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600 dark:text-zinc-400">
                    Provinsi (Sesuai KTP)<span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={provinsi}
                    onChange={(e) => setProvinsi(e.target.value)}
                    className="w-full ag-input text-xs"
                  >
                    <option value="Bengkulu">Bengkulu</option>
                    <option value="Sumatera Selatan">Sumatera Selatan</option>
                    <option value="Sumatera Barat">Sumatera Barat</option>
                    <option value="Jambi">Jambi</option>
                    <option value="Lampung">Lampung</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600 dark:text-zinc-400">
                    Kab / Kota (Sesuai KTP)<span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={kabKota}
                    onChange={(e) => setKabKota(e.target.value)}
                    className="w-full ag-input text-xs"
                  >
                    {DAFTAR_KAFILAH.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600 dark:text-zinc-400">
                    Kecamatan (Sesuai KTP)<span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={kecamatan}
                    onChange={(e) => setKecamatan(e.target.value)}
                    className="w-full ag-input uppercase text-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600 dark:text-zinc-400">
                  Alamat Lengkap Peserta<span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={alamatLengkap}
                  onChange={(e) => setAlamatLengkap(e.target.value)}
                  placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan/desa"
                  className="w-full ag-input uppercase text-xs resize-none"
                  required
                />
              </div>
            </div>

            {/* Section: Rekening */}
            <div className="pt-2 border-t border-slate-200 dark:border-white/10 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-blue-500" />
                <span>Informasi Rekening</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600 dark:text-zinc-400">
                    Nomor Rekening
                  </label>
                  <input
                    type="text"
                    value={nomorRekening}
                    onChange={(e) => setNomorRekening(e.target.value)}
                    className="w-full ag-input font-mono text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600 dark:text-zinc-400">
                    Atas Nama
                  </label>
                  <input
                    type="text"
                    value={atasNama}
                    onChange={(e) => setAtasNama(e.target.value)}
                    className="w-full ag-input text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600 dark:text-zinc-400">
                    Bank
                  </label>
                  <input
                    type="text"
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    placeholder="Bank Bengkulu / BSI / BRI / BNI"
                    className="w-full ag-input text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Section: Lomba & Kategori */}
            <div className="pt-2 border-t border-slate-200 dark:border-white/10 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Cabang & Golongan Lomba</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600 dark:text-zinc-400">
                    Cabang<span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={cabang}
                    onChange={(e) => handleCabangChange(e.target.value)}
                    className="w-full ag-input text-xs font-semibold"
                  >
                    <option value="FAHM AL QUR'AN">FAHM AL QUR'AN</option>
                    <option value="TILAWAH AL-QUR'AN">TILAWAH AL-QUR'AN</option>
                    <option value="HIFZHIL QUR'AN">HIFZHIL QUR'AN</option>
                    <option value="SYARHIL QUR'AN">SYARHIL QUR'AN</option>
                    <option value="KALIGRAFI AL-QUR'AN">KALIGRAFI AL-QUR'AN</option>
                    <option value="QIRO'AT AL-QUR'AN">QIRO'AT AL-QUR'AN</option>
                    <option value="KTIQ (KARYA TULIS)">KTIQ (KARYA TULIS)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600 dark:text-zinc-400">
                    Golongan<span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={golongan}
                    onChange={(e) => setGolongan(e.target.value)}
                    placeholder="Contoh: Fahm Al Qur'an Putera"
                    className="w-full ag-input text-xs font-medium"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600 dark:text-zinc-400">
                    Kategori<span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value as 'Peserta Inti' | 'Cadangan')}
                    className="w-full ag-input text-xs"
                  >
                    <option value="Peserta Inti">Peserta Inti</option>
                    <option value="Cadangan">Cadangan</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section: Administrasi Kependudukan */}
            <div className="pt-2 border-t border-slate-200 dark:border-white/10 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-500" />
                <span>Administrasi Kependudukan</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600 dark:text-zinc-400">
                    Tanggal Terbit KTP<span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={tanggalTerbitKTP}
                    onChange={(e) => setTanggalTerbitKTP(e.target.value)}
                    className="w-full ag-input text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600 dark:text-zinc-400">
                    Tanggal Terbit KK<span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={tanggalTerbitKK}
                    onChange={(e) => setTanggalTerbitKK(e.target.value)}
                    className="w-full ag-input text-xs"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedBankDataForEdit(null);
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Simpan Perubahan' : 'Tambah ke Bank Data'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
