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

    cy.wait(5000)
    cy.screenshot('profile-page-before-upload')

    // Strategy 1: Try direct file input attachment first
    cy.get('input[type="file"]', { timeout: 60000 }).then(($fileInputs) => {
      if ($fileInputs.length > 0) {
        cy.wrap($fileInputs.first())
          .attachFile(resumeFile, { force: true })
          .then(() => {
            cy.log('✓ File attached successfully via direct input')
          })
      } else {
        cy.log('No direct file input found, trying alternative approach')
        throw new Error('Need alternative approach')
      }
    }).catch(() => {
      // Strategy 2: Look for upload button and click it
      cy.get('body').then(($body) => {
        // Try multiple button/link selectors
        const uploadButtonSelectors = [
          'button:contains("Upload")',
          'button:contains("Attach")',
          'button:contains("Browse")',
          'label:contains("Upload")',
          'label:contains("Attach")',
          '[role="button"]:contains("Upload")',
          'a:contains("Upload")',
          'a:contains("Attach")',
          '.upload-button',
          '.attach-button',
          '[class*="upload"]',
          '[class*="attach"]'
        ]
        
        let found = false
        for (let selector of uploadButtonSelectors) {
          if ($body.find(selector).length > 0) {
            cy.get(selector).first().click({ force: true })
            cy.log(`✓ Clicked upload button: ${selector}`)
            found = true
            break
          }
        }
        
        if (!found) {
          cy.log('Could not find upload button, will try direct file input as fallback')
        }
      })
      
      cy.wait(2000)
      
      // Try to find and attach file
      cy.get('input[type="file"]', { timeout: 60000 })
        .attachFile(resumeFile, { force: true })
    })

    // Wait for upload completion
    cy.get('body', { timeout: 30000 }).should('exist')
    cy.wait(3000)
    cy.screenshot('profile-page-after-upload')
  })
})
/**
 * To upload a file in Cypress, use the 'cypress-file-upload' plugin.
 * 1. Install it: npm install --save-dev cypress-file-upload
 * 2. Add `import 'cypress-file-upload';` to your support/e2e.js or at the top of your test file.
 * 3. Use `.attachFile()` on the file input element.
 */
