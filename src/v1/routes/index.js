require('dotenv').config()
const express = require('express')

const path = require('path')

const router = express.Router()

// Route Home
router.get('/', (req, res) => res.sendFile(path.join(path.dirname(__dirname), '/html/index.html')))

const { login, register } = require('../controllers/auth')

// Route Auth
router.post('/login', login)
router.post('/register', register)

module.exports = router
