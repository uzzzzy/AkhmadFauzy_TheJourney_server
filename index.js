require('dotenv').config()

//config
const apiVersion = 1
const port = process.env.PORT || 5000

//
const express = require('express')

const app = express()

const router = require(`./src/v${apiVersion}/routes`)

const cors = require('cors')

// run
app.use(cors())

app.use('/uploads', express.static('uploads'))

app.use(express.urlencoded({ extended: true }))

app.use(express.json())

app.use(`/api/v${apiVersion}`, router)

app.use(express.static(__dirname + '/html'))

app.listen(port, () => console.log(`Listening on port ${port}`))
