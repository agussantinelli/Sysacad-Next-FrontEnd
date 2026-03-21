/// <reference types="cypress" />

describe('Admin Exam Table Management Flow', () => {
  beforeEach(() => {
    cy.login('admin@sysacad.com', '123456');
  });

  it('should configure an exam call for a subject', () => {
    cy.log('1. Access "Mesas de Examen" management');
    cy.contains('.option-card', 'Mesas de Examen').click({ force: true });

    cy.log('2. Access mesas detail for a future turn');
    // Using May 2026 as it's more likely to be active/editable
    cy.contains('.card', 'Mayo 2026', { timeout: 10000 }).find('button').contains('Ver Mesas').click({ force: true });
    cy.get('button.btn-primary', { timeout: 10000 }).contains('Agregar Mesa').click({ force: true });

    cy.log('3. Step 1: Select Career and Subject');
    cy.contains('label', 'Carrera').next('select').select(1);
    cy.get('input[placeholder*="Nombre de materia"]').type('a'); // Search with "a" to get more results
    cy.get('button').contains('Buscar').click({ force: true });
    
    // Click first result if exists
    cy.get('.result-item', { timeout: 15000 }).first().click({ force: true });

    cy.log('4. Step 2: Set Date and Time');
    cy.contains('label', 'Fecha').next('input').type('2026-05-25');
    cy.contains('label', 'Hora').next('input').type('18:00');
    cy.get('button').contains('Siguiente').click({ force: true });

    cy.log('5. Step 3: Select Professor and Confirm');
    cy.get('.professor-item', { timeout: 10000 }).first().click({ force: true });
    cy.get('button.btn-primary').contains('Confirmar').click({ force: true });
    
    cy.get('app-alert-message', { timeout: 15000 }).should('be.visible');

    cy.log('6. Logout from session');
    cy.get('.profile-btn', { timeout: 10000 }).click({ force: true });
    cy.get('.dropdown-item.logout', { timeout: 10000 }).click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/login');
  });
});
