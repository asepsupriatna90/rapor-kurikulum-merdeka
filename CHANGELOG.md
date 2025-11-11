# 📝 CHANGELOG

Semua perubahan penting dalam proyek Rapor Kurikulum Merdeka akan dicatat di sini.

## [1.1.0] - 2025-11-11

### ✨ Added (Fitur Baru)
- ✅ **Demo Data Generator** - Tombol untuk memuat data sampel dengan satu klik
  - Termasuk data sekolah, guru, kelas, siswa, mapel, CP/TP, dan nilai sample
  - Memudahkan user untuk melihat cara kerja aplikasi tanpa input manual
  - File baru: `js/demo-data.js`

- ✅ **Form Validator Module** - Validasi form yang comprehensive
  - Validasi required, email, NISN, NIP, phone, min/max length
  - Validasi nilai numerik (min/max)
  - Custom validation support
  - Display error messages yang user-friendly
  - File baru: `js/form-validator.js`

- ✅ **Enhancement Module** - Fitur tambahan untuk user experience
  - Print-friendly styles untuk rapor
  - Local search functionality di tabel
  - Sortable table columns (ascending/descending)
  - Export table ke CSV
  - Currency formatter
  - Date range picker setup
  - Auto-save functionality
  - Tooltip support
  - File baru: `js/enhancement.js`

### 🔧 Improved (Peningkatan)
- Tampilan dashboard dengan button "Muat Data Sampel"
- Script loading order yang lebih optimal di index.html
- Error handling yang lebih baik

### 📝 Documentation
- Tambah docstring di semua file baru
- Update README untuk menjelaskan fitur baru

### 🐛 Fixed
- Fix order script loading di HTML

---

## [1.0.0] - 2025-11-11

### ✨ Initial Release
- ✅ Aplikasi Rapor Kurikulum Merdeka versi 1.0
- ✅ Manajemen data lengkap (sekolah, guru, kelas, siswa)
- ✅ Input nilai per CP/TP
- ✅ Generate rapor PDF otomatis
- ✅ Export/Import data JSON
- ✅ Offline-first dengan IndexedDB
- ✅ Responsive design
- ✅ Dokumentasi lengkap

---

## 🔮 Roadmap

### Versi 1.2 (Planned)
- [ ] Dark mode support
- [ ] Advanced search dengan filter multiple
- [ ] Batch operations untuk nilai
- [ ] Template customization
- [ ] Email export rapor
- [ ] User authentication
- [ ] Multi-school support

### Versi 2.0 (Future)
- [ ] Cloud sync dengan Firebase/Supabase
- [ ] Mobile app (React Native)
- [ ] Real-time collaboration
- [ ] Advanced analytics & reporting
- [ ] API untuk integrasi sistem lain
- [ ] Webhook support

---

## 📊 Version History

| Version | Date | Status | Highlights |
|---------|------|--------|-----------|
| **1.1.0** | 2025-11-11 | Current | Demo data, validation, enhancements |
| **1.0.0** | 2025-11-11 | Released | Initial release |

---

## 🤝 Contributing

Untuk melihat panduan kontribusi, baca [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📞 Support

Untuk pertanyaan atau masalah, silakan buka Issue di GitHub atau hubungi support.

---

**Last Updated**: November 11, 2025  
**Maintained by**: Rapor Kurikulum Merdeka Team
