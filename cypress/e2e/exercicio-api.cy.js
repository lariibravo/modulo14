/// <reference types="cypress">
import contrato from '../contracts/usuario.contract'

import { faker } from '@faker-js/faker';



describe('Testes da Funcionalidade Usuários', () => {

    it('Deve validar contrato de usuários', () => {
         //TODO: 
         cy.request('usuarios').then(response => {
            return contrato.validateAsync(response.body)
        })
    });

    

    it('Deve listar usuários cadastrados', () => {
         cy.request({
            method: 'GET',
            url:'usuarios'
        }).then((response) =>{
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('usuarios')
        })
    });

    it('Deve cadastrar um usuário com sucesso', () => {
        let email = faker.internet.email()

         cy.cadastrarUsuario("Larissa teste", email, "123").then(response => {
            expect(response.status).to.equal(201)            
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
         })
    });

    it('Deve validar um usuário com email inválido', () => {
        
         cy.cadastrarUsuario("Larissa", "larissatestee@qa.com.br", "123")
            .then(response => {
                expect(response.status).to.equal(400)
                expect(response.body.message).to.equal('Este email já está sendo usado')
            })

    });

    it('Deve editar um usuário previamente cadastrado', () => {
        let email = faker.internet.email()
        cy.cadastrarUsuario("Larissa teste", email, "123").then(response => {
            let id = response.body._id

            cy.request({
                method: 'PUT',
                url: `usuarios/${id}`,
                body: {
                    "nome": "Fulano da Silva",
                    "email": email,
                    "password": "teste",
                    "administrador": "true"
                  }
            }).then(response => {
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })

        })

        
    });

    it('Deve deletar um usuário previamente cadastrado', () => {
        let email = faker.internet.email()
        cy.cadastrarUsuario("Larissa teste", email, "123").then(response => {
            let id = response.body._id

            cy.request({
                method: 'DELETE',
                url: `usuarios/${id}`,
                body: {
                    "nome": "Fulano da Silva",
                    "email": email,
                    "password": "teste",
                    "administrador": "true"
                  }
            }).then(response => {
                expect(response.body.message).to.equal('Registro excluído com sucesso')
            })

        })
    });


});