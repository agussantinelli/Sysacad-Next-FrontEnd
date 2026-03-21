/// <reference types="cypress" />

describe('Admin Analytics and Reports Flow', () => {
  beforeEach(() => {
    cy.login('admin@sysacad.com', '123456');
  });

  it('should verify global statistics and export vacancy data', () => {
    cy.log('1. Navigate to "Estadísticas"');
    cy.contains('.option-card', 'Estadísticas').click({ force: true });

    cy.log('2. Check charts presence');
    cy.get('canvas').should('exist'); // Charts usually use canvas

    cy.log('3. Export list to CSV/Excel');
    cy.contains('button', /Exportar|Descargar/i).first().click({ force: true });

    cy.log('4. Verify no error alerts were triggered');
    cy.get('app-alert-message[type="error"]').should('not.exist');
  });
});
