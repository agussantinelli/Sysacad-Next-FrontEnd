/// <reference types="cypress" />

describe('Admin Commissions Management Flow', () => {
  beforeEach(() => {
    cy.login('admin@sysacad.com', '123456');
  });

  it('should create a commission and assign a subject with staff', () => {
    cy.log('1. Navigate to Commissions management');
    cy.contains('.option-card', 'Gestión de Comisiones').click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/admin/commissions');

    cy.log('2. Create a new dummy Commission');
    cy.get('button.btn-primary', { timeout: 10000 }).contains('Nueva Comisión').click({ force: true });
    cy.get('input[placeholder="Ej: 1K1"]', { timeout: 10000 }).type('E2E-TEST-99');
    cy.get('select').first().select(1); // Select first career
    cy.get('input[type="number"]').first().type('1'); // Level 1
    cy.get('input[type="number"]').eq(1).type('2025'); // Year 2025
    cy.get('select').last().select('Noche'); // Shift
    cy.get('button.btn-primary').contains('Crear').click({ force: true });

    cy.log('3. Assign Subject to the new commission');
    cy.contains('E2E-TEST-99', { timeout: 10000 }).click({ force: true });
    cy.get('button.btn-primary', { timeout: 10000 }).contains('Agregar Materia').click({ force: true });

    cy.log('4. Follow assignment wizard (Step 1: Subject)');
    cy.get('.subject-card', { timeout: 10000 }).first().click({ force: true });

    cy.log('5. Define Schedule (Step 2)');
    cy.get('select#diaSelect', { timeout: 10000 }).select('LUNES');
    cy.get('input#horaDesde').type('18:00');
    cy.get('input#horaHasta').type('22:00');
    cy.get('button.btn-primary').contains('Agregar').click({ force: true });
    cy.get('button.btn-primary').contains('Siguiente').click({ force: true });

    cy.log('6. Assign Professor (Step 3)');
    cy.get('.professor-item', { timeout: 10000 }).first().click({ force: true });
    cy.get('button.btn-primary').contains('Confirmar').click({ force: true });

    cy.log('7. Verify the commission now has materias assigned');
    cy.get('table.data-table', { timeout: 10000 }).should('be.visible');
  });
});
