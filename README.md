# 📚 Rapor Kurikulum Merdeka

> **Aplikasi Web Modern untuk Pembuatan Rapor Siswa Sesuai Standar Kurikulum Merdeka (BSKAP)**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status: Production Ready](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)]()
[![Platform: Web](https://img.shields.io/badge/Platform-Web-blue)]()

---

## ✨ Fitur Utama

### 📊 Manajemen Data
- ✅ Manajemen data sekolah lengkap
- ✅ Database guru dan kelas
- ✅ Kelola data siswa per kelas
- ✅ Input mata pelajaran per fase/jenjang
- ✅ Kelola CP/TP (Capaian Pembelajaran/Tujuan Pembelajaran)

### 📈 Penilaian & Penilaian
- ✅ Input nilai per CP/TP untuk setiap siswa
- ✅ Deskripsi otomatis berdasarkan nilai
- ✅ Nilai ekstrakurikuler
- ✅ Rekam kehadiran (Sakit, Izin, Tanpa Keterangan)
- ✅ Catatan wali kelas untuk siswa

### 📄 Rapor & Cetak
- ✅ Generate rapor PDF otomatis
- ✅ Multiple template (SD, SMP, SMA, SMK, Paket A/B/C)
- ✅ Preview rapor sebelum print
- ✅ Cetak per siswa atau batch
- ✅ Custom header dengan logo sekolah

### 💾 Sinkronisasi & Backup
- ✅ Export semua data ke JSON
- ✅ Import data dari file JSON
- ✅ Backup otomatis
- ✅ Restore data dengan mudah

### 🔐 Offline-First
- ✅ 100% berjalan di browser (IndexedDB)
- ✅ Bekerja offline tanpa internet
- ✅ Data aman tersimpan lokal
- ✅ Tidak perlu server atau database server

---

## 🚀 Quick Start

### Metode 1: Langsung Buka (Paling Mudah)
```bash
1. Download repository
2. Buka file index.html di browser
3. Aplikasi langsung siap digunakan!
```

### Metode 2: Gunakan Local Server
```bash
# Python 3
python -m http.server 8000
# Buka http://localhost:8000

# Node.js
npx http-server
# Buka http://localhost:8080
```

### Metode 3: Akses dari GitHub Pages
Setelah push ke GitHub:
```
https://username.github.io/rapor-kurikulum-merdeka
```

---

## 📋 Petunjuk Penggunaan

1. **Setup Data Awal**
   - Input Data Sekolah
   - Tambahkan Guru/Pengajar
   - Buat Kelas
   - Tambahkan Siswa ke kelas

2. **Setup Pembelajaran**
   - Input Mata Pelajaran
   - Buat CP/TP (Capaian Pembelajaran)
   - Link CP dengan mata pelajaran

3. **Input Penilaian**
   - Menu Nilai → Pilih Kelas, Mapel, Semester
   - Input nilai untuk setiap CP/TP
   - Simpan nilai

4. **Buat Deskripsi**
   - Menu Deskripsi → Pilih Siswa dan Semester
   - Generate otomatis atau manual input
   - Simpan deskripsi

5. **Cetak Rapor**
   - Menu Cetak Rapor
   - Pilih Siswa, Semester, dan Template
   - Preview
   - Download PDF

**Lihat [INSTALLATION.md](INSTALLATION.md) untuk panduan lengkap**

---

## 🛠️ Stack Teknologi

| Teknologi | Deskripsi | Versi |
|-----------|-----------|-------|
| **HTML5** | Struktur & Markup | - |
| **CSS3** | Styling & Responsif | - |
| **JavaScript** | Logic & Interaksi | ES6+ |
| **IndexedDB** | Database Lokal | Browser API |
| **jsPDF** | Generate PDF | 2.5.1 |
| **jsPDF AutoTable** | Tabel di PDF | 3.5.31 |
| **Font Awesome** | Icon Library | 6.4.0 |

---

## 📁 Struktur Proyek

```
rapor-kurikulum-merdeka/
├── index.html                    # 🏠 Halaman utama aplikasi
├── package.json                  # 📦 Metadata proyek
├── README.md                     # 📖 File ini
├── INSTALLATION.md               # 🚀 Panduan instalasi lengkap
├── .gitignore                    # 🚫 File yang di-ignore Git
│
├── css/
│   └── style.css                # 🎨 Styling lengkap aplikasi
│
├── js/
│   ├── app.js                   # 🎯 Entry point & inisialisasi
│   ├── db.js                    # 💾 IndexedDB management
│   ├── ui.js                    # 🖼️ UI update & event handling
│   ├── utils.js                 # 🛠️ Utility functions
│   └── pdf-generator.js         # 📄 Generate PDF rapor
│
└── lib/
    ├── jspdf.min.js             # jsPDF library
    └── jspdf-autotable.min.js   # jsPDF AutoTable plugin
```

---

## 🎓 Kompatibilitas

### Browser
- ✅ Chrome/Chromium (v90+)
- ✅ Firefox (v88+)
- ✅ Safari (v14+)
- ✅ Edge (v90+)

### OS
- ✅ Windows
- ✅ macOS
- ✅ Linux
- ✅ Android/iOS (Mobile Browser)

### Requirements
- Minimal RAM: 256 MB
- Browser dengan support IndexedDB
- Koneksi internet (untuk awal load saja, selanjutnya offline)

---

## 💡 Fitur Unggulan

### 🔄 Sinkronisasi Smart
```javascript
// Export data sebagai JSON
Menu Sinkronisasi → Export JSON

// Import data dari backup
Menu Sinkronisasi → Import dari File
```

### 🎨 Template Responsive
- Otomatis menyesuaikan dengan ukuran layar
- Perfect untuk desktop, tablet, dan mobile
- Print-friendly untuk rapor

### 🚀 Performance
- Load time < 2 detik
- Smooth animations
- Minimal network requests

### 🔒 Keamanan Data
- Semua data tersimpan **lokal** di IndexedDB
- Tidak ada pengiriman data ke server
- User kontrol penuh atas data

---

## 📊 Fase & Jenjang Pendidikan

Aplikasi mendukung semua fase Kurikulum Merdeka:

| Fase | Jenjang | Kelas |
|------|---------|-------|
| **A** | SD | 1-2 |
| **B** | SD | 3-4 |
| **C** | SD | 5-6 |
| **D** | SMP | 7-9 |
| **E** | SMA | 10-12 |
| **F** | SMK/Khusus | 13+ |

---

## 🔧 Konfigurasi

Edit file JavaScript untuk kustomisasi:

### Warna & Theme (`css/style.css`)
```css
:root {
    --primary-color: #4e73df;
    --success-color: #1cc88a;
    --danger-color: #e74a3b;
    /* dst... */
}
```

### Database Schema (`js/db.js`)
Sesuaikan dengan kebutuhan sekolah Anda

---

## 📈 Roadmap

- [ ] Cloud Sync (Firebase)
- [ ] Multi-user dengan authentication
- [ ] Template custom
- [ ] API untuk integrasi sistem lain
- [ ] Mobile app (React Native)
- [ ] Dark mode

---

## 🤝 Kontribusi

Kami senang menerima kontribusi! Silakan:

1. Fork repository ini
2. Buat branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 Lisensi

Proyek ini dilisensikan di bawah **MIT License** - lihat file [LICENSE](LICENSE) untuk detail.

---

## 👨‍💻 Author

Dibuat dengan ❤️ untuk dunia pendidikan Indonesia

---

## � Dukungan & Bantuan

- � Baca [INSTALLATION.md](INSTALLATION.md) untuk panduan lengkap
- 🐛 Report bug di Issues
- 💬 Diskusi di Discussions
- 📧 Email: support@example.com

---

## 🎯 Disclaimer

Aplikasi ini dikembangkan untuk memenuhi standar Kurikulum Merdeka yang diterbitkan oleh BSKAP (Badan Standar, Kurikulum, dan Asesmen Pendidikan). Pengguna bertanggung jawab memastikan data dan laporan sesuai dengan regulasi lokal di daerah masing-masing.

---

**Status**: ✅ Production Ready  
**Versi**: 1.0.0  
**Last Updated**: November 2025  
**Made with ❤️ for Indonesian Education**

