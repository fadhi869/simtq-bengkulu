import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  UserRole,
  ThemeMode,
  AuthUser,
  OfficialAccount,
  CalonPesertaOfficial,
  Peserta,
  PenilaianPeserta,
  StatusVerifikasi,
  StatusTampil,
  LeaderboardItem,
  BankDataPeserta,
  AgendaEventItem,
  MTQEventPortal,
} from '../types';
import {
  DEFAULT_ADMIN_ACCOUNT,
  initialOfficialAccounts,
  initialCalonPeserta,
  initialPeserta,
  initialPenilaian,
  initialBankDataPeserta,
  initialAgendaEvents,
  initialMTQEvents,
} from '../data/mockData';

interface AppContextType {
  // Theme System
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;

  // Navigation & Role
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: AuthUser | null;
  setCurrentUser: (user: AuthUser | null) => void;
  logout: () => void;

  // Specific Authentication Functions
  loginAdmin: (username: string, pass: string) => { success: boolean; message: string; user?: AuthUser };
  loginOfficial: (username: string, pass: string) => { success: boolean; message: string; user?: AuthUser };
  loginHakim: (username: string, pass: string) => { success: boolean; message: string; user?: AuthUser };
  loginPesertaWithGoogle: (
    email: string,
    displayName: string,
    photoURL?: string
  ) => { success: boolean; message: string; user?: AuthUser; calon?: CalonPesertaOfficial };

  // Bank Data Management (Gambar 1 & Gambar 2)
  bankDataList: BankDataPeserta[];
  selectedBankDataForEdit: BankDataPeserta | null;
  setSelectedBankDataForEdit: (item: BankDataPeserta | null) => void;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
  addBankData: (data: Omit<BankDataPeserta, 'id' | 'umurString' | 'kelengkapanLampiran' | 'status'>) => {
    success: boolean;
    message: string;
  };
  updateBankData: (id: string, data: Partial<BankDataPeserta>) => { success: boolean; message: string };
  deleteBankData: (id: string) => void;
  daftarkanPesertaDariBankData: (id: string) => { success: boolean; message: string };

  // Agenda Events & Portal (Gambar 3 & Gambar 5)
  agendaEvents: AgendaEventItem[];
  mtqEvents: MTQEventPortal[];
  selectedEvent: MTQEventPortal | null;
  setSelectedEvent: (e: MTQEventPortal | null) => void;

  // Official Management (Admin)
  officialAccounts: OfficialAccount[];
  addOfficialAccount: (data: {
    username: string;
    password: string;
    namaOfficial: string;
    asalKafilah: string;
    nomorKontak: string;
  }) => { success: boolean; message: string };
  deleteOfficialAccount: (id: string) => void;

  // Calon Peserta by Official
  calonPesertaList: CalonPesertaOfficial[];
  addCalonPeserta: (data: {
    namaLengkap: string;
    emailPeserta: string;
    cabang: string;
    golongan: string;
    asalKafilah: string;
    nik?: string;
    nomorKontakOfficial?: string;
    namaOfficial?: string;
  }) => { success: boolean; message: string };
  deleteCalonPeserta: (id: string) => void;

  // Peserta Registrasi
  pesertaList: Peserta[];
  checkEligibility: (namaLengkap: string, nik: string) => {
    eligible: boolean;
    calon?: CalonPesertaOfficial;
    message: string;
  };
  registerPeserta: (
    pesertaData: Omit<Peserta, 'id' | 'nomorRegistrasi' | 'statusVerifikasi' | 'tanggalDaftar' | 'statusTampil'>
  ) => {
    success: boolean;
    message: string;
    peserta?: Peserta;
  };

  // Admin Actions
  updateVerifikasi: (pesertaId: string, status: StatusVerifikasi, catatan?: string) => void;
  acakNomorUrutTampil: (cabang: string, golongan: string) => { success: boolean; count: number };
  updateStatusTampil: (pesertaId: string, status: StatusTampil, mimbar?: string) => void;

