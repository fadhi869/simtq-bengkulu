export type UserRole =
  | 'public'      // Laman Utama & Pilih Event e-MTQ
  | 'bank-data'   // Bank Data Peserta (Gambar 2)
  | 'admin'       // Dashboard Beranda Admin Bengkulu (Gambar 3)
  | 'official'    // Dashboard Official Kafilah
  | 'escoring'    // Live Scoring Dewan Hakim
  | 'peserta'     // Pendaftaran Peserta Online
  | 'auth';       // Portal Login e-MTQ (Gambar 4)

export type ThemeMode = 'dark' | 'light';

export interface AdminAccount {
  username: string;
  password: string;
  nama: string;
}

export interface OfficialAccount {
  id: string;
  username: string;
  password: string;
  namaOfficial: string;
  asalKafilah: string;
  nomorKontak: string;
  createdAt: string;
}

export interface AuthUser {
  uid: string;
  username?: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  role: UserRole;
  asalKafilah?: string;
  provider: 'password' | 'google' | 'demo';
  createdAt: string;
  calonPesertaId?: string;
}

export type StatusVerifikasi = 'Menunggu Verifikasi' | 'Terverifikasi' | 'Ditolak';
export type StatusTampil = 'Belum Tampil' | 'Sedang Tampil' | 'Sudah Tampil';

export interface BankDataPeserta {
  id: string;
  nik: string;
  namaPeserta: string;
  telepon: string;
  tempatLahir: string;
  tanggalLahir: string; // YYYY-MM-DD
  umurString: string;   // e.g. "17T 6B 15H"
  jenisKelamin: 'LAKI-LAKI' | 'PEREMPUAN';
  // Domisili Sesuai KTP
  provinsi: string;
  kabKota: string;
  kecamatan: string;
  alamatLengkap: string;
  // Rekening
  nomorRekening: string;
  atasNama: string;
  bank: string;
  // Lomba
  cabang: string;
  golongan: string;
  kategori: 'Peserta Inti' | 'Cadangan';
  // Administrasi
  tanggalTerbitKTP: string;
  tanggalTerbitKK: string;
  // Status & Kelengkapan
  kelengkapanLampiran: number; // 60, 80, 100 (%)
  status: 'Aktif' | 'Diterima' | 'Belum Diverifikasi' | 'Mundur' | 'Ditolak';
  catatanValidasi?: string;    // Warning e.g. "Tanggal Lahir 240700 pada NIK tidak sesuai dengan format."
  berkasLampiran?: {
    ktp: boolean;
    kk: boolean;
    ijazah: boolean;
    suratMandat: boolean;
  };
}

export interface AgendaEventItem {
  id: string;
  nama: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  status: 'Selesai' | 'Berlangsung' | 'Persiapan';
}

export interface MTQEventPortal {
  id: string;
  nama: string;
  tanggal: string;
  tingkat: 'Nasional' | 'Provinsi' | 'Kab/Kota';
  tahun: number;
  wilayah: string;
  status: 'Berlangsung' | 'Persiapan' | 'Selesai';
}

export interface CalonPesertaOfficial {
  id: string;
  namaLengkap: string;
  emailPeserta: string;
  cabang: string;
  golongan: string;
  asalKafilah: string;
  nik?: string;
  nomorKontakOfficial: string;
  namaOfficial: string;
  tanggalInput: string;
  isRegistered: boolean;
}

export interface Peserta {
  id: string;
  nomorRegistrasi: string;
  calonPesertaId: string;
  namaLengkap: string;
  emailPeserta?: string;
  nik: string;
  tempatLahir: string;
  tanggalLahir: string;
  usia: number;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  asalKafilah: string;
  alamat: string;
  noHp: string;
  cabang: string;
  golongan: string;
  berkasType: 'KTP' | 'KK';
  berkasUrl: string;
  berkasFileName: string;
  fotoUrl: string;
  isRedBackgroundConfirmed: boolean;
  persetujuanPeraturan: boolean;
  statusVerifikasi: StatusVerifikasi;
  catatanVerifikasi?: string;
  tanggalDaftar: string;
  nomorUrutTampil?: number | null;
  statusTampil: StatusTampil;
  mimbar?: string;
  waktuMulaiTampil?: string;
}

export interface PenilaianPeserta {
  id: string;
  pesertaId: string;
  totalNilai: number;
  komponen?: {
    bidang1: { nama: string; nilai: number; maks: number };
    bidang2: { nama: string; nilai: number; maks: number };
    bidang3: { nama: string; nilai: number; maks: number };
  };
  catatan?: string;
  isLocked?: boolean;
  updatedAt: string;
}

export interface LeaderboardItem {
  peserta: Peserta;
  penilaian: PenilaianPeserta | null;
  nilaiAkhir: number;
  peringkat: number;
}
