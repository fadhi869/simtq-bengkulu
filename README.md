# SIMTQ Bengkulu 🏆
### Sistem Pendaftaran dan Penilaian Lomba MTQ Tingkat Provinsi Bengkulu

> **"Gema Wahyu Ilahi di Bumi Rafflesia yang Qur'ani"**  
> Aplikasi web modern terintegrasi untuk pengelolaan Musabaqah Tilawatil Qur'an (MTQ) Tingkat Provinsi Bengkulu. Mencakup pra-pendaftaran delegasi 10 kabupaten/kota, verifikasi berkas berjenjang, pengundian nomor urut tampil transparan, sistem penilaian Dewan Hakim terproteksi, serta papan skor publik real-time.

---

## 🌟 Fitur Utama & 4 Role Pengguna

### 1. Role 1: Official Kota/Kabupaten
* **Pra-Pendaftaran Kafilah**: Menginput daftar nama calon peserta dari 9 Kabupaten & 1 Kota di Provinsi Bengkulu (*Kota Bengkulu, Bengkulu Selatan, Bengkulu Tengah, Bengkulu Utara, Kaur, Kepahiang, Lebong, Mukomuko, Rejang Lebong, Seluma*).
* **Validasi Terkunci**: Menjadi filter otoritas tunggal—hanya nama dan NIK yang telah didaftarkan Official yang dapat melanjutkan pendaftaran mandiri.
* **Cetak Surat Rekomendasi**: Menghasilkan dokumen resmi rekomendasi kafilah siap cetak dengan tanda tangan dan stempel.

### 2. Role 2: Peserta
* **Pencocokan Rekomendasi**: Peserta memverifikasi nama & NIK berdasarkan data pra-pendaftaran Official Kafilah.
* **Cabang & Golongan Dinamis**: Dropdown kondisional untuk seluruh cabang MTQ:
  * *Tilawah Al-Qur'an* (Anak-anak, Murottal, Remaja, Dewasa, Cacat Netra)
  * *Hifzhil Qur'an* (1 Juz + Tilawah, 5 Juz + Tilawah, 10 Juz, 20 Juz, 30 Juz)
  * *Syarhil Qur'an*, *Fahmil Qur'an*, *Kaligrafi Al-Qur'an*, *Qiro'at Al-Qur'an*, dan *KTIQ*
* **Logika Berkas Berdasarkan Usia (KTP vs KK)**:
  * Usia $\ge 17$ tahun: Wajib mengunggah scan KTP (`.pdf`). Form KK otomatis disembunyikan.
  * Usia $< 17$ tahun: Wajib mengunggah scan Kartu Keluarga (`.pdf`). Form KTP otomatis disembunyikan.
* **Pas Foto Latar Merah**: Validasi pas foto formal berlatar belakang merah dengan pratinjau interaktif.
* **Persetujuan Peraturan**: Checkbox komitmen wajib sebelum konfirmasi pendaftaran aktif.
* **Kartu Tanda Peserta Digital**: ID Card resmi dengan nomor registrasi `MTQ-BKL-2026-XXX`, foto latar merah, dan kode QR.

### 3. Role 3: Admin Pusat (LPTQ Provinsi Bengkulu)
* **Dashboard Rekapitulasi**: Metrik visual dan grafik pengelompokan peserta berdasarkan 10 Kabupaten/Kota dan 7 Cabang Lomba.
* **Verifikasi Berkas**: Modal peninjauan berkas (KTP/KK & foto latar merah) untuk mengubah status menjadi `"Terverifikasi"` atau `"Ditolak"` (disertai catatan alasan).
* **Acak Urutan Tampil Otomatis**: Pengundian acak nomor urut tampil (1, 2, 3...) per cabang & golongan bagi peserta terverifikasi dengan animasi transparan.
* **Manajemen Live Status Mimbar**: Mengubah status tampil peserta: `"Belum Tampil"`, `"Sedang Tampil"`, atau `"Sudah Tampil"`.

