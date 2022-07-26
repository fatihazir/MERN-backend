const express = require('express')
const dotenv = require('dotenv')

//load env vars
dotenv.config({ path: './config/config.env' })

const app = express()

app.get('/api/v1/bootcamps', (req, res) => {
    //directly ends the request
    //res.sendStatus(400)

    //send statu code with json
    res.status(200).json({ success: false, message: 'Show all bootcamps' })

    //send json
    //res.json({ name: "brad" })
})

app.post('/api/v1/bootcamps', (req, res) => {
    res.status(200).json({ success: false, message: 'create new bootcamps' })
})

app.put('/api/v1/bootcamps/:id', (req, res) => {
    res.status(200).json({ success: false, message: 'update bootcamp with id : ' + req.params.id })
})

app.delete('/api/v1/bootcamps/:id', (req, res) => {
    res.status(200).json({ success: false, message: 'delete the bootcamp with id : ' + req.params.id })
})



const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server is up and running for ${process.env.NODE_ENV} mode on port ${PORT}`))