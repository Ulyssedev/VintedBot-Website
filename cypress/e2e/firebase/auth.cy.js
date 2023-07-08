/// <reference types="cypress" />

describe('test vintedbot', () => {

  it('buy redirect', () => {
    cy.visit('/pricing')
    cy.get('.buybutton').first().click()
    cy.url().should('equal', 'http://localhost:3000/signup')
  })

  it('login', () => {
    if (Cypress.env('uid') === undefined) {
      cy.callFirestore('get', 'users').then((users) => {
        cy.login(users[0].id)
      })
      
    }
    else {
      cy.login(Cypress.env('uid'))
    }

  })

  it('subscribe', () => {
    cy.visit('/pricing')
    cy.wait(500)
    cy.get('.buybutton').first().click()

    cy.intercept('POST', 'https://api.stripe.com/v1/payment_intents/*/confirm', {
      statusCode: 500,
      body: {
        error: true,
      },
    }).as('confirmPayment');

    cy.origin('https://checkout.stripe.com', () => {
      cy.url().should('include', 'https://checkout.stripe.com')
  })
  });

})

