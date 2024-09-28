describe('Students Page Tests', () => {
    beforeEach(() => {
        // Visit the login page
        cy.visit('/login');

        // Fill in the login form
        cy.get('input[placeholder="Username"]').type('@super');
        cy.get('input[placeholder="Password"]').type('12345');

        // Submit the login form
        cy.get('button[type="submit"]').click();

        // Verify redirection to the dashboard
        cy.url().should('include', '/dashboard');

        // Navigate to the students page
        cy.visit('/students');
    });

    it('should display the students page components', () => {
        // Check for the heading
        cy.contains('Data Siswa').should('be.visible');

        // Check for the refresh button
        cy.get('button[aria-label="Sync"]').should('be.visible');

        // Check for the create button
        cy.get('button[aria-label="create-student"]').contains('Create').should('be.visible');

        // Check for the edit button
        cy.get('button[aria-label="edit-student"]').contains('Edit').should('be.visible');

        // Check for the delete button
        cy.get('button[aria-label="delete-student"]').contains('Delete').should('be.visible');

        // Check for the search input
        cy.get('input[placeholder="Search by name"]').should('be.visible');

        // Check for the export buttons
        cy.get('button').contains('Export Excel').should('be.visible');
        cy.get('button').contains('Export PDF').should('be.visible');
    });

    it('should open and close the create student modal', () => {
        // Click the create button
        cy.get('button[aria-label="create-student"]').contains('Create').click();

        // Check for the modal
        cy.get('.chakra-modal__content').should('be.visible');

        // Check for the modal header
        cy.contains('Create Student').should('be.visible');

        // Close the modal
        cy.get('button').contains('Cancel').click();

        // Verify the modal is closed
        cy.get('.chakra-modal__content').should('not.exist');
    });

    it('should open and close the edit student modal', () => {
        // Assuming there's a student row to edit
        // Select the first row's edit button
        cy.get('table tbody tr').first().within(() => {
            cy.get('button[aria-label="edit-student"]').contains('Edit').click();
        });

        // Check for the modal
        cy.get('.chakra-modal__content').should('be.visible');

        // Check for the modal header
        cy.contains('Edit Student').should('be.visible');

        // Close the modal
        cy.get('button').contains('Cancel').click();

        // Verify the modal is closed
        cy.get('.chakra-modal__content').should('not.exist');
    });

    it('should select and delete students', () => {
        // Select the second student checkbox
        cy.get('input[type="checkbox"]').eq(1).check({ force: true });

        // Click the delete button
        cy.get('button').contains('Delete').click();

        // Assuming there's a confirmation dialog
        cy.get('button').contains('Cancel').click();

        // Verify the student is deleted (this will depend on your implementation)
        cy.get('input[type="checkbox"]').first().should('not.be.checked');
    });

    // it('should export students to Excel and PDF', () => {
    //     // Click the export to Excel button
    //     cy.get('button').contains('Export Excel').click();

    //     // Verify the Excel file is downloaded (this will depend on your implementation)
    //     cy.readFile('C:/Users/MAZTOD/Downloads').should('exist');

    //     // Click the export to PDF button
    //     cy.get('button').contains('Export PDF').click();

    //     // Verify the PDF file is downloaded (this will depend on your implementation)
    //     cy.readFile('C:/Users/MAZTOD/Downloads').should('exist');
    // });
});