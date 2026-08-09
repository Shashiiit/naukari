describe('Update Naukri Profile', () => {
  before(function () {
    //runs once before all tests in this block
    cy.fixture('loginData').then(function (data) {
      this.data = data
    });
  })
  it('should update the profile successfully', function () {
    // Use GitHub Secrets (env vars) if available, otherwise fall back to fixture file
    const username = Cypress.env('NAUKRI_USERNAME') || this.data.username
    const password = Cypress.env('NAUKRI_PASSWORD') || this.data.password
    
    // Go directly to login page
    cy.visit('https://www.naukri.com/nlogin/login')
    cy.wait(5000)
    
    // Fill login form
    cy.get('input[placeholder*="Email"], input[placeholder*="email"], input[placeholder*="Username"]')
      .first().clear().type(username)
    cy.get('input[type="password"]').first().clear().type(password)
    cy.wait(1000)
    
    // Click the Login button and proceed to profile
    cy.contains('button', /login/i, { timeout: 15000 })
      .click({ force: true })
    cy.wait(8000)

    // Directly visit the profile page once login is submitted
    cy.visit('https://www.naukri.com/mnjuser/profile')
    cy.url({ timeout: 30000 }).should('include', '/mnjuser/profile')
    cy.wait(5000)

    const resumeFile = 'Shashidhar_AgenticAI_Final.docx'
    const uploadInputSelectors = [
      '#attachCV',
      'input[type="file"]',
      'input[name*="resume"]',
      'input[id*="resume"]',
      'input[name*="cv"]',
      'input[id*="cv"]',
      'input[name*="attachment"]',
    ].join(',')

    cy.wait(5000)
    cy.screenshot('profile-page-before-upload')

    // Try to find and interact with upload input
    cy.get('body', { timeout: 60000 }).then(($body) => {
      const uploadInput = $body.find(uploadInputSelectors)
      
      if (uploadInput.length > 0) {
        // Upload input found directly
        cy.get(uploadInputSelectors, { timeout: 60000 })
          .first()
          .should('exist')
          .attachFile(resumeFile, { force: true, subjectType: 'input' })
      } else {
        // Try to find and click upload button first
        cy.contains('span, button, a, label, div', /upload|attach|browse|choose|select|replace/i, { timeout: 30000 })
          .first()
          .should('be.visible')
          .click({ force: true, multiple: true })
        
        cy.wait(2000)
        
        // Now try to find and attach to the file input
        cy.get(uploadInputSelectors, { timeout: 60000 })
          .should('exist')
          .attachFile(resumeFile, { force: true, subjectType: 'input' })
      }
    })
    .then(() => {
      // Wait for upload to complete and verify success
      cy.get('.cnt > .head, .upload-success, [class*="success"], [class*="uploaded"]', { timeout: 30000 })
        .should('be.visible')
    })
  })
})
/**
 * To upload a file in Cypress, use the 'cypress-file-upload' plugin.
 * 1. Install it: npm install --save-dev cypress-file-upload
 * 2. Add `import 'cypress-file-upload';` to your support/e2e.js or at the top of your test file.
 * 3. Use `.attachFile()` on the file input element.
 */
