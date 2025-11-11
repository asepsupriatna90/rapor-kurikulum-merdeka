# 🤝 Panduan Kontribusi

Terima kasih telah tertarik untuk berkontribusi pada Rapor Kurikulum Merdeka! Panduan ini akan membantu Anda memulai.

## 📋 Code of Conduct

Kami berkomitmen untuk memberikan lingkungan yang ramah dan inklusif untuk semua kontributor.

## 🐛 Melaporkan Bug

Jika Anda menemukan bug, silakan buat issue dengan detail:

1. **Deskripsi**: Jelaskan bug secara ringkas
2. **Langkah Reproduksi**: 
   - Buka aplikasi
   - Klik menu X
   - Masukkan data Y
   - Bug terjadi saat...
3. **Expected Behavior**: Apa yang seharusnya terjadi
4. **Actual Behavior**: Apa yang benar-benar terjadi
5. **Browser/OS**: Informasi device Anda
6. **Screenshot**: Jika memungkinkan, attach screenshot

## 💡 Mengusulkan Fitur

Punya ide fitur baru? Buat issue dengan label `enhancement`:

1. **Deskripsi Fitur**: Jelaskan fitur yang diusulkan
2. **Use Case**: Bagaimana fitur ini akan digunakan?
3. **Manfaat**: Apa keuntungannya?
4. **Alternatif**: Ada alternatif lain?

## 🔧 Pull Request Process

### Setup Development Environment

```bash
# 1. Fork repository
# Klik tombol "Fork" di GitHub

# 2. Clone repository Anda
git clone https://github.com/YOUR-USERNAME/rapor-kurikulum-merdeka.git
cd rapor-kurikulum-merdeka

# 3. Add upstream remote
git remote add upstream https://github.com/original-owner/rapor-kurikulum-merdeka.git

# 4. Create feature branch
git checkout -b feature/your-feature-name
```

### Membuat Perubahan

```bash
# 1. Edit files sesuai kebutuhan

# 2. Test di browser (buka index.html)

# 3. Stage changes
git add .

# 4. Commit dengan pesan yang jelas
git commit -m "Add feature: deskripsi singkat"
# Format: 
# - feat: untuk fitur baru
# - fix: untuk bug fix
# - docs: untuk dokumentasi
# - style: untuk formatting
# - refactor: untuk refactoring kode
# - test: untuk test

# 5. Push ke fork Anda
git push origin feature/your-feature-name
```

### Submit Pull Request

1. Pergi ke GitHub repository original
2. Klik "New Pull Request"
3. Pilih branch Anda
4. Isi template PR:
   - Deskripsi perubahan
   - Linked issues (jika ada)
   - Type of change (fix/feature/docs)
   - Testing yang sudah dilakukan
   - Checklist sebelum submit

### PR Requirements

Pastikan PR Anda:
- [ ] Mengikuti style guide proyek
- [ ] Sudah ditest di browser modern
- [ ] Dokumentasi updated (jika diperlukan)
- [ ] Commit messages jelas dan deskriptif
- [ ] Tidak ada conflicts dengan main branch
- [ ] Responsive design tetap terjaga

## 📐 Style Guide

### JavaScript

```javascript
// ❌ Jangan
var x=5;function foo(){return x;}

// ✅ Lakukan
const x = 5;

function calculateValue() {
    return x;
}

// Variable naming
const studentName = 'John'; // camelCase untuk variable
const SCHOOL_NAME = 'SMA Negeri 1'; // UPPER_CASE untuk constant

// Function naming
function generateReport() {} // lowerCamelCase untuk function
class StudentReport {} // PascalCase untuk class

// Comments
// Untuk comment single line
/* Untuk comment multi-line */

// JSDoc untuk dokumentasi function
/**
 * Generate PDF rapor untuk siswa
 * @param {string} studentId - ID siswa
 * @param {number} semester - Nomor semester (1 atau 2)
 * @returns {Object} Rapor data
 */
function generateRapor(studentId, semester) {
    // implementation
}
```

### CSS

```css
/* ❌ Jangan */
.btn-primary{color:white;background:#4e73df;}

/* ✅ Lakukan */
.btn-primary {
    color: white;
    background-color: #4e73df;
    border: 1px solid #4e73df;
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius);
    transition: all 0.3s;
}

/* Gunakan CSS variables untuk colors */
.btn-success {
    background-color: var(--success-color);
}
```

### HTML

```html
<!-- ❌ Jangan -->
<div class="container">
<div class="row">
<h1>Title</h1>
</div></div>

<!-- ✅ Lakukan -->
<div class="container">
    <div class="row">
        <h1>Title</h1>
    </div>
</div>

<!-- Gunakan semantic HTML -->
<header>
    <h1>Rapor Kurikulum Merdeka</h1>
</header>

<main>
    <section>
        <h2>Section Title</h2>
    </section>
</main>

<footer>
    <p>&copy; 2025</p>
</footer>
```

## 📚 File Structure Best Practices

```
├── js/
│   ├── app.js              # Main entry point
│   ├── db.js               # Database operations
│   ├── ui.js               # UI updates
│   ├── utils.js            # Utility functions
│   └── pdf-generator.js    # PDF generation
├── css/
│   └── style.css           # Global styles
└── index.html              # Main HTML file
```

## 🧪 Testing

Sebelum submit PR, test aplikasi:

1. **Desktop Browser**
   - Chrome (latest)
   - Firefox (latest)
   - Safari (latest)
   - Edge (latest)

2. **Mobile Browser**
   - Chrome Mobile
   - Safari iOS

3. **Fungsionalitas**
   - Input data
   - Save/Load data
   - Generate PDF
   - Export/Import

4. **Edge Cases**
   - Data kosong
   - Data invalid
   - Large dataset
   - Offline mode

## 📖 Documentation

Jika menambah fitur baru, update dokumentasi:

1. Update `README.md`
2. Update `INSTALLATION.md` jika ada perubahan cara pakai
3. Add JSDoc comments di code
4. Add examples jika fitur kompleks

## 🚀 Deployment

Setelah PR merged, deployment ke GitHub Pages otomatis via GitHub Actions.

## 📝 Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type:**
- `feat`: Fitur baru
- `fix`: Bug fix
- `docs`: Dokumentasi
- `style`: Formatting
- `refactor`: Refactoring kode
- `test`: Testing
- `chore`: Build/dependency

**Scope:**
- `ui`: UI component
- `db`: Database/data
- `pdf`: PDF generation
- `api`: API/function

**Subject:**
- Use imperative mood ("add" not "added")
- Don't capitalize first letter
- No period (.) at end
- Max 50 characters

**Body:**
- Explain what dan why, bukan how
- Wrap at 72 characters
- Optional

**Footer:**
- Reference issues: `Fixes #123`

**Contoh:**
```
feat(pdf): add support for custom logo in rapor

- Add logo upload in school data page
- Scale logo to fit rapor header
- Support multiple image formats (PNG, JPEG)

Fixes #45
```

## 🎓 Learning Resources

- [Kurikulum Merdeka BSKAP](https://kurikulum.kemendikbud.go.id/)
- [JavaScript MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [CSS MDN](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

## 📞 Bantuan

Punya pertanyaan? 
- Buka Discussion di GitHub
- Lihat Issue yang sudah ada
- Email: support@example.com

---

**Terima kasih atas kontribusi Anda!** ❤️
