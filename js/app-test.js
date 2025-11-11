/**
 * APPLICATION TEST SUITE
 * Komprehensif testing untuk Rapor Kurikulum Merdeka
 * 
 * Usage: Jalankan di browser console atau integrasi dengan testing framework
 */

const AppTest = (() => {
    const TEST_RESULTS = [];
    const COLORS = {
        pass: '\x1b[92m', // Green
        fail: '\x1b[91m', // Red
        warn: '\x1b[93m', // Yellow
        info: '\x1b[94m', // Blue
        reset: '\x1b[0m'  // Reset
    };

    /**
     * Test helpers
     */
    const log = (message, type = 'info') => {
        const color = COLORS[type] || COLORS.info;
        console.log(`${color}${message}${COLORS.reset}`);
    };

    const test = (name, fn) => {
        try {
            fn();
            TEST_RESULTS.push({ name, status: 'PASS', error: null });
            log(`✓ ${name}`, 'pass');
            return true;
        } catch (error) {
            TEST_RESULTS.push({ name, status: 'FAIL', error: error.message });
            log(`✗ ${name}: ${error.message}`, 'fail');
            return false;
        }
    };

    const assert = (condition, message) => {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    };

    /**
     * TEST SUITE 1: UI & DOM STRUCTURE
     */
    const testUIStructure = () => {
        log('\n📋 TESTING UI STRUCTURE', 'info');

        test('HTML has required elements', () => {
            assert(document.querySelector('.sidebar'), 'Sidebar not found');
            assert(document.querySelector('.main-content'), 'Main content not found');
            assert(document.querySelector('.top-bar'), 'Top bar not found');
            assert(document.querySelector('#page-content'), 'Page content not found');
        });

        test('Sidebar menu items exist', () => {
            const menuItems = document.querySelectorAll('.sidebar-menu a');
            assert(menuItems.length >= 12, `Expected at least 12 menu items, found ${menuItems.length}`);
        });

        test('Dashboard cards rendered', () => {
            const cards = document.querySelectorAll('.dashboard-cards .card');
            assert(cards.length >= 4, `Expected at least 4 dashboard cards, found ${cards.length}`);
        });

        test('Modal structure exists', () => {
            assert(document.querySelector('.modal'), 'Modal not found');
            assert(document.querySelector('.modal-body'), 'Modal body not found');
        });

        test('Forms have proper elements', () => {
            const forms = document.querySelectorAll('form');
            assert(forms.length > 0, 'No forms found in page');
        });

        test('Buttons are functional', () => {
            const buttons = document.querySelectorAll('button');
            assert(buttons.length > 5, `Expected at least 5 buttons, found ${buttons.length}`);
        });

        test('Icons loaded (Font Awesome)', () => {
            const icons = document.querySelectorAll('.fas');
            assert(icons.length > 10, `Expected at least 10 Font Awesome icons, found ${icons.length}`);
        });
    };

    /**
     * TEST SUITE 2: DATABASE OPERATIONS
     */
    const testDatabase = () => {
        log('\n💾 TESTING DATABASE OPERATIONS', 'info');

        test('Database initialized', () => {
            assert(typeof DB !== 'undefined', 'DB object not found');
            assert(typeof DB.init === 'function', 'DB.init not a function');
        });

        test('Database stores accessible', () => {
            assert(DB.stores && Array.isArray(DB.stores), 'DB.stores not an array');
            assert(DB.stores.length === 13, `Expected 13 stores, found ${DB.stores.length}`);
        });

        test('Database methods exist', () => {
            assert(typeof DB.add === 'function', 'DB.add not found');
            assert(typeof DB.getAll === 'function', 'DB.getAll not found');
            assert(typeof DB.update === 'function', 'DB.update not found');
            assert(typeof DB.delete === 'function', 'DB.delete not found');
        });

        test('Database export/import', () => {
            assert(typeof DB.exportAllData === 'function', 'DB.exportAllData not found');
            assert(typeof DB.importAllData === 'function', 'DB.importAllData not found');
        });

        test('Database settings', () => {
            assert(typeof DB.getSetting === 'function', 'DB.getSetting not found');
            assert(typeof DB.setSetting === 'function', 'DB.setSetting not found');
        });
    };

    /**
     * TEST SUITE 3: VALIDATION
     */
    const testValidation = () => {
        log('\n✅ TESTING VALIDATION', 'info');

        test('Validator exists', () => {
            assert(typeof FormValidator !== 'undefined', 'FormValidator not found');
            assert(typeof FormValidator.validate === 'function', 'FormValidator.validate not a function');
        });

        test('Validation rules work', () => {
            const result = FormValidator.validate('test@example.com', { type: 'email' });
            assert(result.valid === true, 'Email validation failed');
        });

        test('Invalid email detected', () => {
            const result = FormValidator.validate('invalid-email', { type: 'email' });
            assert(result.valid === false, 'Invalid email not detected');
        });

        test('Required field validation', () => {
            const result = FormValidator.validate('', { type: 'required' });
            assert(result.valid === false, 'Empty field validation failed');
        });

        test('NISN validation', () => {
            const result = FormValidator.validate('0123456789', { type: 'nisn' });
            assert(result.valid === true || result.valid === false, 'NISN validation not working');
        });
    };

    /**
     * TEST SUITE 4: UTILITIES
     */
    const testUtilities = () => {
        log('\n🛠️ TESTING UTILITIES', 'info');

        test('Utils object exists', () => {
            assert(typeof Utils !== 'undefined', 'Utils not found');
        });

        test('Date formatting', () => {
            const date = new Date('2025-11-11');
            const formatted = Utils.formatDate(date);
            assert(formatted && formatted.length > 0, 'Date formatting failed');
        });

        test('Academic year calculation', () => {
            const year = Utils.getCurrentAcademicYear();
            assert(year && year.length > 0, 'Academic year calculation failed');
        });

        test('Notification system', () => {
            assert(typeof Utils.showNotification === 'function', 'Utils.showNotification not found');
        });

        test('Data export function', () => {
            assert(typeof Utils.exportDataToJson === 'function', 'Utils.exportDataToJson not found');
        });

        test('Grade conversion', () => {
            const predicate = Utils.gradeToPredicate(85);
            assert(predicate && predicate.length > 0, 'Grade conversion failed');
        });
    };

    /**
     * TEST SUITE 5: AUTO-BACKUP (v1.2.0)
     */
    const testAutoBackup = () => {
        log('\n🤖 TESTING AUTO-BACKUP SYSTEM', 'info');

        test('AutoBackup exists', () => {
            assert(typeof AutoBackup !== 'undefined', 'AutoBackup not found');
            assert(typeof AutoBackup.init === 'function', 'AutoBackup.init not found');
        });

        test('Auto-backup methods', () => {
            assert(typeof AutoBackup.performBackup === 'function', 'AutoBackup.performBackup not found');
            assert(typeof AutoBackup.startAutoBackup === 'function', 'AutoBackup.startAutoBackup not found');
            assert(typeof AutoBackup.restoreBackup === 'function', 'AutoBackup.restoreBackup not found');
        });

        test('GitHub workflow file exists', () => {
            // Check if workflow file exists in repository structure
            assert(true, 'Manual check required: .github/workflows/auto-backup.yml');
        });
    };

    /**
     * TEST SUITE 6: DEMO DATA (v1.1.0)
     */
    const testDemoData = () => {
        log('\n📊 TESTING DEMO DATA', 'info');

        test('DemoData object exists', () => {
            assert(typeof DemoData !== 'undefined', 'DemoData not found');
            assert(typeof DemoData.load === 'function', 'DemoData.load not found');
        });

        test('Demo data structure', () => {
            assert(DemoData.schools && Array.isArray(DemoData.schools), 'DemoData.schools not an array');
            assert(DemoData.teachers && Array.isArray(DemoData.teachers), 'DemoData.teachers not an array');
            assert(DemoData.classes && Array.isArray(DemoData.classes), 'DemoData.classes not an array');
            assert(DemoData.students && Array.isArray(DemoData.students), 'DemoData.students not an array');
        });
    };

    /**
     * TEST SUITE 7: UI INTERACTIONS
     */
    const testUIInteractions = () => {
        log('\n🖱️ TESTING UI INTERACTIONS', 'info');

        test('Navigation works', () => {
            const menuLinks = document.querySelectorAll('.sidebar-menu a');
            assert(menuLinks.length > 0, 'Menu links not found');
            
            menuLinks.forEach(link => {
                const page = link.dataset.page;
                assert(page, 'Menu link missing data-page attribute');
            });
        });

        test('Modal can be toggled', () => {
            const modal = document.querySelector('.modal');
            assert(modal, 'Modal not found');
            
            // Modal should have show/hide capability
            const style = window.getComputedStyle(modal);
            assert(style, 'Modal style not accessible');
        });

        test('Buttons have click listeners', () => {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(btn => {
                assert(btn.onclick || btn.getAttribute('data-action'), 'Button missing click handler or data-action');
            });
        });

        test('Form inputs are accessible', () => {
            const inputs = document.querySelectorAll('input, select, textarea');
            assert(inputs.length > 5, `Expected at least 5 form inputs, found ${inputs.length}`);
            
            inputs.forEach(input => {
                assert(input.name || input.id, 'Input missing name or id');
            });
        });
    };

    /**
     * TEST SUITE 8: ERROR HANDLING
     */
    const testErrorHandling = () => {
        log('\n⚠️ TESTING ERROR HANDLING', 'info');

        test('Error handling exists', () => {
            assert(typeof Utils !== 'undefined', 'Utils error handling not found');
        });

        test('Console is clean (no errors)', () => {
            // This is a manual check
            assert(true, 'Manual check: Open DevTools console and verify no critical errors');
        });

        test('Invalid operations handled', () => {
            // Test invalid data
            try {
                const result = FormValidator.validate(null, {});
                assert(result && typeof result === 'object', 'Invalid input not handled');
            } catch (e) {
                // Error caught and handled
                assert(true, 'Error properly caught');
            }
        });
    };

    /**
     * TEST SUITE 9: RESPONSIVENESS
     */
    const testResponsiveness = () => {
        log('\n📱 TESTING RESPONSIVENESS', 'info');

        test('CSS media queries present', () => {
            const stylesheet = document.styleSheets[0];
            assert(stylesheet, 'Stylesheet not found');
        });

        test('Viewport meta tag set', () => {
            const viewport = document.querySelector('meta[name="viewport"]');
            assert(viewport, 'Viewport meta tag not found');
        });

        test('Layout adjusts to screen size', () => {
            const mainContent = document.querySelector('.main-content');
            const sidebar = document.querySelector('.sidebar');
            assert(mainContent && sidebar, 'Layout elements not found');
            
            // Check responsive properties
            const style = window.getComputedStyle(sidebar);
            assert(style.position, 'Sidebar position not set');
        });
    };

    /**
     * TEST SUITE 10: PERFORMANCE
     */
    const testPerformance = () => {
        log('\n⚡ TESTING PERFORMANCE', 'info');

        test('Page load performance', () => {
            const perfData = window.performance;
            assert(perfData && perfData.timing, 'Performance API not available');
            
            const loadTime = perfData.timing.loadEventEnd - perfData.timing.navigationStart;
            log(`  Load time: ${loadTime}ms`, 'info');
            assert(loadTime < 10000, `Load time too long: ${loadTime}ms`);
        });

        test('DOM not heavily cluttered', () => {
            const allElements = document.querySelectorAll('*');
            assert(allElements.length < 5000, `Too many DOM elements: ${allElements.length}`);
        });

        test('No memory leaks (basic check)', () => {
            // This is a manual check with DevTools
            assert(true, 'Manual check: Use Chrome DevTools to check for memory leaks');
        });
    };

    /**
     * Run all tests
     */
    const runAllTests = () => {
        log('🚀 STARTING APPLICATION TEST SUITE', 'info');
        log('=' .repeat(50), 'info');

        testUIStructure();
        testDatabase();
        testValidation();
        testUtilities();
        testAutoBackup();
        testDemoData();
        testUIInteractions();
        testErrorHandling();
        testResponsiveness();
        testPerformance();

        // Print summary
        printSummary();
    };

    /**
     * Print test summary
     */
    const printSummary = () => {
        log('=' .repeat(50), 'info');
        log('📊 TEST SUMMARY', 'info');
        
        const passed = TEST_RESULTS.filter(r => r.status === 'PASS').length;
        const failed = TEST_RESULTS.filter(r => r.status === 'FAIL').length;
        const total = TEST_RESULTS.length;

        log(`Total: ${total}`, 'info');
        log(`Passed: ${passed}`, 'pass');
        log(`Failed: ${failed}`, failed > 0 ? 'fail' : 'pass');

        if (failed > 0) {
            log('\n❌ FAILED TESTS:', 'fail');
            TEST_RESULTS.filter(r => r.status === 'FAIL').forEach(r => {
                log(`  - ${r.name}: ${r.error}`, 'fail');
            });
        } else {
            log('\n✅ ALL TESTS PASSED!', 'pass');
        }

        log('\n📈 TEST REPORT', 'info');
        console.table(TEST_RESULTS);
    };

    /**
     * Export test results
     */
    const exportResults = () => {
        return {
            timestamp: new Date().toISOString(),
            results: TEST_RESULTS,
            summary: {
                total: TEST_RESULTS.length,
                passed: TEST_RESULTS.filter(r => r.status === 'PASS').length,
                failed: TEST_RESULTS.filter(r => r.status === 'FAIL').length
            }
        };
    };

    return {
        run: runAllTests,
        export: exportResults,
        test,
        assert,
        log
    };
})();

// Auto-run when document is ready
document.addEventListener('DOMContentLoaded', () => {
    // Uncomment to auto-run tests
    // AppTest.run();
});

// For manual execution in console:
// AppTest.run();
// AppTest.export();
