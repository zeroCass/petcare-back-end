const db = require('../config/db')
const express = require('express')
const router = express.Router()


const getVet = (email, password) => {
    return new Promise((resolve, reject) => {
        const queryVet = 
        `CALL login_verification_vet(?, ?);`
        db.query(queryVet, [email, password], (err, result) => {
            if (err) {
                reject(err)
            }
            resolve(result[0])  
        })
    })
}

const getAttendat = (email, password) => {
    return new Promise((resolve, reject) => {
        const queryAtt = 
            `CALL login_verification(?, ?);`
        db.query(queryAtt, [email, password], (err, result) => {
            if (err) reject(err)
            resolve(result[0])
        })
    })
}

router.post('/signin', (req, res) => {
    const fetchData = async () => {
        try {
            let response = await getVet(req.body.email, req.body.password)
            if (response.length === 1) {
                res.status(200).json(response)
                return
            }
            response = await getAttendat(req.body.email, req.body.password)
            if (response.length === 1) {
                res.status(200).json(response)
                return
            }
            res.status(404).send('Usuario nao encontrado')

        }catch (e) {
            res.status(400).send(e)
        }
    }
    fetchData()

})


// router.post('/signin', (req, res) => {
//     const query = 
//         'CALL login_verification(?, ?);'
//     db.query(query, [req.body.email, req.body.password], (err, result) => {
//         if (err) {
//             res.status(500).send(err)
//             return
//         }
//         res.status(200).json(result)
//     })
// })

module.exports = router
