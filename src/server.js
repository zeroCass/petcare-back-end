require('dotenv').config()
const express = require('express')
const app = express()
const middlewares = require('./config/middlewares')
const routes = require('./config/routes')

middlewares(app)
routes(app)

app.listen(process.env.SERVER_PORT, () => console.log(`Server running on PORT:${process.env.SERVER_PORT}`))

