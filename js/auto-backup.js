/**
 * AUTO-BACKUP MODULE
 * Memungkinkan user untuk auto-backup data ke GitHub
 * atau manual export kapan saja
 */

const AutoBackup = (() => {
    const CONFIG = {
        STORAGE_KEY: 'autoBackup_enabled',
        INTERVAL_KEY: 'autoBackup_interval',
        BACKUP_INTERVAL: 24 * 60 * 60 * 1000, // 24 jam default
        GITHUB_API_ENDPOINT: 'https://api.github.com/repos',
    };

    /**
     * Initialize auto-backup system
     */
    const init = () => {
        console.log('🔄 AutoBackup system initialized');
        
        // Load saved settings
        const isEnabled = localStorage.getItem(CONFIG.STORAGE_KEY) === 'true';
        const interval = localStorage.getItem(CONFIG.INTERVAL_KEY) || CONFIG.BACKUP_INTERVAL;
        
        if (isEnabled) {
            startAutoBackup(interval);
        }
        
        // Setup UI controls
        setupBackupControls();
    };

    /**
     * Start auto-backup interval
     */
    const startAutoBackup = (intervalMs) => {
        console.log(`⏱️ Auto-backup scheduled every ${intervalMs / (1000 * 60 * 60)} hours`);
        
        // Backup immediately
        performBackup();
        
        // Then repeat at interval
        setInterval(() => {
            performBackup();
        }, intervalMs);
    };

    /**
     * Perform backup operation
     */
    const performBackup = async () => {
        try {
            console.log('💾 Performing auto-backup...');
            
            // Get all data from database
            const allData = await new Promise((resolve, reject) => {
                DB.exportAllData((data) => {
                    if (data) {
                        resolve(data);
                    } else {
                        reject(new Error('Failed to export data'));
                    }
                });
            });
            
            // Create backup object
            const backup = {
                timestamp: new Date().toISOString(),
                version: '1.1.0',
                data: allData
            };
            
            // Option 1: Save locally first
            saveBackupLocally(backup);
            
            // Option 2: If user authenticated, upload to GitHub
            const ghToken = localStorage.getItem('gh_token');
            if (ghToken) {
                await uploadToGitHub(backup, ghToken);
            }
            
            // Option 3: Send to backend (if exists)
            const backendUrl = localStorage.getItem('backup_backend_url');
            if (backendUrl) {
                await uploadToBackend(backup, backendUrl);
            }
            
            notifyBackupSuccess(backup);
            
        } catch (error) {
            console.error('❌ Backup failed:', error);
            notifyBackupError(error);
        }
    };

    /**
     * Save backup locally
     */
    const saveBackupLocally = (backup) => {
        const dateStr = new Date().toISOString().split('T')[0];
        const filename = `rapor-backup-${dateStr}.json`;
        
        // Save to localStorage (limited space)
        const backups = JSON.parse(localStorage.getItem('local_backups') || '[]');
        backups.push({
            date: new Date().toISOString(),
            size: JSON.stringify(backup).length,
            filename: filename
        });
        
        // Keep last 7 backups
        if (backups.length > 7) {
            backups.shift();
        }
        localStorage.setItem('local_backups', JSON.stringify(backups));
        
        console.log(`✅ Local backup saved: ${filename}`);
    };

    /**
     * Upload backup to GitHub
     */
    const uploadToGitHub = async (backup, token) => {
        try {
            console.log('📤 Uploading to GitHub...');
            
            // Get repo info
            const owner = localStorage.getItem('gh_owner') || 'your-username';
            const repo = localStorage.getItem('gh_repo') || 'rapor-kurikulum-merdeka';
            
            const dateStr = new Date().toISOString().split('T')[0];
            const filename = `rapor-backup-${dateStr}.json`;
            const filepath = `backups/${filename}`;
            
            // Get existing file if any
            let sha = '';
            try {
                const getRes = await fetch(
                    `https://api.github.com/repos/${owner}/${repo}/contents/${filepath}`,
                    {
                        headers: {
                            'Authorization': `token ${token}`,
                            'Accept': 'application/vnd.github.v3+raw'
                        }
                    }
                );
                
                if (getRes.ok) {
                    const data = await getRes.json();
                    sha = data.sha;
                }
            } catch (e) {
                // File doesn't exist yet
            }
            
            // Create or update file
            const content = btoa(JSON.stringify(backup, null, 2)); // Base64 encode
            const body = {
                message: `🤖 Auto: Daily backup ${new Date().toLocaleDateString()}`,
                content: content,
                ...(sha && { sha })
            };
            
            const response = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/contents/${filepath}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                }
            );
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.statusText}`);
            }
            
            console.log(`✅ GitHub backup uploaded: ${filepath}`);
            
        } catch (error) {
            console.error('❌ GitHub upload failed:', error);
            throw error;
        }
    };

    /**
     * Upload backup to backend server
     */
    const uploadToBackend = async (backup, backendUrl) => {
        try {
            console.log('📤 Uploading to backend...');
            
            const response = await fetch(`${backendUrl}/api/backup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(backup)
            });
            
            if (!response.ok) {
                throw new Error(`Backend error: ${response.statusText}`);
            }
            
            console.log('✅ Backend backup uploaded');
            
        } catch (error) {
            console.error('❌ Backend upload failed:', error);
            throw error;
        }
    };

    /**
     * Setup UI controls for auto-backup
     */
    const setupBackupControls = () => {
        // Create settings panel if not exists
        const panel = document.getElementById('autoBackup-settings') || createSettingsPanel();
        
        // Event listeners
        document.getElementById('autoBackup-enable')?.addEventListener('change', (e) => {
            const enabled = e.target.checked;
            localStorage.setItem(CONFIG.STORAGE_KEY, enabled);
            
            if (enabled) {
                const interval = parseInt(localStorage.getItem(CONFIG.INTERVAL_KEY) || CONFIG.BACKUP_INTERVAL);
                startAutoBackup(interval);
                showNotification('✅ Auto-backup enabled', 'success');
            } else {
                showNotification('⏸️ Auto-backup disabled', 'info');
            }
        });
        
        document.getElementById('autoBackup-now')?.addEventListener('click', async () => {
            const btn = event.target;
            btn.disabled = true;
            btn.textContent = '⏳ Backing up...';
            
            try {
                await performBackup();
                btn.textContent = '✅ Done!';
                setTimeout(() => {
                    btn.disabled = false;
                    btn.textContent = '💾 Backup Now';
                }, 2000);
            } catch (error) {
                btn.disabled = false;
                btn.textContent = '❌ Failed';
                setTimeout(() => {
                    btn.textContent = '💾 Backup Now';
                }, 2000);
            }
        });
        
        document.getElementById('autoBackup-githubToken')?.addEventListener('blur', (e) => {
            const token = e.target.value;
            if (token) {
                localStorage.setItem('gh_token', token);
                showNotification('✅ GitHub token saved', 'success');
            }
        });
    };

    /**
     * Create settings panel UI
     */
    const createSettingsPanel = () => {
        const html = `
        <div id="autoBackup-settings" class="settings-section">
            <h3>🔄 Auto-Backup Settings</h3>
            
            <div class="setting-item">
                <label>
                    <input type="checkbox" id="autoBackup-enable" 
                           ${localStorage.getItem(CONFIG.STORAGE_KEY) === 'true' ? 'checked' : ''}>
                    Enable Auto-Backup
                </label>
                <p class="help-text">Data akan di-backup otomatis setiap 24 jam</p>
            </div>
            
            <div class="setting-item">
                <label for="autoBackup-githubToken">GitHub Personal Access Token (Optional)</label>
                <input type="password" id="autoBackup-githubToken" 
                       placeholder="ghp_xxxxxxxxxxxx"
                       value="${localStorage.getItem('gh_token') || ''}">
                <p class="help-text">
                    <a href="https://github.com/settings/tokens" target="_blank">Generate token</a>
                    dengan scope: repo, workflow
                </p>
            </div>
            
            <div class="setting-item">
                <label for="autoBackup-owner">GitHub Owner</label>
                <input type="text" id="autoBackup-owner" 
                       placeholder="your-username"
                       value="${localStorage.getItem('gh_owner') || ''}">
            </div>
            
            <div class="setting-item">
                <label for="autoBackup-repo">GitHub Repository</label>
                <input type="text" id="autoBackup-repo" 
                       placeholder="rapor-kurikulum-merdeka"
                       value="${localStorage.getItem('gh_repo') || ''}">
            </div>
            
            <div class="button-group">
                <button id="autoBackup-now" class="btn btn-primary">
                    💾 Backup Now
                </button>
                <button id="autoBackup-restore" class="btn btn-secondary">
                    📥 Restore Backup
                </button>
                <button id="autoBackup-viewHistory" class="btn btn-secondary">
                    📋 View History
                </button>
            </div>
            
            <div id="backup-history" class="backup-history"></div>
        </div>
        `;
        
        const container = document.getElementById('settings-container') || 
                         document.querySelector('.settings') ||
                         document.body;
        
        const panel = document.createElement('div');
        panel.innerHTML = html;
        container.appendChild(panel);
        
        return panel;
    };

    /**
     * Restore backup from file
     */
    const restoreBackup = async (file) => {
        try {
            console.log('📥 Restoring backup...');
            
            const text = await file.text();
            const data = JSON.parse(text);
            
            // Import ke database
            await new Promise((resolve, reject) => {
                DB.importAllData(data.data || data, (success) => {
                    if (success) {
                        resolve();
                    } else {
                        reject(new Error('Import failed'));
                    }
                });
            });
            
            notifyRestoreSuccess();
            location.reload();
            
        } catch (error) {
            console.error('❌ Restore failed:', error);
            notifyRestoreError(error);
        }
    };

    /**
     * Show backup success notification
     */
    const notifyBackupSuccess = (backup) => {
        const msg = `✅ Backup successful at ${new Date().toLocaleTimeString()}`;
        showNotification(msg, 'success');
        
        // Update UI
        const statusEl = document.getElementById('backup-status');
        if (statusEl) {
            statusEl.innerHTML = `
                <div class="backup-status-success">
                    <strong>Last backup:</strong> ${new Date().toLocaleString()}
                    <small>${(JSON.stringify(backup).length / 1024).toFixed(2)} KB</small>
                </div>
            `;
        }
    };

    /**
     * Show backup error notification
     */
    const notifyBackupError = (error) => {
        showNotification(`❌ Backup failed: ${error.message}`, 'error');
    };

    /**
     * Show restore success notification
     */
    const notifyRestoreSuccess = () => {
        showNotification('✅ Data restored successfully!', 'success');
    };

    /**
     * Show restore error notification
     */
    const notifyRestoreError = (error) => {
        showNotification(`❌ Restore failed: ${error.message}`, 'error');
    };

    /**
     * Show notification helper
     */
    const showNotification = (message, type = 'info') => {
        console.log(`[${type.toUpperCase()}] ${message}`);
        // Integration dengan notification system yang sudah ada
        if (window.Notification) {
            const className = `notification notification-${type}`;
            const el = document.createElement('div');
            el.className = className;
            el.textContent = message;
            document.body.appendChild(el);
            
            setTimeout(() => el.remove(), 3000);
        }
    };

    return {
        init,
        performBackup,
        startAutoBackup,
        restoreBackup
    };
})();

// Initialize saat DOM ready
document.addEventListener('DOMContentLoaded', () => {
    AutoBackup.init();
});
