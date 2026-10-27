import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  UserRole,
  AuthUser,
  CalonPesertaOfficial,
  Peserta,
  PenilaianPeserta,
  StatusVerifikasi,
  StatusTampil,
  LeaderboardItem,
} from '../types';
import { initialCalonPeserta, initialPeserta, initialPenilaian } from '../data/mockData';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: AuthUser | null;
  setCurrentUser: (user: AuthUser | null) => void;
  logout: () => void;
  calonPesertaList: CalonPesertaOfficial[];
  pesertaList: Peserta[];
  penilaianList: PenilaianPeserta[];
  
  // Official Actions
  addCalonPeserta: (data: {
    namaLengkap: string;
    nik: string;
    asalKafilah: string;
    nomorKontakOfficial: string;
    namaOfficial: string;
  }) => { success: boolean; message: string };
  deleteCalonPeserta: (id: string) => void;

  // Peserta Actions
  checkEligibility: (namaLengkap: string, nik: string) => {
    eligible: boolean;
    calon?: CalonPesertaOfficial;
    message: string;
  };
  registerPeserta: (pesertaData: Omit<Peserta, 'id' | 'nomorRegistrasi' | 'statusVerifikasi' | 'tanggalDaftar' | 'statusTampil'>) => {
    success: boolean;
    message: string;
    peserta?: Peserta;
  };

  // Admin Actions
  updateVerifikasi: (pesertaId: string, status: StatusVerifikasi, catatan?: string) => void;
  acakNomorUrutTampil: (cabang: string, golongan: string) => { success: boolean; count: number };
  updateStatusTampil: (pesertaId: string, status: StatusTampil, mimbar?: string) => void;

  // Juri Actions
  simpanNilai: (data: {
    pesertaId: string;
    juriId: string;
    juriNama: string;
    komponen: PenilaianPeserta['komponen'];
    totalNilai: number;
    catatanDewanHakim: string;
  }) => { success: boolean; message: string };

  // Public / Leaderboard
  getLeaderboard: (cabang?: string, golongan?: string, kafilah?: string) => LeaderboardItem[];
  getActivePesertaTampil: () => Peserta[];

  // Utility
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ROLE: 'simtq_role_bengkulu_v1',
  AUTH_USER: 'simtq_auth_user_v1',
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
  };

  // Official: Pra-Pendaftaran
  const addCalonPeserta = (data: {
    namaLengkap: string;
    nik: string;
    asalKafilah: string;
    nomorKontakOfficial: string;
    namaOfficial: string;
  }) => {
    const cleanNik = data.nik.trim();
    const cleanName = data.namaLengkap.trim();

    // Check duplicate NIK or name
    const exists = calonPesertaList.some(
      (c) => c.nik === cleanNik || c.namaLengkap.toLowerCase() === cleanName.toLowerCase()
    );
    if (exists) {
      return { success: false, message: 'Calon peserta dengan NIK atau Nama tersebut sudah terdaftar di sistem pra-pendaftaran.' };
    }

    const newCalon: CalonPesertaOfficial = {
      id: `CALON-${Date.now().toString().slice(-4)}`,
      namaLengkap: cleanName,
      nik: cleanNik,
      asalKafilah: data.asalKafilah,
      nomorKontakOfficial: data.nomorKontakOfficial,
      namaOfficial: data.namaOfficial,
      tanggalInput: new Date().toISOString().split('T')[0],
      isRegistered: false,
    };

    setCalonPesertaList((prev) => [newCalon, ...prev]);
    return { success: true, message: `Berhasil mendaftarkan calon peserta: ${cleanName}` };
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
        message: `Calon peserta atas nama "${calon.namaLengkap}" sudah menyelesaikan registrasi lengkap sebelumnya. Silakan cek status pendaftaran Anda di menu Laman Peserta atau hubungi Admin.`,
      };
    }

    return {
      eligible: true,
      calon,
      message: `Data rekomendasi Official Kafilah "${calon.asalKafilah}" ditemukan dan valid! Anda berhak melanjutkan pendaftaran lengkap.`,
    };
  };

  // Peserta: Submit Formulir Registrasi Lengkap
  const registerPeserta = (pesertaData: Omit<Peserta, 'id' | 'nomorRegistrasi' | 'statusVerifikasi' | 'tanggalDaftar' | 'statusTampil'>) => {
    // Check validation against CalonPeserta
    const calon = calonPesertaList.find((c) => c.id === pesertaData.calonPesertaId);
    if (!calon) {
      return {
        success: false,
        message: 'Validasi gagal: ID Rekomendasi Official tidak valid.',
      };
    }

    if (calon.isRegistered) {
      return {
        success: false,
        message: 'Peserta ini telah menyelesaikan registrasi sebelumnya.',
      };
    }

    const regCount = pesertaList.length + 1;
    const formattedNum = String(regCount).padStart(3, '0');
    const newId = `PESERTA-${Date.now().toString().slice(-4)}`;
    const newPeserta: Peserta = {
      ...pesertaData,
      id: newId,
      nomorRegistrasi: `MTQ-BKL-2026-${formattedNum}`,
      statusVerifikasi: 'Menunggu Verifikasi',
      tanggalDaftar: new Date().toLocaleString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      statusTampil: 'Belum Tampil',
      nomorUrutTampil: null,
    };

    // Update Peserta list
    setPesertaList((prev) => [newPeserta, ...prev]);

    // Mark CalonPeserta as isRegistered = true
    setCalonPesertaList((prev) =>
      prev.map((c) => (c.id === calon.id ? { ...c, isRegistered: true } : c))
    );

    return {
      success: true,
      message: `Pendaftaran berhasil! Nomor Registrasi Anda: ${newPeserta.nomorRegistrasi}. Berkas Anda sedang menunggu verifikasi oleh Admin Pusat.`,
      peserta: newPeserta,
    };
  };

  // Admin: Verifikasi Berkas
  const updateVerifikasi = (pesertaId: string, status: StatusVerifikasi, catatan?: string) => {
    setPesertaList((prev) =>
      prev.map((p) =>
        p.id === pesertaId
          ? {
              ...p,
              statusVerifikasi: status,
              catatanVerifikasi: catatan || (status === 'Terverifikasi' ? 'Berkas lengkap dan sesuai ketentuan.' : 'Berkas belum memenuhi kualifikasi.'),
            }
          : p
      )
    );
  };

  // Admin: Acak Urutan Tampil (Lottery)
  const acakNomorUrutTampil = (cabang: string, golongan: string) => {
    // Filter peserta terverifikasi pada cabang & golongan
    const eligibleParticipants = pesertaList.filter(
      (p) => p.cabang === cabang && p.golongan === golongan && p.statusVerifikasi === 'Terverifikasi'
    );

    if (eligibleParticipants.length === 0) {
      return { success: false, count: 0 };
    }

    // Shuffle using Fisher-Yates
    const shuffledIds = [...eligibleParticipants.map((p) => p.id)].sort(() => Math.random() - 0.5);

    setPesertaList((prev) =>
      prev.map((p) => {
        const index = shuffledIds.indexOf(p.id);
        if (index !== -1) {
          return {
            ...p,
            nomorUrutTampil: index + 1,
            mimbar: p.mimbar || 'Mimbar Utama MTQ Provinsi Bengkulu',
          };
        }
        return p;
      })
    );

    return { success: true, count: eligibleParticipants.length };
  };

  // Admin: Live Status Management
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

    // If status changed to "Sudah Tampil", lock existing score
    if (status === 'Sudah Tampil') {
      setPenilaianList((prev) =>
        prev.map((item) => (item.pesertaId === pesertaId ? { ...item, isLocked: true } : item))
      );
    }
  };

  // Juri: Input Nilai
  const simpanNilai = (data: {
    pesertaId: string;
    juriId: string;
    juriNama: string;
    komponen: PenilaianPeserta['komponen'];
    totalNilai: number;
    catatanDewanHakim: string;
  }) => {
    const targetPeserta = pesertaList.find((p) => p.id === data.pesertaId);
    if (!targetPeserta) {
      return { success: false, message: 'Data peserta tidak ditemukan.' };
    }

    // Role protection rule: Juri can ONLY input when status is 'Sedang Tampil'
    if (targetPeserta.statusTampil !== 'Sedang Tampil') {
      if (targetPeserta.statusTampil === 'Sudah Tampil') {
        return {
          success: false,
          message: 'GAGAL: Status peserta telah diubah menjadi "Sudah Tampil". Form penilaian telah TERKUNCI secara permanen dan tidak dapat diubah.',
        };
      }
      return {
        success: false,
        message: 'GAGAL: Peserta belum berstatus "Sedang Tampil". Nilai hanya dapat diinput saat peserta sedang berada di panggung mimbar.',
      };
    }

    const existingIndex = penilaianList.findIndex((n) => n.pesertaId === data.pesertaId);

    if (existingIndex >= 0 && penilaianList[existingIndex].isLocked) {
      return {
        success: false,
        message: 'Penilaian peserta ini sudah dikunci secara sah.',
      };
    }

    const updatedPenilaian: PenilaianPeserta = {
      id: existingIndex >= 0 ? penilaianList[existingIndex].id : `NILAI-${Date.now().toString().slice(-4)}`,
      pesertaId: data.pesertaId,
      juriId: data.juriId,
      juriNama: data.juriNama,
      komponen: data.komponen,
      totalNilai: data.totalNilai,
      catatanDewanHakim: data.catatanDewanHakim,
      isLocked: false,
      updatedAt: new Date().toLocaleString('id-ID'),
    };

    if (existingIndex >= 0) {
      setPenilaianList((prev) => prev.map((item, idx) => (idx === existingIndex ? updatedPenilaian : item)));
    } else {
      setPenilaianList((prev) => [updatedPenilaian, ...prev]);
    }

    return {
      success: true,
      message: `Nilai berhasil disimpan: Total ${data.totalNilai.toFixed(2)} poin. Status penilaian aktif selama peserta tampil.`,
    };
  };

  // Public: Leaderboard (Urutan Terbesar ke Terkecil)
  const getLeaderboard = (cabang?: string, golongan?: string, kafilah?: string): LeaderboardItem[] => {
    // Only participants with status "Sudah Tampil"
    const finishedParticipants = pesertaList.filter((p) => p.statusTampil === 'Sudah Tampil');

    const filtered = finishedParticipants.filter((p) => {
      if (cabang && p.cabang !== cabang) return false;
      if (golongan && p.golongan !== golongan) return false;
      if (kafilah && p.asalKafilah !== kafilah) return false;
      return true;
    });

    // Map to Leaderboard items with score
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

    // Sort descending by score
    items.sort((a, b) => b.nilaiAkhir - a.nilaiAkhir);

    // Assign ranking
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
    setCurrentUserState(null);
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
        simpanNilai,
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
