# 💾 DATABASE ARCHITECTURE

## 📍 Lokasi Database

Database aplikasi Rapor Kurikulum Merdeka tersimpan di **Browser Local Storage**, bukan di GitHub.

### Penjelasan:

```
┌─────────────────────────────────────┐
│     Aplikasi Rapor KM 2025         │
├─────────────────────────────────────┤
│  GitHub Pages (Static Files)        │ ← Website hosting
│  - index.html                       │
│  - css/style.css                    │
│  - js/*.js                          │
│  - lib/                             │
├─────────────────────────────────────┤
│  Browser IndexedDB (Local Storage)  │ ← Database
│  - Sekolah                          │
│  - Guru                             │
│  - Kelas                            │
│  - Siswa                            │
│  - Mapel                            │
│  - CP/TP                            │
│  - Nilai                            │
│  - Deskripsi                        │
│  - Ekstrakurikuler                  │
│  - Ketidakhadiran                   │
│  - Catatan Wali Kelas               │
│  - Pengaturan                       │
└─────────────────────────────────────┘
```

---

## 🗄️ INDEXEDDB STORAGE

### Apa itu IndexedDB?

- **Local Storage** browser untuk aplikasi web
- Tersimpan **offline** di komputer user
- Kapasitas **besar** (biasanya 50MB+)
- **Persisten** selama browser cache tidak dihapus
- **Secure** - hanya bisa diakses dari origin yang sama

### Keuntungan:

✅ **Offline-first** - Aplikasi bisa digunakan tanpa internet  
✅ **Fast** - Akses data super cepat  
✅ **Secure** - Data tidak dikirim ke server  
✅ **Privacy** - Data user terjaga 100%  
✅ **No Backend** - Tidak perlu server  

### Kekurangan:

⚠️ **Lokal** - Data tidak auto-sync ke device lain  
⚠️ **Browser-specific** - Data berbeda untuk setiap browser  
⚠️ **Bisa dihapus** - Clear browser cache = data hilang  
⚠️ **Per-domain** - Setiap domain punya storage terpisah  

---

## 📤 EXPORT DATA (Ke GitHub)

### Cara 1: Export Manual ke File

User bisa export data via menu **Sinkronisasi**:

```
Menu: Sinkronisasi → Export Data → Export JSON
```

Ini akan download file JSON berisi semua data:

```json
{
  "sekolah": [...],
  "guru": [...],
  "kelas": [...],
  "siswa": [...],
  ...
}
```

**File bisa disimpan di:**
- Komputer lokal
- GitHub (dengan manual upload)
- Cloud storage (Google Drive, OneDrive, dll)

### Cara 2: Create Backup Automation

Bisa di-custom untuk auto-export:

```javascript
// Auto-backup setiap hari
setInterval(() => {
    DB.exportAllData((data) => {
        // Upload ke Firebase/Supabase
        // atau simpan ke localStorage
    });
}, 24 * 60 * 60 * 1000); // 24 jam
```

---

## 🔄 IMPORT DATA (Dari GitHub)

### Cara 1: Import Manual

User bisa import data via menu **Sinkronisasi**:

```
Menu: Sinkronisasi → Import Data → Import dari File
```

Pilih file JSON yang sudah di-backup sebelumnya.

### Cara 2: Auto-Import saat App Load

Bisa di-setup untuk auto-import dari GitHub:

```javascript
// Load dari GitHub raw content
fetch('https://raw.githubusercontent.com/user/repo/main/data.json')
    .then(r => r.json())
    .then(data => DB.importAllData(data))
```

---

## 🌐 CLOUD SYNC OPTIONS

### Option 1: Firebase Realtime Database

```javascript
// Sync otomatis dengan Firebase
firebase.database().ref('users/' + userId + '/data')
    .on('value', (snapshot) => {
        DB.importAllData(snapshot.val());
    });
```

**Keuntungan:**
- ✅ Real-time sync
- ✅ Multi-device
- ✅ Automatic backup
- ✅ User authentication

**Kekurangan:**
- ❌ Perlu backend setup
- ❌ Biaya (jika data besar)

### Option 2: Supabase (PostgreSQL)

```javascript
// Sync dengan Supabase
const { data, error } = await supabase
    .from('rapor_data')
    .insert([{ user_id, data: allData }])
```

### Option 3: GitHub as Backend

```javascript
// Commit data ke GitHub via GitHub API
const octokit = new Octokit({
    auth: 'github_token'
});

octokit.rest.repos.createOrUpdateFileContents({
    owner: 'user',
    repo: 'repo',
    path: 'data/rapor.json',
    message: 'Auto-sync rapor data',
    content: btoa(JSON.stringify(data))
});
```

---

## 📊 DATA PERSISTENCE STRATEGY

### Saat Ini (v1.1.0):

```
┌─ IndexedDB (Browser Local)
│  └─ Manual Export/Import via JSON
│     └─ User save ke file atau GitHub
```

### Recommended (untuk Production):

```
┌─ IndexedDB (Browser Local)
├─ Auto-backup every 24 hours
├─ Firebase Realtime Database (optional)
├─ Export to JSON daily
└─ Sync to GitHub (optional)
```

---

## 🔐 BACKUP STRATEGY

