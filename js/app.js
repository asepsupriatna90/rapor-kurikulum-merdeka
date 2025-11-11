// Main application entry point

document.addEventListener('DOMContentLoaded', function() {
    // Initialize database
    DB.init((success) => {
        if (success) {
            console.log('Database initialized successfully');
            
            // Initialize UI
            UI.init();
            
            // Check if we need to set default settings
            DB.getSetting('fase', (fase) => {
                if (!fase) {
                    // Set default phase
                    DB.setSetting('fase', 'A', (success) => {
                        if (success) {
                            console.log('Default phase set to A');
                        }
                    });
                }
            });
            
            DB.getSetting('tahun_ajaran', (tahun) => {
                if (!tahun) {
                    // Set default academic year
                    const currentYear = Utils.getCurrentAcademicYear();
                    DB.setSetting('tahun_ajaran', currentYear, (success) => {
                        if (success) {
                            console.log('Default academic year set to ' + currentYear);
                        }
                    });
                }
            });
            
            // Listen for online/offline events
            window.addEventListener('online', () => {
                UI.updateSyncStatus();
                Utils.showNotification('Koneksi internet tersambung', 'success');
            });
            
            window.addEventListener('offline', () => {
                UI.updateSyncStatus();
                Utils.showNotification('Koneksi internet terputus', 'warning');
            });
            
            // Add notification styles
            const notificationStyles = document.createElement('style');
            notificationStyles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 4px;
                    color: white;
                    font-weight: 500;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    min-width: 300px;
                    max-width: 500px;
                    animation: slideIn 0.3s ease-out;
                }
                
                .notification-fade-out {
                    animation: fadeOut 0.3s ease-out forwards;
                }
                
                .notification-success {
                    background-color: var(--success-color);
                }
                
                .notification-error {
                    background-color: var(--danger-color);
                }
                
                .notification-warning {
                    background-color: var(--warning-color);
                }
                
                .notification-info {
                    background-color: var(--info-color);
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    flex: 1;
                }
                
                .notification-content i {
                    margin-right: 10px;
                    font-size: 1.2rem;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                    margin-left: 10px;
                    opacity: 0.8;
                }
                
                .notification-close:hover {
                    opacity: 1;
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes fadeOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
                
                .nilai-cp-container {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                
                .nilai-cp-item {
                    background-color: #f8f9fc;
                    padding: 10px;
                    border-radius: var(--border-radius);
                }
                
                .cp-name {
                    font-weight: 600;
                    margin-bottom: 5px;
                    font-size: 0.85rem;
                }
                
                .nilai-input {
                    width: 80px;
                }
                
                .is-invalid {
                    border-color: var(--danger-color) !important;
                }
                
                .rapor-container {
                    font-family: 'Times New Roman', serif;
                    line-height: 1.5;
                }
                
                .rapor-header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                
                .rapor-school {
                    margin-bottom: 10px;
                }
                
                .rapor-school h2 {
                    font-size: 16px;
                    margin: 5px 0;
                }
                
                .rapor-school p {
                    font-size: 12px;
                    margin: 2px 0;
                }
                
                .rapor-title h1 {
                    font-size: 18px;
                    margin: 10px 0;
                    font-weight: bold;
                }
                
                .rapor-title h2 {
                    font-size: 14px;
                    margin: 5px 0;
                }
                
                .rapor-student-info {
                    margin-bottom: 20px;
                }
                
                .rapor-info-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                
                .rapor-info-table td {
                    padding: 3px 5px;
                    font-size: 12px;
                }
                
                .rapor-section {
                    margin-bottom: 20px;
                }
                
                .rapor-section h3 {
                    font-size: 14px;
                    margin-bottom: 10px;
                    font-weight: bold;
                }
                
                .rapor-grade-table, .rapor-extracurricular-table, .rapor-attendance-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 10px;
                }
                
                .rapor-grade-table th, .rapor-extracurricular-table th {
                    background-color: #f0f0f0;
                    padding: 5px;
                    text-align: left;
                    font-size: 12px;
                    border: 1px solid #ddd;
                }
                
                .rapor-grade-table td, .rapor-extracurricular-table td {
                    padding: 5px;
                    font-size: 12px;
                    border: 1px solid #ddd;
                    vertical-align: top;
                }
                
                .rapor-attendance-table td {
                    padding: 3px 5px;
                    font-size: 12px;
                }
                
                .rapor-parent-response {
                    margin-top: 30px;
                }
                
                .rapor-signatures {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 20px;
                }
                
                .rapor-signature {
                    text-align: center;
                    width: 45%;
                }
                
                .rapor-signature p {
                    font-size: 12px;
                    margin: 5px 0;
                }
                
                .signature-line {
                    border-bottom: 1px solid #000;
                    height: 1px;
                    width: 100%;
                    margin: 20px 0 5px;
                }
            `;
            
            document.head.appendChild(notificationStyles);
            
            // Add CSS for modal
            const modalStyles = document.createElement('style');
            modalStyles.textContent = `
                .modal {
                    z-index: 2000;
                }
                
                .modal-content {
                    max-height: 85vh;
                }
                
                .modal-body {
                    max-height: calc(85vh - 120px);
                    overflow-y: auto;
                }
                
                .form-group {
                    margin-bottom: 1rem;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                }
                
                .form-control {
                    display: block;
                    width: 100%;
                    padding: 0.5rem 0.75rem;
                    font-size: 0.9rem;
                    line-height: 1.5;
                    color: #5a5c69;
                    background-color: white;
                    border: 1px solid #d1d3e2;
                    border-radius: 0.35rem;
                    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                }
                
                .form-control:focus {
                    color: #5a5c69;
                    background-color: white;
                    border-color: #bac8f3;
                    outline: 0;
                    box-shadow: 0 0 0 0.2rem rgba(78, 115, 223, 0.25);
                }
                
                textarea.form-control {
                    min-height: 100px;
                    resize: vertical;
                }
                
                select.form-control {
                    height: auto;
                }
                
                .btn {
                    display: inline-block;
                    font-weight: 400;
                    text-align: center;
                    white-space: nowrap;
                    vertical-align: middle;
                    user-select: none;
                    border: 1px solid transparent;
                    padding: 0.5rem 1rem;
                    font-size: 0.9rem;
                    line-height: 1.5;
                    border-radius: 0.35rem;
                    transition: all 0.15s ease-in-out;
                    cursor: pointer;
                }
                
                .btn-primary {
                    color: white;
                    background-color: var(--primary-color);
                    border-color: var(--primary-color);
                }
                
                .btn-primary:hover {
                    background-color: #2e59d9;
                    border-color: #2653d4;
                }
                
                .btn-secondary {
                    color: white;
                    background-color: var(--secondary-color);
                    border-color: var(--secondary-color);
                }
                
                .btn-secondary:hover {
                    background-color: #6d6e7d;
                    border-color: #656674;
                }
                
                .btn-success {
                    color: white;
                    background-color: var(--success-color);
                    border-color: var(--success-color);
                }
                
                .btn-success:hover {
                    background-color: #17a673;
                    border-color: #169b6b;
                }
                
                .btn-info {
                    color: white;
                    background-color: var(--info-color);
                    border-color: var(--info-color);
                }
                
                .btn-info:hover {
                    background-color: #2c9faf;
                    border-color: #2a96a5;
                }
                
                .btn-warning {
                    color: white;
                    background-color: var(--warning-color);
                    border-color: var(--warning-color);
                }
                
                .btn-warning:hover {
                    background-color: #dda20a;
                    border-color: #d09b0a;
                }
                
                .btn-danger {
                    color: white;
                    background-color: var(--danger-color);
                    border-color: var(--danger-color);
                }
                
                .btn-danger:hover {
                    background-color: #d63829;
                    border-color: #c23527;
                }
                
                .btn-sm {
                    padding: 0.25rem 0.5rem;
                    font-size: 0.8rem;
                }
                
                .sidebar-toggle {
                    position: fixed;
                    top: 15px;
                    left: 15px;
                    z-index: 1002;
                    background-color: var(--primary-color);
                    color: white;
                    border: none;
                    border-radius: var(--border-radius);
                    padding: 0.5rem;
                    display: none;
                }
                
                @media (max-width: 768px) {
                    .sidebar-toggle {
                        display: block;
                    }
                    
                    .sidebar {
                        transform: translateX(-100%);
                    }
                    
                    .sidebar.active {
                        transform: translateX(0);
                        width: var(--sidebar-width);
                        z-index: 1001;
                    }
                    
                    .sidebar-header h2, .sidebar-user, .sidebar-menu a span {
                        display: block;
                    }
                    
                    .sidebar-menu i {
                        margin-right: 0.75rem;
                    }
                    
                    .main-content {
                        margin-left: 0;
                    }
                    
                    .page-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 1rem;
                    }
                    
                    .nilai-header, .deskripsi-header, .ekskul-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 1rem;
                    }
                }
            `;
            
            document.head.appendChild(modalStyles);
        } else {
            console.error('Failed to initialize database');
            alert('Gagal menginisialisasi database. Silakan refresh halaman atau coba lagi.');
        }
    });
});