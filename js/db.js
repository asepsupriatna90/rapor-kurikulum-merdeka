// Database management using IndexedDB

const DB = {
    dbName: 'RaporKurikulumMerdekaDB',
    dbVersion: 1,
    db: null,

    // Initialize database
    init: function(callback) {
        const request = indexedDB.open(this.dbName, this.dbVersion);

        request.onerror = function(event) {
            console.error('Database error:', event.target.error);
            if (callback) callback(false);
        };

        request.onsuccess = function(event) {
            DB.db = event.target.result;
            console.log('Database initialized successfully');
            if (callback) callback(true);
        };

        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            
            // Create object stores if they don't exist
            if (!db.objectStoreNames.contains('sekolah')) {
                const sekolahStore = db.createObjectStore('sekolah', { keyPath: 'id', autoIncrement: true });
                sekolahStore.createIndex('nama', 'nama', { unique: false });
                sekolahStore.createIndex('npsn', 'npsn', { unique: true });
            }
            
            if (!db.objectStoreNames.contains('guru')) {
                const guruStore = db.createObjectStore('guru', { keyPath: 'id', autoIncrement: true });
                guruStore.createIndex('nip', 'nip', { unique: true });
                guruStore.createIndex('nama', 'nama', { unique: false });
            }
            
            if (!db.objectStoreNames.contains('kelas')) {
                const kelasStore = db.createObjectStore('kelas', { keyPath: 'id', autoIncrement: true });
                kelasStore.createIndex('nama', 'nama', { unique: false });
                kelasStore.createIndex('tingkat', 'tingkat', { unique: false });
                kelasStore.createIndex('fase', 'fase', { unique: false });
            }
            
            if (!db.objectStoreNames.contains('siswa')) {
                const siswaStore = db.createObjectStore('siswa', { keyPath: 'id', autoIncrement: true });
                siswaStore.createIndex('nisn', 'nisn', { unique: true });
                siswaStore.createIndex('nama', 'nama', { unique: false });
                siswaStore.createIndex('kelas_id', 'kelas_id', { unique: false });
            }
            
            if (!db.objectStoreNames.contains('mapel')) {
                const mapelStore = db.createObjectStore('mapel', { keyPath: 'id', autoIncrement: true });
                mapelStore.createIndex('kode', 'kode', { unique: true });
                mapelStore.createIndex('nama', 'nama', { unique: false });
                mapelStore.createIndex('fase', 'fase', { unique: false });
            }
            
            if (!db.objectStoreNames.contains('cp')) {
                const cpStore = db.createObjectStore('cp', { keyPath: 'id', autoIncrement: true });
                cpStore.createIndex('kode', 'kode', { unique: true });
                cpStore.createIndex('mapel_id', 'mapel_id', { unique: false });
                cpStore.createIndex('fase', 'fase', { unique: false });
            }
            
            if (!db.objectStoreNames.contains('nilai')) {
                const nilaiStore = db.createObjectStore('nilai', { keyPath: 'id', autoIncrement: true });
                nilaiStore.createIndex('siswa_id', 'siswa_id', { unique: false });
                nilaiStore.createIndex('mapel_id', 'mapel_id', { unique: false });
                nilaiStore.createIndex('cp_id', 'cp_id', { unique: false });
                nilaiStore.createIndex('semester', 'semester', { unique: false });
            }
            
            if (!db.objectStoreNames.contains('deskripsi')) {
                const deskripsiStore = db.createObjectStore('deskripsi', { keyPath: 'id', autoIncrement: true });
                deskripsiStore.createIndex('siswa_id', 'siswa_id', { unique: false });
                deskripsiStore.createIndex('mapel_id', 'mapel_id', { unique: false });
                deskripsiStore.createIndex('semester', 'semester', { unique: false });
            }
            
            if (!db.objectStoreNames.contains('ekstrakurikuler')) {
                const ekstrakurikulerStore = db.createObjectStore('ekstrakurikuler', { keyPath: 'id', autoIncrement: true });
                ekstrakurikulerStore.createIndex('nama', 'nama', { unique: false });
                ekstrakurikulerStore.createIndex('jenis', 'jenis', { unique: false });
            }
            
            if (!db.objectStoreNames.contains('ekstrakurikuler_siswa')) {
                const ekstrakurikulerSiswaStore = db.createObjectStore('ekstrakurikuler_siswa', { keyPath: 'id', autoIncrement: true });
                ekstrakurikulerSiswaStore.createIndex('siswa_id', 'siswa_id', { unique: false });
                ekstrakurikulerSiswaStore.createIndex('ekstrakurikuler_id', 'ekstrakurikuler_id', { unique: false });
                ekstrakurikulerSiswaStore.createIndex('semester', 'semester', { unique: false });
            }
            
            if (!db.objectStoreNames.contains('ketidakhadiran')) {
                const ketidakhadiranStore = db.createObjectStore('ketidakhadiran', { keyPath: 'id', autoIncrement: true });
                ketidakhadiranStore.createIndex('siswa_id', 'siswa_id', { unique: false });
                ketidakhadiranStore.createIndex('semester', 'semester', { unique: false });
            }
            
            if (!db.objectStoreNames.contains('catatan_walikelas')) {
                const catatanWalikelasStore = db.createObjectStore('catatan_walikelas', { keyPath: 'id', autoIncrement: true });
                catatanWalikelasStore.createIndex('siswa_id', 'siswa_id', { unique: false });
                catatanWalikelasStore.createIndex('semester', 'semester', { unique: false });
            }
            
            if (!db.objectStoreNames.contains('pengaturan')) {
                const pengaturanStore = db.createObjectStore('pengaturan', { keyPath: 'id', autoIncrement: true });
                pengaturanStore.createIndex('key', 'key', { unique: true });
            }
        };
    },

    // Add data to a store
    add: function(storeName, data, callback) {
        if (!this.db) {
            console.error('Database not initialized');
            if (callback) callback(false, 'Database not initialized');
            return;
        }

        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.add(data);

        request.onsuccess = function(event) {
            if (callback) callback(true, event.target.result);
        };

        request.onerror = function(event) {
            console.error('Error adding data:', event.target.error);
            if (callback) callback(false, event.target.error);
        };
    },

    // Get data by ID from a store
    getById: function(storeName, id, callback) {
        if (!this.db) {
            console.error('Database not initialized');
            if (callback) callback(null, 'Database not initialized');
            return;
        }

        const transaction = this.db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(id);

        request.onsuccess = function(event) {
            if (callback) callback(event.target.result, null);
        };

        request.onerror = function(event) {
            console.error('Error getting data:', event.target.error);
            if (callback) callback(null, event.target.error);
        };
    },

    // Get all data from a store
    getAll: function(storeName, callback) {
        if (!this.db) {
            console.error('Database not initialized');
            if (callback) callback([], 'Database not initialized');
            return;
        }

        const transaction = this.db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = function(event) {
            if (callback) callback(event.target.result, null);
        };

        request.onerror = function(event) {
            console.error('Error getting all data:', event.target.error);
            if (callback) callback([], event.target.error);
        };
    },

    // Get data by index from a store
    getByIndex: function(storeName, indexName, value, callback) {
        if (!this.db) {
            console.error('Database not initialized');
            if (callback) callback([], 'Database not initialized');
            return;
        }

        const transaction = this.db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const index = store.index(indexName);
        const request = index.getAll(value);

        request.onsuccess = function(event) {
            if (callback) callback(event.target.result, null);
        };

        request.onerror = function(event) {
            console.error('Error getting data by index:', event.target.error);
            if (callback) callback([], event.target.error);
        };
    },

    // Update data in a store
    update: function(storeName, data, callback) {
        if (!this.db) {
            console.error('Database not initialized');
            if (callback) callback(false, 'Database not initialized');
            return;
        }

        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(data);

        request.onsuccess = function(event) {
            if (callback) callback(true, null);
        };

        request.onerror = function(event) {
            console.error('Error updating data:', event.target.error);
            if (callback) callback(false, event.target.error);
        };
    },

    // Delete data from a store
    delete: function(storeName, id, callback) {
        if (!this.db) {
            console.error('Database not initialized');
            if (callback) callback(false, 'Database not initialized');
            return;
        }

        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);

        request.onsuccess = function(event) {
            if (callback) callback(true, null);
        };

        request.onerror = function(event) {
            console.error('Error deleting data:', event.target.error);
            if (callback) callback(false, event.target.error);
        };
    },

    // Clear all data from a store
    clear: function(storeName, callback) {
        if (!this.db) {
            console.error('Database not initialized');
            if (callback) callback(false, 'Database not initialized');
            return;
        }

        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = function(event) {
            if (callback) callback(true, null);
        };

        request.onerror = function(event) {
            console.error('Error clearing data:', event.target.error);
            if (callback) callback(false, event.target.error);
        };
    },

    // Get all data from all stores
    exportAllData: function(callback) {
        const stores = [
            'sekolah', 'guru', 'kelas', 'siswa', 'mapel', 'cp', 
            'nilai', 'deskripsi', 'ekstrakurikuler', 'ekstrakurikuler_siswa',
            'ketidakhadiran', 'catatan_walikelas', 'pengaturan'
        ];
        
        const result = {};
        let completed = 0;
        
        stores.forEach(storeName => {
            this.getAll(storeName, (data, error) => {
                if (!error) {
                    result[storeName] = data;
                }
                
                completed++;
                if (completed === stores.length) {
                    if (callback) callback(result);
                }
            });
        });
    },

    // Import data to all stores
    importAllData: function(data, callback) {
        const stores = Object.keys(data);
        let completed = 0;
        let success = true;
        
        stores.forEach(storeName => {
            // Clear existing data
            this.clear(storeName, (cleared, error) => {
                if (cleared && !error) {
                    // Add new data
                    const items = data[storeName];
                    let itemsAdded = 0;
                    
                    if (items.length === 0) {
                        completed++;
                        if (completed === stores.length) {
                            if (callback) callback(success);
                        }
                        return;
                    }
                    
                    items.forEach(item => {
                        this.add(storeName, item, (added, addError) => {
                            if (!added || addError) {
                                success = false;
                                console.error(`Error adding item to ${storeName}:`, addError);
                            }
                            
                            itemsAdded++;
                            if (itemsAdded === items.length) {
                                completed++;
                                if (completed === stores.length) {
                                    if (callback) callback(success);
                                }
                            }
                        });
                    });
                } else {
                    success = false;
                    console.error(`Error clearing ${storeName}:`, error);
                    completed++;
                    if (completed === stores.length) {
                        if (callback) callback(success);
                    }
                }
            });
        });
    },

    // Get settings
    getSetting: function(key, callback) {
        this.getByIndex('pengaturan', 'key', key, (settings, error) => {
            if (settings && settings.length > 0) {
                if (callback) callback(settings[0].value, null);
            } else {
                if (callback) callback(null, null);
            }
        });
    },

    // Set setting
    setSetting: function(key, value, callback) {
        // Check if setting already exists
        this.getByIndex('pengaturan', 'key', key, (settings, error) => {
            if (settings && settings.length > 0) {
                // Update existing setting
                const setting = settings[0];
                setting.value = value;
                this.update('pengaturan', setting, (updated, updateError) => {
                    if (callback) callback(updated, updateError);
                });
            } else {
                // Add new setting
                this.add('pengaturan', { key, value }, (added, addError) => {
                    if (callback) callback(added, addError);
                });
            }
        });
    }
};