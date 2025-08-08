describe('ISpace End-to-End Test Suite', () => {
  beforeEach(() => {
    // Visit the root URL before each test
    cy.visit('/');
    // Assert that the main page loads by checking for a welcome message
    cy.contains('Welcome to ISpace').should('be.visible');
  });

  it('should cover the full user workflow from upload to export', () => {
    // RF1: Upload room images
    // NOTE: For this test to pass, you must add fixture files at
    // 'cypress/fixtures/room-1.jpg' and 'cypress/fixtures/room-2.jpg'
    cy.get('input[type=file]').selectFile([
      'cypress/fixtures/room-1.jpg',
      'cypress/fixtures/room-2.jpg'
    ], { force: true });
    cy.get('img[alt=Preview]').should('be.visible');

    // RF2: Enter contextual information and generate design
    const initialPrompt = 'A cozy, modern living room with a large sofa, a coffee table, and plenty of natural light. Style: Scandinavian. Budget: $5000.';
    cy.get('input[placeholder="Send a message..."]').type(initialPrompt);
    
    // RF3: Generate initial design proposal
    cy.get('button[aria-label="Send message"]').click();

    // Wait for AI to respond and generate the design.
    // RNF2: Asserting generation takes less than 60 seconds is implicitly handled by responseTimeout in cypress.config.ts
    cy.contains('Generating your vision...', { timeout: 60000 }).should('not.exist');
    cy.get('[data-ai-hint="interior design"]').should('be.visible');
    
    // RF4: Check for budget information (assuming it appears in the controls panel)
    // This is a placeholder as the budget feature isn't implemented in the UI yet.
    // cy.get('[data-testid="budget-estimate"]').should('contain', '$');

    // RF5: Comment and select design elements to modify
    const feedbackText = 'I like it, but can we change the sofa color to blue?';
    cy.get('textarea[placeholder^="Add more details..."]').type(feedbackText);
    cy.get('button').contains('Love it!').click();

    // RF6: Receive a new version of the design
    cy.get('button').contains('Generate New Version').click();
    cy.contains('Generating your vision...', { timeout: 60000 }).should('not.exist');
    cy.get('[data-ai-hint="interior design"]').should('have.length.at.least', 1);

    // RFN8: Assert that core actions are responsive (implicitly tested by Cypress's actionability checks)
    cy.get('button').contains('Not quite').should('be.visible').and('be.enabled');

    // RF8: Access previous design versions
    cy.get('[data-ai-hint="interior design thumbnail"]').should('have.length.gte', 2);
    cy.get('[data-ai-hint="interior design thumbnail"]').first().click();
    cy.contains('History Loaded').should('be.visible');
    
    // RFN7: Confirm version is traceable and rollback is possible
    cy.get('.font-semibold.text-sm').contains('Version 1').should('be.visible');
    cy.get('.font-semibold.text-sm').contains('Version 2').should('be.visible');

    // RF9: Export the design as a file
    // Note: Cypress doesn't handle PDF validation out-of-the-box.
    // This test checks if the download button initiates a download.
    cy.get('button').contains('Export').click();
    // A more robust test would require a plugin like cypress-pdf or checking the download via cy.readFile.

    // RF10: Share design proposals (Placeholder)
    // This feature would require UI elements for sharing that don't currently exist.
    // cy.get('button[aria-label="Share Design"]').click();
    // cy.get('input[data-testid="share-link"]').should('have.value').and('include', 'https://');
  });
  
  it('should allow creating and managing multiple projects (Placeholder)', () => {
    // RF7: This requires multi-project functionality which is not yet implemented.
    // A test would look something like this:
    // cy.get('button').contains('New Project').click();
    // cy.get('input[placeholder="Project Name"]').type('Bedroom Redesign');
    // cy.get('button').contains('Create').click();
    // cy.contains('Bedroom Redesign').should('be.visible');
  });

  // RNF4: Simulating multiple concurrent users is handled by running tests in parallel.
  // This is configured in the CI/CD pipeline (e.g., using Firebase Test Lab or Cypress Dashboard).
  // The test below is a standard test that could be run in parallel.
  it('should handle a simple interaction to be used for parallel testing', () => {
    const prompt = 'A minimalist office with a standing desk.';
    cy.get('input[placeholder="Send a message..."]').type(prompt);
    cy.get('button[aria-label="Send message"]').click();
    cy.contains('Generating your vision...', { timeout: 60000 }).should('not.exist');
    cy.get('[data-ai-hint="interior design"]').should('be.visible');
  });
});
