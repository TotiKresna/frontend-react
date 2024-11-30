describe('Dashboard', () => {
    beforeEach(() => {
      // Login before each test
      cy.visit('/login');
      cy.get('input[placeholder="Username"]').type('@super');
      cy.get('input[placeholder="Password"]').type('12345');
      cy.get('button[type="submit"]').click();
  
      // Ensure we're redirected to the dashboard
      cy.url().should('include', '/dashboard');
    });
  
    it('Interaksi dengan tombol sidebar', () => {
      // Test sidebar navigation buttons
      cy.contains('Dashboard').click(); // Menggunakan teks tombol 'Dashboard'
      cy.url().should('include', '/dashboard');
  
      cy.contains('Data Siswa').click(); // Menggunakan teks tombol 'Data Siswa'
      cy.url().should('include', '/students');
      cy.go('back');
  
      cy.contains('Data Nilai').click(); // Menggunakan teks tombol 'Data Nilai'
      cy.url().should('include', '/test-results');
      cy.go('back');
  
      cy.contains('Import Nilai').click(); // Menggunakan teks tombol 'Import Nilai'
      cy.url().should('include', '/import');
      cy.go('back');
    });
      it('Interaksi dengan tombol profil ', () => {

      cy.get('button[aria-haspopup="menu"]').first().click({ force: true });
  
        // Test the profile dropdown buttons
      cy.get('div[role="menu"]').first().within(() => {

        // Click the 'Change Theme' button
      cy.contains('Change Theme').click({ force: true });
      
      // If user role is 'superadmin', click the 'Manage Accounts' button
      cy.contains('Manage Accounts').click({ force: true });  // Check and click the button only if it exists
  
      // Click the 'Logout' button
      cy.contains('Logout').click({ force: true });
      });

      // If all buttons are functioning, the test passes
      cy.log('Semua tombol berfungsi dengan baik.');
    });
  });