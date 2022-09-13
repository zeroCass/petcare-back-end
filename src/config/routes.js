const users = require('../api/users')
const auth = require('../api/auth')
const client = require('../api/client')
const pet = require('../api/pet')
const consultation = require('../api/consultation')

module.exports = app => {
    app.use('/users', users)
    app.use('/auth', auth)
    app.use('/client', client)
    app.use('/pet', pet)
    app.use('/consultation', consultation)
}