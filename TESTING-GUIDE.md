# 🧪 TESTING GUIDE

**Version**: 1.2.0  
**Last Updated**: November 11, 2025  

---

## 🎯 TESTING OVERVIEW

Aplikasi Rapor Kurikulum Merdeka memiliki comprehensive test suite untuk verifikasi:
- UI & tampilan
- Database & data operations
- Validation & input handling
- Auto-backup functionality
- Demo data
- Performance
- Responsiveness

---

## 🚀 QUICK START TESTING

### Option 1: Automated Testing (Recommended)

1. **Open Application**
   ```
   https://asepsupriatna90.github.io/rapor-kurikulum-merdeka
   ```

2. **Open Developer Console**
   ```
   Press: F12 or Ctrl+Shift+I
   ```

3. **Run Tests**
   ```javascript
   // In console, type:
   runTests()
   
   // Or manually:
   AppTest.run()
   ```

4. **View Results**
   - Green checkmarks = Tests passed
   - Red X = Tests failed
   - Table with detailed results

### Option 2: Manual Testing

Follow the checklist in section 2 below.

---

## 📋 MANUAL TESTING CHECKLIST

### TEST 1: BASIC UI & NAVIGATION

**Setup**: Open application fresh (clear cache if needed)

```
[ ] Application loads without errors
[ ] Dashboard visible with cards
[ ] Sidebar menu shows all items
[ ] Top bar with sync status appears
[ ] All icons load properly
[ ] Page is responsive (test on mobile)
[ ] No visual glitches or layout issues
```

**Expected Result**: Clean UI with all elements visible

---

### TEST 2: DATA MANAGEMENT - SEKOLAH

**Test Data Management (School)**

```
[ ] Click menu "Data Sekolah"
[ ] Click "Tambah" button
[ ] Fill in school data:
    - Nama Sekolah: "SD Merdeka"
    - NPSN: "12345678"
    - Alamat: "Jl. Pendidikan 123"
    - Telepon: "081234567890"
[ ] Click "Simpan"
[ ] School appears in table
[ ] Try edit - click edit button
[ ] Change school name to "SD Merdeka Baru"
[ ] Click "Simpan"
[ ] Name updated in table
[ ] Try delete - click delete button
[ ] Confirm deletion
[ ] School removed from table
```

**Expected Result**: CRUD operations work smoothly

---

### TEST 3: FORM VALIDATION

**Test Input Validation**

```
[ ] Click menu "Guru"
[ ] Click "Tambah" button
[ ] Try submit with empty fields
    → Error messages should appear
[ ] Fill with invalid email
    → Should show "Email tidak valid"
[ ] Fill with invalid phone number
    → Should show "No. telepon tidak valid"
[ ] Fill with all valid data:
    - Name: "Ibu Siti"
    - NIP: "198501012008012001"
    - Email: "ibu.siti@gmail.com"
    - Phone: "081234567890"
[ ] Submit successfully
[ ] Teacher appears in table
```

**Expected Result**: Validation catches errors and shows helpful messages

---

### TEST 4: DEMO DATA GENERATOR

**Test Demo Data Loading**

```
[ ] Go to Dashboard
[ ] Look for "Muat Data Sampel" button (in dashboard info)
[ ] Click "Muat Data Sampel"
[ ] Accept confirmation if asked
[ ] Wait for loading to complete
[ ] Check "Data Sekolah" menu - should have 1 school
[ ] Check "Guru" menu - should have 4 teachers
[ ] Check "Kelas" menu - should have 3 classes
[ ] Check "Siswa" menu - should have 5 students
[ ] Check "Mata Pelajaran" menu - should have 5 subjects
```

**Expected Result**: All demo data loads correctly with relationships intact

---

### TEST 5: EXPORT & IMPORT

**Test Export Functionality**

```
[ ] Go to "Sinkronisasi" menu
[ ] Click "Export Data" (or "Ekspor JSON")
[ ] Select "Export JSON"
[ ] File should download as "rapor-data-*.json"
[ ] Open file to verify JSON format
```

**Test Import Functionality**

```
[ ] Go to "Sinkronisasi" menu
[ ] Click "Import Data" (or "Impor File")
[ ] Select the JSON file downloaded above
[ ] Wait for import to complete
[ ] Data should be restored
[ ] Verify all records are present
```

