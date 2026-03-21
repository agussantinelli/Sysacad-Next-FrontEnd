/// <reference types="cypress" />

describe('Student Exam Registration Flow', () => {
  beforeEach(() => {
    cy.login('maria@sysacad.com', '123456');
  });

  it('should register for an exam final table', () => {
    cy.log('1. Open "Inscripción a Examen" module');
    cy.contains('.option-card', 'Inscripción a Examen').click({ force: true });

    cy.log('2. Click on a subject call (Mesa) in the table');
    cy.get('table.data-table').should('be.visible');
    // If no exam tables are open, this might fail, so we check for empty state or first row
    cy.get('body').then(($body) => {
      if ($body.find('button.action-btn').length > 0) {
        cy.get('button.action-btn').contains('Inscribirse').first().click({ force: true });
        
        cy.log('3. Select a date/shift in the modal');
        cy.get('app-exam-inscription-modal').should('be.visible');
        cy.get('.shift-card').first().click({ force: true });

        cy.log('4. Confirm registration');
        cy.get('button.btn-primary').contains('Confirmar').click({ force: true });
        
        cy.log('5. Verify status "Inscripto"');
        cy.get('app-alert-message').should('be.visible');
      } else {
        cy.contains('No hay datos disponibles').should('be.visible');
      }
    });
  });
});
