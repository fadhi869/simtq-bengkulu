import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  UserRole,
  AuthUser,
  OfficialAccount,
  CalonPesertaOfficial,
  Peserta,
  PenilaianPeserta,
  StatusVerifikasi,
  StatusTampil,
  LeaderboardItem,
} from '../types';
import {
  DEFAULT_ADMIN_ACCOUNT,
  initialOfficialAccounts,
  initialCalonPeserta,
  initialPeserta,
  initialPenilaian,
} from '../data/mockData';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: AuthUser | null;
  setCurrentUser: (user: AuthUser | null) => void;
  logout: () => void;

  // Specific Authentication Functions
  loginAdmin: (username: string, pass: string) => { success: boolean; message: string; user?: AuthUser };
  loginOfficial: (username: string, pass: string) => { success: boolean; message: string; user?: AuthUser };
  loginPesertaWithGoogle: (
    email: string,
    displayName: string,
    photoURL?: string
  ) => { success: boolean; message: string; user?: AuthUser; calon?: CalonPesertaOfficial };

  // Admin Account & Official Management
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

  // Public / Leaderboard
  penilaianList: PenilaianPeserta[];
  getLeaderboard: (cabang?: string, golongan?: string, kafilah?: string) => LeaderboardItem[];
  getActivePesertaTampil: () => Peserta[];

  // Utility
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ROLE: 'simtq_role_bengkulu_v1',
  AUTH_USER: 'simtq_auth_user_v1',
  OFFICIAL_ACCOUNTS: 'simtq_official_accounts_v1',
  CALON: 'simtq_calon_peserta_v1',
  PESERTA: 'simtq_peserta_v1',
  PENILAIAN: 'simtq_penilaian_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
        console.error('Failed to parse auth user data', e);
      }
    }
    return null;
  });

  const [officialAccounts, setOfficialAccounts] = useState<OfficialAccount[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.OFFICIAL_ACCOUNTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse official accounts data', e);
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
        console.error('Failed to parse calon data', e);
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
        console.error('Failed to parse peserta data', e);
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
        console.error('Failed to parse penilaian data', e);
      }
    }
    return initialPenilaian;
  });

  // Sync state to localStorage
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
    if (
      cleanUser === DEFAULT_ADMIN_ACCOUNT.username.toLowerCase() &&
      pass === DEFAULT_ADMIN_ACCOUNT.password
    ) {
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
      message: 'Kombinasi Username atau Password Admin salah. (Gunakan: admin_smtq / rahasiaAdmin2026)',
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

  // 3. Login Peserta with Google Auth (Validasi Email terhadap CalonPesertaOfficial)
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
        message: `Akses Ditolak: Email Google "${email}" BELUM DIDAFTARKAN oleh Official Kafilah daerah Anda. Sesuai regulasi MTQ Provinsi Bengkulu, calon peserta harus didaftarkan oleh Official Kafilah Kabupaten/Kota terlebih dahulu.`,
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

  // Admin: Create & Manage Official Accounts
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

    const exists =
      officialAccounts.some((o) => o.username.toLowerCase() === cleanUser) ||
      cleanUser === DEFAULT_ADMIN_ACCOUNT.username.toLowerCase();

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
      message: `Akun Official "${newOfficial.username}" untuk Kafilah ${newOfficial.asalKafilah} berhasil diterbitkan!`,
    };
  };

  const deleteOfficialAccount = (id: string) => {
    setOfficialAccounts((prev) => prev.filter((o) => o.id !== id));
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

    // Check duplicate email
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
      message: `Berhasil mendaftarkan peserta: "${cleanName}" (${cleanEmail}). Peserta kini dapat login menggunakan Akun Google tersebut.`,
    };
  };

  const deleteCalonPeserta = (id: string) => {
    setCalonPesertaList((prev) => prev.filter((item) => item.id !== id));
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
        message: 'Nama atau NIK Anda TIDAK DITEMUKAN di database pra-pendaftaran Official Kafilah Kabupaten/Kota. Harap hubungi Official Kafilah daerah Anda terlebih dahulu untuk didaftarkan.',
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
        message: 'Registrasi ditolak: ID Pra-Pendaftaran tidak valid atau belum terdaftar oleh Official Kafilah.',
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

    // Mark calon as registered
    setCalonPesertaList((prev) =>
      prev.map((c) => (c.id === calon.id ? { ...c, isRegistered: true } : c))
    );

    return {
      success: true,
      message: `Pendaftaran berhasil disimpan! Nomor Registrasi Anda: ${nomorRegistrasi}`,
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

    // Fisher-Yates shuffle
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
    setCurrentUserState(null);
    setOfficialAccounts(initialOfficialAccounts);
    setCalonPesertaList(initialCalonPeserta);
    setPesertaList(initialPeserta);
    setPenilaianList(initialPenilaian);
    setRoleState('public');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        setCurrentUser,
        logout,
        loginAdmin,
        loginOfficial,
        loginPesertaWithGoogle,
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
