/// <reference types="cypress" />

describe('Professor Final Exam Grading Flow', () => {
  beforeEach(() => {
    cy.login('laura@sysacad.com', '123456');
  });

  it('should record exam results and close the Acta', () => {
    cy.log('1. Access "Mesas de Examen"');
    cy.contains('.option-card', 'Mesas de Examen').click({ force: true });

    cy.log('2. Open a specific exam table for grading');
    cy.get('button.btn-action', { timeout: 10000 }).contains('Calificar').first().click({ force: true });

    cy.log('3. Register exam grades');
    cy.get('input.grade-input', { timeout: 10000 }).first().clear().type('10');

    cy.log('4. Close the session definitively');
    cy.get('button.btn-close-acta', { timeout: 10000 }).click({ force: true });
    cy.get('button.btn-confirm', { timeout: 10000 }).click({ force: true });

    cy.log('5. Verify table is now "Cerrada"');
    cy.contains('span.badge', 'Cerrada', { timeout: 10000 }).should('be.visible');
  });
});
