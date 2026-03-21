/// <reference types="cypress" />

describe('Student Enrollment Flow', () => {
  beforeEach(() => {
    cy.login('maria@sysacad.com', '123456');
  });

  it('should complete a course enrollment through the multi-step modal', () => {
    cy.log('1. Open Enrollment module');
    cy.contains('.option-card', 'Inscripción a Cursado').click({ force: true });

    cy.log('2. Search for a subject and click "Inscribirse"');
    // We assume there's at least one subject available in the table
    cy.get('table.data-table').should('be.visible');
    cy.get('button.action-btn').contains('Inscribirse').first().click({ force: true });

    cy.log('3. Select a commission from the modal');
    cy.get('app-inscription-modal').should('be.visible');
    cy.get('.commission-card').first().click({ force: true });

    cy.log('4. Confirm enrollment in the summary modal');
    cy.get('app-inscription-confirmation-modal').should('be.visible');
    cy.get('button.btn-primary').contains('Confirmar').click({ force: true });

    cy.log('5. Verify success alert on Dashboard or redirection');
    cy.get('app-alert-message').should('be.visible').and('contain.text', 'éxito');
  });
});
