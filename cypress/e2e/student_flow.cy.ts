describe('Student Full Navigation Flow', () => {
  beforeEach(() => {
    // 1. Login
    cy.visit('/login');
    cy.get('#email').type('agustinsantinelli@gmail.com');
    cy.get('#password').type('123456');
    cy.get('.submit-btn').click();
    cy.url().should('include', '/dashboard');
    cy.wait(1000); // Wait for initial dashboard load
  });

  it('should complete the requested academic flow', () => {
    // 2. Inscripciones a cursado -> Volver
    cy.contains('.nav-link', 'Inscripciones').click();
    cy.contains('.nav-dropdown-item', 'Inscripción a Cursado').click();
    cy.url().should('include', '/academic/inscription-course');
    cy.get('.btn-back').click();

    // 3. Inscripción a examen -> Volver
    cy.contains('.nav-link', 'Inscripciones').click();
    cy.contains('.nav-dropdown-item', 'Inscripción a Examen').click();
    cy.url().should('include', '/academic/inscription-exam');
    cy.get('.btn-back').click();

    // 4. Mis inscripciones -> Volver
    cy.contains('.nav-link', 'Inscripciones').click();
    cy.contains('.nav-dropdown-item', 'Mis Inscripciones').click();
    cy.url().should('include', '/academic/my-inscriptions');
    cy.get('.btn-back').click();

    // 5. Estado Académico (Cursado y notas) -> Modal -> Cerrar -> Volver
    cy.contains('.nav-link', 'Consultas').click();
    cy.contains('.nav-dropdown-item', 'Estado Académico').click();
    cy.url().should('include', '/academic/status');
    
    // Abrir modal de historial
    cy.get('.btn-primary').contains('Ver Historial').first().click();
    cy.get('.modal-content').should('be.visible');
    cy.get('.btn-close').click(); // Cierra el modal
    cy.get('.modal-content').should('not.exist');
    
    cy.get('.btn-back').click();

    // 6. Avisos -> Marcar visto -> Volver
    cy.contains('.nav-link', 'Comunicación').click();
    cy.contains('.nav-dropdown-item', 'Avisos').click();
    cy.url().should('include', '/announcements');
    
    // Intenta marcar como leído si hay alguno pendiente
    cy.get('body').then(($body) => {
      if ($body.find('.btn-mark-read').length > 0) {
        cy.get('.btn-mark-read').first().click();
      }
    });
    cy.get('.btn-back').click();

    // 7. Terminar en Mensajes
    cy.contains('.nav-link', 'Comunicación').click();
    cy.contains('.nav-dropdown-item', 'Mensajes').click();
    cy.url().should('include', '/messages');
  });
});
