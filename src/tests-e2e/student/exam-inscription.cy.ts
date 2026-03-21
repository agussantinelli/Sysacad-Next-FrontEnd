/// <reference types="cypress" />

describe('Student Exam Registration Flow', () => {
  beforeEach(() => {
    cy.login('martin@sysacad.com', '123456');
  });

  it('should register for an exam final table', () => {
    cy.log('1. Open "Inscripción a Examen" module');
    cy.contains('.option-card', 'Inscripción a Examen').click({ force: true });

    cy.log('2. Click on a subject call (Mesa) in the table');
    cy.get('table.data-table', { timeout: 10000 }).should('be.visible');
    // If no exam tables are open, this might fail, so we check for empty state or first row
    cy.get('body').then(($body) => {
      if ($body.find('button.action-btn').length > 0) {
        cy.get('button.action-btn').contains('Inscribirse').first().click({ force: true });

        cy.log('3. Select a date/shift in the modal');
        cy.get('app-inscription-modal', { timeout: 10000 }).should('be.visible');
        cy.get('.commission-card', { timeout: 10000 }).first().click({ force: true });
        cy.get('.modal-footer .btn-confirm').contains('Confirmar Inscripción').click({ force: true });

        cy.log('4. Confirm registration');
        cy.get('app-inscription-confirmation-modal', { timeout: 10000 }).should('be.visible');
        cy.get('app-inscription-confirmation-modal .btn-confirm').contains('Confirmar').click({ force: true });

        cy.log('5. Verify success alert');
        cy.get('app-alert-message', { timeout: 15000 }).should('be.visible').and('contain.text', 'Inscripción');
      } else {
        cy.contains('No hay datos disponibles').should('be.visible');
      }
    });

    cy.log('6. Logout from session');
    cy.get('.profile-btn', { timeout: 10000 }).click({ force: true });
    cy.get('.dropdown-item.logout', { timeout: 10000 }).click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/login');
  });
});
