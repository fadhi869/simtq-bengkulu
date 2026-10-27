export const DAFTAR_KAFILAH = [
  "Kota Bengkulu",
  "Kab. Bengkulu Selatan",
  "Kab. Bengkulu Tengah",
  "Kab. Bengkulu Utara",
  "Kab. Kaur",
  "Kab. Kepahiang",
  "Kab. Lebong",
  "Kab. Mukomuko",
  "Kab. Rejang Lebong",
  "Kab. Seluma",
] as const;

export const CABANG_DAN_GOLONGAN: Record<string, string[]> = {
  "Tilawah Al-Qur'an": [
    "Anak-anak Putra",
    "Anak-anak Putri",
    "Murottal Putra",
    "Murottal Putri",
    "Remaja Putra",
    "Remaja Putri",
    "Dewasa Putra",
    "Dewasa Putri",
    "Cacat Netra Putra",
    "Cacat Netra Putri",
  ],
  "Hifzhil Qur'an": [
    "1 Juz + Tilawah Putra",
    "1 Juz + Tilawah Putri",
    "5 Juz + Tilawah Putra",
    "5 Juz + Tilawah Putri",
    "10 Juz Putra",
    "10 Juz Putri",
    "20 Juz Putra",
    "20 Juz Putri",
    "30 Juz Putra",
    "30 Juz Putri",
  ],
  "Syarhil Qur'an": [
    "Syarhil Qur'an Putra",
    "Syarhil Qur'an Putri",
  ],
  "Fahmil Qur'an": [
    "Fahmil Qur'an Putra",
    "Fahmil Qur'an Putri",
  ],
  "Kaligrafi Al-Qur'an": [
    "Naskah Putra",
    "Naskah Putri",
    "Hiasan Mushaf Putra",
    "Hiasan Mushaf Putri",
    "Dekorasi Putra",
    "Dekorasi Putri",
    "Kontemporer Putra",
    "Kontemporer Putri",
  ],
  "Qiro'at Al-Qur'an": [
    "Qiro'at Mujawwad Dewasa Putra",
    "Qiro'at Mujawwad Dewasa Putri",
    "Qiro'at Murattal Dewasa Putra",
    "Qiro'at Murattal Dewasa Putri",
    "Qiro'at Murattal Remaja Putra",
    "Qiro'at Murattal Remaja Putri",
  ],
  "Karya Tulis Ilmiah Al-Qur'an (KTIQ)": [
    "KTIQ Putra",
    "KTIQ Putri",
  ],
};

export const MIMBAR_LIST = [
  "Mimbar I - Panggung Utama Masjid Raya Baitul Izzah",
  "Mimbar II - Aula BPSDM Provinsi Bengkulu",
  "Mimbar III - Gedung Serbaguna Pemprov Bengkulu",
  "Mimbar IV - Aula Asrama Haji Antara Bengkulu",
  "Mimbar V - Masjid Jamik Bengkulu",
];

export const KRITERIA_PENILAIAN_CABANG: Record<string, {
  bidang1: { nama: string; maks: number };
  bidang2: { nama: string; maks: number };
  bidang3: { nama: string; maks: number };
}> = {
  "Tilawah Al-Qur'an": {
    bidang1: { nama: "Tajwid & Makharijul Huruf", maks: 30 },
    bidang2: { nama: "Fashohah & Adab Tilawah", maks: 30 },
    bidang3: { nama: "Irama, Suara & Lagu Maqam", maks: 40 },
  },
  "Hifzhil Qur'an": {
    bidang1: { nama: "Tahfidz & Kelancaran Hafalan", maks: 50 },
    bidang2: { nama: "Tajwid & Tartil", maks: 25 },
    bidang3: { nama: "Fashohah & Adab", maks: 25 },
  },
  "Syarhil Qur'an": {
    bidang1: { nama: "Penguasaan Materi & Sistematika", maks: 40 },
    bidang2: { nama: "Penghayatan & Retorika Bahasa", maks: 35 },
    bidang3: { nama: "Kesesuaian Dalil & Adab Tilawah", maks: 25 },
  },
  "Fahmil Qur'an": {
    bidang1: { nama: "Ketepatan Jawaban Soal Paket", maks: 50 },
    bidang2: { nama: "Kecepatan & Ketepatan Rebutan", maks: 35 },
    bidang3: { nama: "Kekompakan Regu & Adab", maks: 15 },
  },
  "Kaligrafi Al-Qur'an": {
    bidang1: { nama: "Kaidah Khat & Keaslian Aksara", maks: 45 },
    bidang2: { nama: "Komposisi, Keindahan & Warna", maks: 35 },
    bidang3: { nama: "Kerapian, Kebersihan & Keserasian", maks: 20 },
  },
  "Qiro'at Al-Qur'an": {
    bidang1: { nama: "Kaidah Riwayat & Wajhul Qiraat", maks: 40 },
    bidang2: { nama: "Tajwid & Fashohah", maks: 30 },
    bidang3: { nama: "Irama, Lagu & Adab", maks: 30 },
  },
  "Karya Tulis Ilmiah Al-Qur'an (KTIQ)": {
    bidang1: { nama: "Bobot Gagasan, Alur Ilmiah & Orisinalitas", maks: 40 },
    bidang2: { nama: "Kekuatan Argumentasi & Referensi Qurani", maks: 35 },
    bidang3: { nama: "Presentasi, Tanya Jawab & Bahasa", maks: 25 },
  },
};
