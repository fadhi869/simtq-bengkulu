export type UserRole = 'public' | 'official' | 'peserta' | 'admin' | 'auth';

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

export interface CalonPesertaOfficial {
  id: string;
  namaLengkap: string;
  emailPeserta: string; // Validated via Google Auth
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
