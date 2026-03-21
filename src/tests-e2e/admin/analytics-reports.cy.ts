/// <reference types="cypress" />

describe('Admin Analytics and Reports Flow', () => {
  beforeEach(() => {
    cy.login('admin@sysacad.com', '123456');
  });

  it('should verify global statistics and filter data', () => {
    cy.log('1. Navigate to "Estadísticas"');
    cy.contains('.option-card', 'Estadísticas').click({ force: true });
    cy.url().should('include', '/admin/statistics');

    cy.log('2. Check charts presence (SVG/NGX-Charts)');
    // Increase timeout to 15s to allow for API response and chart animation
    cy.get('.ngx-charts', { timeout: 15000 }).should('be.visible');

    cy.log('3. Apply filters and verify loading state');
    cy.get('select').first().select('2026');
    cy.get('button.btn-primary').contains('Actualizar').click({ force: true });
    
    // Check loading spinner appears and then goes away
    cy.get('app-loading-spinner').should('exist');
    cy.get('app-loading-spinner', { timeout: 10000 }).should('not.exist');

    cy.log('4. Verify statistics cards are updated');
    cy.get('.stat-card').should('have.length.at.least', 4);
    cy.get('app-alert-message[type="error"]').should('not.exist');

    cy.log('5. Logout from session');
    cy.get('.profile-btn', { timeout: 10000 }).click({ force: true });
    cy.get('.dropdown-item.logout', { timeout: 10000 }).click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/login');
  });
});
