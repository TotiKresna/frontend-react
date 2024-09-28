// cypress/integration/register.spec.ts

describe('Register Page', () => {
    beforeEach(() => {
      cy.visit('/register');
    });
  
    it('Tampilan form register', () => {
      cy.get('form').should('exist');
      cy.get('input[placeholder="Username"]').should('exist');
      cy.get('input[placeholder="Password"]').should('exist');
      cy.get('input[placeholder="Confirm Password"]').should('exist');
      cy.get('button[type="submit"]').should('contain', 'Register');
    });
  
    it('Pengguna menginput detail akun', () => {
      cy.get('input[placeholder="Username"]').type('newuser');
      cy.get('input[placeholder="Password"]').type('password123');
      cy.get('input[placeholder="Confirm Password"]').type('password123');
      cy.get('input[placeholder="Username"]').should('have.value', 'newuser');
      cy.get('input[placeholder="Password"]').should('have.value', 'password123');
      cy.get('input[placeholder="Confirm Password"]').should('have.value', 'password123');
    });
  
    it('Tampilan error ketika salah input kata sandi', () => {
      cy.get('input[placeholder="Username"]').type('newuser');
      cy.get('input[placeholder="Password"]').type('password123');
      cy.get('input[placeholder="Confirm Password"]').type('password456');
      cy.get('button[type="submit"]').click();
      cy.contains('Passwords do not match').should('be.visible');
    });
  
    it('Mengirim form dan menangani registrasi akun sukses', () => {
      cy.intercept('POST', '/auth/register', {
        statusCode: 200,
        body: { token: 'fake-token' },
      }).as('registerRequest');
  
      cy.get('input[placeholder="Username"]').type('newuser');
      cy.get('input[placeholder="Password"]').type('password123');
      cy.get('input[placeholder="Confirm Password"]').type('password123');
      cy.get('button[type="submit"]').click();
  
      cy.wait('@registerRequest');
      cy.url().should('include', '/login');
      cy.contains('Registrasi berhasil').should('be.visible');
    });
  
    it('Menangangi gagal registrasi akun', () => {
      cy.intercept('POST', '/auth/register', {
        statusCode: 400,
        body: { error: 'Username already exists' },
      }).as('registerRequest');
  
      cy.get('input[placeholder="Username"]').type('existinguser');
      cy.get('input[placeholder="Password"]').type('password123');
      cy.get('input[placeholder="Confirm Password"]').type('password123');
      cy.get('button[type="submit"]').click();
  
      cy.wait('@registerRequest');
      cy.contains('Registrasi gagal').should('be.visible');
      cy.contains('Silakan coba lagi').should('be.visible');
    });
  
    it('Navigasi ke halaman login', () => {
      cy.contains('Login di sini').click();
      cy.url().should('include', '/login');
    });
  });