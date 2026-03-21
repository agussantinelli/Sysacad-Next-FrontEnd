/// <reference types="cypress" />

describe('Admin User Management Flow', () => {
  beforeEach(() => {
    cy.login('admin@sysacad.com', '123456');
  });

  it('should register a new student and verify their creation', () => {
    cy.log('1. Go to "Usuarios"');
    cy.contains('.option-card', 'Usuarios').click({ force: true });
    cy.url().should('include', '/admin/users');

    cy.log('2. Open creation form');
    cy.get('button.btn-create', { timeout: 10000 }).click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/admin/users/create');

    cy.log('3. Fill student registration form');
    const randomSuffix = Math.floor(Math.random() * 10000);
    cy.contains('label', 'Nombre').next('input').type('TestStudent');
    cy.contains('label', 'Apellido').next('input').type(`User_${randomSuffix}`);
    cy.contains('label', 'Email').next('input').type(`student_${randomSuffix}@sysacad.com`);
    cy.contains('label', 'DNI').next('input').type(`4000${randomSuffix}`);
    cy.contains('label', 'Rol').next('select').select('ESTUDIANTE');

    cy.log('4. Submit registration');
    cy.get('button.btn-primary').contains('Crear').click({ force: true });

    cy.log('5. Validate creation success');
    cy.get('app-alert-message', { timeout: 10000 }).should('be.visible').and('contain.text', 'éxito');
    cy.contains(`User_${randomSuffix}`, { timeout: 10000 }).should('be.visible');

    cy.log('6. Logout from session');
    cy.get('.profile-btn', { timeout: 10000 }).click({ force: true });
    cy.get('.dropdown-item.logout', { timeout: 10000 }).click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/login');
  });
});
