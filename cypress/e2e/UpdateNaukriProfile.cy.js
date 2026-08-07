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
    
    // Click the Login button
    cy.contains('button', 'Login').click()
    cy.wait(8000)
    
    // Navigate to profile
    cy.visit('https://www.naukri.com/mnjuser/profile')
    cy.wait(5000)
    cy.get('#attachCV', { timeout: 15000 })
      .attachFile("Shashidhar_AgenticAI_Final.docx")
      .then(() => {
        cy.get('.cnt > .head').should('be.visible')
      })
  })
})
/**
 * To upload a file in Cypress, use the 'cypress-file-upload' plugin.
 * 1. Install it: npm install --save-dev cypress-file-upload
 * 2. Add `import 'cypress-file-upload';` to your support/e2e.js or at the top of your test file.
 * 3. Use `.attachFile()` on the file input element.
 */