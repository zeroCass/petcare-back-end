const db = require('../config/db')
const express = require('express')
const router = express.Router()
const moment = require('moment')

// get all consultations data
router.get('/', (req, res) => {
    const query =
        'SELECT * FROM consulation_data;'
    db.query(query, (err, result) => {
        if (err) {
            console.log('consultation.get:ERROR:', err)
            return res.status(500).send(err)
        }
        return res.status(200).json(result)
    })
})

router.post('/', (req, res) => {
    const consultation = {...req.body}
    consultation.consultationDateTime = moment(new Date(consultation.consultationDateTime)).format('YYYY[-]MM[-]DD HH[:]mm[:]ss')
    const query = 
        'CALL register_consultation (?, ?, ?, ?, ?, @output);\
        SELECT @output;'
    db.query(query, [consultation.consultationDateTime, 
        consultation.idVet, consultation.idPet, consultation.status, consultation.price], (err, result) => {
            if (err) {
                console.log('consultation.post:ERROR:', err)
                return res.status(500).send(err)
            }
            const [ output ] = result[1]
            if (output['@output'] === 1) {
                return res.status(200).send('Consulta Registrada')
                
            }
            return res.status(404).send('Erro ao registrar consulta')
        })
})

router.delete('/:consultationDateTime/:idPet/:idVet', (req, res) => {
    const consultation = req.params
    consultation.consultationDateTime = consultation.consultationDateTime.replace(/ /g,'')
    consultation.consultationDateTime = moment(new Date(consultation.consultationDateTime)).format('YYYY[-]MM[-]DD HH[:]mm[:]ss')

    const query = 
        'CALL delete_consultation (?, ?, ?, @output);\
        SELECT @output;'
    db.query(query, [consultation.consultationDateTime, 
        consultation.idVet, consultation.idPet], (err, result) => {
            if (err) {
                console.log('consultation.delete:ERROR:', err)
                return res.status(500).send(err)
            }

            const [ output ] = result[1]
            if (output['@output'] === 1) {
                return res.status(200).send('Consulta Deletada')
                
            }
            return res.status(404).send('Erro ao deletar consulta')
        })
})

router.put('/', (req, res) => {
    const consultation = {...req.body}
    consultation.consultationDateTime = moment(new Date(consultation.consultationDateTime)).format('YYYY[-]MM[-]DD HH[:]mm[:]ss')

    const query = 
        'CALL update_consultation (?, ?, ?, ?, ?, @output);\
        SELECT @output;'
    db.query(query, [consultation.consultationDateTime, 
        consultation.idVet, consultation.idPet, consultation.status, consultation.price], (err, result) => {
            if (err) {
                console.log('consultation.put:ERROR:', err)
                return res.status(500).send(err)
            }
            const [ output ] = result[1]
            if (output['@output'] === 1) {
                return res.status(200).send('Consulta Atualizada')
                
            }
            return res.status(404).send('Erro ao atualizar consulta')
        })
})

module.exports = router