const Service = require('./database')
const xml = require('xml')

const Controller = {

    async create (req, res){

        let body = req.body

        if(body == {}){
            res.set('Content-type', 'text/xml')
            res.send(xml(error = [{"error": "Nenhuma informação enviada"}], true))
            return
        }

        let codigo = (!body["order"]["codigo"][0]) ? 0 : body["order"]["codigo"][0]
        let transacao = (!body["order"]["transacao"][0]) ? 0 : body["order"]["transacao"][0]
        let status = (!body["order"]["status"][0]) ? '' : body["order"]["status"][0]
        let subtotal = (!body["order"]["subtotal"][0]) ? 0 : body["order"]["subtotal"][0]
        let acrescimo = (!body["order"]["acrescimo"][0]) ? 0 : body["order"]["acrescimo"][0]
        let desconto = (!body["order"]["desconto"][0]) ? 0 : body["order"]["desconto"][0]
        let frete = (!body["order"]["frete"][0]) ? 0 : body["order"]["frete"][0]
        let forma_pagamento = (!body["order"]["forma_pagamento"][0]) ? '' : body["order"]["forma_pagamento"][0]
        let parcelas = (!body["order"]["parcelas"][0]) ? 0 : body["order"]["parcelas"][0]
        let custo = (!body["order"]["custo"][0]) ? 0 : body["order"]["custo"][0]
        let postToken = (!body["order"]["posttoken"][0]) ? 0 : body["order"]["posttoken"][0]

        await Service.add(codigo, transacao, status, subtotal, acrescimo, desconto, frete, forma_pagamento, parcelas, custo, postToken)

        await Service.updateInvoice(status, desconto, codigo)

        if(status == 'Autorizada'){

            let fatura = await Service.invoiceId(codigo)

            let carteira = await Service.findByIdCart(fatura.id_shopkeeper)

            let value = parseInt(fatura.coins) + parseInt(carteira.amount)

            await Service.amountUpdate(value, fatura.id_shopkeeper)

            let shopkeeper = await Service.findByIdshopkeepers(fatura.id_shopkeeper)

            //Insere a informação da Compra no hitorico financeiro
            await Service.paymentShopkeeperCampaign(shopkeeper.email, parseInt(fatura.coins), shopkeeper.name, 'Compra de Moedas', 'compra')
        }

        res.json('successfully received')          
    }
}

module.exports = Controller