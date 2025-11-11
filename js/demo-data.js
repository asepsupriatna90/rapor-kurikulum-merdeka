// Demo Data Generator for testing purposes

const DemoData = {
    // Generate sample data
    generateSampleData: function(callback) {
        // Clear existing data
        const stores = [
            'sekolah', 'guru', 'kelas', 'siswa', 'mapel', 'cp', 
            'nilai', 'deskripsi', 'ekstrakurikuler', 'ekstrakurikuler_siswa',
            'ketidakhadiran', 'catatan_walikelas'
        ];
        
        let cleared = 0;
        stores.forEach(store => {
            DB.clear(store, () => {
                cleared++;
                if (cleared === stores.length) {
                    DemoData.insertData(callback);
                }
            });
        });
    },

    // Insert demo data
    insertData: function(callback) {
        // 1. Insert Sekolah
        const sekolah = {
            nama: 'SMA Negeri 1 Bandung',
            npsn: '20204714',
            alamat: 'Jl. Penghulu No. 1 Bandung, Jawa Barat',
            kota: 'Bandung',
            provinsi: 'Jawa Barat',
            kepala_sekolah: 'Drs. H. Achmad Suryanto, M.Pd',
            no_telpon: '(022) 4202019',
            email: 'sman1bdg@kemendikbud.go.id'
        };
        
        DB.add('sekolah', sekolah, () => {
            // 2. Insert Guru
            const gurus = [
                {
                    nip: '196505121989031001',
                    nama: 'Ibu Siti Nurhaliza, S.Pd',
                    jenis_kelamin: 'P',
                    mapel_diampu: 'Bahasa Indonesia',
                    status: 'PNS',
                    no_telpon: '081234567890'
                },
                {
                    nip: '196807031990031002',
                    nama: 'Bapak Ahmad Hidayat, S.Pd',
                    jenis_kelamin: 'L',
                    mapel_diampu: 'Matematika',
                    status: 'PNS',
                    no_telpon: '081234567891'
                },
                {
                    nip: '197203151995121003',
                    nama: 'Ibu Eka Putri Wulandari, S.Pd',
                    jenis_kelamin: 'P',
                    mapel_diampu: 'IPA',
                    status: 'PNS',
                    no_telpon: '081234567892'
                },
                {
                    nip: '196912101992031004',
                    nama: 'Bapak Bambang Setiawan, S.Pd',
                    jenis_kelamin: 'L',
                    mapel_diampu: 'IPS',
                    status: 'PNS',
                    no_telpon: '081234567893'
                }
            ];
            
            let guruAdded = 0;
            const guruIds = [];
            gurus.forEach(guru => {
                DB.add('guru', guru, (id) => {
                    guruIds.push(id);
                    guruAdded++;
                    if (guruAdded === gurus.length) {
                        DemoData.insertKelas(guruIds, callback);
                    }
                });
            });
        });
    },

    insertKelas: function(guruIds, callback) {
        const kelas = [
            {
                nama: 'X-A',
                tingkat: '10',
                fase: 'E',
                wali_kelas_id: guruIds[0],
                semester: '1',
                tahun_ajaran: '2024/2025'
            },
            {
                nama: 'X-B',
                tingkat: '10',
                fase: 'E',
                wali_kelas_id: guruIds[1],
                semester: '1',
                tahun_ajaran: '2024/2025'
            },
            {
                nama: 'XI-A',
                tingkat: '11',
                fase: 'E',
                wali_kelas_id: guruIds[2],
                semester: '1',
                tahun_ajaran: '2024/2025'
            }
        ];
        
        let kelasAdded = 0;
        const kelasIds = [];
        kelas.forEach(k => {
            DB.add('kelas', k, (id) => {
                kelasIds.push(id);
                kelasAdded++;
                if (kelasAdded === kelas.length) {
                    DemoData.insertSiswa(kelasIds, callback);
                }
            });
        });
    },

    insertSiswa: function(kelasIds, callback) {
        const siswa = [
            // Kelas X-A
            {
                nisn: '0012345678',
                nama: 'Adi Pratama',
                jenis_kelamin: 'L',
                tempat_lahir: 'Bandung',
                tanggal_lahir: '2008-05-15',
                alamat: 'Jl. Merdeka No. 10',
                kelas_id: kelasIds[0],
                status: 'Aktif'
            },
            {
                nisn: '0012345679',
                nama: 'Budi Santoso',
                jenis_kelamin: 'L',
                tempat_lahir: 'Bandung',
                tanggal_lahir: '2008-06-20',
                alamat: 'Jl. Diponegoro No. 25',
                kelas_id: kelasIds[0],
                status: 'Aktif'
            },
            {
                nisn: '0012345680',
                nama: 'Citra Dewi',
                jenis_kelamin: 'P',
                tempat_lahir: 'Bandung',
                tanggal_lahir: '2008-07-10',
                alamat: 'Jl. Ahmad Yani No. 15',
                kelas_id: kelasIds[0],
                status: 'Aktif'
            },
            // Kelas X-B
            {
                nisn: '0012345681',
                nama: 'Dewi Setiawati',
                jenis_kelamin: 'P',
                tempat_lahir: 'Bandung',
                tanggal_lahir: '2008-08-05',
                alamat: 'Jl. Sudirman No. 30',
                kelas_id: kelasIds[1],
                status: 'Aktif'
            },
            {
                nisn: '0012345682',
                nama: 'Eka Prasetya',
                jenis_kelamin: 'L',
                tempat_lahir: 'Bandung',
                tanggal_lahir: '2008-09-12',
                alamat: 'Jl. Gatot Subroto No. 20',
                kelas_id: kelasIds[1],
                status: 'Aktif'
            }
        ];
        
        let siswaAdded = 0;
        const siswaIds = [];
        siswa.forEach(s => {
            DB.add('siswa', s, (id) => {
                siswaIds.push(id);
                siswaAdded++;
                if (siswaAdded === siswa.length) {
                    DemoData.insertMapel(callback);
                }
            });
        });
    },

    insertMapel: function(callback) {
        const mapel = [
            {
                kode: 'B_IND',
                nama: 'Bahasa Indonesia',
                fase: 'E',
                kelompok: 'Umum',
                jam_pelajaran: 4
            },
            {
                kode: 'M_MTK',
                nama: 'Matematika',
                fase: 'E',
                kelompok: 'Umum',
                jam_pelajaran: 4
            },
            {
                kode: 'S_IPA',
                nama: 'Ilmu Pengetahuan Alam',
                fase: 'E',
                kelompok: 'Umum',
                jam_pelajaran: 3
            },
            {
                kode: 'S_IPS',
                nama: 'Ilmu Pengetahuan Sosial',
                fase: 'E',
                kelompok: 'Umum',
                jam_pelajaran: 3
            },
            {
                kode: 'B_ING',
                nama: 'Bahasa Inggris',
                fase: 'E',
                kelompok: 'Umum',
                jam_pelajaran: 3
            }
        ];
        
        let mapelAdded = 0;
        const mapelIds = [];
        mapel.forEach(m => {
            DB.add('mapel', m, (id) => {
                mapelIds.push(id);
                mapelAdded++;
                if (mapelAdded === mapel.length) {
                    DemoData.insertCP(mapelIds, callback);
                }
            });
        });
    },

    insertCP: function(mapelIds, callback) {
        const cp = [
            // Bahasa Indonesia
            {
                kode: 'B.IND.E.1',
                elemen: 'Membaca dan Memahami Teks',
                mapel_id: mapelIds[0],
                fase: 'E',
                deskripsi: 'Peserta didik mampu memahami teks bacaan dengan analisis mendalam',
                jenis: 'Pengetahuan'
            },
            {
                kode: 'B.IND.E.2',
                elemen: 'Menulis dan Mengekspresikan Ide',
                mapel_id: mapelIds[0],
                fase: 'E',
                deskripsi: 'Peserta didik mampu menulis dengan struktur dan ejaan yang tepat',
                jenis: 'Keterampilan'
            },
            // Matematika
            {
                kode: 'M.MTK.E.1',
                elemen: 'Bilangan dan Operasi',
                mapel_id: mapelIds[1],
                fase: 'E',
                deskripsi: 'Peserta didik mampu melakukan operasi bilangan kompleks',
                jenis: 'Pengetahuan'
            },
            {
                kode: 'M.MTK.E.2',
                elemen: 'Aljabar dan Persamaan',
                mapel_id: mapelIds[1],
                fase: 'E',
                deskripsi: 'Peserta didik mampu menyelesaikan persamaan linear dan kuadrat',
                jenis: 'Keterampilan'
            },
            // IPA
            {
                kode: 'S.IPA.E.1',
                elemen: 'Biologi dan Kesehatan',
                mapel_id: mapelIds[2],
                fase: 'E',
                deskripsi: 'Peserta didik memahami konsep biologi dan kesehatan',
                jenis: 'Pengetahuan'
            },
            {
                kode: 'S.IPA.E.2',
                elemen: 'Kimia dan Reaksi',
                mapel_id: mapelIds[2],
                fase: 'E',
                deskripsi: 'Peserta didik mampu menganalisis reaksi kimia',
                jenis: 'Keterampilan'
            }
        ];
        
        let cpAdded = 0;
        const cpIds = [];
        cp.forEach(c => {
            DB.add('cp', c, (id) => {
                cpIds.push(id);
                cpAdded++;
                if (cpAdded === cp.length) {
                    DemoData.insertSampleValues(callback);
                }
            });
        });
    },

    insertSampleValues: function(callback) {
        // Insert some sample grades
        const values = [
            { siswa_id: 1, mapel_id: 1, cp_id: 1, nilai: 85, semester: '1' },
            { siswa_id: 1, mapel_id: 1, cp_id: 2, nilai: 82, semester: '1' },
            { siswa_id: 1, mapel_id: 2, cp_id: 3, nilai: 88, semester: '1' },
            { siswa_id: 1, mapel_id: 2, cp_id: 4, nilai: 90, semester: '1' },
            { siswa_id: 2, mapel_id: 1, cp_id: 1, nilai: 78, semester: '1' },
            { siswa_id: 2, mapel_id: 1, cp_id: 2, nilai: 80, semester: '1' },
            { siswa_id: 3, mapel_id: 2, cp_id: 3, nilai: 92, semester: '1' }
        ];
        
        let valuesAdded = 0;
        values.forEach(v => {
            DB.add('nilai', v, () => {
                valuesAdded++;
                if (valuesAdded === values.length) {
                    Utils.showNotification('Data sampel berhasil dimuat! Refresh halaman untuk melihat perubahan.', 'success');
                    if (callback) callback();
                }
            });
        });
    }
};
