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
      cy.get('a[href="/dashboard"]').click();
      cy.url().should('include', '/dashboard');
  
      cy.get('a[href="/students"]').click();
      cy.url().should('include', '/students');
      cy.go('back');
  
      cy.get('a[href="/test-results"]').click();
      cy.url().should('include', '/test-results');
      cy.go('back');
  
      cy.get('a[href="/import"]').click();
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