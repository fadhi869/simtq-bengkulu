import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CABANG_DAN_GOLONGAN } from '../../data/constants';
import type { CalonPesertaOfficial, Peserta } from '../../types';
import confetti from 'canvas-confetti';
import {
  UserCheck,
  Search,
  CheckCircle,
  AlertCircle,
  Lock,
  Upload,
  FileText,
  Camera,
  ShieldAlert,
  ArrowRight,
  Download,
  Printer,
  Sparkles,
  QrCode,
  Calendar,
  Eye,
} from 'lucide-react';

export const PesertaRegistration: React.FC = () => {
  const { calonPesertaList, pesertaList, checkEligibility, registerPeserta, setRole } = useApp();

  // Search/Verification Step
  const [searchName, setSearchName] = useState<string>('');
  const [searchNik, setSearchNik] = useState<string>('');
  const [verifiedCalon, setVerifiedCalon] = useState<CalonPesertaOfficial | null>(null);
  const [eligibilityResult, setEligibilityResult] = useState<{
    tested: boolean;
    eligible: boolean;
    message: string;
  }>({
    tested: false,
    eligible: false,
    message: '',
  });

  // Step 2 Form States
  const [tempatLahir, setTempatLahir] = useState<string>('Kota Bengkulu');
  const [tanggalLahir, setTanggalLahir] = useState<string>('2005-08-17');
  const [jenisKelamin, setJenisKelamin] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [alamat, setAlamat] = useState<string>('');
  const [noHp, setNoHp] = useState<string>('');
  const [cabang, setCabang] = useState<string>("Tilawah Al-Qur'an");
  const [golongan, setGolongan] = useState<string>('Remaja Putra');

  // File Upload States
  const [berkasFileName, setBerkasFileName] = useState<string>('');
  const [berkasType, setBerkasType] = useState<'KTP' | 'KK'>('KTP');
  const [fotoUrl, setFotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&fit=crop&q=80'
  );
  const [isRedBackgroundConfirmed, setIsRedBackgroundConfirmed] = useState<boolean>(true);
  const [persetujuanPeraturan, setPersetujuanPeraturan] = useState<boolean>(false);

  // Registered Participant Success State
  const [registeredResult, setRegisteredResult] = useState<Peserta | null>(null);

  // Calculate age dynamically from birthdate
  const calculateAge = (dobString: string): number => {
    if (!dobString) return 0;
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const calculatedAge = calculateAge(tanggalLahir);
  const isAdult = calculatedAge >= 17;
  const requiredDocType = isAdult ? 'KTP' : 'KK';

  // Handle checking eligibility
  const handleCheckEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchName.trim()) {
      setEligibilityResult({
        tested: true,
        eligible: false,
        message: 'Silakan masukkan Nama Lengkap Anda terlebih dahulu.',
      });
      return;
    }

    const res = checkEligibility(searchName, searchNik);
    setEligibilityResult({
      tested: true,
      eligible: res.eligible,
      message: res.message,
    });

    if (res.eligible && res.calon) {
      setVerifiedCalon(res.calon);
      // Auto-set initial document filename simulation
      setBerkasFileName(
        calculatedAge >= 17
          ? `KTP_${res.calon.namaLengkap.replace(/\s+/g, '_')}.pdf`
          : `KK_${res.calon.namaLengkap.replace(/\s+/g, '_')}.pdf`
      );
      setBerkasType(calculatedAge >= 17 ? 'KTP' : 'KK');
    } else {
      setVerifiedCalon(null);
    }
  };

  // Handle Form Submission
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!verifiedCalon) {
      alert('Sesi validasi nama tidak ditemukan. Silakan ulangi verifikasi pra-pendaftaran.');
      return;
    }

    if (!persetujuanPeraturan) {
      alert('Anda wajib menyetujui komitmen peraturan sebelum menyelesaikan pendaftaran.');
      return;
    }

    if (!berkasFileName) {
      alert(`Wajib mengunggah scan dokumen ${requiredDocType} (.pdf)!`);
      return;
    }

    const result = registerPeserta({
      calonPesertaId: verifiedCalon.id,
      namaLengkap: verifiedCalon.namaLengkap,
      nik: verifiedCalon.nik,
      tempatLahir,
      tanggalLahir,
      usia: calculatedAge,
      jenisKelamin,
      asalKafilah: verifiedCalon.asalKafilah,
      alamat: alamat.trim() || `Jl. Utama Kafilah ${verifiedCalon.asalKafilah}`,
      noHp: noHp.trim() || '081234567890',
      cabang,
      golongan,
      berkasType: requiredDocType,
      berkasUrl: berkasFileName,
      berkasFileName,
      fotoUrl,
      isRedBackgroundConfirmed,
      persetujuanPeraturan,
    });

    if (result.success && result.peserta) {
      setRegisteredResult(result.peserta);
      // Trigger festive celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-800 to-amber-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 border border-amber-400/30">
            <UserCheck className="w-3.5 h-3.5" />
            ROLE 2: PESERTA KAFILAH
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Pendaftaran & Pelengkapan Berkas Peserta
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-normal">
            Alur pendaftaran terintegrasi. Sistem akan mencocokkan identitas Anda dengan database pra-pendaftaran Official Kafilah Kabupaten/Kota sebelum formulir dibuka.
          </p>
        </div>
      </div>

      {/* Registration Success View: ID Card */}
      {registeredResult ? (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2 animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
              Pendaftaran Berhasil Dikirim
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              Kartu Tanda Peserta MTQ Provinsi Bengkulu
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Simpan bukti pendaftaran ini. Berkas Anda selanjutnya akan diverifikasi oleh Admin Pusat LPTQ Provinsi Bengkulu.
            </p>
          </div>

          {/* Printable ID Card */}
          <div className="border-4 border-emerald-800 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-emerald-900 to-emerald-950 text-white p-6 relative">
            <div className="absolute inset-0 islamic-pattern opacity-20 pointer-events-none"></div>

            {/* ID Card Header */}
            <div className="relative z-10 flex items-center justify-between pb-4 border-b border-amber-500/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-serif text-2xl font-black">
                  م
                </div>
                <div>
                  <h3 className="text-sm font-extrabold tracking-wide text-white">
                    MTQ PROVINSI BENGKULU KE-XXXVI
                  </h3>
                  <p className="text-[10px] text-amber-300 font-medium">
                    Kafilah: {registeredResult.asalKafilah}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-400/40 px-2.5 py-1 rounded-full font-bold">
                  {registeredResult.statusVerifikasi}
                </span>
              </div>
            </div>

            {/* ID Card Body */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center py-6">
              {/* Photo */}
              <div className="sm:col-span-4 flex flex-col items-center">
                <div className="w-32 h-40 rounded-2xl bg-red-600 p-1 border-2 border-red-500 shadow-xl overflow-hidden">
                  <img
                    src={registeredResult.fotoUrl}
                    alt={registeredResult.namaLengkap}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <span className="text-[9px] text-amber-300 font-bold uppercase mt-2 tracking-wider">
                  Foto Resmi Latar Merah
                </span>
              </div>

              {/* Data */}
              <div className="sm:col-span-8 space-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-emerald-300 uppercase font-semibold">
                    Nomor Registrasi:
                  </span>
                  <div className="text-lg font-mono font-black text-amber-300 tracking-wider">
                    {registeredResult.nomorRegistrasi}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-emerald-300 uppercase font-semibold">
                    Nama Lengkap Peserta:
                  </span>
                  <div className="text-base font-bold text-white">
                    {registeredResult.namaLengkap}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] text-emerald-300 uppercase font-semibold">
                      Cabang:
                    </span>
                    <div className="font-semibold text-slate-100">{registeredResult.cabang}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-300 uppercase font-semibold">
                      Golongan:
                    </span>
                    <div className="font-semibold text-amber-300">{registeredResult.golongan}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] text-emerald-300 uppercase font-semibold">
                      Dokumen Unggahan:
                    </span>
                    <div className="font-mono text-[11px] text-slate-200">
                      Scan {registeredResult.berkasType} ({registeredResult.usia} Th)
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-300 uppercase font-semibold">
                      Tanggal Registrasi:
                    </span>
                    <div className="text-[11px] text-slate-200">
                      {registeredResult.tanggalDaftar}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ID Card Footer */}
            <div className="relative z-10 pt-4 border-t border-emerald-800 flex justify-between items-center text-[10px] text-emerald-200">
              <div className="flex items-center gap-2">
                <QrCode className="w-8 h-8 text-amber-300" />
                <span>Validasi Digital LPTQ Bengkulu</span>
              </div>
              <p className="italic">Bawalah kartu ini saat proses verifikasi fisik di lokasi lomba.</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <button
              onClick={() => window.print()}
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-2 shadow"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              Cetak Kartu Tanda Peserta
            </button>
            <button
              onClick={() => setRole('admin')}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold text-xs flex items-center gap-2 shadow"
            >
              Lihat di Role Admin Pusat →
            </button>
            <button
              onClick={() => {
                setRegisteredResult(null);
                setVerifiedCalon(null);
                setSearchName('');
                setSearchNik('');
                setEligibilityResult({ tested: false, eligible: false, message: '' });
              }}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
            >
              Daftarkan Peserta Lain
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* LANGKAH 1: VERIFIKASI PRA-PENDAFTARAN OFFICIAL */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-6">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
                1
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Langkah 1: Verifikasi Rekomendasi Official Kafilah
                </h2>
                <p className="text-xs text-slate-600">
                  Cari nama Anda yang telah diinput oleh Official Kabupaten/Kota untuk membuka formulir
                </p>
              </div>
            </div>

            <form onSubmit={handleCheckEligibility} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Masukkan Nama Lengkap Sesuai Rekomendasi Kafilah *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    placeholder="Ketik nama lengkap Anda..."
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    required
                  />
                  <Search className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nomor Induk Kependudukan (NIK) Opsional/Pencocokan Cepat
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={searchNik}
                  onChange={(e) => setSearchNik(e.target.value.replace(/\D/g, ''))}
                  placeholder="16 Digit NIK (Opsional jika nama unik)"
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-900/20 transition-all flex items-center gap-2"
                >
                  <Search className="w-4 h-4 text-amber-300" />
                  Cek Rekomendasi Official
                </button>

                {/* Quick Hint / Select from mock list */}
                <div className="text-xs text-slate-600 flex items-center gap-1.5">
                  <span>Atau pilih contoh nama belum mendaftar:</span>
                  <select
                    onChange={(e) => {
                      const selected = calonPesertaList.find((c) => c.namaLengkap === e.target.value);
                      if (selected) {
                        setSearchName(selected.namaLengkap);
                        setSearchNik(selected.nik);
                      }
                    }}
                    className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-lg px-2 py-1"
                  >
                    <option value="">-- Pilih Calon Rekomendasi --</option>
                    {calonPesertaList
                      .filter((c) => !c.isRegistered)
                      .map((c) => (
                        <option key={c.id} value={c.namaLengkap}>
                          {c.namaLengkap} ({c.asalKafilah})
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </form>

            {/* Eligibility Feedback */}
            {eligibilityResult.tested && (
              <div
                className={`mt-6 p-4 rounded-2xl border text-xs leading-relaxed flex items-start gap-3 ${
                  eligibilityResult.eligible
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-red-50 border-red-200 text-red-900'
                }`}
              >
                {eligibilityResult.eligible ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-extrabold text-sm mb-1">
                    {eligibilityResult.eligible
                      ? 'Validasi Rekomendasi Berhasil!'
                      : 'Validasi Tidak Berhasil'}
                  </h4>
                  <p>{eligibilityResult.message}</p>

                  {eligibilityResult.eligible && verifiedCalon && (
                    <div className="mt-3 p-3 bg-white rounded-xl border border-emerald-200 space-y-1 text-xs">
                      <p>
                        <strong>Nama Lengkap:</strong> {verifiedCalon.namaLengkap}
                      </p>
                      <p>
                        <strong>Asal Kafilah:</strong> {verifiedCalon.asalKafilah}
                      </p>
                      <p>
                        <strong>Official Pengusul:</strong> {verifiedCalon.namaOfficial} ({verifiedCalon.nomorKontakOfficial})
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* LANGKAH 2: FORMULIR DATA PRIBADI & BERKAS LENGKAP */}
          {verifiedCalon && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-600/40 shadow-xl space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-black">
                    2
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">
                      Langkah 2: Formulir Registrasi & Pengunggahan Berkas
                    </h2>
                    <p className="text-xs text-slate-600">
                      Lengkapi biodata, pilihan cabang & golongan lomba, serta upload scan KTP/KK dan Pas Foto
                    </p>
                  </div>
                </div>

                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <Lock className="w-3.5 h-3.5" /> Hak Akses Terbuka
                </span>
              </div>

              <form onSubmit={handleFinalSubmit} className="space-y-8">
                {/* Bagian A: Data Identitas Pribadi */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    A. Data Identitas Pribadi (Terkunci Sesuai Rekomendasi)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Nama Lengkap (Terkunci):
                      </label>
                      <input
                        type="text"
                        value={verifiedCalon.namaLengkap}
                        disabled
                        className="w-full text-xs bg-slate-100 border border-slate-300 rounded-xl px-3 py-2.5 font-bold text-slate-700 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        NIK (Terkunci):
                      </label>
                      <input
                        type="text"
                        value={verifiedCalon.nik}
                        disabled
                        className="w-full text-xs bg-slate-100 border border-slate-300 rounded-xl px-3 py-2.5 font-mono font-bold text-slate-700 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Asal Kafilah Kabupaten/Kota:
                      </label>
                      <input
                        type="text"
                        value={verifiedCalon.asalKafilah}
                        disabled
                        className="w-full text-xs bg-slate-100 border border-slate-300 rounded-xl px-3 py-2.5 font-bold text-emerald-900 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Tempat Lahir *:
                      </label>
                      <input
                        type="text"
                        value={tempatLahir}
                        onChange={(e) => setTempatLahir(e.target.value)}
                        placeholder="Contoh: Kota Bengkulu"
                        className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Tanggal Lahir * (Penentu KTP/KK):
                      </label>
                      <input
                        type="date"
                        value={tanggalLahir}
                        onChange={(e) => setTanggalLahir(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                        required
                      />
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-800 font-semibold">
                        <Calendar className="w-3 h-3" />
                        <span>
                          Usia Terhitung: <strong>{calculatedAge} Tahun</strong> (
                          {isAdult ? 'Wajib KTP' : 'Wajib Kartu Keluarga'})
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Jenis Kelamin *:
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setJenisKelamin('Laki-laki');
                            // If current category has Putri, switch to Putra
                            if (golongan.includes('Putri')) {
                              setGolongan(golongan.replace('Putri', 'Putra'));
                            }
                          }}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                            jenisKelamin === 'Laki-laki'
                              ? 'bg-emerald-800 text-white border-emerald-800'
                              : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          Laki-laki (Putra)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setJenisKelamin('Perempuan');
                            // If current category has Putra, switch to Putri
                            if (golongan.includes('Putra')) {
                              setGolongan(golongan.replace('Putra', 'Putri'));
                            }
                          }}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                            jenisKelamin === 'Perempuan'
                              ? 'bg-emerald-800 text-white border-emerald-800'
                              : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          Perempuan (Putri)
                        </button>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Alamat Lengkap Domisili *:
                      </label>
                      <input
                        type="text"
                        value={alamat}
                        onChange={(e) => setAlamat(e.target.value)}
                        placeholder="Nama jalan, RT/RW, Kelurahan, Kecamatan, Kabupaten/Kota di Bengkulu"
                        className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Nomor HP / WhatsApp Aktif *:
                      </label>
                      <input
                        type="text"
                        value={noHp}
                        onChange={(e) => setNoHp(e.target.value)}
                        placeholder="0812xxxxxxxx"
                        className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Bagian B: Pilihan Cabang & Golongan (Dropdown Dinamis Kondisional) */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    B. Pilihan Cabang & Golongan Perlombaan (Dinamis Kondisional)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Pilih Cabang Musabaqah *:
                      </label>
                      <select
                        value={cabang}
                        onChange={(e) => {
                          const newCabang = e.target.value;
                          setCabang(newCabang);
                          // Auto set default matching golongan
                          const list = CABANG_DAN_GOLONGAN[newCabang] || [];
                          const matching = list.find((g) =>
                            jenisKelamin === 'Laki-laki' ? g.includes('Putra') : g.includes('Putri')
                          );
                          setGolongan(matching || list[0] || '');
                        }}
                        className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-900"
                        required
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
                        Pilih Golongan Perlombaan *:
                      </label>
                      <select
                        value={golongan}
                        onChange={(e) => setGolongan(e.target.value)}
                        className="w-full text-xs bg-emerald-50 border border-emerald-300 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-950"
                        required
                      >
                        {CABANG_DAN_GOLONGAN[cabang]?.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                      <span className="text-[10px] text-slate-600 mt-1 block">
                        Daftar golongan otomatis menyesuaikan dengan cabang "{cabang}".
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bagian C: Validasi Unggah Berkas (Logika KTP/KK berdasarkan Usia & Pas Foto Merah) */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    C. Validasi Berkas Identitas & Pas Foto (Kondisional Usia)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* DOKUMEN IDENTITAS (LOGIKA KTP VS KK) */}
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">
                          {isAdult ? 'Scan KTP Asli (.pdf)' : 'Scan Kartu Keluarga (.pdf)'}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            isAdult
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-amber-100 text-amber-900 border border-amber-200'
                          }`}
                        >
                          Usia: {calculatedAge} Tahun → {isAdult ? 'Wajib KTP' : 'Wajib KK'}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {isAdult
                          ? 'Karena peserta berusia ≥ 17 tahun, sistem mewajibkan pengunggahan Scan KTP. Form KK otomatis disembunyikan.'
                          : 'Karena peserta berusia < 17 tahun, form KTP otomatis disembunyikan dan digantikan wajib mengunggah Scan Kartu Keluarga.'}
                      </p>

                      <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-emerald-500 transition-colors bg-white">
                        <FileText className="w-8 h-8 text-emerald-700 mx-auto mb-2" />
                        <span className="text-xs font-bold text-slate-800 block">
                          {berkasFileName || `Upload Scan ${requiredDocType} (.pdf)`}
                        </span>
                        <span className="text-[10px] text-slate-600 block mt-0.5">
                          Ukuran maksimal 2MB (Format PDF)
                        </span>

                        <div className="flex justify-center gap-2 mt-3">
                          <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold">
                            Pilih File PDF
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setBerkasFileName(e.target.files[0].name);
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setBerkasFileName(
                                isAdult
                                  ? `KTP_${verifiedCalon.namaLengkap.replace(/\s+/g, '_')}_Scan.pdf`
                                  : `KK_${verifiedCalon.namaLengkap.replace(/\s+/g, '_')}_Scan.pdf`
                              );
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold"
                          >
                            Simulasi Berkas Sah
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* UNGGAH PAS FOTO LATAR BELAKANG MERAH */}
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">
                          Pas Foto Resmi (Latar Belakang Merah) *
                        </span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
                          Wajib Latar Merah
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Ketentuan panitia: Pas foto formal terbaru dengan latar belakang merah polos (format .jpg / .jpeg / .png).
                      </p>

                      <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200">
                        {/* Red background preview container */}
                        <div className="w-20 h-24 rounded-xl bg-red-600 p-1 border-2 border-red-700 shadow-md shrink-0 flex items-center justify-center overflow-hidden">
                          <img
                            src={fotoUrl}
                            alt="Preview Pas Foto Latar Merah"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>

                        <div className="space-y-2 flex-1">
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 w-fit">
                            <Camera className="w-3.5 h-3.5" />
                            Ganti Pas Foto
                            <input
                              type="file"
                              accept="image/png, image/jpeg, image/jpg"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const url = URL.createObjectURL(e.target.files[0]);
                                  setFotoUrl(url);
                                }
                              }}
                              className="hidden"
                            />
                          </label>

                          <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                            <span className="w-2 h-2 rounded-full bg-red-600"></span>
                            <span>Pratinjau berlatar belakang merah terverifikasi</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bagian D: Checkbox Persetujuan Komitmen */}
                <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="persetujuan"
                      checked={persetujuanPeraturan}
                      onChange={(e) => setPersetujuanPeraturan(e.target.checked)}
                      className="w-5 h-5 rounded text-emerald-700 focus:ring-emerald-500 mt-0.5 cursor-pointer"
                      required
                    />
                    <label htmlFor="persetujuan" className="text-xs text-amber-950 font-bold cursor-pointer leading-relaxed">
                      "Saya berkomitmen untuk mengikuti peraturan hingga akhir"
                    </label>
                  </div>
                  <p className="text-[11px] text-amber-900/80 pl-8 leading-relaxed">
                    Dengan mencentang pernyataan di atas, saya menyatakan bahwa seluruh data yang diisi adalah benar, mematuhi keputusan Dewan Hakim, serta siap bertanding menjunjung tinggi ukhuwah Islamiyah.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={!persetujuanPeraturan}
                    className={`w-full py-4 px-6 rounded-2xl font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 ${
                      persetujuanPeraturan
                        ? 'bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white shadow-emerald-900/20 cursor-pointer hover:scale-[1.01]'
                        : 'bg-slate-200 text-slate-600 border border-slate-300 cursor-not-allowed'
                    }`}
                  >
                    <UserCheck className="w-5 h-5 text-amber-300" />
                    Konfirmasi & Kirim Formulir Pendaftaran Lengkap
                  </button>
                  {!persetujuanPeraturan && (
                    <p className="text-center text-[11px] text-amber-800 font-semibold mt-2">
                      ⚠️ Tombol konfirmasi akan aktif setelah Anda mencentang checkbox komitmen peraturan di atas.
                    </p>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
