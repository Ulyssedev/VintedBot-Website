/// <reference types="cypress" />

describe('test vintedbot', () => {

  it('buy redirect', () => {
    cy.visit('http://localhost:3000/pricing')
    cy.get('.buybutton').first().click()
    cy.url().should('equal', 'http://localhost:3000/signup')
  })

})

