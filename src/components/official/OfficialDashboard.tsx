import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DAFTAR_KAFILAH } from '../../data/constants';
import {
  Users,
  UserPlus,
  ShieldCheck,
  CheckCircle,
  Clock,
  Printer,
  Search,
  AlertCircle,
  FileText,
  Trash2,
  Sparkles,
} from 'lucide-react';

export const OfficialDashboard: React.FC = () => {
  const { calonPesertaList, addCalonPeserta, deleteCalonPeserta, setRole } = useApp();

  const [selectedKafilah, setSelectedKafilah] = useState<string>('Kota Bengkulu');
  const [namaLengkap, setNamaLengkap] = useState<string>('');
  const [nik, setNik] = useState<string>('');
  const [namaOfficial, setNamaOfficial] = useState<string>('Drs. H. Ahmad Zarkasi, M.Pd');
  const [nomorKontakOfficial, setNomorKontakOfficial] = useState<string>('081273948201');

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!namaLengkap.trim() || !nik.trim()) {
      setNotification({
        type: 'error',
        message: 'Nama Lengkap dan NIK Calon Peserta wajib diisi!',
      });
      return;
    }

    if (nik.trim().length !== 16 || !/^\d+$/.test(nik.trim())) {
      setNotification({
        type: 'error',
        message: 'NIK harus terdiri dari tepat 16 digit angka!',
      });
      return;
    }

    const result = addCalonPeserta({
      namaLengkap: namaLengkap.trim(),
      nik: nik.trim(),
      asalKafilah: selectedKafilah,
      namaOfficial: namaOfficial.trim() || `Official ${selectedKafilah}`,
      nomorKontakOfficial: nomorKontakOfficial.trim() || '081234567890',
    });

    if (result.success) {
      setNotification({
        type: 'success',
        message: result.message,
      });
      setNamaLengkap('');
      setNik('');
    } else {
      setNotification({
        type: 'error',
        message: result.message,
      });
    }
  };

  // Filter list by selected Kafilah and search query
  const filteredList = calonPesertaList.filter((item) => {
    const matchKafilah = !selectedKafilah || item.asalKafilah === selectedKafilah;
    const matchSearch =
      !searchQuery.trim() ||
      item.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nik.includes(searchQuery);
    return matchKafilah && matchSearch;
  });

  const registeredCount = filteredList.filter((c) => c.isRegistered).length;
  const pendingCount = filteredList.length - registeredCount;

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-amber-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 border border-amber-400/30">
            <Users className="w-3.5 h-3.5" />
            ROLE 1: OFFICIAL KOTA / KABUPATEN
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Pra-Pendaftaran & Penguncian Hak Akses Peserta
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-normal">
            Official bertindak sebagai otoritas awal yang menerbitkan rekomendasi resmi kafilah daerah.
            <strong className="text-amber-300 font-bold ml-1">
              Hanya calon peserta yang didaftarkan pada modul ini yang diizinkan melanjutkan pendaftaran lengkap di sistem.
            </strong>
          </p>
        </div>
      </div>

      {/* Kafilah Selector & Summary Badges */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-600 block uppercase tracking-wider">
              Wilayah Kafilah yang Dikelola:
            </label>
            <select
              value={selectedKafilah}
              onChange={(e) => setSelectedKafilah(e.target.value)}
              className="text-base font-extrabold text-emerald-950 bg-transparent border-b-2 border-emerald-600 focus:outline-none cursor-pointer pr-4"
            >
              {DAFTAR_KAFILAH.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-600 font-medium">Total Rekomendasi: </span>
            <strong className="text-slate-900 font-bold">{filteredList.length} Nama</strong>
          </div>
          <div className="bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 text-xs">
            <span className="text-emerald-800 font-medium">Sudah Registrasi: </span>
            <strong className="text-emerald-900 font-bold">{registeredCount}</strong>
          </div>
          <div className="bg-amber-50 px-3.5 py-2 rounded-xl border border-amber-200 text-xs">
            <span className="text-amber-800 font-medium">Belum Registrasi: </span>
            <strong className="text-amber-900 font-bold">{pendingCount}</strong>
          </div>
          <button
            onClick={() => setShowPrintModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            Cetak Rekomendasi
          </button>
        </div>
      </div>

      {/* Grid: Form Input vs Data Calon */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Formulir Input Calon Peserta (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Input Calon Peserta Baru
              </h2>
              <p className="text-[11px] text-slate-600">
                Terbitkan rekomendasi dan kunci hak registrasi
              </p>
            </div>
          </div>

          {notification && (
            <div
              className={`mb-5 p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                notification.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-red-50 text-red-900 border border-red-200'
              }`}
            >
              {notification.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 font-medium leading-relaxed">{notification.message}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Lengkap Calon Peserta *
              </label>
              <input
                type="text"
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                placeholder="Contoh: Ahmad Rizki Fauzan"
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                required
              />
              <span className="text-[10px] text-slate-600 mt-1 block">
                Nama harus persis sama dengan kartu identitas KTP/KK.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                NIK Calon Peserta (16 Digit) *
              </label>
              <input
                type="text"
                maxLength={16}
                value={nik}
                onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
                placeholder="177101xxxxxxxxxx"
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-medium"
                required
              />
              <span className="text-[10px] text-slate-600 mt-1 block">
                {nik.length}/16 digit terisi
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Nama Official Penanggungjawab:
                </label>
                <input
                  type="text"
                  value={namaOfficial}
                  onChange={(e) => setNamaOfficial(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  No. WhatsApp Official:
                </label>
                <input
                  type="text"
                  value={nomorKontakOfficial}
                  onChange={(e) => setNomorKontakOfficial(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Sistem Validasi Terkunci:</strong> Data yang diinput di sini akan menjadi kunci master. Peserta yang mencari namanya di formulir pendaftaran hanya dapat membuka formulir jika namanya terdaftar di tabel rekomendasi ini.
              </span>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-900/20 transition-all flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-amber-300" />
              Daftarkan Calon Peserta
            </button>
          </form>

          {/* Quick Demo Pre-fill */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
              Simulasi Cepat untuk Penguji:
            </span>
            <button
              type="button"
              onClick={() => {
                const randomId = Math.floor(1000 + Math.random() * 9000);
                setNamaLengkap(`Ahmad Fauzi Bengkulu ${randomId}`);
                setNik(`177101${randomId}000001`);
              }}
              className="w-full text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 py-1.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Isi Data Calon Uji Coba Acak
            </button>
          </div>
        </div>

        {/* Right: Tabel Daftar Calon Peserta (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Daftar Rekomendasi Kafilah {selectedKafilah}
              </h2>
              <p className="text-[11px] text-slate-600">
                Memiliki hak validasi untuk pendaftaran mandiri peserta
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama / NIK..."
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
              <Search className="w-3.5 h-3.5 text-slate-600 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Table List */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Nama Calon Peserta</th>
                  <th className="py-2.5 px-3">NIK</th>
                  <th className="py-2.5 px-3">Status Registrasi</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.length > 0 ? (
                  filteredList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{item.namaLengkap}</div>
                        <div className="text-[10px] text-slate-600">ID: {item.id}</div>
                      </td>
                      <td className="py-3 px-3 font-mono font-medium text-slate-700">
                        {item.nik}
                      </td>
                      <td className="py-3 px-3">
                        {item.isRegistered ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            Sudah Registrasi Lengkap
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Menunggu Pendaftaran Mandiri
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {!item.isRegistered ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setRole('peserta');
                              }}
                              className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
                              title="Daftarkan Peserta Ini"
                            >
                              Daftarkan Sekarang →
                            </button>
                            <button
                              onClick={() => deleteCalonPeserta(item.id)}
                              className="text-slate-600 hover:text-red-600 p-1 rounded"
                              title="Hapus Calon"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-600 italic">
                            Terkunci (Terdaftar)
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-600">
                      Tidak ada calon peserta untuk kafilah {selectedKafilah}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 flex items-center justify-between">
            <span>
              💡 <em>Klik "Daftarkan Sekarang" untuk berpindah ke Role 2 (Peserta) dan menguji alur verifikasi nama.</em>
            </span>
          </div>
        </div>
      </div>

      {/* Modal Cetak Surat Rekomendasi Kafilah */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="text-center pb-6 border-b-2 border-slate-800 mb-6">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-600">
                Pemerintah Daerah Provinsi Bengkulu
              </h3>
              <h2 className="text-lg font-black text-slate-900 uppercase">
                Lembaga Pengembangan Tilawatil Qur'an (LPTQ) {selectedKafilah}
              </h2>
              <p className="text-[11px] text-slate-600 mt-1">
                Surat Rekomendasi Resmi Delegasi Kafilah MTQ Tingkat Provinsi Bengkulu Ke-XXXVI
              </p>
            </div>

            <div className="space-y-4 text-xs text-slate-800 leading-relaxed">
              <p>
                Dengan ini menerangkan bahwa nama-nama terlampir di bawah ini adalah perwakilan resmi utusan Kafilah <strong>{selectedKafilah}</strong> yang telah melalui seleksi tingkat daerah dan direkomendasikan untuk mengikuti MTQ Tingkat Provinsi Bengkulu:
              </p>

              <div className="rounded-xl border border-slate-300 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-bold border-b border-slate-300">
                    <tr>
                      <th className="py-2 px-3">No</th>
                      <th className="py-2 px-3">Nama Lengkap</th>
                      <th className="py-2 px-3">NIK</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredList.map((item, idx) => (
                      <tr key={item.id}>
                        <td className="py-1.5 px-3 font-semibold">{idx + 1}</td>
                        <td className="py-1.5 px-3 font-bold">{item.namaLengkap}</td>
                        <td className="py-1.5 px-3 font-mono">{item.nik}</td>
                        <td className="py-1.5 px-3">
                          {item.isRegistered ? 'Terdaftar' : 'Belum Registrasi'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-6 flex justify-between items-end text-xs">
                <div>
                  <p className="text-slate-600">Dikeluarkan di: {selectedKafilah}</p>
                  <p className="text-slate-600">Tanggal: {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-slate-700">Official Kafilah,</p>
                  <div className="h-16 flex items-center justify-center italic text-slate-600">
                    (Tanda Tangan & Cap Basah)
                  </div>
                  <p className="font-bold underline text-slate-900">{namaOfficial}</p>
                  <p className="text-[10px] text-slate-600">NIP. 19780512 200501 1 004</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                Cetak Dokumen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
