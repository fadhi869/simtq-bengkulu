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
  FileText,
  Camera,
  Printer,
  Sparkles,
  QrCode,
  Calendar,
  Lock,
} from 'lucide-react';

export const PesertaRegistration: React.FC = () => {
  const { calonPesertaList, checkEligibility, registerPeserta, setRole } = useApp();

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

  const [tempatLahir, setTempatLahir] = useState<string>('Kota Bengkulu');
  const [tanggalLahir, setTanggalLahir] = useState<string>('2005-08-17');
  const [jenisKelamin, setJenisKelamin] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [alamat, setAlamat] = useState<string>('');
  const [noHp, setNoHp] = useState<string>('');
  const [cabang, setCabang] = useState<string>("Tilawah Al-Qur'an");
  const [golongan, setGolongan] = useState<string>('Remaja Putra');

  const [berkasFileName, setBerkasFileName] = useState<string>('');
  const [fotoUrl, setFotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&fit=crop&q=80'
  );
  const [isRedBackgroundConfirmed] = useState<boolean>(true);
  const [persetujuanPeraturan, setPersetujuanPeraturan] = useState<boolean>(false);

  const [registeredResult, setRegisteredResult] = useState<Peserta | null>(null);

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
      setBerkasFileName(
        calculatedAge >= 17
          ? `KTP_${res.calon.namaLengkap.replace(/\s+/g, '_')}.pdf`
          : `KK_${res.calon.namaLengkap.replace(/\s+/g, '_')}.pdf`
      );
    } else {
      setVerifiedCalon(null);
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!verifiedCalon) {
      alert('Sesi validasi nama tidak ditemukan.');
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
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Minimalist */}
      <div className="border-b border-white/[0.08] pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-mono tracking-widest uppercase text-emerald-400">
            ROLE 02 • REGISTRASI PESERTA
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Pendaftaran & Unggah Berkas Peserta
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-1.5 leading-relaxed">
          Verifikasi identitas Anda dari daftar rekomendasi kafilah untuk membuka formulir biodata lengkap, pilihan cabang, dan unggah scan KTP/KK.
        </p>
      </div>

      {registeredResult ? (
        <div className="ag-card p-6 sm:p-10 max-w-2xl mx-auto space-y-6 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">
              Kartu Tanda Peserta Digital
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Pendaftaran berhasil dikirim dan siap diverifikasi oleh Admin Pusat LPTQ.
            </p>
          </div>

          {/* Minimalist Digital ID Card */}
          <div className="bg-[#12141d] rounded-2xl border border-white/10 p-6 text-left space-y-5 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-start pb-4 border-b border-white/[0.06]">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 block">
                  KARTU PESERTA MTQ PROVINSI BENGKULU
                </span>
                <span className="text-sm font-bold text-white">
                  Kafilah {registeredResult.asalKafilah}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] text-emerald-400 border border-emerald-500/30">
                {registeredResult.statusVerifikasi}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
              <div className="w-24 h-32 rounded-xl bg-red-600/90 p-1 border border-white/20 shrink-0 overflow-hidden shadow">
                <img
                  src={registeredResult.fotoUrl}
                  alt={registeredResult.namaLengkap}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              <div className="space-y-2 text-xs flex-1">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 block uppercase">No. Registrasi</span>
                  <span className="text-base font-bold font-mono text-emerald-400 tracking-wider">
                    {registeredResult.nomorRegistrasi}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-zinc-400 block uppercase">Nama Peserta</span>
                  <span className="text-sm font-semibold text-white">
                    {registeredResult.namaLengkap}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                  <div>
                    <span className="text-[9px] text-zinc-400 block uppercase">Cabang</span>
                    <span className="text-zinc-200 font-sans">{registeredResult.cabang}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-400 block uppercase">Golongan</span>
                    <span className="text-zinc-200 font-sans">{registeredResult.golongan}</span>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-zinc-400 pt-1">
                  Dokumen: Scan {registeredResult.berkasType} ({registeredResult.usia} Tahun)
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex justify-between items-center text-[10px] font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-zinc-400" />
                <span>QR Autentikasi LPTQ Bengkulu</span>
              </div>
              <span>{registeredResult.tanggalDaftar}</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2.5 pt-2">
            <button
              onClick={() => window.print()}
              className="px-5 py-2 rounded-full bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak Kartu Tanda Peserta
            </button>
            <button
              onClick={() => setRole('admin')}
              className="px-5 py-2 rounded-full bg-white/[0.06] text-zinc-200 hover:bg-white/[0.12] text-xs font-medium border border-white/10 transition-colors"
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
              className="px-4 py-2 rounded-full text-zinc-400 hover:text-white text-xs transition-colors"
            >
              Daftarkan Lainnya
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 max-w-3xl mx-auto">
          {/* Langkah 1: Verifikasi Nama */}
          <div className="ag-card p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
              <span className="w-5 h-5 rounded-full bg-white/[0.08] text-white flex items-center justify-center font-mono text-xs">
                1
              </span>
              <h2 className="text-sm font-semibold text-white">
                Verifikasi Rekomendasi Official Kafilah
              </h2>
            </div>

            <form onSubmit={handleCheckEligibility} className="space-y-3.5">
              <div>
                <label className="block text-xs text-zinc-300 font-medium mb-1">
                  Nama Lengkap Sesuai Rekomendasi Kafilah *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    placeholder="Masukkan nama lengkap..."
                    className="w-full ag-input pl-8"
                    required
                  />
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-300 font-medium mb-1">
                  Nomor Induk Kependudukan (NIK) Opsional
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={searchNik}
                  onChange={(e) => setSearchNik(e.target.value.replace(/\D/g, ''))}
                  placeholder="16 Digit NIK"
                  className="w-full ag-input font-mono"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-colors flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  Cek Rekomendasi
                </button>

                {/* Quick mock selector */}
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span>Atau pilih contoh:</span>
                  <select
                    onChange={(e) => {
                      const selected = calonPesertaList.find((c) => c.namaLengkap === e.target.value);
                      if (selected) {
                        setSearchName(selected.namaLengkap);
                        setSearchNik(selected.nik);
                      }
                    }}
                    className="ag-input py-1 text-xs"
                  >
                    <option value="" className="bg-[#10121a]">-- Pilih Rekomendasi --</option>
                    {calonPesertaList
                      .filter((c) => !c.isRegistered)
                      .map((c) => (
                        <option key={c.id} value={c.namaLengkap} className="bg-[#10121a]">
                          {c.namaLengkap} ({c.asalKafilah})
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </form>

            {eligibilityResult.tested && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                  eligibilityResult.eligible
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-300 border border-red-500/20'
                }`}
              >
                {eligibilityResult.eligible ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-semibold block mb-0.5">
                    {eligibilityResult.eligible ? 'Rekomendasi Ditemukan' : 'Verifikasi Gagal'}
                  </span>
                  <span>{eligibilityResult.message}</span>
                </div>
              </div>
            )}
          </div>

          {/* Langkah 2: Formulir Lengkap */}
          {verifiedCalon && (
            <div className="ag-card p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-black flex items-center justify-center font-mono text-xs font-bold">
                    2
                  </span>
                  <h2 className="text-sm font-semibold text-white">
                    Formulir Biodata & Berkas Peserta
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Akses Terbuka
                </span>
              </div>

              <form onSubmit={handleFinalSubmit} className="space-y-6">
                {/* Biodata */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 block">
                    A. IDENTITAS PRIBADI
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Nama Lengkap (Terkunci)</label>
                      <input
                        type="text"
                        value={verifiedCalon.namaLengkap}
                        disabled
                        className="w-full ag-input opacity-70 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">NIK (Terkunci)</label>
                      <input
                        type="text"
                        value={verifiedCalon.nik}
                        disabled
                        className="w-full ag-input opacity-70 cursor-not-allowed font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Tempat Lahir *</label>
                      <input
                        type="text"
                        value={tempatLahir}
                        onChange={(e) => setTempatLahir(e.target.value)}
                        className="w-full ag-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Tanggal Lahir *</label>
                      <input
                        type="date"
                        value={tanggalLahir}
                        onChange={(e) => setTanggalLahir(e.target.value)}
                        className="w-full ag-input text-zinc-200"
                        required
                      />
                      <div className="flex items-center gap-1.5 mt-1 text-[10px] font-mono text-emerald-400">
                        <Calendar className="w-3 h-3" />
                        <span>Usia: {calculatedAge} Th ({isAdult ? 'Wajib KTP' : 'Wajib KK'})</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Jenis Kelamin *</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setJenisKelamin('Laki-laki')}
                          className={`py-2 px-3 rounded-xl text-xs font-medium border transition-colors ${
                            jenisKelamin === 'Laki-laki'
                              ? 'bg-white text-black border-white'
                              : 'bg-white/[0.03] text-zinc-400 border-white/10'
                          }`}
                        >
                          Laki-laki
                        </button>
                        <button
                          type="button"
                          onClick={() => setJenisKelamin('Perempuan')}
                          className={`py-2 px-3 rounded-xl text-xs font-medium border transition-colors ${
                            jenisKelamin === 'Perempuan'
                              ? 'bg-white text-black border-white'
                              : 'bg-white/[0.03] text-zinc-400 border-white/10'
                          }`}
                        >
                          Perempuan
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">No. WhatsApp *</label>
                      <input
                        type="text"
                        value={noHp}
                        onChange={(e) => setNoHp(e.target.value)}
                        placeholder="0812xxxxxxxx"
                        className="w-full ag-input font-mono"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-zinc-400 mb-1">Alamat Lengkap *</label>
                      <input
                        type="text"
                        value={alamat}
                        onChange={(e) => setAlamat(e.target.value)}
                        placeholder="Alamat domisili di kabupaten/kota..."
                        className="w-full ag-input"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Cabang & Golongan */}
                <div className="space-y-3 pt-4 border-t border-white/[0.06]">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 block">
                    B. CABANG & GOLONGAN LOMBA
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs text-zinc-300 font-medium mb-1">Cabang *</label>
                      <select
                        value={cabang}
                        onChange={(e) => {
                          const newC = e.target.value;
                          setCabang(newC);
                          const list = CABANG_DAN_GOLONGAN[newC] || [];
                          const matching = list.find((g) =>
                            jenisKelamin === 'Laki-laki' ? g.includes('Putra') : g.includes('Putri')
                          );
                          setGolongan(matching || list[0] || '');
                        }}
                        className="w-full ag-input"
                      >
                        {Object.keys(CABANG_DAN_GOLONGAN).map((c) => (
                          <option key={c} value={c} className="bg-[#10121a]">{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-300 font-medium mb-1">Golongan *</label>
                      <select
                        value={golongan}
                        onChange={(e) => setGolongan(e.target.value)}
                        className="w-full ag-input text-emerald-400"
                      >
                        {CABANG_DAN_GOLONGAN[cabang]?.map((g) => (
                          <option key={g} value={g} className="bg-[#10121a]">{g}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Berkas KTP/KK & Foto */}
                <div className="space-y-3 pt-4 border-t border-white/[0.06]">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 block">
                    C. UNGGAH BERKAS (KONDISIONAL USIA)
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Logika KTP vs KK */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium text-white">Scan {requiredDocType} (.pdf) *</span>
                        <span className="text-[10px] font-mono text-zinc-400">
                          {isAdult ? 'Usia ≥ 17 Th' : 'Usia < 17 Th'}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        {isAdult
                          ? 'Peserta berusia ≥ 17 tahun: Wajib unggah Scan KTP asli.'
                          : 'Peserta berusia < 17 tahun: Wajib unggah Scan Kartu Keluarga.'}
                      </p>
                      <div className="border border-dashed border-white/10 rounded-xl p-3 text-center space-y-2">
                        <FileText className="w-6 h-6 text-zinc-500 mx-auto" />
                        <span className="text-[11px] font-mono text-zinc-300 block truncate">
                          {berkasFileName || `Pilih file ${requiredDocType}.pdf`}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setBerkasFileName(
                              isAdult
                                ? `KTP_${verifiedCalon.namaLengkap.replace(/\s+/g, '_')}_Scan.pdf`
                                : `KK_${verifiedCalon.namaLengkap.replace(/\s+/g, '_')}_Scan.pdf`
                            );
                          }}
                          className="px-3 py-1 rounded-full text-[10px] font-mono bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 transition-colors"
                        >
                          Simulasi Berkas Sah
                        </button>
                      </div>
                    </div>

                    {/* Pas Foto Latar Merah */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium text-white">Pas Foto Latar Merah *</span>
                        <span className="text-[10px] font-mono text-red-400">Wajib Merah</span>
                      </div>
                      <div className="flex items-center gap-4 pt-1">
                        <div className="w-16 h-20 rounded-lg bg-red-600/90 p-0.5 border border-white/20 shrink-0 overflow-hidden shadow">
                          <img
                            src={fotoUrl}
                            alt="Pas Foto Latar Merah"
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="space-y-1.5 text-xs text-zinc-400">
                          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 text-xs font-medium border border-white/10 transition-colors">
                            <Camera className="w-3.5 h-3.5" />
                            Ganti Foto
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setFotoUrl(URL.createObjectURL(e.target.files[0]));
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                          <span className="text-[10px] text-zinc-400 block font-mono">
                            Pratinjau latar merah terverifikasi
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Komitmen */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="komitmen"
                    checked={persetujuanPeraturan}
                    onChange={(e) => setPersetujuanPeraturan(e.target.checked)}
                    className="w-4 h-4 rounded mt-0.5 accent-emerald-500 cursor-pointer"
                    required
                  />
                  <label htmlFor="komitmen" className="text-xs text-zinc-300 font-medium cursor-pointer leading-relaxed">
                    "Saya berkomitmen untuk mengikuti peraturan hingga akhir"
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!persetujuanPeraturan}
                  className={`w-full py-3 px-4 rounded-full text-xs font-semibold transition-all ${
                    persetujuanPeraturan
                      ? 'bg-white text-black hover:bg-zinc-200 cursor-pointer shadow-md'
                      : 'bg-white/[0.05] text-zinc-500 cursor-not-allowed border border-white/[0.06]'
                  }`}
                >
                  Konfirmasi & Kirim Formulir Pendaftaran
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
