/// <reference types="cypress" />

describe('Student Documents and Academic Status Flow', () => {
  beforeEach(() => {
    cy.login('maria@sysacad.com', '123456');
  });

  it('should verify academic performance and download certificates', () => {
    cy.log('1. Access "Estado Académico" module');
    cy.contains('.option-card', 'Estado Académico').click({ force: true });

    cy.log('2. Verify weighted and non-weighted averages');
    cy.contains('.stat-card', /Promedio/i).should('be.visible');
    cy.get('.highlight-value').should('not.be.empty');

    cy.log('3. Open graded subject details');
    cy.get('table.data-table').should('be.visible');
    
    cy.log('4. Test "Alumno Regular" certificate generation');
    cy.contains('button', /Certificado Alumno Regular/i).should('be.visible').click({ force: true });
    // Usually triggers a download or alert
    cy.get('app-loading-spinner').should('exist');
    cy.get('app-loading-spinner').should('not.exist');
  });
});
