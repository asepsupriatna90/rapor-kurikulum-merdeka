# 📖 Panduan Instalasi dan Penggunaan

## 🚀 Cara Menjalankan Aplikasi

### Metode 1: Buka Langsung di Browser (Paling Mudah)
1. Download atau clone repository ini
2. Buka file `index.html` di browser Anda (Firefox, Chrome, Edge, Safari)
3. Aplikasi siap digunakan!

### Metode 2: Gunakan Local Server (Recommended)

#### Di Windows (dengan Python):
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Kemudian buka: http://localhost:8000

#### Di Windows (dengan Node.js):
```bash
# Install http-server
npm install -g http-server

# Jalankan
http-server
```

#### Di Mac/Linux:
```bash
# Gunakan Python built-in
python3 -m http.server 8000
```

## 💾 Menggunakan Aplikasi

### 1. **Mulai dengan Data**
   - Klik **Dashboard** untuk melihat overview
   - Masukkan data sekolah terlebih dahulu
   - Tambahkan guru, kelas, dan siswa
   - Input mata pelajaran dan CP/TP (Capaian Pembelajaran)

### 2. **Input Nilai**
   - Pergi ke menu **Nilai**
   - Pilih Kelas, Mata Pelajaran, dan Semester
   - Input nilai untuk setiap CP/TP
   - Klik **Simpan Nilai**

### 3. **Deskripsi Kompetensi**
   - Pergi ke menu **Deskripsi**
   - Pilih Kelas, Siswa, dan Semester
   - Bisa manual atau auto-generate dari nilai
   - Klik **Simpan Deskripsi**

### 4. **Ekstrakurikuler**
   - Input jenis ekstrakurikuler terlebih dahulu
   - Input nilai ekstrakurikuler siswa
   - Akan muncul di rapor

### 5. **Cetak Rapor**
   - Pergi ke **Cetak Rapor**
   - Pilih Siswa, Semester, dan Template
   - Preview rapor
   - Klik **Cetak PDF** untuk download

### 6. **Backup & Restore Data**
   - Klik tombol **Download** di top bar untuk backup
   - Klik tombol **Upload** untuk restore dari backup
   - Gunakan menu **Sinkronisasi** untuk export/import JSON

## 📊 Struktur Data

### Database (IndexedDB)
Aplikasi menggunakan IndexedDB untuk menyimpan data lokal:

- **sekolah**: Data sekolah
- **guru**: Data guru/pengajar
- **kelas**: Data kelas
- **siswa**: Data siswa
- **mapel**: Mata pelajaran
- **cp**: Capaian Pembelajaran / Tujuan Pembelajaran
- **nilai**: Nilai siswa per CP
- **deskripsi**: Deskripsi capaian kompetensi
- **ekstrakurikuler**: Data ekstrakurikuler
- **ekstrakurikuler_siswa**: Nilai ekstrakurikuler siswa
- **ketidakhadiran**: Rekam kehadiran (sakit, izin, tanpa keterangan)
- **catatan_walikelas**: Catatan wali kelas untuk siswa
- **pengaturan**: Pengaturan umum aplikasi

## 🔄 Sinkronisasi Data

### Export Data
- Menu **Sinkronisasi** → **Export Data** → **Export JSON**
- File JSON akan di-download ke komputer
- Gunakan untuk backup atau transfer data

### Import Data
- Menu **Sinkronisasi** → **Import Data** → **Import dari File**
- Pilih file JSON yang sudah di-backup
- Data akan di-import ke aplikasi

## 🌐 Akses Melalui GitHub Pages

Jika Anda sudah push ke GitHub, aplikasi dapat diakses di:
```
https://username.github.io/rapor-kurikulum-merdeka
```

Contoh: `https://john.github.io/rapor-kurikulum-merdeka`

## ⚙️ Pengaturan

- **Tahun Ajaran**: Set otomatis berdasarkan tanggal (dapat diubah)
- **Fase Aktif**: Sesuaikan dengan jenjang pendidikan
- **Semester**: Semester 1 atau 2

## 🔒 Keamanan Data

- Semua data disimpan **lokal di browser** (IndexedDB)
- Data **tidak dikirim ke server** manapun
- Data aman dan **hanya bisa diakses dari browser yang sama**
- Gunakan fitur backup untuk keamanan maksimal

## 🎨 Fitur Lanjutan

### Template Rapor
Aplikasi mendukung beberapa template:
- SD (Sekolah Dasar)
- SMP (Sekolah Menengah Pertama)
- SMA (Sekolah Menengah Atas)
- SMK (Sekolah Menengah Kejuruan)
- Paket A, B, C (Pendidikan Kesetaraan)

### Kehadiran
- Input kehadiran siswa (Sakit, Izin, Tanpa Keterangan)
- Otomatis muncul di rapor

### Catatan Wali Kelas
- Berikan catatan khusus per siswa
- Muncul di bagian akhir rapor

## 🐛 Troubleshooting

### Aplikasi Blank/Tidak Muncul
1. Buka Developer Console (F12)
2. Lihat apakah ada error
3. Coba clear browser cache (Ctrl+Shift+Delete)
4. Refresh halaman (Ctrl+F5)

### Data Tidak Tersimpan
- Pastikan browser mendukung IndexedDB
- Coba browser lain (Chrome, Firefox)
- Periksa storage browser tidak penuh

### Error saat Export/Import
- Pastikan file JSON valid
- Coba buka file JSON dengan text editor
- Pastikan tidak ada karakter spesial yang corrupt

## 📞 Bantuan & Support

- Lihat documentation di README.md
- Periksa console browser untuk error details
- Gunakan backup/export untuk keamanan data

## 🎓 Tips & Trik

1. **Backup Rutin**: Lakukan export data setiap minggu
2. **Gunakan Multiple Tabs**: Buka di tab berbeda untuk aplikasi berbeda jika perlu
3. **Keyboard Shortcut**: Tekan Tab untuk navigate antar field
4. **Print Preview**: Gunakan browser's print preview untuk lihat rapor sebelum PDF
5. **Data Sampel**: Gunakan load data demo untuk testing

---

**Versi**: 1.0.0  
**Status**: Production Ready  
**Update Terakhir**: 2025
