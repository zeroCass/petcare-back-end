const db = require('../config/db')
const express = require('express')
const router = express.Router()


router.get('/', (req, res) => {
    const query = 'select * from employee;'
    db.query(query, (err, result) => {
        if (err) res.status(400).send(err)
        res.status(200).json(result)
    })
})


module.exports = router
