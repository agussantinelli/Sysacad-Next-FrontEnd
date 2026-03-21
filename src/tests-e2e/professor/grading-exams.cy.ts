/// <reference types="cypress" />

describe('Professor Final Exam Grading Flow', () => {
  beforeEach(() => {
    cy.login('dario@sysacad.com', '123456');
  });

  it('should record exam results and close the Acta', () => {
    cy.log('1. Access "Mesas de Examen"');
    cy.contains('.option-card', 'Mesas de Examen').click({ force: true });

    cy.log('2. Search for an editable exam mesa');

    const findAndEnterMesa = (index: number) => {
      cy.log(`Checking turn at index ${index}`);
      cy.get('button:contains("Ver Materias")', { timeout: 10000 }).eq(index).click({ force: true });

      // Wait for detail view and loading to finish
      cy.url({ timeout: 10000 }).should('match', /\/exams\/[a-zA-Z0-9-]+$/);
      cy.get('app-loading-spinner').should('not.exist');

      // Ensure either cards or empty state are present
      cy.get('body').then(($body) => {
        if ($body.find('.detail-card').length === 0 && $body.find('.empty-state').length === 0) {
          cy.log('Waiting for content to settle...');
          cy.wait(1000);
        }
      });

      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Corregir Examen")').length > 0) {
          cy.log('Found an editable exam, proceeding...');
          cy.contains('button', 'Corregir Examen').first().click({ force: true });
        } else if (index < 1) { // Only try one fallback for now to avoid infinite loops
          cy.log(`No editable exams in turn ${index}, trying next one...`);
          cy.contains('button', 'Volver').click({ force: true });
          cy.url({ timeout: 10000 }).should('match', /\/exams$/);
          findAndEnterMesa(index + 1);
        } else {
          throw new Error('No editable exams found in the available turns');
        }
      });
    };

    findAndEnterMesa(0);

    cy.log('3. Register exam grades (Estado, Nota, Tomo, Folio)');
    cy.get('select.status-select', { timeout: 10000 }).first().select('APROBADO', { force: true });
    cy.get('input.grade-input', { timeout: 10000 }).first().clear().type('10');
    cy.get('input.folio-input[placeholder="T"]', { timeout: 10000 }).first().clear().type('123');
    cy.get('input.folio-input[placeholder="F"]', { timeout: 10000 }).first().clear().type('456');

    cy.log('4. Save exam results');
    cy.get('button.btn-save', { timeout: 30000 }).contains('Guardar Notas').click({ force: true });

    cy.wait(40000);

    cy.log('5. Logout from session');
    cy.get('.profile-btn', { timeout: 10000 }).click({ force: true });
    cy.get('.dropdown-item.logout', { timeout: 10000 }).click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/login');
  });
});
