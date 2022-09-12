const bodyParser = require('body-parser')
const express = require('express')

module.exports = app => {
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(express.json()) // for parsing application/json
    app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
}