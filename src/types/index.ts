export type UserRole = 'public' | 'official' | 'peserta' | 'admin' | 'juri';

export type StatusVerifikasi = 'Menunggu Verifikasi' | 'Terverifikasi' | 'Ditolak';
export type StatusTampil = 'Belum Tampil' | 'Sedang Tampil' | 'Sudah Tampil';

export interface CalonPesertaOfficial {
  id: string;
  namaLengkap: string;
  nik: string;
  asalKafilah: string;
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

export interface KomponenNilai {
  nama: string;
  nilai: number;
  maks: number;
}

export interface PenilaianPeserta {
  id: string;
  pesertaId: string;
  juriId: string;
  juriNama: string;
  komponen: {
    bidang1: KomponenNilai;
    bidang2: KomponenNilai;
    bidang3: KomponenNilai;
  };
  totalNilai: number;
  catatanDewanHakim: string;
  isLocked: boolean;
  updatedAt: string;
}

export interface LeaderboardItem {
  peserta: Peserta;
  penilaian: PenilaianPeserta | null;
  nilaiAkhir: number;
  peringkat: number;
}
