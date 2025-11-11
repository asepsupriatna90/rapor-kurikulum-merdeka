// Utility functions for the application

const Utils = {
    // Generate unique ID
    generateId: function() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Format date to Indonesian format
    formatDate: function(date) {
        if (!date) return '-';
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    },

    // Format date and time to Indonesian format
    formatDateTime: function(date) {
        if (!date) return '-';
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        return `${day}-${month}-${year} ${hours}:${minutes}`;
    },

    // Get current academic year
    getCurrentAcademicYear: function() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        
        // If month is January to June, academic year is (year-1)/year
        // If month is July to December, academic year is year/(year+1)
        if (month < 6) {
            return `${year-1}/${year}`;
        } else {
            return `${year}/${year+1}`;
        }
    },

    // Get current semester
    getCurrentSemester: function() {
        const now = new Date();
        const month = now.getMonth();
        
        // If month is January to June, semester is 2
        // If month is July to December, semester is 1
        if (month < 6) {
            return '2';
        } else {
            return '1';
        }
    },

    // Get phase from class level
    getPhaseFromClass: function(classLevel) {
        const level = parseInt(classLevel);
        if (level >= 1 && level <= 2) return 'A';
        if (level >= 3 && level <= 4) return 'B';
        if (level >= 5 && level <= 6) return 'C';
        if (level >= 7 && level <= 9) return 'D';
        if (level >= 10 && level <= 12) return 'E';
        if (level >= 13) return 'F';
        return '';
    },

    // Get class level from phase
    getClassLevelsFromPhase: function(phase) {
        switch(phase) {
            case 'A': return [1, 2];
            case 'B': return [3, 4];
            case 'C': return [5, 6];
            case 'D': return [7, 8, 9];
            case 'E': return [10, 11, 12];
            case 'F': return [13];
            default: return [];
        }
    },

    // Validate NISN (should be 10 digits)
    validateNISN: function(nisn) {
        const regex = /^\d{10}$/;
        return regex.test(nisn);
    },

    // Validate NIP (should be 18 digits)
    validateNIP: function(nip) {
        const regex = /^\d{18}$/;
        return regex.test(nip);
    },

    // Validate grade (0-100)
    validateGrade: function(grade) {
        const num = parseFloat(grade);
        return !isNaN(num) && num >= 0 && num <= 100;
    },

    // Convert grade to predicate
    gradeToPredicate: function(grade) {
        const num = parseFloat(grade);
        if (num >= 90) return 'Sangat Baik';
        if (num >= 80) return 'Baik';
        if (num >= 70) return 'Cukup';
        if (num >= 60) return 'Kurang';
        return 'Sangat Kurang';
    },

    // Generate description based on grades
    generateDescription: function(grades, cpData) {
        if (!grades || !cpData || grades.length === 0 || cpData.length === 0) {
            return "Tidak ada data untuk deskripsi.";
        }

        // Find highest and lowest grades
        const highestGrade = Math.max(...grades.map(g => parseFloat(g.nilai)));
        const lowestGrade = Math.min(...grades.map(g => parseFloat(g.nilai)));
        
        // Find CP with highest and lowest grades
        const highestCP = grades.find(g => parseFloat(g.nilai) === highestGrade);
        const lowestCP = grades.find(g => parseFloat(g.nilai) === lowestGrade);
        
        // Get CP details
        const highestCPDetail = cpData.find(cp => cp.id === highestCP.cp_id);
        const lowestCPDetail = cpData.find(cp => cp.id === lowestCP.cp_id);
        
        // Generate description
        let description = "";
        
        if (highestCPDetail) {
            description += `Ananda mencapai kompetensi sangat baik dalam ${highestCPDetail.elemen}. `;
        }
        
        if (lowestCPDetail && parseFloat(lowestGrade) < 70) {
            description += `Perlu peningkatan dalam ${lowestCPDetail.elemen}.`;
        }
        
        if (!description) {
            description = "Ananda telah mencapai semua kompetensi dengan baik.";
        }
        
        return description;
    },

    // Generate student description based on all subjects
    generateStudentDescription: function(studentId, semester, callback) {
        // Get all grades for the student
        DB.getAll('nilai', nilai => {
            const studentGrades = nilai.filter(n => n.siswa_id === studentId && n.semester === semester);
            
            if (studentGrades.length === 0) {
                callback("Tidak ada data nilai untuk siswa ini.");
                return;
            }
            
            // Get all CPs
            DB.getAll('cp', cpData => {
                // Group grades by subject
                const subjects = {};
                studentGrades.forEach(grade => {
                    if (!subjects[grade.mapel_id]) {
                        subjects[grade.mapel_id] = [];
                    }
                    subjects[grade.mapel_id].push(grade);
                });
                
                // Get subject details
                DB.getAll('mapel', mapelData => {
                    const descriptions = {};
                    
                    // Generate description for each subject
                    Object.keys(subjects).forEach(subjectId => {
                        const subject = mapelData.find(m => m.id === subjectId);
                        if (subject) {
                            const subjectGrades = subjects[subjectId];
                            const subjectCPs = cpData.filter(cp => cp.mapel_id === subjectId);
                            
                            descriptions[subjectId] = {
                                nama: subject.nama,
                                deskripsi: Utils.generateDescription(subjectGrades, subjectCPs)
                            };
                        }
                    });
                    
                    callback(descriptions);
                });
            });
        });
    },

    // Calculate attendance
    calculateAttendance: function(attendanceData) {
        if (!attendanceData || attendanceData.length === 0) {
            return {
                sakit: 0,
                izin: 0,
                tanpaKeterangan: 0
            };
        }
        
        return attendanceData.reduce((acc, curr) => {
            acc.sakit += parseInt(curr.sakit || 0);
            acc.izin += parseInt(curr.izin || 0);
            acc.tanpaKeterangan += parseInt(curr.tanpa_keterangan || 0);
            return acc;
        }, {
            sakit: 0,
            izin: 0,
            tanpaKeterangan: 0
        });
    },

    // Export data to JSON
    exportDataToJson: function(data, filename) {
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || `data-export-${Utils.formatDate(new Date())}.json`;
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    },

    // Import data from JSON file
    importDataFromJson: function(file, callback) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                callback(null, data);
            } catch (error) {
                callback(error, null);
            }
        };
        
        reader.onerror = function() {
            callback(new Error('Error reading file'), null);
        };
        
        reader.readAsText(file);
    },

    // Show notification
    showNotification: function(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Add close event
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.classList.add('fade-out');
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    },

    // Check if online
    isOnline: function() {
        return navigator.onLine;
    },

    // Format number with commas
    formatNumber: function(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    // Get education level from class
    getEducationLevel: function(classLevel) {
        const level = parseInt(classLevel);
        if (level >= 1 && level <= 6) return 'sd';
        if (level >= 7 && level <= 9) return 'smp';
        if (level >= 10 && level <= 12) return 'sma';
        return '';
    },

    // Get template name from education level
    getTemplateName: function(educationLevel) {
        switch(educationLevel) {
            case 'sd': return 'SD';
            case 'smp': return 'SMP';
            case 'sma': return 'SMA';
            case 'smk': return 'SMK';
            case 'paketa': return 'Paket A';
            case 'paketb': return 'Paket B';
            case 'paketc': return 'Paket C';
            default: return 'Umum';
        }
    }
};