/// <reference types="cypress" />

describe('Professor Final Exam Grading Flow', () => {
  beforeEach(() => {
    cy.login('laura@sysacad.com', '123456');
  });

  it('should record exam results and close the Acta', () => {
    cy.log('1. Access "Mesas de Examen"');
    cy.contains('.option-card', 'Mesas de Examen').click({ force: true });

    cy.log('2. Access specific mesa details');
    cy.contains('button', 'Ver Materias').first().click({ force: true });
    cy.contains('button', 'Corregir Examen', { timeout: 10000 }).first().click({ force: true });

    cy.log('3. Register exam grades (Estado, Nota, Tomo, Folio)');
    cy.get('select.status-select', { timeout: 10000 }).first().select('APROBADO', { force: true });
    cy.get('input.grade-input', { timeout: 10000 }).first().clear().type('10');
    cy.get('input.folio-input[placeholder="T"]', { timeout: 10000 }).first().clear().type('123');
    cy.get('input.folio-input[placeholder="F"]', { timeout: 10000 }).first().clear().type('456');

    cy.log('4. Save exam results');
    cy.get('button.btn-save', { timeout: 25000 }).contains('Guardar Notas').click({ force: true });

    cy.get('app-alert-message', { timeout: 10000 }).should('be.visible').and('contain.text', 'correctamente');

    cy.log('5. Verify table is now "Cerrada"');
    cy.contains('span.badge', 'Cerrada', { timeout: 10000 }).should('be.visible');

    cy.log('6. Logout from session');
    cy.get('.profile-btn', { timeout: 10000 }).click({ force: true });
    cy.get('.dropdown-item.logout', { timeout: 10000 }).click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/login');
  });
});
