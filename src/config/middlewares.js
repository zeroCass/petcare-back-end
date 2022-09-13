const bodyParser = require('body-parser')
const express = require('express')

module.exports = app => {
    app.use(express.json({limit: '50mb'}));
    app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));
    // app.use(express.json()); // Used to parse JSON bodies
    // app.use(express.urlencoded()); //Parse URL-encoded bodies
   
}