### 4. Role 4: Dewan Hakim / Juri
* **Proteksi Akses Penilaian**: Formulir nilai **hanya aktif** saat peserta berstatus `"Sedang Tampil"`.
* **Proteksi Nilai Permanen**: Begitu status diubah menjadi `"Sudah Tampil"`, form nilai otomatis **TERKUNCI** dengan status *"Sah & Terkunci"*.
* **Komponen Penilaian Standar LPTQ**: Penilaian Tajwid, Fashohah, Lagu/Tahfidz dengan slider interaktif dan kalkulasi total nilai otomatis $(0 - 100)$.

### 5. Laman Utama & Papan Skor (Publik)
* **Live Arena Dashboard**: Menampilkan peserta yang sedang tampil di panggung mimbar secara real-time dengan status pulsing badge dan mikrofon mimbar aktif.
* **Leaderboard Terurut Otomatis**: Menampilkan daftar peserta yang sudah tampil, diurutkan otomatis dari **nilai terbesar ke terkecil** (Juara I Emas, Juara II Perak, Juara III Perunggu, Harapan, dst.).
* **Filter Interaktif**: Berdasarkan Cabang Lomba, Golongan, Asal Kafilah, dan pencarian nama peserta.
* **Informasi 5 Mimbar MTQ Bengkulu**: Pusat lokasi lomba di Masjid Raya Baitul Izzah, Aula BPSDM, Gedung Serbaguna Pemprov Bengkulu, dll.

---

## 🛠️ Stack Teknologi

* **Frontend**: React 19, TypeScript
* **Build Tool**: Vite
* **Styling**: Tailwind CSS (Desain bernuansa Islami Modern dengan palet Bengkulu Emerald Green `#0d5c3a`, Royal Gold `#d4af37`, dan Rafflesia Amber)
* **Icons**: Lucide Icons (`lucide-react`)
* **Effects**: Canvas Confetti (`canvas-confetti`)
* **State Management**: Reactive LocalStorage Provider (`AppContext.tsx`) dengan pre-populated mock data

---

## 🚀 Panduan Menjalankan Proyek

### 1. Klon Repositori
```bash
git clone https://github.com/<username>/<repo-name>.git
cd simtq
```

### 2. Instal Dependensi
```bash
npm install
```

### 3. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka browser di `http://localhost:3000/`.

### 4. Build untuk Produksi
```bash
npm run build
npm run preview
```

---

## 📁 Struktur Direktori
```text
simtq/
├── public/              # Aset publik statis
├── src/
│   ├── components/
│   │   ├── admin/       # Dashboard Admin Pusat (Rekap, Verifikasi, Acak Tampil, Status)
│   │   ├── common/      # Navbar, Footer, & Komponen Bersama
│   │   ├── juri/        # Dashboard Dewan Hakim & Form Penilaian Terproteksi
│   │   ├── official/    # Dashboard Official Kafilah & Pra-Pendaftaran
│   │   ├── peserta/     # Formulir Pendaftaran Peserta & ID Card
│   │   └── public/      # Laman Utama, Live Arena, & Papan Skor
│   ├── context/         # AppContext (State management & LocalStorage reactive store)
│   ├── data/            # Konstanta daerah/cabang (constants.ts) & Dummy data (mockData.ts)
│   ├── types/           # Definisi antarmuka TypeScript
│   ├── App.tsx          # Root Layout & Role Switcher
│   ├── index.css        # Tailwind CSS & Islamic subtle pattern styling
│   └── main.tsx         # Entry point aplikasi
├── index.html           # HTML template dengan branding MTQ Bengkulu
├── package.json         # Konfigurasi dependensi
├── tailwind.config.js   # Konfigurasi tema Tailwind CSS
└── vite.config.ts       # Konfigurasi Vite
```

---

## 📜 Lisensi
Dikembangkan untuk LPTQ & Musabaqah Tilawatil Qur'an Tingkat Provinsi Bengkulu.
