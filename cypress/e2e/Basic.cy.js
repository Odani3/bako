/// <reference types="cypress"/>

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
    })
    
    const NomeDoVault = "1"
    const nomeDeTx = "To Fuel"
    const adress = "0xb032527ab1e83cd6305a01e7d8da19bffa18300ba05ceb57e1a5373f812e7d53"
    const newAdressBook = "0x1B3817BDcb3E60163f91CAc137c3dcA09deB004b77575AbC8585DCfb78c8e82a"
    const vaultDescription = "Descrição de um vault qualquer para um vault qualquer"
    const personalvaultID = "/0a12157b-d390-4006-80fb-4e23c67ee4b8/vault/f7aed249-c1af-4547-a6f9-b21a71dd4118"

    let randomVaultName;
        before(() =>{
            //hook para puxar os nomes do jSON e joga para uma funçao then
            cy.fixture('names').then((names) => {
                randomVaultName = names[Math.floor(Math.random() * names.length)]
            });
        });
    

//Funcionalidade
describe('Teste ', () => {
    beforeEach(() => {
        cy.visit('https://stg-safe.bako.global/')
        cy.contains('Username').parent().find('input').type('personal');
        cy.contains('button','Login account').click()
            .intercept('POST','https://stg-api.bako.global/auth/sign-in')
            .as('signin')
            .wait('@signin',{timeout:100000})
            cy.get().click()
        })

    it('Criação de vault', () => {

        cy.contains('button','Vault').click().wait(1000)
        cy.contains('button','Create new vault').click()
        cy.contains('div','Search').type('Personal')
        cy.contains("Personal Vault").click({force:true})
        
        cy.get('.chakra-image').click()
        //Criação de vault
        cy.get('.css-0 > .chakra-button').click()
        cy.contains('div','Vault name').type(randomVaultName)
          //.click().contains("Name is required").should('be.visible').wait(400)
        cy.get('textarea[name="description"]').type(vaultDescription)
        cy.contains('button','Continue').click();
        cy.contains('button','Create Vault').click().wait(2000) 
        cy.get('.loading-spinner').should('not.exist');
        cy.contains('button','Done')
            .click()
            .wait(3000)

        cy.contains('div', randomVaultName).should('be.visible')
        cy.contains('div')
            .should('have.text', vaultDescription)
            .should('be.visible')
        cy.url().should('include','/workspace');    
        
        //Criar vault pelo Drawer
        cy.pause()

    })

    it('Navegar pelas Tabs', () => {
        //Navega pelos Vaults
        cy.contains('div','Vaults')
            .click()
            .url()
            .should('include','/vault/me')

        //Navega pelas Transactions≈
        cy.contains('div','Transactions')
            .click()
            .url()
            .should('include', '/transaction/me').wait(1000)
        
        //Navega pela Adress Book
        cy.get('.css-0 > .chakra-stack > :nth-child(2)').click()
        cy.get('.css-0 > .chakra-stack > :nth-child(3)').click()
        cy.contains('div','Address book')
            .click()
            .url()
            .should('include', '/address-book').wait(500)

        cy.get('div.css-1oovyp6') 
            .find('button')
            .eq(0)
            .click()
            .contains('input','Name or Label').type(newAdressBook)
        cy.contains('div','Vaults').click().url().should('include', '/list/vault/me').wait(500)
        cy.contains('button','Back home').click()
            .url().should('include','/home')

    })    

    it.only('Create Transaction', () => { 
        cy.get('.css-8atqhb > .chakra-button').click()
        cy.get('input').eq(0).type(nomeDeTx); 
        cy.get('input').eq(1).type(adress, {force:true})
        cy.get('input').eq(3).type("0,0002",{force:true})
           .intercept('POST','/api/4508058965442560/envelope/?sentry_key=13843504330efb0b44fe38a003161e56&sentry_version=7&sentry_client=sentry.javascript.react%2F8.35.0')
           .as('enabledButton')
           .wait('@enabledButton',{timeout:100000})
        cy.get('button').last().click({force:true}); //solução paleativa
        cy.get('.chakra-stack.css-my99ce button:nth-of-type(1)').click()
            .intercept('POST','/transaction').as('transação')
            .wait('@transação', {timeout:100000})




    })

})