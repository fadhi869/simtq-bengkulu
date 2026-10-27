import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DAFTAR_KAFILAH, CABANG_DAN_GOLONGAN } from '../../data/constants';
import {
  Users,
  UserPlus,
  CheckCircle,
  Clock,
  Printer,
  Search,
  AlertCircle,
  Trash2,
  Sparkles,
  Lock,
  Mail,
} from 'lucide-react';

export const OfficialDashboard: React.FC = () => {
  const { calonPesertaList, addCalonPeserta, deleteCalonPeserta, setRole, currentUser } = useApp();

  const [selectedKafilah, setSelectedKafilah] = useState<string>(
    currentUser?.asalKafilah || 'Kota Bengkulu'
  );
  const [namaLengkap, setNamaLengkap] = useState<string>('');
  const [emailPeserta, setEmailPeserta] = useState<string>('');
  const [selectedCabang, setSelectedCabang] = useState<string>("Tilawah Al-Qur'an");
  const [selectedGolongan, setSelectedGolongan] = useState<string>('Remaja Putra');
  const [nik, setNik] = useState<string>('');
  const [namaOfficial, setNamaOfficial] = useState<string>(
    currentUser?.displayName || 'Drs. H. Ahmad Zarkasi, M.Pd'
  );
  const [nomorKontakOfficial, setNomorKontakOfficial] = useState<string>('081273948201');

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!namaLengkap.trim() || !emailPeserta.trim()) {
      setNotification({
        type: 'error',
        message: 'Nama Lengkap dan Email Google Calon Peserta wajib diisi!',
      });
      return;
    }

    if (!emailPeserta.includes('@')) {
      setNotification({
        type: 'error',
        message: 'Format Email Calon Peserta tidak valid (harus memiliki domain @gmail.com atau sejenisnya).',
      });
      return;
    }

    const result = addCalonPeserta({
      namaLengkap: namaLengkap.trim(),
      emailPeserta: emailPeserta.trim().toLowerCase(),
      cabang: selectedCabang,
      golongan: selectedGolongan,
      nik: nik.trim() || undefined,
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
      setEmailPeserta('');
      setNik('');
    } else {
      setNotification({
        type: 'error',
        message: result.message,
      });
    }
  };

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
      {/* Header Minimalist */}
      <div className="border-b border-white/[0.08] pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-mono tracking-widest uppercase text-emerald-400">
            ROLE 01 • OFFICIAL KAFILAH DAERAH
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Pra-Pendaftaran & Otoritas Akses Peserta
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-1.5 leading-relaxed">
          Official menerbitkan rekomendasi resmi kafilah kabupaten/kota. Hanya nama dan NIK yang terdaftar pada tabel di bawah yang memiliki hak akses membuka formulir registrasi mandiri di sistem.
        </p>
      </div>

      {/* Kafilah Selection & Metric Bar */}
      <div className="ag-card p-4 sm:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div>
            <label className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase block mb-1">
              Kafilah Terpilih
            </label>
            <select
              value={selectedKafilah}
              onChange={(e) => setSelectedKafilah(e.target.value)}
              className="text-sm font-semibold text-white bg-transparent border-b border-white/20 pb-0.5 focus:outline-none focus:border-emerald-400 cursor-pointer"
            >
              {DAFTAR_KAFILAH.map((k) => (
                <option key={k} value={k} className="bg-[#10121a]">
                  {k}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/[0.08] text-zinc-300">
            Total: <span className="font-bold text-white">{filteredList.length}</span>
          </div>
          <div className="bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 text-emerald-300">
            Terdaftar: <span className="font-bold">{registeredCount}</span>
          </div>
          <div className="bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20 text-amber-300">
            Menunggu: <span className="font-bold">{pendingCount}</span>
          </div>
          <button
            onClick={() => setShowPrintModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-zinc-200 border border-white/10 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Surat Rekomendasi</span>
          </button>
        </div>
      </div>

      {/* Grid: Form Input vs Roster Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Form Input (5 Cols) */}
        <div className="lg:col-span-5 ag-card p-6 space-y-5">
          <div className="pb-3 border-b border-white/[0.06]">
            <h2 className="text-sm font-semibold text-white">
              Input Calon Peserta Kafilah
            </h2>
            <p className="text-[11px] text-zinc-400">
              Kunci hak akses untuk pendaftaran peserta
            </p>
          </div>

          {notification && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                notification.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                  : 'bg-red-500/10 text-red-300 border border-red-500/20'
              }`}
            >
              {notification.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 font-medium leading-relaxed">{notification.message}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-300 font-medium mb-1.5">
                Nama Lengkap Calon Peserta *
              </label>
              <input
                type="text"
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                placeholder="Contoh: Muhammad Ilham Pratama"
                className="w-full ag-input"
                required
              />
              <span className="text-[10px] text-zinc-400 mt-1 block">
                Harus sama persis dengan kartu identitas KTP/KK.
              </span>
            </div>

            <div>
              <label className="block text-xs text-zinc-300 font-medium mb-1.5">
                Email Aktif Peserta (Akun Google) *
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={emailPeserta}
                  onChange={(e) => setEmailPeserta(e.target.value)}
                  placeholder="peserta.mtq@gmail.com"
                  className="w-full ag-input pl-9 font-mono text-xs"
                  required
                />
              </div>
              <span className="text-[10px] text-zinc-400 mt-1 block">
                Digunakan untuk login peserta melalui <strong>Google Auth</strong>.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-zinc-300 font-medium mb-1.5">
                  Cabang Lomba
                </label>
                <select
                  value={selectedCabang}
                  onChange={(e) => {
                    setSelectedCabang(e.target.value);
                    const gols = CABANG_DAN_GOLONGAN[e.target.value] || [];
                    if (gols.length > 0) setSelectedGolongan(gols[0]);
                  }}
                  className="w-full ag-input text-xs"
                >
                  {Object.keys(CABANG_DAN_GOLONGAN).map((c) => (
                    <option key={c} value={c} className="bg-[#12151e]">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-zinc-300 font-medium mb-1.5">
                  Golongan Lomba
                </label>
                <select
                  value={selectedGolongan}
                  onChange={(e) => setSelectedGolongan(e.target.value)}
                  className="w-full ag-input text-xs"
                >
                  {(CABANG_DAN_GOLONGAN[selectedCabang] || []).map((g) => (
                    <option key={g} value={g} className="bg-[#12151e]">
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-zinc-300 font-medium mb-1.5">
                NIK Calon Peserta (16 Digit)
              </label>
              <input
                type="text"
                maxLength={16}
                value={nik}
                onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
                placeholder="177101xxxxxxxxxx (Opsional)"
                className="w-full ag-input font-mono"
              />
              <span className="text-[10px] text-zinc-400 mt-1 block font-mono">
                {nik.length}/16 digit terisi
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">
                  Nama Official:
                </label>
                <input
                  type="text"
                  value={namaOfficial}
                  onChange={(e) => setNamaOfficial(e.target.value)}
                  className="w-full ag-input"
                />
              </div>
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">
                  WhatsApp Official:
                </label>
                <input
                  type="text"
                  value={nomorKontakOfficial}
                  onChange={(e) => setNomorKontakOfficial(e.target.value)}
                  className="w-full ag-input font-mono"
                />
              </div>
            </div>

            <div className="p-3 bg-white/[0.02] border border-white/[0.08] rounded-xl text-[11px] text-zinc-400 flex items-start gap-2 leading-relaxed">
              <Lock className="w-4 h-4 text-[#00FF87] shrink-0 mt-0.5" />
              <span>
                <strong>Proteksi Google Auth:</strong> Peserta hanya dapat masuk jika email Google mereka telah didaftarkan di form ini.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-[#00FF87] text-black font-semibold text-xs hover:bg-[#00FF87]/90 transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,255,135,0.25)]"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Daftarkan Data Dasar Peserta
            </button>
          </form>

          {/* Quick Mock Filler */}
          <div className="pt-4 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={() => {
                const randomId = Math.floor(1000 + Math.random() * 9000);
                setNamaLengkap(`Fauzi Al-Bengkulu ${randomId}`);
                setEmailPeserta(`fauzi.${randomId}@gmail.com`);
                setNik(`177101${randomId}000001`);
              }}
              className="w-full text-[11px] font-mono text-zinc-400 hover:text-white py-1.5 px-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              Isi Data Simulasi Acak
            </button>
          </div>
        </div>

        {/* Right: Roster Table (7 Cols) */}
        <div className="lg:col-span-7 ag-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-white/[0.06]">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Daftar Rekomendasi Kafilah {selectedKafilah}
              </h2>
              <p className="text-[11px] text-zinc-400">
                Memiliki hak akses pendaftaran mandiri
              </p>
            </div>
            <div className="relative w-full sm:w-56">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama / NIK..."
                className="w-full ag-input pl-8 py-1.5 text-xs"
              />
              <Search className="w-3 h-3 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] text-zinc-400 font-mono text-[11px] border-b border-white/[0.06]">
                <tr>
                  <th className="py-2.5 px-3">Nama & ID</th>
                  <th className="py-2.5 px-3">Email Google</th>
                  <th className="py-2.5 px-3">Cabang & Golongan</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredList.length > 0 ? (
                  filteredList.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-medium text-white">{item.namaLengkap}</div>
                        <div className="text-[10px] font-mono text-zinc-400">{item.id} • {item.nik || 'NIK -'}</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-zinc-300">
                        {item.emailPeserta ? (
                          <span className="text-[#00FF87]">{item.emailPeserta}</span>
                        ) : (
                          <span className="text-zinc-600">-</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-zinc-300">
                        <div>{item.cabang}</div>
                        <div className="text-[10px] font-mono text-zinc-500">{item.golongan}</div>
                      </td>
                      <td className="py-3 px-3">
                        {item.isRegistered ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Terdaftar
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Menunggu Google Auth
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {!item.isRegistered ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => deleteCalonPeserta(item.id)}
                              className="text-zinc-500 hover:text-red-400 p-1"
                              title="Hapus Calon Peserta"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono text-zinc-400">Terkunci</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-400 text-xs">
                      Tidak ada calon peserta untuk {selectedKafilah}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Cetak Surat Rekomendasi Kafilah */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#10121a] rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto text-zinc-200">
            <div className="text-center pb-6 border-b border-white/10 mb-6">
              <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                Pemerintah Daerah Provinsi Bengkulu
              </h3>
              <h2 className="text-lg font-bold text-white uppercase mt-1">
                Lembaga Pengembangan Tilawatil Qur'an (LPTQ) {selectedKafilah}
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Surat Rekomendasi Resmi Delegasi Kafilah MTQ Tingkat Provinsi Bengkulu Ke-XXXVI
              </p>
            </div>

            <div className="space-y-4 text-xs leading-relaxed">
              <p>
                Dengan ini menerangkan bahwa nama-nama terlampir di bawah ini adalah perwakilan resmi utusan Kafilah <strong>{selectedKafilah}</strong> yang direkomendasikan untuk mengikuti MTQ Tingkat Provinsi Bengkulu:
              </p>

              <div className="rounded-xl border border-white/10 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/[0.04] font-mono text-[10px] text-zinc-400 border-b border-white/10">
                    <tr>
                      <th className="py-2 px-3">No</th>
                      <th className="py-2 px-3">Nama Lengkap</th>
                      <th className="py-2 px-3">NIK</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {filteredList.map((item, idx) => (
                      <tr key={item.id}>
                        <td className="py-2 px-3 font-mono">{idx + 1}</td>
                        <td className="py-2 px-3 font-medium text-white">{item.namaLengkap}</td>
                        <td className="py-2 px-3 font-mono text-zinc-400">{item.nik}</td>
                        <td className="py-2 px-3 font-mono text-[11px]">
                          {item.isRegistered ? 'Terdaftar' : 'Belum Registrasi'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-6 flex justify-between items-end text-xs text-zinc-400">
                <div>
                  <p>Dikeluarkan di: {selectedKafilah}</p>
                  <p>Tanggal: {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
                </div>
                <div className="text-center">
                  <p className="text-zinc-300">Official Kafilah,</p>
                  <div className="h-14 flex items-center justify-center italic text-zinc-600">
                    (Tanda Tangan)
                  </div>
                  <p className="font-semibold text-white">{namaOfficial}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex justify-end gap-2.5">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 rounded-full border border-white/10 text-zinc-300 font-medium text-xs hover:bg-white/[0.06]"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-full bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Cetak Dokumen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
