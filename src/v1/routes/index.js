require('dotenv').config()
const express = require('express')

const path = require('path')

const router = express.Router()

// Route Home
router.get('/', (req, res) => res.sendFile(path.join(path.dirname(__dirname), '/html/index.html')))

const { login, register, verifyToken } = require('../controllers/auth')
const { addBookmark, deleteBookmark } = require('../controllers/bookmark')
const { addImage, deleteImage, getImages } = require('../controllers/image')
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
router.post('/bookmark', auth, addBookmark)
router.delete('/bookmark/:id', auth, deleteBookmark)

//
router.get('/images', auth, getImages)
router.post('/image', auth, uploadFile('image'), addImage)
router.delete('/image', auth, deleteImage)

module.exports = router
