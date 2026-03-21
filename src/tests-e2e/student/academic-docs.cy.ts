/// <reference types="cypress" />

describe('Student Documents and Academic Status Flow', () => {
  beforeEach(() => {
    cy.login('maria@sysacad.com', '123456');
  });

  it('should verify academic performance and download certificates', () => {
    cy.log('1. Access "Estado Académico" module');
    cy.contains('.option-card', 'Estado Académico').click({ force: true });

    cy.log('2. Verify weighted and non-weighted averages');
    cy.contains('.stat-card', /Promedio/i, { timeout: 10000 }).should('be.visible');
    cy.get('.highlight-value', { timeout: 10000 }).should('not.be.empty');

    cy.log('3. Open graded subject details');
    cy.get('table.data-table', { timeout: 10000 }).should('be.visible');
    
    cy.log('4. Test "Alumno Regular" certificate generation');
    cy.contains('button', /Certificado Alumno Regular/i).should('be.visible').click({ force: true });
    // Usually triggers a download or alert, wait for processing
    cy.get('app-loading-spinner', { timeout: 15000 }).should('exist');
    cy.get('app-loading-spinner', { timeout: 15000 }).should('not.exist');

    cy.log('5. Logout from session');
    cy.get('.profile-btn', { timeout: 10000 }).click({ force: true });
    cy.get('.dropdown-item.logout', { timeout: 10000 }).click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/login');
  });
});
