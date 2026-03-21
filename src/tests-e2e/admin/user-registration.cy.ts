/// <reference types="cypress" />

describe('Admin User Management Flow', () => {
  beforeEach(() => {
    cy.login('admin@sysacad.com', '123456');
  });

  it('should register a new student and verify their creation', () => {
    cy.log('1. Go to "Gestión de Usuarios"');
    cy.contains('.option-card', 'Gestión de Usuarios').click({ force: true });
    cy.url().should('include', '/admin/users');

    cy.log('2. Open creation form');
    cy.get('button.btn-create').click({ force: true });
    cy.url().should('include', '/admin/users/create');

    cy.log('3. Fill student registration form');
    const randomSuffix = Math.floor(Math.random() * 10000);
    cy.get('input[placeholder*="Nombre"]').type('TestStudent');
    cy.get('input[placeholder*="Apellido"]').type(`User_${randomSuffix}`);
    cy.get('input[placeholder*="Email"]').type(`student_${randomSuffix}@sysacad.com`);
    cy.get('input[placeholder*="DNI"]').type(`4000${randomSuffix}`);
    cy.get('select').select('ESTUDIANTE');

    cy.log('4. Submit registration');
    cy.get('button.btn-primary').contains('Crear').click({ force: true });

    cy.log('5. Validate creation success in the list');
    cy.get('app-alert-message').should('be.visible').and('contain.text', 'éxito');
    cy.contains(`User_${randomSuffix}`).should('be.visible');
  });
});
