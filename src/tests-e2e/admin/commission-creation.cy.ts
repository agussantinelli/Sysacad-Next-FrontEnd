/// <reference types="cypress" />

describe('Admin Commissions Management Flow', () => {
  beforeEach(() => {
    cy.login('admin@sysacad.com', '123456');
  });

  it('should create a new commission and logout', () => {
    cy.log('1. Navigate to Commissions management');
    cy.contains('.option-card', 'Comisiones').click({ force: true });
    cy.url({ timeout: 20000 }).should('include', '/admin/commissions');

    cy.log('2. Create a new dummy Commission');
    cy.get('button.btn-primary', { timeout: 20000 }).contains('Nueva Comisión').click({ force: true });

    cy.contains('label', 'Nombre').next('input').type('E2E-TEST-99');
    cy.contains('label', 'Carrera').next('select').select(1);
    cy.contains('label', 'Nivel').next('input').type('1');
    cy.contains('label', 'Turno').next('select').select('Noche');

    // Once Turno and Anio are set, Salon should be enabled
    cy.contains('label', 'Salón Asignado').next('select', { timeout: 10000 }).should('not.be.disabled').select(1);

    cy.get('button.btn-primary').contains('Crear').click({ force: true });
    cy.contains('E2E-TEST-99', { timeout: 10000 }).should('be.visible');

    cy.log('3. Logout from session');
    cy.get('.profile-btn', { timeout: 10000 }).click({ force: true });
    cy.get('.dropdown-item.logout', { timeout: 10000 }).click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/login');
  });
});