**Expected Result**: Export/import cycle preserves all data

---

### TEST 6: PDF GENERATION

**Test Rapor PDF**

```
[ ] Ensure data exists (load demo data if needed)
[ ] Go to "Cetak Rapor" menu
[ ] Select:
    - Tahun Ajaran: 2024/2025
    - Kelas: Select a class
    - Siswa: Select a student
    - Semester: 1
[ ] Click "Preview Rapor" or "Generate PDF"
[ ] PDF should generate and preview
[ ] PDF contains:
    - School name
    - Student info
    - Grades
    - Attendance
    - Signature lines
[ ] Click "Download" if option available
[ ] File should save as PDF
```

**Expected Result**: PDF generates correctly with all data

---

### TEST 7: AUTO-BACKUP (v1.2.0)

**Test GitHub Auto-Backup**

```
[ ] Go to "Sinkronisasi" menu
[ ] Look for "Auto-Backup Settings" section
[ ] Check "Enable Auto-Backup" checkbox
[ ] Verify settings appear
[ ] Click "Backup Now" button
[ ] Wait for success notification
[ ] Go to GitHub repository
[ ] Check /backups/ folder
[ ] New backup file should appear: rapor-backup-YYYY-MM-DD.json
[ ] Click file to verify it's valid JSON
```

**Test Restore**

```
[ ] In "Auto-Backup Settings", click "Restore Backup"
[ ] Select a backup JSON file
[ ] Wait for import to complete
[ ] Verify data is restored
```

**Expected Result**: Backup and restore work smoothly

---

### TEST 8: OFFLINE MODE

**Test Offline Functionality**

```
[ ] Close network (DevTools → Network → Offline)
[ ] Or use Chrome DevTools throttling
[ ] Application should still work
[ ] Try adding new data
[ ] Try editing data
[ ] Try deleting data
[ ] Refresh page
[ ] Data should still be there (from IndexedDB)
[ ] Enable network again
[ ] Sync status should update
```

**Expected Result**: Full offline capability works

---

### TEST 9: MOBILE RESPONSIVENESS

**Test on Mobile Device or DevTools**

```
[ ] Press F12 to open DevTools
[ ] Click device toggle (top-left) or Ctrl+Shift+M
[ ] Test viewport sizes:
    - 320px (mobile)
    - 768px (tablet)
    - 1024px (desktop)

[ ] For mobile (320px):
    - Sidebar should collapse or hamburger menu appear
    - Content should stack vertically
    - Buttons should be tappable (44px+)
    - Text readable without pinching
    
[ ] For tablet (768px):
    - Layout should adapt
    - Forms should be usable
    
[ ] For desktop (1024px+):
    - Full layout visible
    - All features accessible
```

**Expected Result**: Responsive design works on all sizes

---

### TEST 10: SEARCH & FILTERING

**Test Search in Tables**

```
[ ] Go to any data table (e.g., "Guru")
[ ] Look for search box
[ ] Type a name to search
[ ] Table should filter in real-time
[ ] Results should highlight matching records
[ ] Clear search should show all records
```

**Test Sorting**

```
[ ] Click column headers
[ ] Table should sort ascending/descending
[ ] Arrow indicator should show sort direction
[ ] Sort should work on multiple columns
```

**Expected Result**: Search and sorting work smoothly

---

### TEST 11: ERROR HANDLING

**Test Error Cases**

```
[ ] Try to add duplicate NISN
    → Should show error or warning
[ ] Try to delete record in use
    → Should show warning
[ ] Try invalid data format
    → Should show validation error
[ ] Go offline during operation
    → Should handle gracefully
[ ] Check browser console (F12)
    → Should have minimal errors
    → No critical JS errors
```

**Expected Result**: Errors handled gracefully with helpful messages

---

### TEST 12: PERFORMANCE

**Test Loading Speed**

```
[ ] Open Chrome DevTools (F12)
[ ] Go to Performance tab
[ ] Click record
[ ] Perform actions:
    - Navigate between pages
    - Load demo data
    - Export data
    - Generate PDF
[ ] Stop recording
[ ] Review performance:
    - Should be < 3s for page load
    - Should be < 1s for page transitions
    - Should be < 5s for PDF generation
```

