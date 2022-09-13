const db = require('../config/db')
const express = require('express')
const router = express.Router()
// const base64 = require('base64-arraybuffer')
// const fs = require('fs')


router.get('/:idPet', (req, res) => {
    const idPet = req.params.idPet
    const query = 
        'SELECT * FROM pet\
        WHERE pet.idPet = ?;'
    db.query(query, [idPet], (err, result) => {
        if (err) {
            res.status(500).send()
        }
        res.status(200).json(result)

    })
})

router.post('/', (req, res) => {
    const pet = {...req.body}

    const arrayBufferImg = Buffer.from(pet.image, 'base64')
    const query = 
        'INSERT INTO pet (name, sex, species, breed, size, weight, birthDate, cpfTutor, image)\
         VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);'
    db.query(query, [pet.name, pet.sex, pet.species, pet.breed, 
        pet.size, pet.weight, pet.birthDate, pet.cpfTutor, arrayBufferImg], (err, result) => {
            if (err) {
                console.log('pet/post/ERROR:',err)
                res.status(500).send(err)
                return
            }
            if (result.insertId) {
                res.status(200).json(result)
                return
            }
            res.status(400).send('Error')
                
        })
})

router.put('/', async (req, res) => {
    const pet = {...req.body}
    
    const arrayBufferImg = Buffer.from(pet.image, 'base64')
    // const img = await jimp.read(arrayBufferImg)
    // console.log(img)
    // const myBase64 = Buffer.from(myBuffer, 'binary').toString('base64')

    const query = 
        'CALL update_pet (?, ?, ?, ?, ?, ?, ?, ?, ?,  @output);\
        SELECT @output;'
    db.query(query, [pet.idPet, pet.name, pet.sex, pet.species, pet.breed, 
        pet.size, pet.weight, pet.birthDate, arrayBufferImg], (err, result) => {
            if (err) {
                console.log('pet/put:ERR:',err)
                res.status(500).send(err)
                return
            }
            const [ output ] = result[1]
            if (output['@output'] === 1) {
                res.status(200).send('Pet Atualizado')
                return
            }
            res.status(404).send('Pet não existe')
        })
})

router.delete('/:idPet', (req, res) => {
    const idPet = req.params.idPet
    const query = 
        'CALL delete_pet (?, @output);\
        SELECT @output;'
    db.query(query, [idPet], (err, result) => {
        if (err) {
            res.status(500).send(err)
            return
        }
        const [ output ] = result[1]
            if (output['@output'] === 1) {
                res.status(200).send('Pet Deletado')
                return
            }
            res.status(404).send('Pet não existe')
    })
})

router.get('/all/:cpfTutor', (req, res) => {
    const cpfTutor = req.params.cpfTutor
    const query = 
        'SELECT * FROM pet\
        where pet.cpfTutor = ?;'
    db.query(query, [cpfTutor], (err, result) => {
        if (err) {
            res.status(500).json(err)
            return
        }
        const data = result
        for(d of data) {
            // d['image'] ? d['image'] = Buffer.from(d['image'], 'binary').toString('utf-8') : null
            d['image'] ? d['image'] = Buffer.from(d['image'], 'binary').toString('base64') : null
        }
        res.status(200).json(result)
    })
})

module.exports = router