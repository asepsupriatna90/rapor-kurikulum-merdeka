# 🤖 GitHub AUTO-BACKUP SETUP

## 📋 Apa itu Auto-Backup?

Auto-Backup adalah sistem otomatis yang:
- ✅ Backup data setiap 24 jam (atau interval pilihan user)
- ✅ Simpan di GitHub dalam folder `/backups/`
- ✅ Bisa restore kapan saja dari backup file
- ✅ Support GitHub Personal Access Token untuk automated upload
- ✅ Optional manual trigger setiap saat

---

## 🔧 SETUP GITHUB ACTIONS

### Step 1: Workflow sudah ada

File `.github/workflows/auto-backup.yml` sudah di-setup. Workflow ini:
- Berjalan setiap hari pukul 02:00 UTC (09:00 WIB)
- Bisa di-trigger manual dari GitHub Actions tab
- Membuat backup JSON file
- Auto-commit ke repository

### Step 2: Enable GitHub Actions

1. Buka repository di GitHub
2. Klik tab **Actions**
3. Pilih workflow **Auto Backup Data**
4. Klik **Enable workflow**

### Step 3: Test Workflow

1. Klik workflow **Auto Backup Data**
2. Klik **Run workflow** button
3. Pilih branch: `main`
4. Klik **Run workflow**
5. Tunggu proses selesai (~1-2 menit)

---

## 🎮 SETUP DI APLIKASI

### Opsi 1: Automatic (via GitHub Actions)

Workflow sudah berjalan otomatis. Tidak perlu setup di aplikasi.

**Keuntungan:**
- Tidak perlu token
- Aman (token disimpan GitHub)
- Otomatis setiap hari

**Kekurangan:**
- Backup generic (template data)
- Tidak bisa real-time sync

### Opsi 2: Manual Trigger (di Aplikasi)

User bisa manual backup via aplikasi.

**Setup:**
1. Buka menu **Sinkronisasi**
2. Klik tab **Auto-Backup Settings**
3. Enable "Auto-Backup"
4. (Optional) Masuk GitHub token jika ingin auto-upload

---

## 🔑 GITHUB PERSONAL ACCESS TOKEN (Optional)

Jika ingin auto-upload real-time ke GitHub:

### Generate Token:

1. Buka https://github.com/settings/tokens
2. Klik **Generate new token** → **Generate new token (classic)**
3. Isi:
   - **Token name**: `rapor-backup`
   - **Expiration**: 90 days (atau No expiration)
   - **Select scopes**:
     - ✅ `repo` (Full control of private repositories)
     - ✅ `workflow` (Update GitHub Action workflows)
4. Klik **Generate token**
5. Copy token (tampil sekali saja!)

### Simpan di Aplikasi:

1. Buka aplikasi Rapor KM
2. Menu **Sinkronisasi** → **Auto-Backup Settings**
3. Paste token di field **GitHub Personal Access Token**
4. Isi **GitHub Owner**: `asepsupriatna90` (username Anda)
5. Isi **GitHub Repository**: `rapor-kurikulum-merdeka`
6. Klik **Save**

---

## 📂 BACKUP FILE STRUCTURE

Setelah auto-backup berjalan, folder akan terlihat seperti:

```
rapor-kurikulum-merdeka/
├── .github/
│   └── workflows/
│       └── auto-backup.yml        ← GitHub Actions config
├── backups/                        ← Backup files folder
│   ├── rapor-backup-2025-11-11.json
│   ├── rapor-backup-2025-11-12.json
│   ├── rapor-backup-2025-11-13.json
│   └── ...
├── index.html
├── css/
├── js/
│   └── auto-backup.js              ← Backup module
└── ...
```

---

## 🎯 BACKUP WORKFLOW

### Automatic (GitHub Actions):

```
Every day 02:00 UTC
    ↓
GitHub Actions trigger
    ↓
Generate backup JSON
    ↓
Commit to /backups/ folder
    ↓
Push to repository
    ↓
✅ Backup complete
```

### Manual (User Triggered):

```
User click "Backup Now"
    ↓
Export all data from IndexedDB
    ↓
Create backup object
    ↓
Save locally (localStorage)
    ↓
Upload to GitHub (if token set)
    ↓
✅ Backup complete
```

---

## 🔄 RESTORE DATA

### Dari Aplikasi:

1. Menu **Sinkronisasi** → **Auto-Backup Settings**
2. Klik **Restore Backup**
3. Pilih file JSON backup
4. Klik **Open**
5. Data akan di-restore dan reload aplikasi

### Dari GitHub:

