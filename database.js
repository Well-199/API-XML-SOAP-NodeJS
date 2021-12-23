const { QueryTypes } = require('sequelize')
const { sequelize } = require('./db.connection')

const Service = {

    add: async (codigo, transacao, status, subtotal, acrescimo, desconto, frete, forma_pagamento, parcelas, custo, postToken) => {
        const query = `
            INSERT INTO retorno_pfacil 
                (codigo, transacao, status, subtotal, acrescimo, desconto, frete, forma_pagamento, parcelas, custo, postToken)
            VALUES (("${codigo}"), ("${transacao}"), ("${status}"), ("${subtotal}"), 
                    ("${acrescimo}"), ("${desconto}"), ("${frete}"), ("${forma_pagamento}"), 
                    ("${parcelas}"), ("${custo}"), ("${postToken}"))`
        const result = await sequelize.query(query, {
          raw: false,
          type: QueryTypes.INSERT
        })
        return result
    },

    updateInvoice: async (status, discount, codigo) => {
        const query = `
        UPDATE invoices SET status="${status}", discount="${discount}", updatedAt=(CURRENT_TIMESTAMP) WHERE (cod_invoice = ${codigo})`
        const result = await sequelize.query(query, {
            raw: false,
            type: QueryTypes.UPDATE
        })
        return result
    },

    invoiceId: async (id) => {
        const query = `SELECT * FROM invoices WHERE (cod_invoice = ("${id}"))`
        const result = await sequelize.query(query, {
            raw: false,
            type: QueryTypes.SELECT
        })
        return result[0]
    },

    findByIdCart: async (id) => {
        const query = `SELECT * FROM store_cart where id_store="${id}"`
        const result = await sequelize.query(query, {
            raw: false,
            type: QueryTypes.SELECT
        })
        return result[0]
    },

    amountUpdate: async (amount, id_store) => {
        const query = `UPDATE store_cart SET amount="${amount}", updatedAt=(CURRENT_TIMESTAMP) WHERE (id_store = ${id_store})`
        const result = await sequelize.query(query, {
            raw: false,
            type: QueryTypes.UPDATE
        })
        return result
    },

    // Inseri dados da compra de campanha no historico financeiro
    paymentShopkeeperCampaign: async (email, valor, nome, descricao, tipo) => {
        const query = `
        INSERT INTO financial_statement (email_origem, email, valor, nome_origem, nome_recebimento, descricao, tipo, data_lancamento) 
        VALUES 
        (("${email}"), ("${email}"), ("${valor}"), ("${nome}"), ("${nome}"), ("${descricao}"), ("${tipo}"), (CURRENT_TIMESTAMP))`
        const result = await sequelize.query(query, {
            raw: false,
            type: QueryTypes.INSERT
        })
        return result
    },

    // Retorna um Lojista pelo ID FIND_BY_LOJISTA FIND_BY_SHOPKEEPERS
    findByIdshopkeepers: async (id) => {
        const query = `SELECT * FROM shopkeepers where id="${id}"`
        const result = await sequelize.query(query, {
            raw: false,
            type: QueryTypes.SELECT
        })
        return result[0] //Primeiro elemento para retornar false ao inves de um array vazio
    },

}

module.exports = Service