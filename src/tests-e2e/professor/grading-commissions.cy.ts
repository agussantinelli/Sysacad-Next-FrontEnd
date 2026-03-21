/// <reference types="cypress" />

describe('Professor Course Grading Flow', () => {
  beforeEach(() => {
    cy.login('laura@sysacad.com', '123456');
  });

  it('should load partial student grades correctly', () => {
    cy.log('1. Go to "Mis Comisiones"');
    cy.contains('.option-card', 'Mis Comisiones').click({ force: true });

    cy.log('2. Open the grading grid for the first commission');
    cy.get('button.btn-grade', { timeout: 10000 }).first().click({ force: true });

    cy.log('3. Fill concept and input a grade');
    cy.contains('label', 'Concepto').next('input').type('1er Parcial - E2E');
    cy.get('input.grade-input', { timeout: 10000 }).first().clear().type('8');
    
    cy.log('4. Save progress');
    cy.get('button.btn-primary').contains('Descargar y Recargar').click({ force: true });

    cy.log('5. Verify success notification');
    cy.get('app-alert-message', { timeout: 10000 }).should('be.visible').and('contain.text', 'correctamente');

    cy.log('6. Logout from session');
    cy.get('.profile-btn', { timeout: 10000 }).click({ force: true });
    cy.get('.dropdown-item.logout', { timeout: 10000 }).click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/login');
  });
});