1. Buka repository
2. Folder **backups/**
3. Pilih file yang diinginkan
4. Klik **Raw** button
5. Copy URL
6. Di aplikasi: Menu **Sinkronisasi** → **Import dari URL**
7. Paste URL dan klik **Import**

---

## 📊 MONITORING BACKUPS

### View dalam GitHub:

1. Buka repository
2. Klik **Commits**
3. Cari commits dengan pesan "🤖 Auto: Daily backup"
4. Klik commit untuk lihat perubahan

### View dalam Aplikasi:

1. Menu **Sinkronisasi** → **Auto-Backup Settings**
2. Klik **View History**
3. Lihat daftar backup yang sudah dibuat
4. Lihat tanggal, waktu, dan ukuran file

---

## ⚙️ CONFIGURATION

### Mengubah Interval Backup:

**Di GitHub Actions:**
```yaml
# .github/workflows/auto-backup.yml
schedule:
  - cron: '0 2 * * *'  # Setiap hari pukul 02:00 UTC
```

Cron format:
```
┌───────────── menit (0-59)
│ ┌───────────── jam (0-23)
│ │ ┌───────────── tanggal bulan (1-31)
│ │ │ ┌───────────── bulan (1-12)
│ │ │ │ ┌───────────── hari minggu (0-6)
│ │ │ │ │
│ │ │ │ │
0 2 * * *
```

**Contoh:**
- `0 2 * * *` = Setiap hari pukul 02:00 UTC (09:00 WIB)
- `0 */6 * * *` = Setiap 6 jam
- `0 12 * * 0` = Setiap Minggu pukul 12:00 UTC
- `0 0 1 * *` = Setiap tanggal 1 pukul 00:00 UTC

### Mengubah di Aplikasi:

```javascript
// js/auto-backup.js
const CONFIG = {
    BACKUP_INTERVAL: 24 * 60 * 60 * 1000, // 24 jam
    // Ubah ke:
    BACKUP_INTERVAL: 12 * 60 * 60 * 1000, // 12 jam
    // atau:
    BACKUP_INTERVAL: 6 * 60 * 60 * 1000,  // 6 jam
};
```

---

## 🔐 SECURITY NOTES

### Token Safety:

⚠️ **JANGAN**:
- ❌ Commit token ke repository
- ❌ Share token dengan orang lain
- ❌ Post token di internet/forum

✅ **LAKUKAN**:
- ✅ Simpan token di localStorage (client-side)
- ✅ Regenerate token jika expired
- ✅ Delete token jika tidak digunakan

### Data Encryption:

Saat ini backup tersimpan plain JSON. Untuk keamanan lebih:

```javascript
// Optional: Encrypt backup sebelum upload
const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(backup),
    password
).toString();

// Upload encrypted data
// Decrypt saat restore
```

---

## 🐛 TROUBLESHOOTING

### Backup tidak jalan?

**1. Check workflow status:**
- GitHub → Actions → Auto Backup Data
- Lihat log terbaru

**2. Common errors:**

| Error | Solusi |
|-------|--------|
| "Permission denied" | Enable workflows di repository settings |
| "Commit failed" | Check branch protection rules |
| "File too large" | Compress backup atau split data |
| "Rate limit" | Wait 1 hour atau upgrade token |

### Restore gagal?

**1. Check file format:**
```bash
# Validate JSON
cat backups/rapor-backup-2025-11-11.json | jq empty
```

**2. Check data structure:**
```json
{
  "timestamp": "2025-11-11T09:00:00.000Z",
  "version": "1.1.0",
  "data": {
    "sekolah": [...],
    "guru": [...],
    ...
  }
}
```

---

## 📈 NEXT IMPROVEMENTS

Fitur yang bisa ditambahkan:

- [ ] Incremental backup (hanya data yang berubah)
- [ ] Data compression (.zip format)
- [ ] Automatic cleanup (delete old backups)
- [ ] Backup scheduling UI
- [ ] Restore point selection
- [ ] Backup verification
- [ ] Cloud storage integration (Google Drive, OneDrive)
- [ ] Encryption at rest
- [ ] Backup analytics dashboard

---

## 📞 SUPPORT

**Jika ada masalah:**

1. Check GitHub Actions logs
2. Check browser console (F12 → Console)
3. Check localStorage (`localStorage.getItem('local_backups')`)
4. Create issue di GitHub repository

---

## ✅ CHECKLIST SETUP

- [ ] GitHub Actions workflow ada (`.github/workflows/auto-backup.yml`)
- [ ] Auto-backup module loaded (`js/auto-backup.js`)
- [ ] Workflow enabled di GitHub
- [ ] Test workflow berjalan sukses
- [ ] Data di folder `/backups/` terbuat
- [ ] (Optional) GitHub token di-generate
- [ ] (Optional) Token di-simpan di aplikasi
- [ ] (Optional) Manual backup di-test

---

**Status**: ✅ Implemented (v1.1.0)  
**Last Updated**: November 11, 2025  
**Maintained by**: GitHub Actions Workflow
