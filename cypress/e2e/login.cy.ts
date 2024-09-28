describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('Tampilan form Login', () => {
    cy.get('form').should('exist');
    cy.get('input[placeholder="Username"]').should('exist');
    cy.get('input[placeholder="Password"]').should('exist');
    cy.get('button[type="submit"]').should('contain', 'Login');
  });

  it('Pengguna menginput kredensial akun', () => {
    cy.get('input[placeholder="Username"]').type('@super');
    cy.get('input[placeholder="Password"]').type('12345');
    cy.get('input[placeholder="Username"]').should('have.value', '@super');
    cy.get('input[placeholder="Password"]').should('have.value', '12345');
  });

  it('Tombol sembunyikan kata sandi', () => {
    cy.get('input[placeholder="Password"]').should('have.attr', 'type', 'password');
    cy.get('button[aria-label="Show password"]').click();
    cy.get('input[placeholder="Password"]').should('have.attr', 'type', 'text');
    cy.get('button[aria-label="Hide password"]').click();
    cy.get('input[placeholder="Password"]').should('have.attr', 'type', 'password');
  });

  it('Mengirim data form dan menangani login sukses', () => {
    cy.intercept('POST', '/auth/login', {
      statusCode: 200,
      body: { success: 'Login Successfully'},
    }).as('loginRequest');

    cy.get('input[placeholder="Username"]').type('@super');
    cy.get('input[placeholder="Password"]').type('12345');
    cy.get('button[type="submit"]').click();

    // Check if the URL changes to /dashboard, indicating successful login
    cy.url().should('include', '/dashboard', { timeout: 10000 });
  });

  it('Menangani gagal login', () => {
    cy.intercept('POST', '/auth/login', {
      statusCode: 401,
      body: { error: 'Invalid credentials' },
    }).as('loginRequest');

    cy.get('input[placeholder="Username"]').type('wronguser');
    cy.get('input[placeholder="Password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.contains('Username atau password salah').should('be.visible');
  });

  it('Navigasi ke halaman register', () => {
    cy.contains('Daftar di sini').click();
    cy.url().should('include', '/register');
  });
});