  // Dewan Hakim & Penilaian Digital
  penilaianList: PenilaianPeserta[];
  updatePenilaianHakim: (
    pesertaId: string,
    b1: number,
    b2: number,
    b3: number,
    catatan?: string,
    lock?: boolean
  ) => void;

  // Public / Leaderboard
  getLeaderboard: (cabang?: string, golongan?: string, kafilah?: string) => LeaderboardItem[];
  getActivePesertaTampil: () => Peserta[];

  // Utility
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  THEME: 'simtq_theme_mode_v2',
  ROLE: 'simtq_role_bengkulu_v2',
  AUTH_USER: 'simtq_auth_user_v2',
  OFFICIAL_ACCOUNTS: 'simtq_official_accounts_v2',
  CALON: 'simtq_calon_peserta_v2',
  PESERTA: 'simtq_peserta_v2',
  PENILAIAN: 'simtq_penilaian_v2',
  BANK_DATA: 'simtq_bank_data_v2',
};

// Calculate age string e.g. "17T 6B 15H"
export function calculateAgeString(birthDateStr: string): string {
  if (!birthDateStr) return '0T 0B 0H';
  const birth = new Date(birthDateStr);
  if (isNaN(birth.getTime())) return '0T 0B 0H';
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();
  if (days < 0) {
    months -= 1;
    const prevMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return `${years}T ${months}B ${days}H`;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Theme Mode State
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark'; // Default luxury dark
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
  };

  // 2. Navigation & User Role
  const [role, setRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (saved as UserRole) || 'public';
  });

  const [currentUser, setCurrentUserState] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse auth user', e);
      }
    }
    return null;
  });

  // 3. Bank Data Peserta
  const [bankDataList, setBankDataList] = useState<BankDataPeserta[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BANK_DATA);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse bank data', e);
      }
    }
    return initialBankDataPeserta;
  });

  const [selectedBankDataForEdit, setSelectedBankDataForEdit] = useState<BankDataPeserta | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // 4. Agenda Events & Portals
  const [agendaEvents] = useState<AgendaEventItem[]>(initialAgendaEvents);
  const [mtqEvents] = useState<MTQEventPortal[]>(initialMTQEvents);
  const [selectedEvent, setSelectedEvent] = useState<MTQEventPortal | null>(initialMTQEvents[1]);

  // 5. Official, Calon, Peserta, & Penilaian
  const [officialAccounts, setOfficialAccounts] = useState<OfficialAccount[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.OFFICIAL_ACCOUNTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialOfficialAccounts;
  });

  const [calonPesertaList, setCalonPesertaList] = useState<CalonPesertaOfficial[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CALON);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialCalonPeserta;
  });

  const [pesertaList, setPesertaList] = useState<Peserta[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PESERTA);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialPeserta;
  });

  const [penilaianList, setPenilaianList] = useState<PenilaianPeserta[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PENILAIAN);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialPenilaian;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  }, [role]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BANK_DATA, JSON.stringify(bankDataList));
  }, [bankDataList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OFFICIAL_ACCOUNTS, JSON.stringify(officialAccounts));
  }, [officialAccounts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CALON, JSON.stringify(calonPesertaList));
  }, [calonPesertaList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PESERTA, JSON.stringify(pesertaList));
  }, [pesertaList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PENILAIAN, JSON.stringify(penilaianList));
  }, [penilaianList]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
  };

  const setCurrentUser = (user: AuthUser | null) => {
    setCurrentUserState(user);
    if (user?.role && user.role !== 'auth') {
      setRoleState(user.role);
    }
  };

  const logout = () => {
    setCurrentUserState(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    setRoleState('public');
  };

  // 1. Login Admin (Username & Password)
  const loginAdmin = (username: string, pass: string) => {
    const cleanUser = username.trim().toLowerCase();
    const isMatchesAdmin =
      (cleanUser === DEFAULT_ADMIN_ACCOUNT.username.toLowerCase() || cleanUser === 'admin_smtq') &&
      (pass === DEFAULT_ADMIN_ACCOUNT.password || pass === 'rahasiaAdmin2026' || pass === 'admin123');

    if (isMatchesAdmin) {
      const user: AuthUser = {
        uid: 'ADMIN-PUSAT-01',
        username: DEFAULT_ADMIN_ACCOUNT.username,
        displayName: DEFAULT_ADMIN_ACCOUNT.nama,
        email: 'admin.lptq@bengkulu.go.id',
        role: 'admin',
        provider: 'password',
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(user);
      setRoleState('admin');
      return { success: true, message: 'Autentikasi Admin Pusat Terverifikasi.', user };
    }
    return {
      success: false,
      message: 'Kombinasi Username atau Password Admin salah. (Gunakan: adminBengkulu / rahasiaAdmin2026)',
    };
  };

  // 2. Login Official (Username & Password)
  const loginOfficial = (username: string, pass: string) => {
    const cleanUser = username.trim().toLowerCase();
    const acc = officialAccounts.find(
      (o) => o.username.toLowerCase() === cleanUser && o.password === pass
    );

    if (acc) {
      const user: AuthUser = {
        uid: acc.id,
        username: acc.username,
        displayName: acc.namaOfficial,
        email: `${acc.username}@kafilah.bengkulu.go.id`,
        role: 'official',
        asalKafilah: acc.asalKafilah,
        provider: 'password',
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(user);
      setRoleState('official');
      return {
        success: true,
        message: `Autentikasi Official ${acc.asalKafilah} Terverifikasi.`,
        user,
      };
    }
    return {
      success: false,
      message: 'Username atau Password Official tidak cocok. (Gunakan: official_bengkulu / officialSmtq2026)',
    };
  };

  // 3. Login Dewan Hakim (Username & Password)
  const loginHakim = (username: string, pass: string) => {
    const cleanUser = username.trim().toLowerCase();
    if (
      (cleanUser === 'hakim_bengkulu' || cleanUser === 'hakim') &&
      (pass === 'hakimSmtq2026' || pass === 'hakim123')
    ) {
      const user: AuthUser = {
        uid: 'HAKIM-01',
        username: 'hakim_bengkulu',
        displayName: 'Prof. Dr. H. Rohimin, M.Ag (Dewan Hakim)',
        email: 'hakim.mtq@bengkulu.go.id',
        role: 'escoring',
        provider: 'password',
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(user);
      setRoleState('escoring');
      return { success: true, message: 'Autentikasi Dewan Hakim Terverifikasi.', user };
    }
    return {
      success: false,
      message: 'Username atau Password Dewan Hakim salah. (Gunakan: hakim_bengkulu / hakimSmtq2026)',
    };
  };

  // 4. Login Peserta with Google Auth
  const loginPesertaWithGoogle = (
    email: string,
    displayName: string,
    photoURL?: string
  ) => {
    const cleanEmail = email.trim().toLowerCase();
    const calon = calonPesertaList.find(
      (c) => c.emailPeserta && c.emailPeserta.toLowerCase() === cleanEmail
    );

    if (!calon) {
      return {
        success: false,
        message: `Akses Ditolak: Email Google "${email}" BELUM DIDAFTARKAN oleh Official Kafilah daerah Anda. Calon peserta harus didaftarkan terlebih dahulu oleh Official Kabupaten/Kota.`,
      };
    }

    const user: AuthUser = {
      uid: `PESERTA-${calon.id}`,
      displayName: displayName || calon.namaLengkap,
      email: cleanEmail,
      photoURL: photoURL || null,
      role: 'peserta',
      asalKafilah: calon.asalKafilah,
      calonPesertaId: calon.id,
      provider: 'google',
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(user);
    setRoleState('peserta');
    return {
      success: true,
      message: `Otentikasi Berhasil! Data Anda ditemukan atas nama "${calon.namaLengkap}" (${calon.asalKafilah}).`,
      user,
      calon,
    };
  };

  // Bank Data CRUD Operations (Gambar 1 & Gambar 2)
  const addBankData = (data: Omit<BankDataPeserta, 'id' | 'umurString' | 'kelengkapanLampiran' | 'status'>) => {
    const id = `BANK-${(bankDataList.length + 1).toString().padStart(3, '0')}`;
    const umurString = calculateAgeString(data.tanggalLahir);

    // Calculate document completion %
    let countLampiran = 0;
    if (data.berkasLampiran?.ktp) countLampiran += 25;
    if (data.berkasLampiran?.kk) countLampiran += 25;
    if (data.berkasLampiran?.ijazah) countLampiran += 25;
    if (data.berkasLampiran?.suratMandat) countLampiran += 25;
    if (countLampiran === 0) countLampiran = 80; // default initial

    const newBankItem: BankDataPeserta = {
      ...data,
      id,
      umurString,
      kelengkapanLampiran: countLampiran,
      status: 'Aktif',
    };

    setBankDataList((prev) => [newBankItem, ...prev]);
    return {
      success: true,
      message: `Data peserta "${newBankItem.namaPeserta}" berhasil ditambahkan ke Bank Data.`,
    };
  };

  const updateBankData = (id: string, data: Partial<BankDataPeserta>) => {
    setBankDataList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...data };
          if (data.tanggalLahir) {
            updated.umurString = calculateAgeString(data.tanggalLahir);
          }
          return updated;
        }
        return item;
      })
    );
    return { success: true, message: 'Bank Data berhasil diperbarui.' };
  };

  const deleteBankData = (id: string) => {
    setBankDataList((prev) => prev.filter((item) => item.id !== id));
  };

  const daftarkanPesertaDariBankData = (id: string) => {
    const target = bankDataList.find((b) => b.id === id);
    if (!target) return { success: false, message: 'Data tidak ditemukan' };

    // Update status in bank data
    setBankDataList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Diterima' } : item))
    );

    // Also sync to active peserta list if not already there
    const existing = pesertaList.find((p) => p.nik === target.nik);
    if (!existing) {
      const regSeq = (pesertaList.length + 1).toString().padStart(3, '0');
      const newPeserta: Peserta = {
        id: `PESERTA-${Date.now().toString().slice(-4)}`,
        nomorRegistrasi: `MTQ-BKL-2026-${regSeq}`,
        calonPesertaId: target.id,
        namaLengkap: target.namaPeserta,
        nik: target.nik,
        tempatLahir: target.tempatLahir,
        tanggalLahir: target.tanggalLahir,
        usia: parseInt(target.umurString.split('T')[0]) || 18,
        jenisKelamin: target.jenisKelamin === 'LAKI-LAKI' ? 'Laki-laki' : 'Perempuan',
        asalKafilah: target.kabKota || 'Kota Bengkulu',
        alamat: target.alamatLengkap,
        noHp: target.telepon,
        cabang: target.cabang,
        golongan: target.golongan,
        berkasType: 'KTP',
        berkasUrl: 'scan-ktp.pdf',
        berkasFileName: `KTP_${target.namaPeserta.replace(/\s+/g, '_')}.pdf`,
        fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&fit=crop&q=80',
        isRedBackgroundConfirmed: true,
        persetujuanPeraturan: true,
        statusVerifikasi: 'Terverifikasi',
        tanggalDaftar: new Date().toLocaleString('id-ID'),
        statusTampil: 'Belum Tampil',
      };
      setPesertaList((prev) => [newPeserta, ...prev]);
    }

    return {
      success: true,
      message: `Peserta "${target.namaPeserta}" berhasil didaftarkan resmi ke Event MTQ Bengkulu!`,
    };
  };

  // Official: Pra-Pendaftaran Data Dasar Peserta
  const addCalonPeserta = (data: {
    namaLengkap: string;
    emailPeserta: string;
    cabang: string;
    golongan: string;
    asalKafilah: string;
    nik?: string;
    nomorKontakOfficial?: string;
    namaOfficial?: string;
  }) => {
    const cleanEmail = data.emailPeserta.trim().toLowerCase();
    const cleanName = data.namaLengkap.trim();

    if (!cleanEmail || !cleanName) {
      return { success: false, message: 'Nama Lengkap dan Email Google Peserta wajib diisi.' };
    }

    const exists = calonPesertaList.some(
      (c) => c.emailPeserta && c.emailPeserta.toLowerCase() === cleanEmail
    );
    if (exists) {
      return {
        success: false,
        message: `Email Google "${cleanEmail}" sudah terdaftar pada daftar calon peserta.`,
      };
    }

    const newCalon: CalonPesertaOfficial = {
      id: `CALON-${Date.now().toString().slice(-4)}`,
      namaLengkap: cleanName,
      emailPeserta: cleanEmail,
      cabang: data.cabang,
      golongan: data.golongan,
      nik: data.nik?.trim() || `17${Math.floor(10000000000000 + Math.random() * 90000000000000)}`,
      asalKafilah: data.asalKafilah,
      nomorKontakOfficial: data.nomorKontakOfficial || '081234567890',
      namaOfficial: data.namaOfficial || `Official ${data.asalKafilah}`,
      tanggalInput: new Date().toISOString().split('T')[0],
      isRegistered: false,
    };

    setCalonPesertaList((prev) => [newCalon, ...prev]);
    return {
      success: true,
      message: `Berhasil mendaftarkan peserta: "${cleanName}" (${cleanEmail}).`,
    };
  };

  const deleteCalonPeserta = (id: string) => {
    setCalonPesertaList((prev) => prev.filter((item) => item.id !== id));
  };

  // Admin Official Account Management
  const addOfficialAccount = (data: {
    username: string;
    password: string;
    namaOfficial: string;
    asalKafilah: string;
    nomorKontak: string;
  }) => {
    const cleanUser = data.username.trim().toLowerCase();
    if (!cleanUser || !data.password.trim() || !data.namaOfficial.trim()) {
      return { success: false, message: 'Username, password, dan nama official wajib diisi.' };
    }

    const exists = officialAccounts.some((o) => o.username.toLowerCase() === cleanUser);
    if (exists) {
      return { success: false, message: 'Username tersebut sudah terdaftar di sistem. Gunakan yang lain.' };
    }

    const newOfficial: OfficialAccount = {
      id: `OFFICIAL-${Date.now().toString().slice(-4)}`,
      username: cleanUser,
      password: data.password.trim(),
      namaOfficial: data.namaOfficial.trim(),
      asalKafilah: data.asalKafilah,
      nomorKontak: data.nomorKontak.trim() || '081234567890',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setOfficialAccounts((prev) => [newOfficial, ...prev]);
    return {
      success: true,
      message: `Akun Official "${newOfficial.username}" untuk Kafilah ${newOfficial.asalKafilah} berhasil dibuat!`,
    };
  };

  const deleteOfficialAccount = (id: string) => {
    setOfficialAccounts((prev) => prev.filter((o) => o.id !== id));
  };

  // Peserta: Cek Validasi Pra-pendaftaran
  const checkEligibility = (namaLengkap: string, nik: string) => {
    const cleanName = namaLengkap.trim().toLowerCase();
    const cleanNik = nik.trim();

    const calon = calonPesertaList.find(
      (c) =>
        c.namaLengkap.toLowerCase() === cleanName ||
        (cleanNik.length > 0 && c.nik === cleanNik)
    );

    if (!calon) {
      return {
        eligible: false,
        message: 'Nama atau NIK Anda TIDAK DITEMUKAN di database pra-pendaftaran Official Kafilah Kabupaten/Kota.',
      };
    }

    if (calon.isRegistered) {
      return {
        eligible: false,
        calon,
        message: `Calon peserta atas nama "${calon.namaLengkap}" sudah menyelesaikan registrasi lengkap sebelumnya.`,
      };
    }

    return {
      eligible: true,
      calon,
      message: `Data rekomendasi Official Kafilah "${calon.asalKafilah}" ditemukan dan valid!`,
    };
  };

  // Peserta: Submit Formulir Registrasi Lengkap
  const registerPeserta = (
    pesertaData: Omit<Peserta, 'id' | 'nomorRegistrasi' | 'statusVerifikasi' | 'tanggalDaftar' | 'statusTampil'>
  ) => {
    const calon = calonPesertaList.find((c) => c.id === pesertaData.calonPesertaId);
    if (!calon) {
      return {
        success: false,
        message: 'Registrasi ditolak: ID Pra-Pendaftaran tidak valid.',
      };
    }

    const regSeq = (pesertaList.length + 1).toString().padStart(3, '0');
    const nomorRegistrasi = `MTQ-BKL-2026-${regSeq}`;

    const newPeserta: Peserta = {
      ...pesertaData,
      id: `PESERTA-${Date.now().toString().slice(-4)}`,
      nomorRegistrasi,
      emailPeserta: calon.emailPeserta,
      statusVerifikasi: 'Menunggu Verifikasi',
      tanggalDaftar: new Date().toLocaleString('id-ID'),
      statusTampil: 'Belum Tampil',
    };

    setPesertaList((prev) => [newPeserta, ...prev]);

    setCalonPesertaList((prev) =>
      prev.map((c) => (c.id === calon.id ? { ...c, isRegistered: true } : c))
    );

    return {
      success: true,
      message: `Pendaftaran berhasil disimpan! Nomor Registrasi: ${nomorRegistrasi}`,
      peserta: newPeserta,
    };
  };

  // Admin: Verifikasi Berkas
  const updateVerifikasi = (pesertaId: string, status: StatusVerifikasi, catatan?: string) => {
    setPesertaList((prev) =>
      prev.map((p) =>
        p.id === pesertaId ? { ...p, statusVerifikasi: status, catatanVerifikasi: catatan } : p
      )
    );
  };

  // Admin: Acak Nomor Urut Tampil
  const acakNomorUrutTampil = (cabang: string, golongan: string) => {
    const pool = pesertaList.filter(
      (p) => p.cabang === cabang && p.golongan === golongan && p.statusVerifikasi === 'Terverifikasi'
    );

    if (pool.length === 0) {
      return { success: false, count: 0 };
    }

    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const updatedMap = new Map<string, number>();
    shuffled.forEach((peserta, idx) => {
      updatedMap.set(peserta.id, idx + 1);
    });

    setPesertaList((prev) =>
      prev.map((p) => (updatedMap.has(p.id) ? { ...p, nomorUrutTampil: updatedMap.get(p.id) } : p))
    );

    return { success: true, count: pool.length };
  };

  // Admin: Live Mimbar Status
  const updateStatusTampil = (pesertaId: string, status: StatusTampil, mimbar?: string) => {
    setPesertaList((prev) =>
      prev.map((p) => {
        if (p.id === pesertaId) {
          return {
            ...p,
            statusTampil: status,
            mimbar: mimbar || p.mimbar || 'Mimbar Utama',
            waktuMulaiTampil:
              status === 'Sedang Tampil'
                ? `${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB (Sedang Berlangsung)`
                : p.waktuMulaiTampil,
          };
        }
        return p;
      })
    );

    if (status === 'Sudah Tampil') {
      setPenilaianList((prev) =>
        prev.map((item) => (item.pesertaId === pesertaId ? { ...item, isLocked: true } : item))
      );
    }
  };

  // Dewan Hakim: e-Scoring Grading
  const updatePenilaianHakim = (
    pesertaId: string,
    b1: number,
    b2: number,
    b3: number,
    catatan?: string,
    lock?: boolean
  ) => {
    const total = parseFloat((b1 + b2 + b3).toFixed(2));
    setPenilaianList((prev) => {
      const existing = prev.find((n) => n.pesertaId === pesertaId);
      if (existing) {
        return prev.map((n) =>
          n.pesertaId === pesertaId
            ? {
                ...n,
                totalNilai: total,
                komponen: {
                  bidang1: { nama: 'Bidang 1', nilai: b1, maks: 50 },
                  bidang2: { nama: 'Bidang 2', nilai: b2, maks: 30 },
                  bidang3: { nama: 'Bidang 3', nilai: b3, maks: 20 },
                },
                catatan: catatan || n.catatan,
                isLocked: lock ?? n.isLocked,
                updatedAt: new Date().toLocaleTimeString('id-ID'),
              }
            : n
        );
      } else {
        const newItem: PenilaianPeserta = {
          id: `NILAI-${Date.now().toString().slice(-4)}`,
          pesertaId,
          totalNilai: total,
          komponen: {
            bidang1: { nama: 'Bidang 1', nilai: b1, maks: 50 },
            bidang2: { nama: 'Bidang 2', nilai: b2, maks: 30 },
            bidang3: { nama: 'Bidang 3', nilai: b3, maks: 20 },
          },
          catatan: catatan || 'Penilaian digital resmi dewan hakim.',
          isLocked: lock ?? false,
          updatedAt: new Date().toLocaleTimeString('id-ID'),
        };
        return [newItem, ...prev];
      }
    });
  };

  // Public: Leaderboard
  const getLeaderboard = (cabang?: string, golongan?: string, kafilah?: string): LeaderboardItem[] => {
    const finishedParticipants = pesertaList.filter((p) => p.statusTampil === 'Sudah Tampil');

    const filtered = finishedParticipants.filter((p) => {
      if (cabang && p.cabang !== cabang) return false;
      if (golongan && p.golongan !== golongan) return false;
      if (kafilah && p.asalKafilah !== kafilah) return false;
      return true;
    });

    const items: LeaderboardItem[] = filtered.map((peserta) => {
      const penilaian = penilaianList.find((n) => n.pesertaId === peserta.id) || null;
      const nilaiAkhir = penilaian ? penilaian.totalNilai : 0;
      return {
        peserta,
        penilaian,
        nilaiAkhir,
        peringkat: 0,
      };
    });

    items.sort((a, b) => b.nilaiAkhir - a.nilaiAkhir);

    return items.map((item, index) => ({
      ...item,
      peringkat: index + 1,
    }));
  };

  // Public: Active participants on stage
  const getActivePesertaTampil = (): Peserta[] => {
    return pesertaList.filter((p) => p.statusTampil === 'Sedang Tampil');
  };

  // Reset demo
  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.CALON);
    localStorage.removeItem(STORAGE_KEYS.PESERTA);
    localStorage.removeItem(STORAGE_KEYS.PENILAIAN);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    localStorage.removeItem(STORAGE_KEYS.OFFICIAL_ACCOUNTS);
    localStorage.removeItem(STORAGE_KEYS.BANK_DATA);
    setCurrentUserState(null);
    setOfficialAccounts(initialOfficialAccounts);
    setCalonPesertaList(initialCalonPeserta);
    setPesertaList(initialPeserta);
    setPenilaianList(initialPenilaian);
    setBankDataList(initialBankDataPeserta);
    setRoleState('public');
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        role,
        setRole,
        currentUser,
        setCurrentUser,
        logout,
        loginAdmin,
        loginOfficial,
        loginHakim,
        loginPesertaWithGoogle,
        bankDataList,
        selectedBankDataForEdit,
        setSelectedBankDataForEdit,
        isEditModalOpen,
        setIsEditModalOpen,
        addBankData,
        updateBankData,
        deleteBankData,
        daftarkanPesertaDariBankData,
        agendaEvents,
        mtqEvents,
        selectedEvent,
        setSelectedEvent,
        officialAccounts,
        addOfficialAccount,
        deleteOfficialAccount,
        calonPesertaList,
        pesertaList,
        penilaianList,
        addCalonPeserta,
        deleteCalonPeserta,
        checkEligibility,
        registerPeserta,
        updateVerifikasi,
        acakNomorUrutTampil,
        updateStatusTampil,
        updatePenilaianHakim,
        getLeaderboard,
        getActivePesertaTampil,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
