// PDF Generator for report cards

const PDFGenerator = {
    // Generate PDF for report card
    generate: function(
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
        // Create new jsPDF instance
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Set document properties
        doc.setProperties({
            title: `Rapor ${siswa.nama} - ${kelas.nama}`,
            subject: 'Laporan Hasil Belajar Peserta Didik',
            author: sekolah ? sekolah.nama : 'Sekolah',
            creator: 'Aplikasi Rapor Kurikulum Merdeka 2025'
        });
        
        // Add fonts
        doc.addFont('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf', 'Roboto', 'normal');
        doc.addFont('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Bold.ttf', 'Roboto', 'bold');
        
        // Set font
        doc.setFont('Roboto', 'normal');
        
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
        
        // Get template settings
        const templateSettings = this.getTemplateSettings(template);
        
        // Add header
        this.addHeader(doc, sekolah, templateSettings);
        
        // Add student info
        this.addStudentInfo(doc, siswa, kelas, semester, templateSettings);
        
        // Add grades
        this.addGrades(doc, mapelData, gradesBySubject, descriptionsBySubject, templateSettings);
        
        // Add extracurricular
        this.addExtracurricular(doc, ekskulData, templateSettings);
        
        // Add attendance
        this.addAttendance(doc, attendance, templateSettings);
        
        // Add teacher notes
        this.addTeacherNotes(doc, catatanData, templateSettings);
        
        // Add signatures
        this.addSignatures(doc, kelas, templateSettings);
        
        // Save the PDF
        const fileName = `Rapor_${siswa.nama.replace(/\s+/g, '_')}_${kelas.nama}_Semester_${semester}.pdf`;
        doc.save(fileName);
        
        // Show notification
        Utils.showNotification('Rapor berhasil dibuat', 'success');
    },
    
    // Get template settings based on education level
    getTemplateSettings: function(template) {
        const settings = {
            // Common settings
            fontSize: 10,
            titleFontSize: 14,
            headerFontSize: 12,
            tableFontSize: 9,
            lineHeight: 5,
            margin: 15,
            
            // Template-specific settings
            sd: {
                pageSize: 'a4',
                orientation: 'portrait',
                showGradeDetails: true,
                showPredikat: true
            },
            smp: {
                pageSize: 'a4',
                orientation: 'portrait',
                showGradeDetails: true,
                showPredikat: true
            },
            sma: {
                pageSize: 'a4',
                orientation: 'portrait',
                showGradeDetails: true,
                showPredikat: true
            },
            smk: {
                pageSize: 'a4',
                orientation: 'portrait',
                showGradeDetails: true,
                showPredikat: true
            },
            paketa: {
                pageSize: 'a4',
                orientation: 'portrait',
                showGradeDetails: true,
                showPredikat: true
            },
            paketb: {
                pageSize: 'a4',
                orientation: 'portrait',
                showGradeDetails: true,
                showPredikat: true
            },
            paketc: {
                pageSize: 'a4',
                orientation: 'portrait',
                showGradeDetails: true,
                showPredikat: true
            }
        };
        
        return settings[template] || settings.sd;
    },
    
    // Add header to PDF
    addHeader: function(doc, sekolah, settings) {
        // Add school name
        doc.setFontSize(settings.titleFontSize);
        doc.setFont('Roboto', 'bold');
        if (sekolah) {
            doc.text(sekolah.nama, settings.margin, 20);
        } else {
            doc.text('Sekolah', settings.margin, 20);
        }
        
        // Add report title
        doc.setFontSize(settings.titleFontSize);
        doc.text('LAPORAN HASIL BELAJAR PESERTA DIDIK', settings.margin, 30);
        
        // Add academic year
        doc.setFontSize(settings.fontSize);
        doc.setFont('Roboto', 'normal');
        doc.text(`Tahun Pelajaran ${Utils.getCurrentAcademicYear()}`, settings.margin, 40);
        
        // Add line separator
        doc.setLineWidth(0.5);
        doc.line(settings.margin, 45, 200 - settings.margin, 45);
    },
    
    // Add student information to PDF
    addStudentInfo: function(doc, siswa, kelas, semester, settings) {
        let yPos = 55;
        
        // Student info table
        doc.setFontSize(settings.headerFontSize);
        doc.setFont('Roboto', 'bold');
        doc.text('Data Peserta Didik', settings.margin, yPos);
        
        yPos += settings.lineHeight + 5;
        
        doc.setFontSize(settings.fontSize);
        doc.setFont('Roboto', 'normal');
        
        // Student details
        const studentDetails = [
            { label: 'Nama', value: siswa.nama },
            { label: 'NISN', value: siswa.nisn },
            { label: 'Kelas', value: kelas.nama },
            { label: 'Semester', value: semester }
        ];
        
        studentDetails.forEach(detail => {
            doc.text(`${detail.label}: ${detail.value}`, settings.margin, yPos);
            yPos += settings.lineHeight;
        });
        
        yPos += settings.lineHeight;
        
        // Add line separator
        doc.setLineWidth(0.3);
        doc.line(settings.margin, yPos, 200 - settings.margin, yPos);
        
        return yPos + settings.lineHeight;
    },
    
    // Add grades to PDF
    addGrades: function(doc, mapelData, gradesBySubject, descriptionsBySubject, settings) {
        let yPos = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 80;
        
        // Section title
        doc.setFontSize(settings.headerFontSize);
        doc.setFont('Roboto', 'bold');
        doc.text('A. Nilai & Capaian Kompetensi', settings.margin, yPos);
        
        yPos += settings.lineHeight + 5;
        
        // Prepare table data
        const tableData = [];
        const headers = ['No', 'Mata Pelajaran', 'Nilai', 'Deskripsi'];
        
        mapelData.forEach((mapel, index) => {
            const subjectGrades = gradesBySubject[mapel.id] || [];
            const subjectDescription = descriptionsBySubject[mapel.id] || '-';
            
            // Calculate average grade
            let averageGrade = 0;
            if (subjectGrades.length > 0) {
                const sum = subjectGrades.reduce((acc, curr) => acc + parseFloat(curr.nilai), 0);
                averageGrade = sum / subjectGrades.length;
            }
            
            // Add row
            const row = [
                index + 1,
                mapel.nama,
                averageGrade > 0 ? averageGrade.toFixed(2) : '-',
                subjectDescription
            ];
            
            tableData.push(row);
        });
        
        // Add table
        doc.autoTable({
            head: [headers],
            body: tableData,
            startY: yPos,
            theme: 'grid',
            styles: {
                fontSize: settings.tableFontSize,
                cellPadding: 3,
                font: 'Roboto'
            },
            headStyles: {
                fillColor: [66, 115, 223],
                textColor: 255,
                fontStyle: 'bold'
            },
            columnStyles: {
                0: { cellWidth: 15 }, // No
                1: { cellWidth: 60 }, // Subject
                2: { cellWidth: 20 }, // Grade
                3: { cellWidth: 80 }  // Description
            }
        });
        
        return doc.lastAutoTable.finalY + 10;
    },
    
    // Add extracurricular to PDF
    addExtracurricular: function(doc, ekskulData, settings) {
        let yPos = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 150;
        
        // Section title
        doc.setFontSize(settings.headerFontSize);
        doc.setFont('Roboto', 'bold');
        doc.text('B. Ekstrakurikuler', settings.margin, yPos);
        
        yPos += settings.lineHeight + 5;
        
        // Prepare table data
        const tableData = [];
        const headers = ['No', 'Kegiatan', 'Status', 'Deskripsi Capaian'];
        
        if (ekskulData.length > 0) {
            ekskulData.forEach((ekskul, index) => {
                // Add row
                const row = [
                    index + 1,
                    ekskul.ekstrakurikuler_nama || '-',
                    ekskul.status || '-',
                    ekskul.deskripsi || '-'
                ];
                
                tableData.push(row);
            });
        } else {
            // Add empty row
            tableData.push([
                '',
                { content: 'Tidak ada data ekstrakurikuler', colSpan: 3, styles: { halign: 'center' } }
            ]);
        }
        
        // Add table
        doc.autoTable({
            head: [headers],
            body: tableData,
            startY: yPos,
            theme: 'grid',
            styles: {
                fontSize: settings.tableFontSize,
                cellPadding: 3,
                font: 'Roboto'
            },
            headStyles: {
                fillColor: [66, 115, 223],
                textColor: 255,
                fontStyle: 'bold'
            },
            columnStyles: {
                0: { cellWidth: 15 }, // No
                1: { cellWidth: 50 }, // Activity
                2: { cellWidth: 30 }, // Status
                3: { cellWidth: 80 }  // Description
            }
        });
        
        return doc.lastAutoTable.finalY + 10;
    },
    
    // Add attendance to PDF
    addAttendance: function(doc, attendance, settings) {
        let yPos = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 200;
        
        // Section title
        doc.setFontSize(settings.headerFontSize);
        doc.setFont('Roboto', 'bold');
        doc.text('C. Ketidakhadiran', settings.margin, yPos);
        
        yPos += settings.lineHeight + 5;
        
        // Prepare table data
        const tableData = [
            ['Sakit', `${attendance.sakit} hari`],
            ['Izin', `${attendance.izin} hari`],
            ['Tanpa Keterangan', `${attendance.tanpaKeterangan} hari`]
        ];
        
        // Add table
        doc.autoTable({
            body: tableData,
            startY: yPos,
            theme: 'grid',
            styles: {
                fontSize: settings.tableFontSize,
                cellPadding: 3,
                font: 'Roboto'
            },
            columnStyles: {
                0: { cellWidth: 50, fontStyle: 'bold' }, // Type
                1: { cellWidth: 50 }  // Value
            }
        });
        
        return doc.lastAutoTable.finalY + 10;
    },
    
    // Add teacher notes to PDF
    addTeacherNotes: function(doc, catatanData, settings) {
        let yPos = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 230;
        
        // Section title
        doc.setFontSize(settings.headerFontSize);
        doc.setFont('Roboto', 'bold');
        doc.text('D. Catatan Wali Kelas', settings.margin, yPos);
        
        yPos += settings.lineHeight + 5;
        
        // Add notes
        doc.setFontSize(settings.fontSize);
        doc.setFont('Roboto', 'normal');
        
        const notes = catatanData ? catatanData.catatan : 'Tidak ada catatan';
        const splitNotes = doc.splitTextToSize(notes, 170);
        
        doc.text(splitNotes, settings.margin, yPos);
        
        return yPos + (splitNotes.length * 5) + 10;
    },
    
    // Add signatures to PDF
    addSignatures: function(doc, kelas, settings) {
        let yPos = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 250;
        
        // Section title
        doc.setFontSize(settings.headerFontSize);
        doc.setFont('Roboto', 'bold');
        doc.text('E. Tanggapan Orang Tua/Wali', settings.margin, yPos);
        
        yPos += settings.lineHeight + 10;
        
        // Add signature boxes
        doc.setFontSize(settings.fontSize);
        doc.setFont('Roboto', 'normal');
        
        // Left signature (Teacher)
        doc.text('Wali Kelas,', settings.margin, yPos);
        yPos += settings.lineHeight + 15;
        
        doc.setLineWidth(0.3);
        doc.line(settings.margin, yPos, 70, yPos);
        yPos += settings.lineHeight;
        
        doc.text(kelas.wali_kelas_nama || '...........................', settings.margin, yPos);
        yPos += settings.lineHeight;
        
        doc.text('NIP. ' + (kelas.wali_kelas_nip || '...........................'), settings.margin, yPos);
        
        // Right signature (Parent)
        yPos -= settings.lineHeight * 3;
        
        doc.text('Orang Tua/Wali,', 130, yPos);
        yPos += settings.lineHeight + 15;
        
        doc.line(130, yPos, 190, yPos);
        yPos += settings.lineHeight;
        
        doc.text('...........................', 130, yPos);
        
        return yPos + settings.lineHeight;
    }
};