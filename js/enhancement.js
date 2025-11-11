// Enhancement Module - Fitur tambahan untuk aplikasi

const Enhancement = {
    // Initialize enhancements
    init: function() {
        this.addPrintStyles();
        this.setupLocalSearch();
        this.setupSortableColumns();
    },

    // Add print-friendly styles
    addPrintStyles: function() {
        const printStyles = document.createElement('style');
        printStyles.textContent = `
            @media print {
                .sidebar,
                .top-bar,
                .user-actions,
                .page-header button,
                .btn,
                .modal,
                .sidebar-toggle {
                    display: none !important;
                }

                body {
                    background-color: white;
                }

                .main-content {
                    margin-left: 0;
                    padding: 0;
                }

                .rapor-container {
                    max-width: 100%;
                    page-break-after: always;
                }

                .rapor-signatures {
                    page-break-inside: avoid;
                }

                table {
                    page-break-inside: avoid;
                }

                tr {
                    page-break-inside: avoid;
                }
            }
        `;
        document.head.appendChild(printStyles);
    },

    // Setup local search functionality
    setupLocalSearch: function() {
        const searchElements = document.querySelectorAll('[data-searchable]');
        
        searchElements.forEach(searchBox => {
            searchBox.addEventListener('keyup', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const tableId = searchBox.getAttribute('data-table');
                
                if (tableId) {
                    const table = document.getElementById(tableId);
                    if (table) {
                        const rows = table.querySelectorAll('tbody tr');
                        
                        rows.forEach(row => {
                            const text = row.textContent.toLowerCase();
                            if (text.includes(searchTerm)) {
                                row.style.display = '';
                            } else {
                                row.style.display = 'none';
                            }
                        });
                    }
                }
            });
        });
    },

    // Setup sortable table columns
    setupSortableColumns: function() {
        const tables = document.querySelectorAll('.data-table');
        
        tables.forEach(table => {
            const headers = table.querySelectorAll('th');
            
            headers.forEach((header, index) => {
                header.style.cursor = 'pointer';
                header.title = 'Klik untuk mengurutkan';
                
                header.addEventListener('click', () => {
                    this.sortTable(table, index);
                });
            });
        });
    },

    // Sort table by column
    sortTable: function(table, columnIndex) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        // Get sort direction
        const header = table.querySelectorAll('th')[columnIndex];
        const isAscending = !header.classList.contains('sort-asc');
        
        // Remove sort indicators
        table.querySelectorAll('th').forEach(h => {
            h.classList.remove('sort-asc', 'sort-desc');
        });
        
        // Set sort indicator
        header.classList.add(isAscending ? 'sort-asc' : 'sort-desc');
        
        // Sort rows
        rows.sort((a, b) => {
            let aValue = a.querySelectorAll('td')[columnIndex].textContent.trim();
            let bValue = b.querySelectorAll('td')[columnIndex].textContent.trim();
            
            // Try numeric sort
            const aNum = parseFloat(aValue);
            const bNum = parseFloat(bValue);
            
            if (!isNaN(aNum) && !isNaN(bNum)) {
                return isAscending ? aNum - bNum : bNum - aNum;
            }
            
            // String sort
            return isAscending ? 
                aValue.localeCompare(bValue) : 
                bValue.localeCompare(aValue);
        });
        
        // Re-insert sorted rows
        rows.forEach(row => tbody.appendChild(row));
    },

    // Export table to CSV
    exportTableToCSV: function(tableId, filename) {
        const table = document.getElementById(tableId);
        if (!table) return;
        
        let csv = [];
        const rows = table.querySelectorAll('tr');
        
        rows.forEach(row => {
            const cols = row.querySelectorAll('td, th');
            const csvRow = [];
            
            cols.forEach(col => {
                csvRow.push('"' + col.textContent.trim().replace(/"/g, '""') + '"');
            });
            
            csv.push(csvRow.join(','));
        });
        
        // Download CSV
        const csvContent = 'data:text/csv;charset=utf-8,' + csv.join('\n');
        const link = document.createElement('a');
        link.setAttribute('href', encodeURI(csvContent));
        link.setAttribute('download', filename || 'export.csv');
        link.click();
    },

    // Format currency
    formatCurrency: function(value) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(value);
    },

    // Format date range picker
    setupDateRangePicker: function(startDateSelector, endDateSelector, callback) {
        const startDateInput = document.querySelector(startDateSelector);
        const endDateInput = document.querySelector(endDateSelector);
        
        if (startDateInput && endDateInput) {
            const updateRange = () => {
                const startDate = new Date(startDateInput.value);
                const endDate = new Date(endDateInput.value);
                
                if (startDate && endDate && callback) {
                    callback(startDate, endDate);
                }
            };
            
            startDateInput.addEventListener('change', updateRange);
            endDateInput.addEventListener('change', updateRange);
        }
    },

    // Debounce function for expensive operations
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Add tooltips
    setupTooltips: function() {
        const tooltips = document.querySelectorAll('[title]');
        
        tooltips.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = element.getAttribute('title');
                tooltip.style.position = 'absolute';
                tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                tooltip.style.color = 'white';
                tooltip.style.padding = '5px 10px';
                tooltip.style.borderRadius = '4px';
                tooltip.style.fontSize = '0.8rem';
                tooltip.style.whiteSpace = 'nowrap';
                tooltip.style.zIndex = '1000';
                
                document.body.appendChild(tooltip);
                
                const rect = element.getBoundingClientRect();
                tooltip.style.top = (rect.bottom + 10) + 'px';
                tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
                
                element.addEventListener('mouseleave', () => {
                    tooltip.remove();
                });
            });
        });
    },

    // Setup auto-save functionality
    setupAutoSave: function(formSelector, saveFunction, interval = 30000) {
        const form = document.querySelector(formSelector);
        if (!form) return;
        
        setInterval(() => {
            const formData = new FormData(form);
            if (saveFunction) {
                saveFunction(Object.fromEntries(formData));
            }
        }, interval);
    }
};

// Initialize enhancements when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        Enhancement.init();
    });
} else {
    Enhancement.init();
}
