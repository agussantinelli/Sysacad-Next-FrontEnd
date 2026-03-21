/// <reference types="cypress" />

describe('Student Enrollment Flow', () => {
  beforeEach(() => {
    cy.login('maria@sysacad.com', '123456');
  });

  it('should complete a course enrollment through the multi-step modal', () => {
    cy.log('1. Open Enrollment module');
    cy.contains('.option-card', 'Inscripción a Cursado').click({ force: true });

    cy.log('2. Search for a subject and click "Inscribirse"');
    // Wait for data table to load
    cy.get('table.data-table', { timeout: 10000 }).should('be.visible');
    cy.get('button.action-btn').contains('Inscribirse').first().click({ force: true });

    cy.log('3. Select a commission from the modal');
    cy.get('app-inscription-modal', { timeout: 10000 }).should('be.visible');
    cy.get('.commission-card', { timeout: 10000 }).first().click({ force: true });

    cy.log('4. Confirm enrollment in the summary modal');
    cy.get('app-inscription-confirmation-modal', { timeout: 10000 }).should('be.visible');
    cy.get('button.btn-primary').contains('Confirmar').click({ force: true });

    cy.log('5. Verify success alert');
    cy.get('app-alert-message', { timeout: 10000 }).should('be.visible').and('contain.text', 'éxito');

    cy.log('6. Logout from session');
    cy.get('.profile-btn', { timeout: 10000 }).click({ force: true });
    cy.get('.dropdown-item.logout', { timeout: 10000 }).click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/login');
  });
});