**Test with Large Dataset**

```
[ ] Load demo data (10+ records)
[ ] Try searching
    - Should respond < 100ms
[ ] Try sorting
    - Should respond immediately
[ ] Try PDF generation
    - Should complete < 5s
```

**Expected Result**: Application performs well

---

## 🧪 AUTOMATED TEST SUITE REFERENCE

### Run Tests

```javascript
// In browser console:
runTests()

// or:
AppTest.run()
```

### Test Coverage

```
✓ UI Structure (7 tests)
  - HTML elements
  - Sidebar menu
  - Dashboard cards
  - Modals
  - Forms
  - Buttons
  - Icons

✓ Database (5 tests)
  - DB initialization
  - Store accessibility
  - CRUD methods
  - Export/import
  - Settings

✓ Validation (5 tests)
  - Validator object
  - Email validation
  - Required fields
  - NISN validation
  - etc.

✓ Utilities (6 tests)
  - Utils object
  - Date formatting
  - Academic year
  - Notifications
  - Export
  - Grade conversion

✓ Auto-Backup (3 tests)
  - AutoBackup object
  - Methods exist
  - Workflow file

✓ Demo Data (2 tests)
  - DemoData object
  - Data structure

✓ UI Interactions (4 tests)
  - Navigation
  - Modals
  - Buttons
  - Forms

✓ Error Handling (3 tests)
  - Error handling
  - Console clean
  - Invalid operations

✓ Responsiveness (3 tests)
  - CSS media queries
  - Viewport meta tag
  - Layout responsiveness

✓ Performance (3 tests)
  - Load performance
  - DOM size
  - Memory

Total: 41 automated tests
```

### View Results

After running tests, results display as:

```
📊 TEST SUMMARY
- Total: 41
- Passed: ✅ (green number)
- Failed: ❌ (red number)

📈 TEST REPORT
[Detailed table with each test result]
```

---

## 🐛 COMMON ISSUES & FIXES

| Issue | Check | Fix |
|-------|-------|-----|
| Tests don't run | AppTest loaded? | Refresh page, check console |
| Demo data won't load | IndexedDB enabled? | Enable in browser settings |
| Export fails | Browser permissions? | Check file system access |
| PDF won't generate | jsPDF loaded? | Check script loading order |
| Offline fails | Service worker? | Manual offline test in DevTools |
| Mobile layout broken | Viewport meta? | Check responsive CSS |

---

## 📊 TEST REPORT TEMPLATE

After testing, fill this:

```markdown
## Test Report
**Date**: [DATE]
**Tester**: [NAME]
**Version**: 1.2.0
**Browser**: [BROWSER & VERSION]
**Device**: [DEVICE TYPE]

### Results
- Total Tests: 41
- Passed: [NUMBER]
- Failed: [NUMBER]
- Blocked: [NUMBER]

### Issues Found
1. [Issue 1]
   - Severity: [HIGH/MEDIUM/LOW]
   - Steps to reproduce: [...]
   
2. [Issue 2]
   - ...

### Recommendations
- [Recommendation 1]
- [Recommendation 2]

### Sign Off
Tested by: [NAME]
Date: [DATE]
Status: [PASS/FAIL]
```

---

## 🎯 TESTING CHECKLIST (Final)

Before release:

- [ ] Automated tests pass (41/41)
- [ ] Manual UI tests pass
- [ ] Data management tests pass
- [ ] Export/import works
- [ ] PDF generation works
- [ ] Auto-backup works
- [ ] Offline mode works
- [ ] Mobile responsive works
- [ ] Search/filter works
- [ ] Error handling works
- [ ] Performance acceptable
- [ ] No console errors
- [ ] Browser compatibility verified
- [ ] Documentation complete

---

## 📞 NEED HELP?

- **Test fails?** → Check AUDIT-REPORT.md
- **Function missing?** → Check README.md
- **How to use?** → Check QUICK_START.md
- **GitHub setup?** → Check GITHUB_SETUP.md
- **Database questions?** → Check DATABASE.md

---

**Status**: ✅ Testing Framework Ready  
**Last Updated**: November 11, 2025  
**Maintained by**: Development Team
