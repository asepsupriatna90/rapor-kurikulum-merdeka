# 🚀 Panduan Push ke GitHub

## Step 1: Setup Repository GitHub

1. Buka https://github.com/new
2. Isi form:
   - **Repository name**: `rapor-kurikulum-merdeka`
   - **Description**: Aplikasi pembuatan rapor siswa sesuai Kurikulum Merdeka
   - **Public**: Pilih ini agar siap di-publish
   - **Add .gitignore**: Skip (sudah ada)
   - **Add license**: Skip (sudah ada)
3. Klik **Create repository**

## Step 2: Setup Remote & Push

Jalankan perintah ini di terminal (PowerShell):

```powershell
# Ganti USERNAME dengan username GitHub Anda!
git remote add origin https://github.com/USERNAME/rapor-kurikulum-merdeka.git

# Set main branch
git branch -M main

# Push semua ke GitHub
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Pergi ke repository Anda di GitHub
2. Klik **Settings**
3. Di sidebar, klik **Pages**
4. Di "Source", pilih:
   - Branch: `main`
   - Folder: `/ (root)`
5. Klik **Save**

Setelah beberapa detik, GitHub Pages akan aktif.

**URL aplikasi Anda:**
```
https://USERNAME.github.io/rapor-kurikulum-merdeka
```

## Step 4: Verifikasi

Kunjungi URL di atas di browser untuk memastikan aplikasi berjalan dengan baik.

---

**Catatan:** 
- Replace `USERNAME` dengan username GitHub Anda
- Jika ada error authentication, gunakan Personal Access Token (PAT) dari GitHub
- Untuk generate PAT: GitHub Settings → Developer settings → Personal access tokens

Semua file sudah siap! ✅
