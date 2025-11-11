# 📚 INDEX DOKUMENTASI

Selamat datang! Berikut adalah panduan lengkap untuk menggunakan dan mendeploy aplikasi Rapor Kurikulum Merdeka.

## 🚀 **MULAI DARI SINI**

### 1️⃣ **[QUICK_START.md](QUICK_START.md)** ⭐ BACA DULU
Ringkasan singkat tentang apa yang sudah dilakukan dan langkah selanjutnya untuk push ke GitHub.

### 2️⃣ **[GITHUB_SETUP.md](GITHUB_SETUP.md)** 
Step-by-step untuk setup repository GitHub dan GitHub Pages.

### 3️⃣ **[INSTALLATION.md](INSTALLATION.md)**
Panduan instalasi aplikasi dan cara menggunakannya dengan detail.

---

## 📖 **DOKUMENTASI LENGKAP**

| File | Isi | Untuk Siapa |
|------|-----|-----------|
| **[README.md](README.md)** | Overview project, fitur, teknologi, stack | Developer & Public |
| **[INSTALLATION.md](INSTALLATION.md)** | Cara install & setup, tutorial penggunaan | End User |
| **[CONTRIBUTING.md](CONTRIBUTING.md)** | Panduan kontribusi kode, style guide | Developer/Kontributor |
| **[GITHUB_SETUP.md](GITHUB_SETUP.md)** | Setup repository GitHub & Pages | Admin Project |
| **[QUICK_START.md](QUICK_START.md)** | Ringkasan & next steps | Project Owner |

---

## 💾 **FILE PENTING LAINNYA**

| File | Deskripsi |
|------|-----------|
| **package.json** | Metadata project & dependencies |
| **LICENSE** | MIT License |
| **.gitignore** | File yang diabaikan Git |

---

## 🎯 **CHECKLIST SEBELUM PUSH KE GITHUB**

- [ ] Sudah read [QUICK_START.md](QUICK_START.md)
- [ ] Sudah buat repository GitHub baru
- [ ] Sudah siap dengan Personal Access Token
- [ ] Sudah jalankan perintah git push
- [ ] Sudah aktifkan GitHub Pages di Settings
- [ ] Aplikasi sudah bisa diakses di GitHub Pages URL

---

## 📋 **STRUKTUR PROYEK**

```
📁 rapor-kurikulum-merdeka/
├── 📄 index.html                 ← Aplikasi utama
├── 📄 package.json               ← Metadata
├── 📄 LICENSE                    ← MIT License
├── 📄 .gitignore                 ← Git ignore rules
│
├── 📚 Dokumentasi/
│   ├── README.md                 ← Project overview
│   ├── QUICK_START.md            ← Quick start guide ⭐
│   ├── GITHUB_SETUP.md           ← GitHub setup guide
│   ├── INSTALLATION.md           ← Panduan instalasi
│   ├── CONTRIBUTING.md           ← Panduan kontribusi
│   └── INDEX.md                  ← File ini
│
├── 📁 css/
│   └── style.css                 ← Styling lengkap
│
├── 📁 js/
│   ├── app.js                    ← Entry point
│   ├── db.js                     ← Database management
│   ├── ui.js                     ← UI updates
│   ├── utils.js                  ← Utility functions
│   └── pdf-generator.js          ← PDF generation
│
└── 📁 lib/
    ├── jspdf.min.js              ← jsPDF library
    └── jspdf-autotable.min.js    ← jsPDF AutoTable
```

---

## 🔄 **WORKFLOW DEVELOPMENT**

### Local Development
```bash
# Buka folder di VS Code
code .

# Edit file sesuai kebutuhan
# Test di browser dengan buka index.html

# Commit perubahan
git add .
git commit -m "pesan commit"

# Push ke GitHub
git push
```

### Live Website
- Aplikasi otomatis ter-deploy ke GitHub Pages
- Akses di: `https://USERNAME.github.io/rapor-kurikulum-merdeka`

---

## 🎓 **FITUR APLIKASI**

### Core Features
- ✅ Manajemen Data (Sekolah, Guru, Kelas, Siswa)
- ✅ Input Nilai per CP/TP
- ✅ Generate Rapor PDF
- ✅ Export/Import Data
- ✅ Offline-First dengan IndexedDB
- ✅ Multi-template Rapor
- ✅ Responsive Design

### Advanced Features
- ✅ Deskripsi Otomatis
- ✅ Ekstrakurikuler Management
- ✅ Kehadiran Tracking
- ✅ Catatan Wali Kelas

---

## 🆘 **TROUBLESHOOTING**

### Problem: "Aplikasi tidak muncul"
**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Refresh halaman (Ctrl+F5)
3. Buka Developer Console (F12) cek error

### Problem: "Data tidak tersimpan"
**Solution:**
1. Pastikan browser support IndexedDB
2. Cek storage browser tidak penuh
3. Coba di browser lain (Chrome, Firefox)

### Problem: "GitHub push error"
**Solution:**
1. Pastikan URL remote benar: `git remote -v`
2. Update PAT yang expired
3. Check internet connection

---

## 📞 **BANTUAN & SUPPORT**

- 📖 Baca dokumentasi yang sesuai di atas
- 🔍 Search issue di GitHub Issues
- 💬 Buat discussion di GitHub Discussions
- 📧 Email: support@example.com

---

## 🎯 **NEXT STEPS**

1. **Baca [QUICK_START.md](QUICK_START.md)**
2. **Ikuti langkah di [GITHUB_SETUP.md](GITHUB_SETUP.md)**
3. **Push ke GitHub dan aktifkan GitHub Pages**
4. **Aplikasi sudah live! 🎉**

---

## 📊 **PROJECT INFO**

| Info | Detail |
|------|--------|
| **Status** | ✅ Production Ready |
| **Versi** | 1.0.0 |
| **License** | MIT |
| **Platform** | Web (Browser) |
| **Database** | IndexedDB (Offline) |
| **Framework** | Vanilla JavaScript |

---

**Last Updated**: November 2025  
**Made with ❤️ for Indonesian Education**

---

## 🎉 **CONGRATULATIONS!**

Proyek Anda siap untuk di-push ke GitHub dan di-deploy sebagai website! 🚀

Ikuti [QUICK_START.md](QUICK_START.md) untuk langkah terakhir!
