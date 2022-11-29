/// <reference types="cypress">

import contrato from '../contracts/produtos.contract'

describe('Teste da funcionalidade Produtos', () => {

    let token

    before(() => {
        cy.token('larissateste@qa.com.br', 'teste').then(tkn => {
            token = tkn
        })
    });

    it('Deve validar contrato de produtos', () => {
        cy.request('produtos').then(response => {
            return contrato.validateAsync(response.body)
        })
    });

    it('Listar Produtos', () => {
        cy.request({
            method: 'GET',
            url:'http://localhost:3000/produtos'
        }).then((response) =>{
           // expect(response.body.produtos[0].nome).to.equal('Logitech MX Vertical')
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('produtos')
            expect(response.duration).to.be.lessThan(150)
        })
    });

    it('Cadastrar Produto', () => {
        let produto = `Produto EBAC ${Math.floor(Math.random() * 10000000)}`

        cy.request({
            method: 'POST',
            url: 'produtos',
            body: {
                "nome": produto,
                "preco": 470,
                "descricao": "Produto Novo",
                "quantidade": 381
              },
            headers: {authorization: token}
        }).then((response) =>{
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })
    });

    it('Deve validar mensagem de erro ao cadastrar Produto Repetido', () => {
        cy.cadastrarProdutos(token, "Produto EBAC 5566947", 250, "Descrição do produto novo", 180).then((response) =>{
            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal('Já existe produto com esse nome')
        })
    });

    it('Deve editar um produto já cadastrado', () => {
        cy.request('produtos').then(response =>{
            let id = response.body.produtos[0]._id
          //  cy.log(response.body.produtos[0]._id)
            cy.request({
                method: 'PUT',
                url: `produtos/${id}`,
                headers: {authorization: token},
                body: {
                    "nome": "Produto editado 1",
                    "preco": 470,
                    "descricao": "Mouse",
                    "quantidade": 381
                  }
            }).then(response => {
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })
        })
    });

    it('Deve editar um produto cadastrado breviamente', () => {
        let produto = `Produto EBAC ${Math.floor(Math.random() * 10000000)}`
        cy.cadastrarProdutos(token, produto, 250, "Descrição do produto novo", 180).then(response => {

            let id = response.body._id

            cy.request({
                method: 'PUT',
                url: `produtos/${id}`,
                headers: {authorization: token},
                body: {
                    "nome": produto,
                    "preco": 470,
                    "descricao": "Mouse",
                    "quantidade": 381
                  }
            }).then(response => {
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })
        })
    });

    it('Deve deletar um produto breviamente cadastrado', () => {
        let produto = `Produto EBAC ${Math.floor(Math.random() * 10000000)}`
        cy.cadastrarProdutos(token, produto, 250, "Descrição do produto novo", 180).then(response => {

            let id = response.body._id

            cy.request({
                method: 'DELETE',
                url: `produtos/${id}`,
                headers: {authorization: token}
            }).then(response => {
                expect(response.body.message).to.equal('Registro excluído com sucesso')
            })
        })
    });
    
});