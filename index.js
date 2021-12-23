const express = require('express')
const xmlParser = require('express-xml-bodyparser')
const app = express()
app.use(express.json())
app.use(xmlParser())

const Controller = require('./controller')

const port = 8003

app.post('/api/retorno-xml-pfacil', Controller.create)

app.use((req, res) => {
    res.status(404).json({status: 404, message: 'url não encontrada'})
})

app.listen(port, () => {
    console.log(`Server Running on port ${port}`)
})
