require('dotenv').config()
const express = require('express')

const path = require('path')

const router = express.Router()

// Route Home
router.get('/', (req, res) => res.sendFile(path.join(path.dirname(__dirname), '/html/index.html')))

const { login, register, verifyToken } = require('../controllers/auth')
const { images, deleteImage } = require('../controllers/image')
const { getJourneys, getJourney, addJourney } = require('../controllers/journey')

const { auth } = require('../middlewares/auth')
const { uploadFile } = require('../middlewares/upload')

// Route Auth
router.post('/login', login)
router.post('/register', register)
router.post('/verify', auth, verifyToken)

// Route Journey
router.get('/journeys', getJourneys)
router.get('/journey/:id', getJourney)
router.post('/journey', auth, addJourney)

// Route Bookmark

//
router.post('/image', uploadFile('image'), images)
router.delete('/image', deleteImage)

module.exports = router