### Recommended Backup Plan:

1. **Daily Auto-Export**
   ```javascript
   // Setiap hari auto-download backup
   setInterval(() => {
       DB.exportAllData((data) => {
           Utils.exportDataToJson(data, 
               `backup-${new Date().toISOString()}.json`
           );
       });
   }, 24 * 60 * 60 * 1000);
   ```

2. **Manual Backup Button**
   ```javascript
   // User bisa backup kapan saja
   document.getElementById('backup-btn').addEventListener('click', () => {
       DB.exportAllData((data) => {
           Utils.exportDataToJson(data, 
               `rapor-backup-${Utils.formatDate(new Date())}.json`
           );
       });
   });
   ```

3. **Restore from JSON**
   ```javascript
   // Restore dari file yang di-backup
   Utils.importDataFromJson(file, (error, data) => {
       DB.importAllData(data, (success) => {
           if (success) alert('Data restored!');
       });
   });
   ```

4. **GitHub Backup**
   ```javascript
   // Manual atau automated upload ke GitHub
   // Gunakan GitHub API atau manual upload
   ```

---

## 📱 MULTI-DEVICE SYNC

Saat ini: **TIDAK AUTO-SYNC** (offline-first model)

Jika ingin multi-device sync:

### Option A: Manual Sync

User export dari device 1, import ke device 2

### Option B: Cloud Sync (Firebase/Supabase)

Setup cloud database untuk real-time sync

### Option C: GitHub Sync

Auto-commit data ke GitHub setiap jam

---

## 🛡️ DATA SECURITY

### Current (v1.1.0):

```
✅ Data tersimpan lokal (tidak ke server)
✅ HTTPS GitHub Pages (SSL encrypted)
✅ User kontrol penuh atas data
⚠️ Hanya aman jika browser aman
⚠️ Tidak ada user authentication
```

### Improvements Needed:

- [ ] Encrypt data before backup
- [ ] Add user authentication
- [ ] Add API key protection
- [ ] Implement data access control

---

## 💾 HOW TO BACKUP TO GITHUB

### Manual Method:

1. **Export data sebagai JSON**
   ```
   Menu → Sinkronisasi → Export JSON
   ```

2. **Upload ke GitHub**
   - Buka repository
   - Klik "Add file" → "Upload files"
   - Pilih file JSON
   - Commit

3. **Share link**
   - Copy raw link dari GitHub
   - Bisa di-import kembali kapan saja

### Automated Method (Optional):

Setup GitHub Actions untuk auto-commit data:

```yaml
# .github/workflows/backup-data.yml
name: Auto Backup

on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Backup data
        run: |
          # Export data dan commit
          git add data/
          git commit -m "Auto: daily backup"
          git push
```

---

## 🎯 DATABASE DIAGRAM

```
Aplikasi (index.html)
    ↓
JavaScript Logic (ui.js, app.js)
    ↓
DB Module (db.js)
    ↓
IndexedDB Browser Storage
    ├─ sekolah store
    ├─ guru store
    ├─ kelas store
    ├─ siswa store
    ├─ mapel store
    ├─ cp store
    ├─ nilai store
    ├─ deskripsi store
    ├─ ekstrakurikuler store
    ├─ ekstrakurikuler_siswa store
    ├─ ketidakhadiran store
    ├─ catatan_walikelas store
    └─ pengaturan store
    
Data Persistence
    ├─ Manual Export (JSON file)
    ├─ Backup Download
    └─ GitHub Upload (optional)
```

---

## 📋 CHECKLIST DATA MANAGEMENT

- [x] Local IndexedDB storage working
- [x] Export to JSON functionality
- [x] Import from JSON functionality
- [ ] Auto-backup implementation
- [ ] Cloud sync integration (optional)
- [ ] Data encryption (optional)
- [ ] User authentication (optional)
- [ ] GitHub API integration (optional)

---

## 🔗 STORAGE LIMITS

| Provider | Capacity | Cost | Sync |
|----------|----------|------|------|
| **IndexedDB** | 50MB+ | Free | Manual |
| **Firebase** | Unlimited | $$ | Real-time |
| **Supabase** | 500MB free | Free/$ | Real-time |
| **GitHub** | 100MB/file | Free | Manual |
| **Google Drive** | 15GB free | Free/$ | Manual |

---

## 💡 RECOMMENDED SETUP

### For Individual Schools:

```
IndexedDB (Local)
    ↓
Weekly Manual Export
    ↓
GitHub or Google Drive Backup
```

### For Multiple Schools:

```
IndexedDB (Local per User)
    ↓
Firebase Realtime Database (Cloud)
    ↓
Auto-sync every hour
    ↓
Automatic backup
```

---

## 🎓 SUMMARY

- **Database**: IndexedDB (Browser Local)
- **Storage**: Local user's computer
- **Backup**: Manual export to JSON
- **Sync**: Manual via import/export
- **GitHub**: Backup location only (not primary DB)
- **Multi-device**: Manual sync needed
- **Security**: Local only (no server)

---

**Status**: ✅ Working (v1.1.0)  
**Next Step**: Optional cloud sync integration  
**Backup Recommended**: Weekly export to JSON + GitHub  

---

*Last Updated: November 11, 2025*
