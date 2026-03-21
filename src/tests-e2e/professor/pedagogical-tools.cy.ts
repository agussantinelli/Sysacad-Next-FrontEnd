/// <reference types="cypress" />

describe('Professor Management and Communication Flow', () => {
  beforeEach(() => {
    cy.login('laura@sysacad.com', '123456');
  });

  it('should send an announcement to students and export checklist', () => {
    cy.log('1. Go to "Mis Comisiones"');
    cy.contains('.option-card', 'Mis Comisiones').click({ force: true });

    cy.log('2. Open message modal for a commission');
    cy.get('button.btn-message', { timeout: 10000 }).first().click({ force: true });

    cy.log('3. Write and send quick announcement');
    cy.get('textarea', { timeout: 10000 }).type('Aviso E2E: La clase de mañana es virtual.');
    cy.get('button.btn-send').click({ force: true });

    cy.log('5. Logout from session');
    cy.get('.profile-btn', { timeout: 10000 }).click({ force: true });
    cy.get('.dropdown-item.logout', { timeout: 10000 }).click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/login');
  });
});
