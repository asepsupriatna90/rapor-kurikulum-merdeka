// UI Management for the application

const UI = {
    currentPage: 'dashboard',
    sidebarActive: false,

    // Initialize UI
    init: function() {
        this.setupEventListeners();
        this.loadDashboard();
        this.updateSyncStatus();
    },

    // Setup event listeners
    setupEventListeners: function() {
        // Sidebar menu navigation
        const menuLinks = document.querySelectorAll('.sidebar-menu a');
        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateToPage(page);
            });
        });

        // Mobile menu toggle
        const sidebarToggle = document.createElement('button');
        sidebarToggle.className = 'sidebar-toggle';
        sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
        sidebarToggle.style.position = 'fixed';
        sidebarToggle.style.top = '15px';
        sidebarToggle.style.left = '15px';
        sidebarToggle.style.zIndex = '1002';
        sidebarToggle.style.backgroundColor = 'var(--primary-color)';
        sidebarToggle.style.color = 'white';
        sidebarToggle.style.border = 'none';
        sidebarToggle.style.borderRadius = 'var(--border-radius)';
        sidebarToggle.style.padding = '0.5rem';
        sidebarToggle.style.display = 'none';
        document.body.appendChild(sidebarToggle);

        sidebarToggle.addEventListener('click', () => {
            const sidebar = document.querySelector('.sidebar');
            sidebar.classList.toggle('active');
        });

        // Show/hide sidebar toggle on mobile
        const checkMobile = () => {
            if (window.innerWidth <= 768) {
                sidebarToggle.style.display = 'block';
            } else {
                sidebarToggle.style.display = 'none';
                document.querySelector('.sidebar').classList.remove('active');
            }
        };

        window.addEventListener('resize', checkMobile);
        checkMobile();

        // Modal close button
        const modalClose = document.querySelector('.modal .close');
        modalClose.addEventListener('click', () => {
            this.closeModal();
        });

        // Modal cancel button
        const modalCancel = document.getElementById('modal-cancel-btn');
        modalCancel.addEventListener('click', () => {
            this.closeModal();
        });

        // File input for backup/restore
        const fileInput = document.getElementById('file-input');
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                Utils.importDataFromJson(file, (error, data) => {
                    if (error) {
                        Utils.showNotification('Error importing data: ' + error.message, 'error');
                    } else {
                        DB.importAllData(data, (success) => {
                            if (success) {
                                Utils.showNotification('Data imported successfully', 'success');
                                this.loadDashboard();
                            } else {
                                Utils.showNotification('Error importing data', 'error');
                            }
                        });
                    }
                });
                // Reset file input
                fileInput.value = '';
            }
        });

        // Backup button
        const backupBtn = document.getElementById('backup-btn');
        backupBtn.addEventListener('click', () => {
            DB.exportAllData((data) => {
                const filename = `rapor-backup-${Utils.formatDate(new Date())}.json`;
                Utils.exportDataToJson(data, filename);
                Utils.showNotification('Backup created successfully', 'success');
            });
        });

        // Restore button
        const restoreBtn = document.getElementById('restore-btn');
        restoreBtn.addEventListener('click', () => {
            fileInput.click();
        });

        // Export JSON button
        const exportJsonBtn = document.getElementById('export-json-btn');
        exportJsonBtn.addEventListener('click', () => {
            DB.exportAllData((data) => {
                const filename = `rapor-export-${Utils.formatDate(new Date())}.json`;
                Utils.exportDataToJson(data, filename);
                Utils.showNotification('Data exported successfully', 'success');
            });
        });

        // Import from file button
        const importFileBtn = document.getElementById('import-file-btn');
        importFileBtn.addEventListener('click', () => {
            fileInput.click();
        });

        // Import from server button
        const importServerBtn = document.getElementById('import-server-btn');
        importServerBtn.addEventListener('click', () => {
            // In a real implementation, this would fetch data from a server
            // For now, we'll just show a notification
            Utils.showNotification('Server import not implemented yet', 'info');
        });

        // Check sync button
        const checkSyncBtn = document.getElementById('check-sync-btn');
        checkSyncBtn.addEventListener('click', () => {
            this.updateSyncStatus();
        });

        // Add buttons for each page
        this.setupPageEventListeners();
    },

    // Setup event listeners for each page
    setupPageEventListeners: function() {
        // Data Sekolah
        const addSekolahBtn = document.getElementById('add-sekolah-btn');
        if (addSekolahBtn) {
            addSekolahBtn.addEventListener('click', () => {
                this.showSekolahForm();
            });
        }

        // Guru
        const addGuruBtn = document.getElementById('add-guru-btn');
        if (addGuruBtn) {
            addGuruBtn.addEventListener('click', () => {
                this.showGuruForm();
            });
        }

        // Kelas
        const addKelasBtn = document.getElementById('add-kelas-btn');
        if (addKuruBtn) {
            addKelasBtn.addEventListener('click', () => {
                this.showKelasForm();
            });
        }

        // Siswa
        const addSiswaBtn = document.getElementById('add-siswa-btn');
        if (addSiswaBtn) {
            addSiswaBtn.addEventListener('click', () => {
                this.showSiswaForm();
            });
        }

        // Mapel
        const addMapelBtn = document.getElementById('add-mapel-btn');
        if (addMapelBtn) {
            addMapelBtn.addEventListener('click', () => {
                this.showMapelForm();
            });
        }

        // CP/TP
        const addCpBtn = document.getElementById('add-cp-btn');
        if (addCpBtn) {
            addCpBtn.addEventListener('click', () => {
                this.showCpForm();
            });
        }

        // Ekstrakurikuler
        const addEkstrakurikulerBtn = document.getElementById('add-ekstrakurikuler-btn');
        if (addEkstrakurikulerBtn) {
            addEkstrakurikulerBtn.addEventListener('click', () => {
                this.showEkstrakurikulerForm();
            });
        }

        // Nilai
        const nilaiKelas = document.getElementById('nilai-kelas');
        const nilaiMapel = document.getElementById('nilai-mapel');
        const saveNilaiBtn = document.getElementById('save-nilai-btn');
        
        if (nilaiKelas) {
            nilaiKelas.addEventListener('change', () => {
                this.updateNilaiMapelOptions();
                this.loadNilaiTable();
            });
        }
        
        if (nilaiMapel) {
            nilaiMapel.addEventListener('change', () => {
                this.loadNilaiTable();
            });
        }
        
        if (saveNilaiBtn) {
            saveNilaiBtn.addEventListener('click', () => {
                this.saveNilai();
            });
        }

        // Deskripsi
        const deskripsiKelas = document.getElementById('deskripsi-kelas');
        const deskripsiSiswa = document.getElementById('deskripsi-siswa');
        const generateDeskripsiBtn = document.getElementById('generate-deskripsi-btn');
        const saveDeskripsiBtn = document.getElementById('save-deskripsi-btn');
        
        if (deskripsiKelas) {
            deskripsiKelas.addEventListener('change', () => {
                this.updateDeskripsiSiswaOptions();
            });
        }
        
        if (deskripsiSiswa) {
            deskripsiSiswa.addEventListener('change', () => {
                this.loadDeskripsiForm();
            });
        }
        
        if (generateDeskripsiBtn) {
            generateDeskripsiBtn.addEventListener('click', () => {
                this.generateDeskripsi();
            });
        }
        
        if (saveDeskripsiBtn) {
            saveDeskripsiBtn.addEventListener('click', () => {
                this.saveDeskripsi();
            });
        }

        // Ekstrakurikuler Siswa
        const ekskulKelas = document.getElementById('ekskul-kelas');
        const ekskulSiswa = document.getElementById('ekskul-siswa');
        const saveEkskulBtn = document.getElementById('save-ekskul-btn');
        
        if (ekskulKelas) {
            ekskulKelas.addEventListener('change', () => {
                this.updateEkskulSiswaOptions();
            });
        }
        
        if (ekskulSiswa) {
            ekskulSiswa.addEventListener('change', () => {
                this.loadEkskulForm();
            });
        }
        
        if (saveEkskulBtn) {
            saveEkskulBtn.addEventListener('click', () => {
                this.saveEkskul();
            });
        }

        // Load Demo Data Button
        const loadDemoBtn = document.getElementById('load-demo-btn');
        if (loadDemoBtn) {
            loadDemoBtn.addEventListener('click', () => {
                if (confirm('Apakah Anda yakin ingin memuat data sampel? Data lama akan dihapus.')) {
                    DemoData.generateSampleData(() => {
                        setTimeout(() => {
                            location.reload();
                        }, 1500);
                    });
                }
            });
        }

        // Cetak Rapor
        const cetakKelas = document.getElementById('cetak-kelas');
        const cetakSiswa = document.getElementById('cetak-siswa');
        const cetakPdfBtn = document.getElementById('cetak-pdf-btn');
        
        if (cetakKelas) {
            cetakKelas.addEventListener('change', () => {
                this.updateCetakSiswaOptions();
            });
        }
        
        if (cetakSiswa) {
            cetakSiswa.addEventListener('change', () => {
                this.loadCetakPreview();
            });
        }
        
        if (cetakPdfBtn) {
            cetakPdfBtn.addEventListener('click', () => {
                this.generatePDF();
            });
        }
    },

    // Navigate to a page
    navigateToPage: function(page) {
        // Update active menu
        const menuLinks = document.querySelectorAll('.sidebar-menu a');
        menuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === page) {
                link.classList.add('active');
            }
        });

        // Update page title
        const pageTitle = document.getElementById('page-title');
        const titles = {
            'dashboard': 'Dashboard',
            'sekolah': 'Data Sekolah',
            'guru': 'Data Guru',
            'kelas': 'Data Kelas',
            'siswa': 'Data Siswa',
            'mapel': 'Mata Pelajaran',
            'cp': 'CP/TP',
            'nilai': 'Input Nilai',
            'deskripsi': 'Deskripsi',
            'ekstrakurikuler': 'Ekstrakurikuler',
            'cetak': 'Cetak Rapor',
            'sinkronisasi': 'Sinkronisasi'
        };
        
        if (titles[page]) {
            pageTitle.textContent = titles[page];
        }

        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(p => {
            p.classList.remove('active');
        });

        // Show selected page
        const selectedPage = document.getElementById(`${page}-page`);
        if (selectedPage) {
            selectedPage.classList.add('active');
            this.currentPage = page;
            
            // Load page data
            this.loadPageData(page);
        }

        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            document.querySelector('.sidebar').classList.remove('active');
        }
    },

    // Load data for a specific page
    loadPageData: function(page) {
        switch(page) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'sekolah':
                this.loadSekolahTable();
                break;
            case 'guru':
                this.loadGuruTable();
                break;
            case 'kelas':
                this.loadKelasTable();
                break;
            case 'siswa':
                this.loadSiswaTable();
                break;
            case 'mapel':
                this.loadMapelTable();
                break;
            case 'cp':
                this.loadCpTable();
                break;
            case 'ekstrakurikuler':
                this.loadEkstrakurikulerTable();
                break;
        }
    },

    // Load dashboard data
    loadDashboard: function() {
        // Update counts
        DB.getAll('sekolah', (data) => {
            document.getElementById('sekolah-count').textContent = data.length;
        });
        
        DB.getAll('guru', (data) => {
            document.getElementById('guru-count').textContent = data.length;
        });
        
        DB.getAll('kelas', (data) => {
            document.getElementById('kelas-count').textContent = data.length;
        });
        
        DB.getAll('siswa', (data) => {
            document.getElementById('siswa-count').textContent = data.length;
        });

        // Update academic info
        const currentYear = Utils.getCurrentAcademicYear();
        const currentSemester = Utils.getCurrentSemester();
        
        document.getElementById('tahun-ajaran').textContent = currentYear;
        document.getElementById('semester-aktif').textContent = `Semester ${currentSemester}`;
        
        // Get active phase from settings
        DB.getSetting('fase', (fase) => {
            document.getElementById('fase-aktif').textContent = fase ? `Fase ${fase}` : '-';
        });

        // Load activity log
        this.loadActivityLog();
    },

    // Load activity log
    loadActivityLog: function() {
        const activityList = document.getElementById('activity-list');
        activityList.innerHTML = `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-info-circle"></i>
                </div>
                <div class="activity-content">
                    <p>Selamat datang di Aplikasi Rapor Kurikulum Merdeka 2025</p>
                    <span class="activity-time">Baru saja</span>
                </div>
            </div>
        `;
    },

    // Load sekolah table
    loadSekolahTable: function() {
        const table = document.getElementById('sekolah-table');
        const tbody = table.querySelector('tbody');
        
        DB.getAll('sekolah', (data) => {
            tbody.innerHTML = '';
            
            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center">Tidak ada data</td></tr>';
                return;
            }
            
            data.forEach((sekolah, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${sekolah.nama}</td>
                    <td>${sekolah.npsn}</td>
                    <td>${sekolah.alamat}</td>
                    <td>${sekolah.kepala_sekolah}</td>
                    <td>
                        <button class="btn btn-sm btn-primary edit-sekolah" data-id="${sekolah.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger delete-sekolah" data-id="${sekolah.id}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(row);
            });
            
            // Add event listeners to buttons
            tbody.querySelectorAll('.edit-sekolah').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.closest('button').getAttribute('data-id');
                    this.showSekolahForm(id);
                });
            });
            
            tbody.querySelectorAll('.delete-sekolah').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.closest('button').getAttribute('data-id');
                    this.deleteSekolah(id);
                });
            });
        });
    },

    // Load guru table
    loadGuruTable: function() {
        const table = document.getElementById('guru-table');
        const tbody = table.querySelector('tbody');
        
        DB.getAll('guru', (data) => {
            tbody.innerHTML = '';
            
            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="text-center">Tidak ada data</td></tr>';
                return;
            }
            
            data.forEach((guru, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${guru.nip}</td>
                    <td>${guru.nama}</td>
                    <td>${guru.jenis_kelamin}</td>
                    <td>${guru.mapel_diampu || '-'}</td>
                    <td>${guru.status || 'Aktif'}</td>
                    <td>
                        <button class="btn btn-sm btn-primary edit-guru" data-id="${guru.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger delete-guru" data-id="${guru.id}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(row);
            });
            
            // Add event listeners to buttons
            tbody.querySelectorAll('.edit-guru').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.closest('button').getAttribute('data-id');
                    this.showGuruForm(id);
                });
            });
            
            tbody.querySelectorAll('.delete-guru').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.closest('button').getAttribute('data-id');
                    this.deleteGuru(id);
                });
            });
        });
    },

    // Load kelas table
    loadKelasTable: function() {
        const table = document.getElementById('kelas-table');
        const tbody = table.querySelector('tbody');
        
        DB.getAll('kelas', (data) => {
            tbody.innerHTML = '';
            
            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="text-center">Tidak ada data</td></tr>';
                return;
            }
            
            // Get guru data for wali kelas
            DB.getAll('guru', (guruData) => {
                // Get student count for each class
                DB.getAll('siswa', (siswaData) => {
                    data.forEach((kelas, index) => {
                        const waliKelas = guruData.find(g => g.id === kelas.wali_kelas_id);
                        const studentCount = siswaData.filter(s => s.kelas_id === kelas.id).length;
                        
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${index + 1}</td>
                            <td>${kelas.nama}</td>
                            <td>${kelas.tingkat}</td>
                            <td>${kelas.fase}</td>
                            <td>${waliKelas ? waliKelas.nama : '-'}</td>
                            <td>${studentCount}</td>
                            <td>
                                <button class="btn btn-sm btn-primary edit-kelas" data-id="${kelas.id}"><i class="fas fa-edit"></i></button>
                                <button class="btn btn-sm btn-danger delete-kelas" data-id="${kelas.id}"><i class="fas fa-trash"></i></button>
                            </td>
                        `;
                        tbody.appendChild(row);
                    });
                    
                    // Add event listeners to buttons
                    tbody.querySelectorAll('.edit-kelas').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            const id = e.target.closest('button').getAttribute('data-id');
                            this.showKelasForm(id);
                        });
                    });
                    
                    tbody.querySelectorAll('.delete-kelas').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            const id = e.target.closest('button').getAttribute('data-id');
                            this.deleteKelas(id);
                        });
                    });
                });
            });
        });
    },

    // Load siswa table
    loadSiswaTable: function() {
        const table = document.getElementById('siswa-table');
        const tbody = table.querySelector('tbody');
        const filterKelas = document.getElementById('filter-kelas');
        const searchSiswa = document.getElementById('search-siswa');
        
        // Load classes for filter
        DB.getAll('kelas', (kelasData) => {
            filterKelas.innerHTML = '<option value="">Semua Kelas</option>';
            kelasData.forEach(kelas => {
                const option = document.createElement('option');
                option.value = kelas.id;
                option.textContent = kelas.nama;
                filterKelas.appendChild(option);
            });
            
            // Load students
            DB.getAll('siswa', (siswaData) => {
                this.renderSiswaTable(siswaData, kelasData);
                
                // Add event listeners for filters
                filterKelas.addEventListener('change', () => {
                    this.filterSiswaTable();
                });
                
                searchSiswa.addEventListener('input', () => {
                    this.filterSiswaTable();
                });
            });
        });
    },

    // Render siswa table
    renderSiswaTable: function(siswaData, kelasData) {
        const table = document.getElementById('siswa-table');
        const tbody = table.querySelector('tbody');
        
        tbody.innerHTML = '';
        
        if (siswaData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">Tidak ada data</td></tr>';
            return;
        }
        
        siswaData.forEach((siswa, index) => {
            const kelas = kelasData.find(k => k.id === siswa.kelas_id);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${siswa.nisn}</td>
                <td>${siswa.nama}</td>
                <td>${siswa.jenis_kelamin}</td>
                <td>${kelas ? kelas.nama : '-'}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-siswa" data-id="${siswa.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger delete-siswa" data-id="${siswa.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        // Add event listeners to buttons
        tbody.querySelectorAll('.edit-siswa').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('button').getAttribute('data-id');
                this.showSiswaForm(id);
            });
        });
        
        tbody.querySelectorAll('.delete-siswa').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('button').getAttribute('data-id');
                this.deleteSiswa(id);
            });
        });
    },

    // Filter siswa table
    filterSiswaTable: function() {
        const filterKelas = document.getElementById('filter-kelas').value;
        const searchSiswa = document.getElementById('search-siswa').value.toLowerCase();
        
        DB.getAll('siswa', (siswaData) => {
            DB.getAll('kelas', (kelasData) => {
                let filteredData = siswaData;
                
                // Filter by class
                if (filterKelas) {
                    filteredData = filteredData.filter(s => s.kelas_id === filterKelas);
                }
                
                // Filter by search
                if (searchSiswa) {
                    filteredData = filteredData.filter(s => 
                        s.nama.toLowerCase().includes(searchSiswa) || 
                        s.nisn.includes(searchSiswa)
                    );
                }
                
                this.renderSiswaTable(filteredData, kelasData);
            });
        });
    },

    // Load mapel table
    loadMapelTable: function() {
        const table = document.getElementById('mapel-table');
        const tbody = table.querySelector('tbody');
        const filterFase = document.getElementById('filter-fase-mapel');
        
        // Load subjects
        DB.getAll('mapel', (mapelData) => {
            this.renderMapelTable(mapelData);
            
            // Add event listeners for filters
            filterFase.addEventListener('change', () => {
                this.filterMapelTable();
            });
        });
    },

    // Render mapel table
    renderMapelTable: function(mapelData) {
        const table = document.getElementById('mapel-table');
        const tbody = table.querySelector('tbody');
        
        tbody.innerHTML = '';
        
        if (mapelData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">Tidak ada data</td></tr>';
            return;
        }
        
        mapelData.forEach((mapel, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${mapel.kode}</td>
                <td>${mapel.nama}</td>
                <td>${mapel.fase}</td>
                <td>${mapel.kelompok}</td>
                <td>${mapel.jam_pelajaran}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-mapel" data-id="${mapel.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger delete-mapel" data-id="${mapel.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        // Add event listeners to buttons
        tbody.querySelectorAll('.edit-mapel').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('button').getAttribute('data-id');
                this.showMapelForm(id);
            });
        });
        
        tbody.querySelectorAll('.delete-mapel').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('button').getAttribute('data-id');
                this.deleteMapel(id);
            });
        });
    },

    // Filter mapel table
    filterMapelTable: function() {
        const filterFase = document.getElementById('filter-fase-mapel').value;
        
        DB.getAll('mapel', (mapelData) => {
            let filteredData = mapelData;
            
            // Filter by phase
            if (filterFase) {
                filteredData = filteredData.filter(m => m.fase === filterFase);
            }
            
            this.renderMapelTable(filteredData);
        });
    },

    // Load CP table
    loadCpTable: function() {
        const table = document.getElementById('cp-table');
        const tbody = table.querySelector('tbody');
        const filterMapel = document.getElementById('filter-mapel-cp');
        const filterFase = document.getElementById('filter-fase-cp');
        
        // Load subjects for filter
        DB.getAll('mapel', (mapelData) => {
            filterMapel.innerHTML = '<option value="">Semua Mata Pelajaran</option>';
            mapelData.forEach(mapel => {
                const option = document.createElement('option');
                option.value = mapel.id;
                option.textContent = mapel.nama;
                filterMapel.appendChild(option);
            });
            
            // Load CPs
            DB.getAll('cp', (cpData) => {
                this.renderCpTable(cpData, mapelData);
                
                // Add event listeners for filters
                filterMapel.addEventListener('change', () => {
                    this.filterCpTable();
                });
                
                filterFase.addEventListener('change', () => {
                    this.filterCpTable();
                });
            });
        });
    },

    // Render CP table
    renderCpTable: function(cpData, mapelData) {
        const table = document.getElementById('cp-table');
        const tbody = table.querySelector('tbody');
        
        tbody.innerHTML = '';
        
        if (cpData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">Tidak ada data</td></tr>';
            return;
        }
        
        cpData.forEach((cp, index) => {
            const mapel = mapelData.find(m => m.id === cp.mapel_id);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${cp.kode}</td>
                <td>${cp.elemen}</td>
                <td>${mapel ? mapel.nama : '-'}</td>
                <td>${cp.fase}</td>
                <td>${cp.jenis}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-cp" data-id="${cp.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger delete-cp" data-id="${cp.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        // Add event listeners to buttons
        tbody.querySelectorAll('.edit-cp').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('button').getAttribute('data-id');
                this.showCpForm(id);
            });
        });
        
        tbody.querySelectorAll('.delete-cp').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('button').getAttribute('data-id');
                this.deleteCp(id);
            });
        });
    },

    // Filter CP table
    filterCpTable: function() {
        const filterMapel = document.getElementById('filter-mapel-cp').value;
        const filterFase = document.getElementById('filter-fase-cp').value;
        
        DB.getAll('cp', (cpData) => {
            DB.getAll('mapel', (mapelData) => {
                let filteredData = cpData;
                
                // Filter by subject
                if (filterMapel) {
                    filteredData = filteredData.filter(c => c.mapel_id === filterMapel);
                }
                
                // Filter by phase
                if (filterFase) {
                    filteredData = filteredData.filter(c => c.fase === filterFase);
                }
                
                this.renderCpTable(filteredData, mapelData);
            });
        });
    },

    // Load ekstrakurikuler table
    loadEkstrakurikulerTable: function() {
        const table = document.getElementById('ekstrakurikuler-table');
        const tbody = table.querySelector('tbody');
        
        DB.getAll('ekstrakurikuler', (data) => {
            tbody.innerHTML = '';
            
            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center">Tidak ada data</td></tr>';
                return;
            }
            
            data.forEach((ekskul, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${ekskul.nama}</td>
                    <td>${ekskul.jenis}</td>
                    <td>${ekskul.pembina}</td>
                    <td>${ekskul.deskripsi || '-'}</td>
                    <td>
                        <button class="btn btn-sm btn-primary edit-ekstrakurikuler" data-id="${ekskul.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger delete-ekstrakurikuler" data-id="${ekskul.id}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(row);
            });
            
            // Add event listeners to buttons
            tbody.querySelectorAll('.edit-ekstrakurikuler').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.closest('button').getAttribute('data-id');
                    this.showEkstrakurikulerForm(id);
                });
            });
            
            tbody.querySelectorAll('.delete-ekstrakurikuler').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.closest('button').getAttribute('data-id');
                    this.deleteEkstrakurikuler(id);
                });
            });
        });
    },

    // Update nilai mapel options based on selected class
    updateNilaiMapelOptions: function() {
        const kelasId = document.getElementById('nilai-kelas').value;
        const mapelSelect = document.getElementById('nilai-mapel');
        
        mapelSelect.innerHTML = '<option value="">-- Pilih Mata Pelajaran --</option>';
        
        if (!kelasId) return;
        
        // Get class data
        DB.getById('kelas', kelasId, (kelas) => {
            if (!kelas) return;
            
            // Get subjects for the phase
            DB.getAll('mapel', (mapelData) => {
                const filteredMapel = mapelData.filter(m => m.fase === kelas.fase);
                
                filteredMapel.forEach(mapel => {
                    const option = document.createElement('option');
                    option.value = mapel.id;
                    option.textContent = mapel.nama;
                    mapelSelect.appendChild(option);
                });
            });
        });
    },

    // Load nilai table
    loadNilaiTable: function() {
        const kelasId = document.getElementById('nilai-kelas').value;
        const mapelId = document.getElementById('nilai-mapel').value;
        const semester = document.getElementById('nilai-semester').value;
        const container = document.getElementById('nilai-input-container');
        const table = document.getElementById('nilai-table');
        const tbody = table.querySelector('tbody');
        
        if (!kelasId || !mapelId) {
            container.style.display = 'none';
            return;
        }
        
        container.style.display = 'block';
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Memuat data...</td></tr>';
        
        // Get students in the class
        DB.getByIndex('siswa', 'kelas_id', kelasId, (siswaData) => {
            // Get CPs for the subject
            DB.getByIndex('cp', 'mapel_id', mapelId, (cpData) => {
                if (siswaData.length === 0 || cpData.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" class="text-center">Tidak ada data siswa atau CP</td></tr>';
                    return;
                }
                
                // Get existing grades
                DB.getAll('nilai', (nilaiData) => {
                    // Filter grades by class, subject, and semester
                    const siswaIds = siswaData.map(s => s.id);
                    const existingNilai = nilaiData.filter(n => 
                        siswaIds.includes(n.siswa_id) && 
                        n.mapel_id === mapelId && 
                        n.semester === semester
                    );
                    
                    // Build table header with CPs
                    const headerRow = table.querySelector('thead tr');
                    headerRow.innerHTML = `
                        <th>No</th>
                        <th>NISN</th>
                        <th>Nama Siswa</th>
                        <th class="nilai-cp-header">CP/TP</th>
                        <th class="nilai-actions-header">Aksi</th>
                    `;
                    
                    // Clear table body
                    tbody.innerHTML = '';
                    
                    // Add rows for each student
                    siswaData.forEach((siswa, index) => {
                        const row = document.createElement('tr');
                        row.setAttribute('data-siswa-id', siswa.id);
                        
                        // Get grades for this student
                        const studentNilai = existingNilai.filter(n => n.siswa_id === siswa.id);
                        
                        // Create CP cells
                        let cpCells = '';
                        cpData.forEach(cp => {
                            const nilai = studentNilai.find(n => n.cp_id === cp.id);
                            const nilaiValue = nilai ? nilai.nilai : '';
                            
                            cpCells += `
                                <div class="nilai-cp-item" data-cp-id="${cp.id}">
                                    <div class="cp-name">${cp.kode} - ${cp.elemen}</div>
                                    <input type="number" class="form-control nilai-input" min="0" max="100" 
                                           value="${nilaiValue}" data-siswa-id="${siswa.id}" data-cp-id="${cp.id}">
                                </div>
                            `;
                        });
                        
                        row.innerHTML = `
                            <td>${index + 1}</td>
                            <td>${siswa.nisn}</td>
                            <td>${siswa.nama}</td>
                            <td class="nilai-cp-cell">
                                <div class="nilai-cp-container">
                                    ${cpCells}
                                </div>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-info generate-deskripsi-siswa" 
                                        data-siswa-id="${siswa.id}" data-mapel-id="${mapelId}">
                                    <i class="fas fa-magic"></i>
                                </button>
                            </td>
                        `;
                        
                        tbody.appendChild(row);
                    });
                    
                    // Add event listeners to generate deskripsi buttons
                    tbody.querySelectorAll('.generate-deskripsi-siswa').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            const siswaId = e.target.closest('button').getAttribute('data-siswa-id');
                            const mapelId = e.target.closest('button').getAttribute('data-mapel-id');
                            this.generateDeskripsiSiswa(siswaId, mapelId, semester);
                        });
                    });
                });
            });
        });
    },

    // Generate deskripsi for a single student
    generateDeskripsiSiswa: function(siswaId, mapelId, semester) {
        // Get all grades for the student
        DB.getByIndex('nilai', 'siswa_id', siswaId, (nilaiData) => {
            const studentNilai = nilaiData.filter(n => n.mapel_id === mapelId && n.semester === semester);
            
            if (studentNilai.length === 0) {
                Utils.showNotification('Tidak ada data nilai untuk siswa ini', 'warning');
                return;
            }
            
            // Get CPs
            DB.getByIndex('cp', 'mapel_id', mapelId, (cpData) => {
                if (cpData.length === 0) {
                    Utils.showNotification('Tidak ada data CP untuk mata pelajaran ini', 'warning');
                    return;
                }
                
                // Generate description
                const description = Utils.generateDescription(studentNilai, cpData);
                
                // Show notification
                Utils.showNotification('Deskripsi berhasil digenerate: ' + description, 'success');
            });
        });
    },

    // Save nilai
    saveNilai: function() {
        const kelasId = document.getElementById('nilai-kelas').value;
        const mapelId = document.getElementById('nilai-mapel').value;
        const semester = document.getElementById('nilai-semester').value;
        const nilaiInputs = document.querySelectorAll('.nilai-input');
        
        if (!kelasId || !mapelId) {
            Utils.showNotification('Pilih kelas dan mata pelajaran terlebih dahulu', 'warning');
            return;
        }
        
        // Get all nilai values
        const nilaiData = [];
        let hasErrors = false;
        
        nilaiInputs.forEach(input => {
            const siswaId = input.getAttribute('data-siswa-id');
            const cpId = input.getAttribute('data-cp-id');
            const nilaiValue = input.value;
            
            if (nilaiValue !== '') {
                if (!Utils.validateGrade(nilaiValue)) {
                    input.classList.add('is-invalid');
                    hasErrors = true;
                } else {
                    input.classList.remove('is-invalid');
                    
                    nilaiData.push({
                        siswa_id: siswaId,
                        mapel_id: mapelId,
                        cp_id: cpId,
                        semester: semester,
                        nilai: parseFloat(nilaiValue)
                    });
                }
            }
        });
        
        if (hasErrors) {
            Utils.showNotification('Perbaiki nilai yang tidak valid (0-100)', 'error');
            return;
        }
        
        if (nilaiData.length === 0) {
            Utils.showNotification('Tidak ada data nilai untuk disimpan', 'warning');
            return;
        }
        
        // Save each nilai
        let savedCount = 0;
        nilaiData.forEach(nilai => {
            // Check if nilai already exists
            DB.getAll('nilai', (allNilai) => {
                const existingNilai = allNilai.find(n => 
                    n.siswa_id === nilai.siswa_id && 
                    n.mapel_id === nilai.mapel_id && 
                    n.cp_id === nilai.cp_id && 
                    n.semester === nilai.semester
                );
                
                if (existingNilai) {
                    // Update existing nilai
                    nilai.id = existingNilai.id;
                    DB.update('nilai', nilai, (success, error) => {
                        if (success) {
                            savedCount++;
                            checkAllSaved();
                        } else {
                            console.error('Error updating nilai:', error);
                        }
                    });
                } else {
                    // Add new nilai
                    DB.add('nilai', nilai, (success, id) => {
                        if (success) {
                            savedCount++;
                            checkAllSaved();
                        } else {
                            console.error('Error adding nilai');
                        }
                    });
                }
            });
        });
        
        // Check if all nilai have been saved
        function checkAllSaved() {
            if (savedCount === nilaiData.length) {
                Utils.showNotification(`${savedCount} nilai berhasil disimpan`, 'success');
            }
        }
    },

    // Update deskripsi siswa options based on selected class
    updateDeskripsiSiswaOptions: function() {
        const kelasId = document.getElementById('deskripsi-kelas').value;
        const siswaSelect = document.getElementById('deskripsi-siswa');
        
        siswaSelect.innerHTML = '<option value="">-- Pilih Siswa --</option>';
        
        if (!kelasId) return;
        
        // Get students in the class
        DB.getByIndex('siswa', 'kelas_id', kelasId, (siswaData) => {
            siswaData.forEach(siswa => {
                const option = document.createElement('option');
                option.value = siswa.id;
                option.textContent = `${siswa.nisn} - ${siswa.nama}`;
                siswaSelect.appendChild(option);
            });
        });
    },

    // Load deskripsi form
    loadDeskripsiForm: function() {
        const siswaId = document.getElementById('deskripsi-siswa').value;
        const semester = document.getElementById('deskripsi-semester').value;
        const container = document.getElementById('deskripsi-input-container');
        const deskripsiList = document.getElementById('deskripsi-mapel-list');
        
        if (!siswaId) {
            container.style.display = 'none';
            return;
        }
        
        container.style.display = 'block';
        deskripsiList.innerHTML = '<div class="text-center">Memuat data...</div>';
        
        // Get student data
        DB.getById('siswa', siswaId, (siswa) => {
            if (!siswa) {
                deskripsiList.innerHTML = '<div class="text-center">Data siswa tidak ditemukan</div>';
                return;
            }
            
            // Get class data
            DB.getById('kelas', siswa.kelas_id, (kelas) => {
                if (!kelas) {
                    deskripsiList.innerHTML = '<div class="text-center">Data kelas tidak ditemukan</div>';
                    return;
                }
                
                // Get subjects for the phase
                DB.getAll('mapel', (mapelData) => {
                    const filteredMapel = mapelData.filter(m => m.fase === kelas.fase);
                    
                    if (filteredMapel.length === 0) {
                        deskripsiList.innerHTML = '<div class="text-center">Tidak ada mata pelajaran untuk fase ini</div>';
                        return;
                    }
                    
                    // Get existing descriptions
                    DB.getByIndex('deskripsi', 'siswa_id', siswaId, (deskripsiData) => {
                        const studentDeskripsi = deskripsiData.filter(d => d.semester === semester);
                        
                        // Clear and build deskripsi list
                        deskripsiList.innerHTML = '';
                        
                        filteredMapel.forEach(mapel => {
                            const deskripsi = studentDeskripsi.find(d => d.mapel_id === mapel.id);
                            const deskripsiValue = deskripsi ? deskripsi.deskripsi : '';
                            
                            const item = document.createElement('div');
                            item.className = 'deskripsi-mapel-item';
                            item.innerHTML = `
                                <h5>${mapel.nama}</h5>
                                <textarea class="form-control deskripsi-input" 
                                          data-mapel-id="${mapel.id}">${deskripsiValue}</textarea>
                            `;
                            
                            deskripsiList.appendChild(item);
                        });
                    });
                });
            });
        });
    },

    // Generate deskripsi for all subjects
    generateDeskripsi: function() {
        const siswaId = document.getElementById('deskripsi-siswa').value;
        const semester = document.getElementById('deskripsi-semester').value;
        
        if (!siswaId) {
            Utils.showNotification('Pilih siswa terlebih dahulu', 'warning');
            return;
        }
        
        Utils.generateStudentDescription(siswaId, semester, (descriptions) => {
            if (typeof descriptions === 'string') {
                Utils.showNotification(descriptions, 'warning');
                return;
            }
            
            // Update deskripsi inputs
            Object.keys(descriptions).forEach(mapelId => {
                const input = document.querySelector(`.deskripsi-input[data-mapel-id="${mapelId}"]`);
                if (input) {
                    input.value = descriptions[mapelId].deskripsi;
                }
            });
            
            Utils.showNotification('Deskripsi berhasil digenerate untuk semua mata pelajaran', 'success');
        });
    },

    // Save deskripsi
    saveDeskripsi: function() {
        const siswaId = document.getElementById('deskripsi-siswa').value;
        const semester = document.getElementById('deskripsi-semester').value;
        const deskripsiInputs = document.querySelectorAll('.deskripsi-input');
        
        if (!siswaId) {
            Utils.showNotification('Pilih siswa terlebih dahulu', 'warning');
            return;
        }
        
        // Get all deskripsi values
        const deskripsiData = [];
        
        deskripsiInputs.forEach(input => {
            const mapelId = input.getAttribute('data-mapel-id');
            const deskripsiValue = input.value.trim();
            
            if (deskripsiValue !== '') {
                deskripsiData.push({
                    siswa_id: siswaId,
                    mapel_id: mapelId,
                    semester: semester,
                    deskripsi: deskripsiValue
                });
            }
        });
        
        if (deskripsiData.length === 0) {
            Utils.showNotification('Tidak ada data deskripsi untuk disimpan', 'warning');
            return;
        }
        
        // Save each deskripsi
        let savedCount = 0;
        deskripsiData.forEach(deskripsi => {
            // Check if deskripsi already exists
            DB.getAll('deskripsi', (allDeskripsi) => {
                const existingDeskripsi = allDeskripsi.find(d => 
                    d.siswa_id === deskripsi.siswa_id && 
                    d.mapel_id === deskripsi.mapel_id && 
                    d.semester === deskripsi.semester
                );
                
                if (existingDeskripsi) {
                    // Update existing deskripsi
                    deskripsi.id = existingDeskripsi.id;
                    DB.update('deskripsi', deskripsi, (success, error) => {
                        if (success) {
                            savedCount++;
                            checkAllSaved();
                        } else {
                            console.error('Error updating deskripsi:', error);
                        }
                    });
                } else {
                    // Add new deskripsi
                    DB.add('deskripsi', deskripsi, (success, id) => {
                        if (success) {
                            savedCount++;
                            checkAllSaved();
                        } else {
                            console.error('Error adding deskripsi');
                        }
                    });
                }
            });
        });
        
        // Check if all deskripsi have been saved
        function checkAllSaved() {
            if (savedCount === deskripsiData.length) {
                Utils.showNotification(`${savedCount} deskripsi berhasil disimpan`, 'success');
            }
        }
    },

    // Update ekskul siswa options based on selected class
    updateEkskulSiswaOptions: function() {
        const kelasId = document.getElementById('ekskul-kelas').value;
        const siswaSelect = document.getElementById('ekskul-siswa');
        
        siswaSelect.innerHTML = '<option value="">-- Pilih Siswa --</option>';
        
        if (!kelasId) return;
        
        // Get students in the class
        DB.getByIndex('siswa', 'kelas_id', kelasId, (siswaData) => {
            siswaData.forEach(siswa => {
                const option = document.createElement('option');
                option.value = siswa.id;
                option.textContent = `${siswa.nisn} - ${siswa.nama}`;
                siswaSelect.appendChild(option);
            });
        });
    },

    // Load ekskul form
    loadEkskulForm: function() {
        const siswaId = document.getElementById('ekskul-siswa').value;
        const semester = document.getElementById('ekskul-semester').value;
        const container = document.getElementById('ekskul-input-container');
        const ekskulList = document.getElementById('ekskul-list');
        
        if (!siswaId) {
            container.style.display = 'none';
            return;
        }
        
        container.style.display = 'block';
        ekskulList.innerHTML = '<div class="text-center">Memuat data...</div>';
        
        // Get all ekstrakurikuler
        DB.getAll('ekstrakurikuler', (ekskulData) => {
            if (ekskulData.length === 0) {
                ekskulList.innerHTML = '<div class="text-center">Tidak ada data ekstrakurikuler</div>';
                return;
            }
            
            // Get existing student ekskul
            DB.getByIndex('ekstrakurikuler_siswa', 'siswa_id', siswaId, (ekskulSiswaData) => {
                const studentEkskul = ekskulSiswaData.filter(e => e.semester === semester);
                
                // Clear and build ekskul list
                ekskulList.innerHTML = '';
                
                ekskulData.forEach(ekskul => {
                    const studentEkskulItem = studentEkskul.find(e => e.ekstrakurikuler_id === ekskul.id);
                    
                    const item = document.createElement('div');
                    item.className = 'ekskul-item';
                    item.innerHTML = `
                        <h5>${ekskul.nama}</h5>
                        <div class="form-group">
                            <label>Status</label>
                            <select class="form-control ekskul-status" data-ekskul-id="${ekskul.id}">
                                <option value="">-- Pilih Status --</option>
                                <option value="aktif" ${studentEkskulItem && studentEkskulItem.status === 'aktif' ? 'selected' : ''}>Aktif</option>
                                <option value="tidak aktif" ${studentEkskulItem && studentEkskulItem.status === 'tidak aktif' ? 'selected' : ''}>Tidak Aktif</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Deskripsi Capaian</label>
                            <textarea class="form-control ekskul-deskripsi" 
                                      data-ekskul-id="${ekskul.id}">${studentEkskulItem ? studentEkskulItem.deskripsi : ''}</textarea>
                        </div>
                    `;
                    
                    ekskulList.appendChild(item);
                });
            });
        });
    },

    // Save ekskul
    saveEkskul: function() {
        const siswaId = document.getElementById('ekskul-siswa').value;
        const semester = document.getElementById('ekskul-semester').value;
        const statusInputs = document.querySelectorAll('.ekskul-status');
        const deskripsiInputs = document.querySelectorAll('.ekskul-deskripsi');
        
        if (!siswaId) {
            Utils.showNotification('Pilih siswa terlebih dahulu', 'warning');
            return;
        }
        
        // Get all ekskul values
        const ekskulData = [];
        
        statusInputs.forEach((input, index) => {
            const ekskulId = input.getAttribute('data-ekskul-id');
            const statusValue = input.value;
            const deskripsiValue = deskripsiInputs[index].value.trim();
            
            if (statusValue !== '' || deskripsiValue !== '') {
                ekskulData.push({
                    siswa_id: siswaId,
                    ekstrakurikuler_id: ekskulId,
                    semester: semester,
                    status: statusValue,
                    deskripsi: deskripsiValue
                });
            }
        });
        
        if (ekskulData.length === 0) {
            Utils.showNotification('Tidak ada data ekstrakurikuler untuk disimpan', 'warning');
            return;
        }
        
        // Save each ekskul
        let savedCount = 0;
        ekskulData.forEach(ekskul => {
            // Check if ekskul already exists
            DB.getAll('ekstrakurikuler_siswa', (allEkskul) => {
                const existingEkskul = allEkskul.find(e => 
                    e.siswa_id === ekskul.siswa_id && 
                    e.ekstrakurikuler_id === ekskul.ekstrakurikuler_id && 
                    e.semester === ekskul.semester
                );
                
                if (existingEkskul) {
                    // Update existing ekskul
                    ekskul.id = existingEkskul.id;
                    DB.update('ekstrakurikuler_siswa', ekskul, (success, error) => {
                        if (success) {
                            savedCount++;
                            checkAllSaved();
                        } else {
                            console.error('Error updating ekskul:', error);
                        }
                    });
                } else {
                    // Add new ekskul
                    DB.add('ekstrakurikuler_siswa', ekskul, (success, id) => {
                        if (success) {
                            savedCount++;
                            checkAllSaved();
                        } else {
                            console.error('Error adding ekskul');
                        }
                    });
                }
            });
        });
        
        // Check if all ekskul have been saved
        function checkAllSaved() {
            if (savedCount === ekskulData.length) {
                Utils.showNotification(`${savedCount} data ekstrakurikuler berhasil disimpan`, 'success');
            }
        }
    },

    // Update cetak siswa options based on selected class
    updateCetakSiswaOptions: function() {
        const kelasId = document.getElementById('cetak-kelas').value;
        const siswaSelect = document.getElementById('cetak-siswa');
        
        siswaSelect.innerHTML = '<option value="">-- Pilih Siswa --</option>';
        
        if (!kelasId) return;
        
        // Get students in the class
        DB.getByIndex('siswa', 'kelas_id', kelasId, (siswaData) => {
            siswaData.forEach(siswa => {
                const option = document.createElement('option');
                option.value = siswa.id;
                option.textContent = `${siswa.nisn} - ${siswa.nama}`;
                siswaSelect.appendChild(option);
            });
        });
    },

    // Load cetak preview
    loadCetakPreview: function() {
        const siswaId = document.getElementById('cetak-siswa').value;
        const semester = document.getElementById('cetak-semester').value;
        const template = document.getElementById('cetak-template').value;
        const container = document.getElementById('cetak-preview-container');
        const preview = document.getElementById('cetak-preview');
        
        if (!siswaId) {
            container.style.display = 'none';
            return;
        }
        
        container.style.display = 'block';
        preview.innerHTML = '<div class="text-center">Memuat data...</div>';
        
        // Get student data
        DB.getById('siswa', siswaId, (siswa) => {
            if (!siswa) {
                preview.innerHTML = '<div class="text-center">Data siswa tidak ditemukan</div>';
                return;
            }
            
            // Get class data
            DB.getById('kelas', siswa.kelas_id, (kelas) => {
                if (!kelas) {
                    preview.innerHTML = '<div class="text-center">Data kelas tidak ditemukan</div>';
                    return;
                }
                
                // Get school data
                DB.getAll('sekolah', (sekolahData) => {
                    const sekolah = sekolahData.length > 0 ? sekolahData[0] : null;
                    
                    // Get subjects for the phase
                    DB.getAll('mapel', (mapelData) => {
                        const filteredMapel = mapelData.filter(m => m.fase === kelas.fase);
                        
                        if (filteredMapel.length === 0) {
                            preview.innerHTML = '<div class="text-center">Tidak ada mata pelajaran untuk fase ini</div>';
                            return;
                        }
                        
                        // Get grades for the student
                        DB.getByIndex('nilai', 'siswa_id', siswaId, (nilaiData) => {
                            const studentNilai = nilaiData.filter(n => n.semester === semester);
                            
                            // Get descriptions for the student
                            DB.getByIndex('deskripsi', 'siswa_id', siswaId, (deskripsiData) => {
                                const studentDeskripsi = deskripsiData.filter(d => d.semester === semester);
                                
                                // Get attendance for the student
                                DB.getByIndex('ketidakhadiran', 'siswa_id', siswaId, (ketidakhadiranData) => {
                                    const studentKetidakhadiran = ketidakhadiranData.find(k => k.semester === semester);
                                    
                                    // Get teacher notes for the student
                                    DB.getByIndex('catatan_walikelas', 'siswa_id', siswaId, (catatanData) => {
                                        const studentCatatan = catatanData.find(c => c.semester === semester);
                                        
                                        // Get extracurricular for the student
                                        DB.getByIndex('ekstrakurikuler_siswa', 'siswa_id', siswaId, (ekskulData) => {
                                            const studentEkskul = ekskulData.filter(e => e.semester === semester);
                                            
                                            // Build preview HTML
                                            this.buildRaporPreview(
                                                preview, 
                                                siswa, 
                                                kelas, 
                                                sekolah, 
                                                filteredMapel, 
                                                studentNilai, 
                                                studentDeskripsi, 
                                                studentKetidakhadiran, 
                                                studentCatatan, 
                                                studentEkskul, 
                                                semester, 
                                                template
                                            );
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    },

    // Build rapor preview HTML
    buildRaporPreview: function(
        preview, 
        siswa, 
        kelas, 
        sekolah, 
        mapelData, 
        nilaiData, 
        deskripsiData, 
        ketidakhadiranData, 
        catatanData, 
        ekskulData, 
        semester, 
        template
    ) {
        // Calculate attendance
        const attendance = Utils.calculateAttendance([ketidakhadiranData].filter(Boolean));
        
        // Group grades by subject
        const gradesBySubject = {};
        nilaiData.forEach(nilai => {
            if (!gradesBySubject[nilai.mapel_id]) {
                gradesBySubject[nilai.mapel_id] = [];
            }
            gradesBySubject[nilai.mapel_id].push(nilai);
        });
        
        // Group descriptions by subject
        const descriptionsBySubject = {};
        deskripsiData.forEach(deskripsi => {
            descriptionsBySubject[deskripsi.mapel_id] = deskripsi.deskripsi;
        });
        
        // Build HTML
        let html = `
            <div class="rapor-container">
                <div class="rapor-header">
                    <div class="rapor-school">
                        ${sekolah ? `
                            <h2>${sekolah.nama}</h2>
                            <p>${sekolah.alamat}</p>
                            <p>NPSN: ${sekolah.npsn}</p>
                        ` : '<h2>Sekolah</h2>'}
                    </div>
                    <div class="rapor-title">
                        <h1>LAPORAN HASIL BELAJAR PESERTA DIDIK</h1>
                        <h2>Tahun Pelajaran ${Utils.getCurrentAcademicYear()}</h2>
                    </div>
                </div>
                
                <div class="rapor-student-info">
                    <table class="rapor-info-table">
                        <tr>
                            <td width="20%">Nama</td>
                            <td width="2%">:</td>
                            <td width="78%">${siswa.nama}</td>
                        </tr>
                        <tr>
                            <td>NISN</td>
                            <td>:</td>
                            <td>${siswa.nisn}</td>
                        </tr>
                        <tr>
                            <td>Kelas</td>
                            <td>:</td>
                            <td>${kelas.nama}</td>
                        </tr>
                        <tr>
                            <td>Semester</td>
                            <td>:</td>
                            <td>${semester}</td>
                        </tr>
                    </table>
                </div>
                
                <div class="rapor-section">
                    <h3>A. Nilai & Capaian Kompetensi</h3>
                    <table class="rapor-grade-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Mata Pelajaran</th>
                                <th>Nilai</th>
                                <th>Deskripsi</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        // Add subject rows
        mapelData.forEach((mapel, index) => {
            const subjectGrades = gradesBySubject[mapel.id] || [];
            const subjectDescription = descriptionsBySubject[mapel.id] || '-';
            
            // Calculate average grade
            let averageGrade = 0;
            if (subjectGrades.length > 0) {
                const sum = subjectGrades.reduce((acc, curr) => acc + parseFloat(curr.nilai), 0);
                averageGrade = sum / subjectGrades.length;
            }
            
            html += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${mapel.nama}</td>
                    <td>${averageGrade > 0 ? averageGrade.toFixed(2) : '-'}</td>
                    <td>${subjectDescription}</td>
                </tr>
            `;
        });
        
        html += `
                        </tbody>
                    </table>
                </div>
                
                <div class="rapor-section">
                    <h3>B. Ekstrakurikuler</h3>
                    <table class="rapor-extracurricular-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Kegiatan</th>
                                <th>Status</th>
                                <th>Deskripsi Capaian</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        // Add extracurricular rows
        if (ekskulData.length > 0) {
            ekskulData.forEach((ekskul, index) => {
                html += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${ekskul.ekstrakurikuler_nama || '-'}</td>
                        <td>${ekskul.status || '-'}</td>
                        <td>${ekskul.deskripsi || '-'}</td>
                    </tr>
                `;
            });
        } else {
            html += `
                <tr>
                    <td colspan="4" class="text-center">Tidak ada data ekstrakurikuler</td>
                </tr>
            `;
        }
        
        html += `
                        </tbody>
                    </table>
                </div>
                
                <div class="rapor-section">
                    <h3>C. Ketidakhadiran</h3>
                    <table class="rapor-attendance-table">
                        <tr>
                            <td width="30%">Sakit</td>
                            <td width="2%">:</td>
                            <td width="68%">${attendance.sakit} hari</td>
                        </tr>
                        <tr>
                            <td>Izin</td>
                            <td>:</td>
                            <td>${attendance.izin} hari</td>
                        </tr>
                        <tr>
                            <td>Tanpa Keterangan</td>
                            <td>:</td>
                            <td>${attendance.tanpaKeterangan} hari</td>
                        </tr>
                    </table>
                </div>
                
                <div class="rapor-section">
                    <h3>D. Catatan Wali Kelas</h3>
                    <p>${catatanData ? catatanData.catatan : 'Tidak ada catatan'}</p>
                </div>
                
                <div class="rapor-section">
                    <h3>E. Tanggapan Orang Tua/Wali</h3>
                    <div class="rapor-parent-response">
                        <p>Mengetahui,</p>
                        <div class="rapor-signatures">
                            <div class="rapor-signature">
                                <p>Wali Kelas,</p>
                                <div class="signature-line"></div>
                                <p>${kelas.wali_kelas_nama || '...........................'}</p>
                                <p>NIP. ${kelas.wali_kelas_nip || '...........................'}</p>
                            </div>
                            <div class="rapor-signature">
                                <p>Orang Tua/Wali,</p>
                                <div class="signature-line"></div>
                                <p>...........................</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        preview.innerHTML = html;
    },

    // Generate PDF
    generatePDF: function() {
        const siswaId = document.getElementById('cetak-siswa').value;
        const semester = document.getElementById('cetak-semester').value;
        const template = document.getElementById('cetak-template').value;
        
        if (!siswaId) {
            Utils.showNotification('Pilih siswa terlebih dahulu', 'warning');
            return;
        }
        
        // Get student data
        DB.getById('siswa', siswaId, (siswa) => {
            if (!siswa) {
                Utils.showNotification('Data siswa tidak ditemukan', 'error');
                return;
            }
            
            // Get class data
            DB.getById('kelas', siswa.kelas_id, (kelas) => {
                if (!kelas) {
                    Utils.showNotification('Data kelas tidak ditemukan', 'error');
                    return;
                }
                
                // Get school data
                DB.getAll('sekolah', (sekolahData) => {
                    const sekolah = sekolahData.length > 0 ? sekolahData[0] : null;
                    
                    // Get subjects for the phase
                    DB.getAll('mapel', (mapelData) => {
                        const filteredMapel = mapelData.filter(m => m.fase === kelas.fase);
                        
                        // Get grades for the student
                        DB.getByIndex('nilai', 'siswa_id', siswaId, (nilaiData) => {
                            const studentNilai = nilaiData.filter(n => n.semester === semester);
                            
                            // Get descriptions for the student
                            DB.getByIndex('deskripsi', 'siswa_id', siswaId, (deskripsiData) => {
                                const studentDeskripsi = deskripsiData.filter(d => d.semester === semester);
                                
                                // Get attendance for the student
                                DB.getByIndex('ketidakhadiran', 'siswa_id', siswaId, (ketidakhadiranData) => {
                                    const studentKetidakhadiran = ketidakhadiranData.find(k => k.semester === semester);
                                    
                                    // Get teacher notes for the student
                                    DB.getByIndex('catatan_walikelas', 'siswa_id', siswaId, (catatanData) => {
                                        const studentCatatan = catatanData.find(c => c.semester === semester);
                                        
                                        // Get extracurricular for the student
                                        DB.getByIndex('ekstrakurikuler_siswa', 'siswa_id', siswaId, (ekskulData) => {
                                            const studentEkskul = ekskulData.filter(e => e.semester === semester);
                                            
                                            // Generate PDF
                                            PDFGenerator.generate(
                                                siswa, 
                                                kelas, 
                                                sekolah, 
                                                filteredMapel, 
                                                studentNilai, 
                                                studentDeskripsi, 
                                                studentKetidakhadiran, 
                                                studentCatatan, 
                                                studentEkskul, 
                                                semester, 
                                                template
                                            );
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    },

    // Update sync status
    updateSyncStatus: function() {
        const syncIcon = document.getElementById('sync-icon');
        const syncText = document.getElementById('sync-text');
        const syncConnected = document.getElementById('sync-connected');
        const syncLastTime = document.getElementById('sync-last-time');
        const syncDbVersion = document.getElementById('sync-db-version');
        
        // Check online status
        if (Utils.isOnline()) {
            syncIcon.classList.add('online');
            syncText.textContent = 'Online';
            syncConnected.textContent = 'Ya';
        } else {
            syncIcon.classList.remove('online');
            syncText.textContent = 'Offline';
            syncConnected.textContent = 'Tidak';
        }
        
        // Get last sync time from settings
        DB.getSetting('last_sync', (lastSync) => {
            if (lastSync) {
                syncLastTime.textContent = Utils.formatDateTime(lastSync);
            }
        });
        
        // Set DB version
        syncDbVersion.textContent = DB.dbVersion.toString();
    },

    // Show modal
    showModal: function(title, content, onSave) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const modalSaveBtn = document.getElementById('modal-save-btn');
        
        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        
        // Remove existing event listeners
        const newSaveBtn = modalSaveBtn.cloneNode(true);
        modalSaveBtn.parentNode.replaceChild(newSaveBtn, modalSaveBtn);
        
        // Add new event listener
        newSaveBtn.addEventListener('click', () => {
            if (onSave) {
                onSave();
            }
        });
        
        modal.style.display = 'block';
    },

    // Close modal
    closeModal: function() {
        const modal = document.getElementById('modal');
        modal.style.display = 'none';
    },

    // Show sekolah form
    showSekolahForm: function(id) {
        let sekolah = {
            nama: '',
            npsn: '',
            alamat: '',
            kepala_sekolah: ''
        };
        
        if (id) {
            DB.getById('sekolah', id, (data) => {
                if (data) {
                    sekolah = data;
                    this.renderSekolahForm(sekolah);
                }
            });
        } else {
            this.renderSekolahForm(sekolah);
        }
    },

    // Render sekolah form
    renderSekolahForm: function(sekolah) {
        const content = `
            <form id="sekolah-form">
                <div class="form-group">
                    <label for="sekolah-nama">Nama Sekolah</label>
                    <input type="text" id="sekolah-nama" class="form-control" value="${sekolah.nama}" required>
                </div>
                <div class="form-group">
                    <label for="sekolah-npsn">NPSN</label>
                    <input type="text" id="sekolah-npsn" class="form-control" value="${sekolah.npsn}" required>
                </div>
                <div class="form-group">
                    <label for="sekolah-alamat">Alamat</label>
                    <textarea id="sekolah-alamat" class="form-control" required>${sekolah.alamat}</textarea>
                </div>
                <div class="form-group">
                    <label for="sekolah-kepala">Kepala Sekolah</label>
                    <input type="text" id="sekolah-kepala" class="form-control" value="${sekolah.kepala_sekolah}" required>
                </div>
            </form>
        `;
        
        this.showModal('Data Sekolah', content, () => {
            this.saveSekolah(sekolah.id);
        });
    },

    // Save sekolah
    saveSekolah: function(id) {
        const nama = document.getElementById('sekolah-nama').value.trim();
        const npsn = document.getElementById('sekolah-npsn').value.trim();
        const alamat = document.getElementById('sekolah-alamat').value.trim();
        const kepala_sekolah = document.getElementById('sekolah-kepala').value.trim();
        
        if (!nama || !npsn || !alamat || !kepala_sekolah) {
            Utils.showNotification('Semua field harus diisi', 'error');
            return;
        }
        
        const sekolah = {
            nama,
            npsn,
            alamat,
            kepala_sekolah
        };
        
        if (id) {
            sekolah.id = id;
            DB.update('sekolah', sekolah, (success, error) => {
                if (success) {
                    Utils.showNotification('Data sekolah berhasil diperbarui', 'success');
                    this.closeModal();
                    this.loadSekolahTable();
                } else {
                    Utils.showNotification('Error: ' + error, 'error');
                }
            });
        } else {
            DB.add('sekolah', sekolah, (success, id) => {
                if (success) {
                    Utils.showNotification('Data sekolah berhasil ditambahkan', 'success');
                    this.closeModal();
                    this.loadSekolahTable();
                } else {
                    Utils.showNotification('Error menambahkan data', 'error');
                }
            });
        }
    },

    // Delete sekolah
    deleteSekolah: function(id) {
        if (confirm('Apakah Anda yakin ingin menghapus data sekolah ini?')) {
            DB.delete('sekolah', id, (success, error) => {
                if (success) {
                    Utils.showNotification('Data sekolah berhasil dihapus', 'success');
                    this.loadSekolahTable();
                } else {
                    Utils.showNotification('Error: ' + error, 'error');
                }
            });
        }
    },

    // Show guru form
    showGuruForm: function(id) {
        let guru = {
            nip: '',
            nama: '',
            jenis_kelamin: 'L',
            tempat_lahir: '',
            tanggal_lahir: '',
            alamat: '',
            mapel_diampu: '',
            status: 'Aktif'
        };
        
        if (id) {
            DB.getById('guru', id, (data) => {
                if (data) {
                    guru = data;
                    this.renderGuruForm(guru);
                }
            });
        } else {
            this.renderGuruForm(guru);
        }
    },

    // Render guru form
    renderGuruForm: function(guru) {
        const content = `
            <form id="guru-form">
                <div class="form-group">
                    <label for="guru-nip">NIP</label>
                    <input type="text" id="guru-nip" class="form-control" value="${guru.nip}" required>
                </div>
                <div class="form-group">
                    <label for="guru-nama">Nama Guru</label>
                    <input type="text" id="guru-nama" class="form-control" value="${guru.nama}" required>
                </div>
                <div class="form-group">
                    <label for="guru-jk">Jenis Kelamin</label>
                    <select id="guru-jk" class="form-control" required>
                        <option value="L" ${guru.jenis_kelamin === 'L' ? 'selected' : ''}>Laki-laki</option>
                        <option value="P" ${guru.jenis_kelamin === 'P' ? 'selected' : ''}>Perempuan</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="guru-tempat-lahir">Tempat Lahir</label>
                    <input type="text" id="guru-tempat-lahir" class="form-control" value="${guru.tempat_lahir}">
                </div>
                <div class="form-group">
                    <label for="guru-tanggal-lahir">Tanggal Lahir</label>
                    <input type="date" id="guru-tanggal-lahir" class="form-control" value="${guru.tanggal_lahir}">
                </div>
                <div class="form-group">
                    <label for="guru-alamat">Alamat</label>
                    <textarea id="guru-alamat" class="form-control">${guru.alamat}</textarea>
                </div>
                <div class="form-group">
                    <label for="guru-mapel">Mapel Diampu</label>
                    <input type="text" id="guru-mapel" class="form-control" value="${guru.mapel_diampu}">
                </div>
                <div class="form-group">
                    <label for="guru-status">Status</label>
                    <select id="guru-status" class="form-control">
                        <option value="Aktif" ${guru.status === 'Aktif' ? 'selected' : ''}>Aktif</option>
                        <option value="Tidak Aktif" ${guru.status === 'Tidak Aktif' ? 'selected' : ''}>Tidak Aktif</option>
                    </select>
                </div>
            </form>
        `;
        
        this.showModal('Data Guru', content, () => {
            this.saveGuru(guru.id);
        });
    },

    // Save guru
    saveGuru: function(id) {
        const nip = document.getElementById('guru-nip').value.trim();
        const nama = document.getElementById('guru-nama').value.trim();
        const jenis_kelamin = document.getElementById('guru-jk').value;
        const tempat_lahir = document.getElementById('guru-tempat-lahir').value.trim();
        const tanggal_lahir = document.getElementById('guru-tanggal-lahir').value;
        const alamat = document.getElementById('guru-alamat').value.trim();
        const mapel_diampu = document.getElementById('guru-mapel').value.trim();
        const status = document.getElementById('guru-status').value;
        
        if (!nip || !nama || !jenis_kelamin) {
            Utils.showNotification('NIP, nama, dan jenis kelamin harus diisi', 'error');
            return;
        }
        
        if (!Utils.validateNIP(nip)) {
            Utils.showNotification('NIP harus 18 digit', 'error');
            return;
        }
        
        const guru = {
            nip,
            nama,
            jenis_kelamin,
            tempat_lahir,
            tanggal_lahir,
            alamat,
            mapel_diampu,
            status
        };
        
        if (id) {
            guru.id = id;
            DB.update('guru', guru, (success, error) => {
                if (success) {
                    Utils.showNotification('Data guru berhasil diperbarui', 'success');
                    this.closeModal();
                    this.loadGuruTable();
                } else {
                    Utils.showNotification('Error: ' + error, 'error');
                }
            });
        } else {
            DB.add('guru', guru, (success, id) => {
                if (success) {
                    Utils.showNotification('Data guru berhasil ditambahkan', 'success');
                    this.closeModal();
                    this.loadGuruTable();
                } else {
                    Utils.showNotification('Error menambahkan data', 'error');
                }
            });
        }
    },

    // Delete guru
    deleteGuru: function(id) {
        if (confirm('Apakah Anda yakin ingin menghapus data guru ini?')) {
            DB.delete('guru', id, (success, error) => {
                if (success) {
                    Utils.showNotification('Data guru berhasil dihapus', 'success');
                    this.loadGuruTable();
                } else {
                    Utils.showNotification('Error: ' + error, 'error');
                }
            });
        }
    },

    // Show kelas form
    showKelasForm: function(id) {
        let kelas = {
            nama: '',
            tingkat: '',
            fase: '',
            wali_kelas_id: ''
        };
        
        if (id) {
            DB.getById('kelas', id, (data) => {
                if (data) {
                    kelas = data;
                    this.renderKelasForm(kelas);
                }
            });
        } else {
            this.renderKelasForm(kelas);
        }
    },

    // Render kelas form
    renderKelasForm: function(kelas) {
        // Get guru data for wali kelas dropdown
        DB.getAll('guru', (guruData) => {
            let guruOptions = '<option value="">-- Pilih Wali Kelas --</option>';
            guruData.forEach(guru => {
                guruOptions += `<option value="${guru.id}" ${kelas.wali_kelas_id == guru.id ? 'selected' : ''}>${guru.nama}</option>`;
            });
            
            const content = `
                <form id="kelas-form">
                    <div class="form-group">
                        <label for="kelas-nama">Nama Kelas</label>
                        <input type="text" id="kelas-nama" class="form-control" value="${kelas.nama}" required>
                    </div>
                    <div class="form-group">
                        <label for="kelas-tingkat">Tingkat</label>
                        <select id="kelas-tingkat" class="form-control" required>
                            <option value="">-- Pilih Tingkat --</option>
                            <option value="1" ${kelas.tingkat === '1' ? 'selected' : ''}>1</option>
                            <option value="2" ${kelas.tingkat === '2' ? 'selected' : ''}>2</option>
                            <option value="3" ${kelas.tingkat === '3' ? 'selected' : ''}>3</option>
                            <option value="4" ${kelas.tingkat === '4' ? 'selected' : ''}>4</option>
                            <option value="5" ${kelas.tingkat === '5' ? 'selected' : ''}>5</option>
                            <option value="6" ${kelas.tingkat === '6' ? 'selected' : ''}>6</option>
                            <option value="7" ${kelas.tingkat === '7' ? 'selected' : ''}>7</option>
                            <option value="8" ${kelas.tingkat === '8' ? 'selected' : ''}>8</option>
                            <option value="9" ${kelas.tingkat === '9' ? 'selected' : ''}>9</option>
                            <option value="10" ${kelas.tingkat === '10' ? 'selected' : ''}>10</option>
                            <option value="11" ${kelas.tingkat === '11' ? 'selected' : ''}>11</option>
                            <option value="12" ${kelas.tingkat === '12' ? 'selected' : ''}>12</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="kelas-fase">Fase</label>
                        <select id="kelas-fase" class="form-control" required>
                            <option value="">-- Pilih Fase --</option>
                            <option value="A" ${kelas.fase === 'A' ? 'selected' : ''}>Fase A</option>
                            <option value="B" ${kelas.fase === 'B' ? 'selected' : ''}>Fase B</option>
                            <option value="C" ${kelas.fase === 'C' ? 'selected' : ''}>Fase C</option>
                            <option value="D" ${kelas.fase === 'D' ? 'selected' : ''}>Fase D</option>
                            <option value="E" ${kelas.fase === 'E' ? 'selected' : ''}>Fase E</option>
                            <option value="F" ${kelas.fase === 'F' ? 'selected' : ''}>Fase F</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="kelas-wali">Wali Kelas</label>
                        <select id="kelas-wali" class="form-control">
                            ${guruOptions}
                        </select>
                    </div>
                </form>
            `;
            
            this.showModal('Data Kelas', content, () => {
                this.saveKelas(kelas.id);
            });
        });
    },

    // Save kelas
    saveKelas: function(id) {
        const nama = document.getElementById('kelas-nama').value.trim();
        const tingkat = document.getElementById('kelas-tingkat').value;
        const fase = document.getElementById('kelas-fase').value;
        const wali_kelas_id = document.getElementById('kelas-wali').value;
        
        if (!nama || !tingkat || !fase) {
            Utils.showNotification('Nama, tingkat, dan fase harus diisi', 'error');
            return;
        }
        
        const kelas = {
            nama,
            tingkat,
            fase,
            wali_kelas_id
        };
        
        if (id) {
            kelas.id = id;
            DB.update('kelas', kelas, (success, error) => {
                if (success) {
                    Utils.showNotification('Data kelas berhasil diperbarui', 'success');
                    this.closeModal();
                    this.loadKelasTable();
                } else {
                    Utils.showNotification('Error: ' + error, 'error');
                }
            });
        } else {
            DB.add('kelas', kelas, (success, id) => {
                if (success) {
                    Utils.showNotification('Data kelas berhasil ditambahkan', 'success');
                    this.closeModal();
                    this.loadKelasTable();
                } else {
                    Utils.showNotification('Error menambahkan data', 'error');
                }
            });
        }
    },

    // Delete kelas
    deleteKelas: function(id) {
        if (confirm('Apakah Anda yakin ingin menghapus data kelas ini?')) {
            // Check if there are students in this class
            DB.getByIndex('siswa', 'kelas_id', id, (siswaData) => {
                if (siswaData.length > 0) {
                    Utils.showNotification('Tidak dapat menghapus kelas ini karena masih ada siswa di dalamnya', 'error');
                    return;
                }
                
                DB.delete('kelas', id, (success, error) => {
                    if (success) {
                        Utils.showNotification('Data kelas berhasil dihapus', 'success');
                        this.loadKelasTable();
                    } else {
                        Utils.showNotification('Error: ' + error, 'error');
                    }
                });
            });
        }
    },

    // Show siswa form
    showSiswaForm: function(id) {
        let siswa = {
            nisn: '',
            nama: '',
            jenis_kelamin: 'L',
            tempat_lahir: '',
            tanggal_lahir: '',
            alamat: '',
            nama_ayah: '',
            nama_ibu: '',
            pekerjaan_ayah: '',
            pekerjaan_ibu: '',
            kelas_id: ''
        };
        
        if (id) {
            DB.getById('siswa', id, (data) => {
                if (data) {
                    siswa = data;
                    this.renderSiswaForm(siswa);
                }
            });
        } else {
            this.renderSiswaForm(siswa);
        }
    },

    // Render siswa form
    renderSiswaForm: function(siswa) {
        // Get kelas data for dropdown
        DB.getAll('kelas', (kelasData) => {
            let kelasOptions = '<option value="">-- Pilih Kelas --</option>';
            kelasData.forEach(kelas => {
                kelasOptions += `<option value="${kelas.id}" ${siswa.kelas_id == kelas.id ? 'selected' : ''}>${kelas.nama}</option>`;
            });
            
            const content = `
                <form id="siswa-form">
                    <div class="form-group">
                        <label for="siswa-nisn">NISN</label>
                        <input type="text" id="siswa-nisn" class="form-control" value="${siswa.nisn}" required>
                    </div>
                    <div class="form-group">
                        <label for="siswa-nama">Nama Siswa</label>
                        <input type="text" id="siswa-nama" class="form-control" value="${siswa.nama}" required>
                    </div>
                    <div class="form-group">
                        <label for="siswa-jk">Jenis Kelamin</label>
                        <select id="siswa-jk" class="form-control" required>
                            <option value="L" ${siswa.jenis_kelamin === 'L' ? 'selected' : ''}>Laki-laki</option>
                            <option value="P" ${siswa.jenis_kelamin === 'P' ? 'selected' : ''}>Perempuan</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="siswa-tempat-lahir">Tempat Lahir</label>
                        <input type="text" id="siswa-tempat-lahir" class="form-control" value="${siswa.tempat_lahir}">
                    </div>
                    <div class="form-group">
                        <label for="siswa-tanggal-lahir">Tanggal Lahir</label>
                        <input type="date" id="siswa-tanggal-lahir" class="form-control" value="${siswa.tanggal_lahir}">
                    </div>
                    <div class="form-group">
                        <label for="siswa-alamat">Alamat</label>
                        <textarea id="siswa-alamat" class="form-control">${siswa.alamat}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="siswa-ayah">Nama Ayah</label>
                        <input type="text" id="siswa-ayah" class="form-control" value="${siswa.nama_ayah}">
                    </div>
                    <div class="form-group">
                        <label for="siswa-ibu">Nama Ibu</label>
                        <input type="text" id="siswa-ibu" class="form-control" value="${siswa.nama_ibu}">
                    </div>
                    <div class="form-group">
                        <label for="siswa-pekerjaan-ayah">Pekerjaan Ayah</label>
                        <input type="text" id="siswa-pekerjaan-ayah" class="form-control" value="${siswa.pekerjaan_ayah}">
                    </div>
                    <div class="form-group">
                        <label for="siswa-pekerjaan-ibu">Pekerjaan Ibu</label>
                        <input type="text" id="siswa-pekerjaan-ibu" class="form-control" value="${siswa.pekerjaan_ibu}">
                    </div>
                    <div class="form-group">
                        <label for="siswa-kelas">Kelas</label>
                        <select id="siswa-kelas" class="form-control" required>
                            ${kelasOptions}
                        </select>
                    </div>
                </form>
            `;
            
            this.showModal('Data Siswa', content, () => {
                this.saveSiswa(siswa.id);
            });
        });
    },

    // Save siswa
    saveSiswa: function(id) {
        const nisn = document.getElementById('siswa-nisn').value.trim();
        const nama = document.getElementById('siswa-nama').value.trim();
        const jenis_kelamin = document.getElementById('siswa-jk').value;
        const tempat_lahir = document.getElementById('siswa-tempat-lahir').value.trim();
        const tanggal_lahir = document.getElementById('siswa-tanggal-lahir').value;
        const alamat = document.getElementById('siswa-alamat').value.trim();
        const nama_ayah = document.getElementById('siswa-ayah').value.trim();
        const nama_ibu = document.getElementById('siswa-ibu').value.trim();
        const pekerjaan_ayah = document.getElementById('siswa-pekerjaan-ayah').value.trim();
        const pekerjaan_ibu = document.getElementById('siswa-pekerjaan-ibu').value.trim();
        const kelas_id = document.getElementById('siswa-kelas').value;
        
        if (!nisn || !nama || !jenis_kelamin || !kelas_id) {
            Utils.showNotification('NISN, nama, jenis kelamin, dan kelas harus diisi', 'error');
            return;
        }
        
        if (!Utils.validateNISN(nisn)) {
            Utils.showNotification('NISN harus 10 digit', 'error');
            return;
        }
        
        const siswa = {
            nisn,
            nama,
            jenis_kelamin,
            tempat_lahir,
            tanggal_lahir,
            alamat,
            nama_ayah,
            nama_ibu,
            pekerjaan_ayah,
            pekerjaan_ibu,
            kelas_id
        };
        
        if (id) {
            siswa.id = id;
            DB.update('siswa', siswa, (success, error) => {
                if (success) {
                    Utils.showNotification('Data siswa berhasil diperbarui', 'success');
                    this.closeModal();
                    this.loadSiswaTable();
                } else {
                    Utils.showNotification('Error: ' + error, 'error');
                }
            });
        } else {
            DB.add('siswa', siswa, (success, id) => {
                if (success) {
                    Utils.showNotification('Data siswa berhasil ditambahkan', 'success');
                    this.closeModal();
                    this.loadSiswaTable();
                } else {
                    Utils.showNotification('Error menambahkan data', 'error');
                }
            });
        }
    },

    // Delete siswa
    deleteSiswa: function(id) {
        if (confirm('Apakah Anda yakin ingin menghapus data siswa ini?')) {
            // Check if there are grades for this student
            DB.getByIndex('nilai', 'siswa_id', id, (nilaiData) => {
                if (nilaiData.length > 0) {
                    Utils.showNotification('Tidak dapat menghapus siswa ini karena masih ada data nilai', 'error');
                    return;
                }
                
                DB.delete('siswa', id, (success, error) => {
                    if (success) {
                        Utils.showNotification('Data siswa berhasil dihapus', 'success');
                        this.loadSiswaTable();
                    } else {
                        Utils.showNotification('Error: ' + error, 'error');
                    }
                });
            });
        }
    },

    // Show mapel form
    showMapelForm: function(id) {
        let mapel = {
            kode: '',
            nama: '',
            fase: '',
            kelompok: '',
            jam_pelajaran: ''
        };
        
        if (id) {
            DB.getById('mapel', id, (data) => {
                if (data) {
                    mapel = data;
                    this.renderMapelForm(mapel);
                }
            });
        } else {
            this.renderMapelForm(mapel);
        }
    },

    // Render mapel form
    renderMapelForm: function(mapel) {
        const content = `
            <form id="mapel-form">
                <div class="form-group">
                    <label for="mapel-kode">Kode Mata Pelajaran</label>
                    <input type="text" id="mapel-kode" class="form-control" value="${mapel.kode}" required>
                </div>
                <div class="form-group">
                    <label for="mapel-nama">Nama Mata Pelajaran</label>
                    <input type="text" id="mapel-nama" class="form-control" value="${mapel.nama}" required>
                </div>
                <div class="form-group">
                    <label for="mapel-fase">Fase</label>
                    <select id="mapel-fase" class="form-control" required>
                        <option value="">-- Pilih Fase --</option>
                        <option value="A" ${mapel.fase === 'A' ? 'selected' : ''}>Fase A</option>
                        <option value="B" ${mapel.fase === 'B' ? 'selected' : ''}>Fase B</option>
                        <option value="C" ${mapel.fase === 'C' ? 'selected' : ''}>Fase C</option>
                        <option value="D" ${mapel.fase === 'D' ? 'selected' : ''}>Fase D</option>
                        <option value="E" ${mapel.fase === 'E' ? 'selected' : ''}>Fase E</option>
                        <option value="F" ${mapel.fase === 'F' ? 'selected' : ''}>Fase F</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="mapel-kelompok">Kelompok</label>
                    <select id="mapel-kelompok" class="form-control" required>
                        <option value="">-- Pilih Kelompok --</option>
                        <option value="A" ${mapel.kelompok === 'A' ? 'selected' : ''}>Kelompok A</option>
                        <option value="B" ${mapel.kelompok === 'B' ? 'selected' : ''}>Kelompok B</option>
                        <option value="C" ${mapel.kelompok === 'C' ? 'selected' : ''}>Kelompok C</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="mapel-jam">Jam Pelajaran</label>
                    <input type="number" id="mapel-jam" class="form-control" value="${mapel.jam_pelajaran}" min="1">
                </div>
            </form>
        `;
        
        this.showModal('Data Mata Pelajaran', content, () => {
            this.saveMapel(mapel.id);
        });
    },

    // Save mapel
    saveMapel: function(id) {
        const kode = document.getElementById('mapel-kode').value.trim();
        const nama = document.getElementById('mapel-nama').value.trim();
        const fase = document.getElementById('mapel-fase').value;
        const kelompok = document.getElementById('mapel-kelompok').value;
        const jam_pelajaran = document.getElementById('mapel-jam').value;
        
        if (!kode || !nama || !fase || !kelompok) {
            Utils.showNotification('Kode, nama, fase, dan kelompok harus diisi', 'error');
            return;
        }
        
        const mapel = {
            kode,
            nama,
            fase,
            kelompok,
            jam_pelajaran
        };
        
        if (id) {
            mapel.id = id;
            DB.update('mapel', mapel, (success, error) => {
                if (success) {
                    Utils.showNotification('Data mata pelajaran berhasil diperbarui', 'success');
                    this.closeModal();
                    this.loadMapelTable();
                } else {
                    Utils.showNotification('Error: ' + error, 'error');
                }
            });
        } else {
            DB.add('mapel', mapel, (success, id) => {
                if (success) {
                    Utils.showNotification('Data mata pelajaran berhasil ditambahkan', 'success');
                    this.closeModal();
                    this.loadMapelTable();
                } else {
                    Utils.showNotification('Error menambahkan data', 'error');
                }
            });
        }
    },

    // Delete mapel
    deleteMapel: function(id) {
        if (confirm('Apakah Anda yakin ingin menghapus data mata pelajaran ini?')) {
            // Check if there are CPs for this subject
            DB.getByIndex('cp', 'mapel_id', id, (cpData) => {
                if (cpData.length > 0) {
                    Utils.showNotification('Tidak dapat menghapus mata pelajaran ini karena masih ada data CP/TP', 'error');
                    return;
                }
                
                DB.delete('mapel', id, (success, error) => {
                    if (success) {
                        Utils.showNotification('Data mata pelajaran berhasil dihapus', 'success');
                        this.loadMapelTable();
                    } else {
                        Utils.showNotification('Error: ' + error, 'error');
                    }
                });
            });
        }
    },

    // Show CP form
    showCpForm: function(id) {
        let cp = {
            kode: '',
            elemen: '',
            mapel_id: '',
            fase: '',
            jenis: 'CP'
        };
        
        if (id) {
            DB.getById('cp', id, (data) => {
                if (data) {
                    cp = data;
                    this.renderCpForm(cp);
                }
            });
        } else {
            this.renderCpForm(cp);
        }
    },

    // Render CP form
    renderCpForm: function(cp) {
        // Get mapel data for dropdown
        DB.getAll('mapel', (mapelData) => {
            let mapelOptions = '<option value="">-- Pilih Mata Pelajaran --</option>';
            mapelData.forEach(mapel => {
                mapelOptions += `<option value="${mapel.id}" ${cp.mapel_id == mapel.id ? 'selected' : ''}>${mapel.nama} (Fase ${mapel.fase})</option>`;
            });
            
            const content = `
                <form id="cp-form">
                    <div class="form-group">
                        <label for="cp-kode">Kode CP/TP</label>
                        <input type="text" id="cp-kode" class="form-control" value="${cp.kode}" required>
                    </div>
                    <div class="form-group">
                        <label for="cp-elemen">Elemen CP/TP</label>
                        <textarea id="cp-elemen" class="form-control" required>${cp.elemen}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="cp-mapel">Mata Pelajaran</label>
                        <select id="cp-mapel" class="form-control" required>
                            ${mapelOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="cp-fase">Fase</label>
                        <select id="cp-fase" class="form-control" required>
                            <option value="">-- Pilih Fase --</option>
                            <option value="A" ${cp.fase === 'A' ? 'selected' : ''}>Fase A</option>
                            <option value="B" ${cp.fase === 'B' ? 'selected' : ''}>Fase B</option>
                            <option value="C" ${cp.fase === 'C' ? 'selected' : ''}>Fase C</option>
                            <option value="D" ${cp.fase === 'D' ? 'selected' : ''}>Fase D</option>
                            <option value="E" ${cp.fase === 'E' ? 'selected' : ''}>Fase E</option>
                            <option value="F" ${cp.fase === 'F' ? 'selected' : ''}>Fase F</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="cp-jenis">Jenis</label>
                        <select id="cp-jenis" class="form-control" required>
                            <option value="CP" ${cp.jenis === 'CP' ? 'selected' : ''}>CP (Capaian Pembelajaran)</option>
                            <option value="TP" ${cp.jenis === 'TP' ? 'selected' : ''}>TP (Tujuan Pembelajaran)</option>
                        </select>
                    </div>
                </form>
            `;
            
            this.showModal('Data CP/TP', content, () => {
                this.saveCp(cp.id);
            });
        });
    },

    // Save CP
    saveCp: function(id) {
        const kode = document.getElementById('cp-kode').value.trim();
        const elemen = document.getElementById('cp-elemen').value.trim();
        const mapel_id = document.getElementById('cp-mapel').value;
        const fase = document.getElementById('cp-fase').value;
        const jenis = document.getElementById('cp-jenis').value;
        
        if (!kode || !elemen || !mapel_id || !fase || !jenis) {
            Utils.showNotification('Semua field harus diisi', 'error');
            return;
        }
        
        const cp = {
            kode,
            elemen,
            mapel_id,
            fase,
            jenis
        };
        
        if (id) {
            cp.id = id;
            DB.update('cp', cp, (success, error) => {
                if (success) {
                    Utils.showNotification('Data CP/TP berhasil diperbarui', 'success');
                    this.closeModal();
                    this.loadCpTable();
                } else {
                    Utils.showNotification('Error: ' + error, 'error');
                }
            });
        } else {
            DB.add('cp', cp, (success, id) => {
                if (success) {
                    Utils.showNotification('Data CP/TP berhasil ditambahkan', 'success');
                    this.closeModal();
                    this.loadCpTable();
                } else {
                    Utils.showNotification('Error menambahkan data', 'error');
                }
            });
        }
    },

    // Delete CP
    deleteCp: function(id) {
        if (confirm('Apakah Anda yakin ingin menghapus data CP/TP ini?')) {
            // Check if there are grades for this CP
            DB.getByIndex('nilai', 'cp_id', id, (nilaiData) => {
                if (nilaiData.length > 0) {
                    Utils.showNotification('Tidak dapat menghapus CP/TP ini karena masih ada data nilai', 'error');
                    return;
                }
                
                DB.delete('cp', id, (success, error) => {
                    if (success) {
                        Utils.showNotification('Data CP/TP berhasil dihapus', 'success');
                        this.loadCpTable();
                    } else {
                        Utils.showNotification('Error: ' + error, 'error');
                    }
                });
            });
        }
    },

    // Show ekstrakurikuler form
    showEkstrakurikulerForm: function(id) {
        let ekskul = {
            nama: '',
            jenis: '',
            pembina: '',
            deskripsi: ''
        };
        
        if (id) {
            DB.getById('ekstrakurikuler', id, (data) => {
                if (data) {
                    ekskul = data;
                    this.renderEkstrakurikulerForm(ekskul);
                }
            });
        } else {
            this.renderEkstrakurikulerForm(ekskul);
        }
    },

    // Render ekstrakurikuler form
    renderEkstrakurikulerForm: function(ekskul) {
        const content = `
            <form id="ekstrakurikuler-form">
                <div class="form-group">
                    <label for="ekstrakurikuler-nama">Nama Kegiatan</label>
                    <input type="text" id="ekstrakurikuler-nama" class="form-control" value="${ekskul.nama}" required>
                </div>
                <div class="form-group">
                    <label for="ekstrakurikuler-jenis">Jenis</label>
                    <select id="ekstrakurikuler-jenis" class="form-control" required>
                        <option value="">-- Pilih Jenis --</option>
                        <option value="Ekstrakurikuler" ${ekskul.jenis === 'Ekstrakurikuler' ? 'selected' : ''}>Ekstrakurikuler</option>
                        <option value="Kokurikuler" ${ekskul.jenis === 'Kokurikuler' ? 'selected' : ''}>Kokurikuler</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="ekstrakurikuler-pembina">Pembina</label>
                    <input type="text" id="ekstrakurikuler-pembina" class="form-control" value="${ekskul.pembina}" required>
                </div>
                <div class="form-group">
                    <label for="ekstrakurikuler-deskripsi">Deskripsi</label>
                    <textarea id="ekstrakurikuler-deskripsi" class="form-control">${ekskul.deskripsi}</textarea>
                </div>
            </form>
        `;
        
        this.showModal('Data Ekstrakurikuler', content, () => {
            this.saveEkstrakurikuler(ekskul.id);
        });
    },

    // Save ekstrakurikuler
    saveEkstrakurikuler: function(id) {
        const nama = document.getElementById('ekstrakurikuler-nama').value.trim();
        const jenis = document.getElementById('ekstrakurikuler-jenis').value;
        const pembina = document.getElementById('ekstrakurikuler-pembina').value.trim();
        const deskripsi = document.getElementById('ekstrakurikuler-deskripsi').value.trim();
        
        if (!nama || !jenis || !pembina) {
            Utils.showNotification('Nama, jenis, dan pembina harus diisi', 'error');
            return;
        }
        
        const ekskul = {
            nama,
            jenis,
            pembina,
            deskripsi
        };
        
        if (id) {
            ekskul.id = id;
            DB.update('ekstrakurikuler', ekskul, (success, error) => {
                if (success) {
                    Utils.showNotification('Data ekstrakurikuler berhasil diperbarui', 'success');
                    this.closeModal();
                    this.loadEkstrakurikulerTable();
                } else {
                    Utils.showNotification('Error: ' + error, 'error');
                }
            });
        } else {
            DB.add('ekstrakurikuler', ekskul, (success, id) => {
                if (success) {
                    Utils.showNotification('Data ekstrakurikuler berhasil ditambahkan', 'success');
                    this.closeModal();
                    this.loadEkstrakurikulerTable();
                } else {
                    Utils.showNotification('Error menambahkan data', 'error');
                }
            });
        }
    },

    // Delete ekstrakurikuler
    deleteEkstrakurikuler: function(id) {
        if (confirm('Apakah Anda yakin ingin menghapus data ekstrakurikuler ini?')) {
            // Check if there are student records for this activity
            DB.getByIndex('ekstrakurikuler_siswa', 'ekstrakurikuler_id', id, (ekskulSiswaData) => {
                if (ekskulSiswaData.length > 0) {
                    Utils.showNotification('Tidak dapat menghapus ekstrakurikuler ini karena masih ada data siswa', 'error');
                    return;
                }
                
                DB.delete('ekstrakurikuler', id, (success, error) => {
                    if (success) {
                        Utils.showNotification('Data ekstrakurikuler berhasil dihapus', 'success');
                        this.loadEkstrakurikulerTable();
                    } else {
                        Utils.showNotification('Error: ' + error, 'error');
                    }
                });
            });
        }
    }
};