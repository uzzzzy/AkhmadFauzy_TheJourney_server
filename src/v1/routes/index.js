require('dotenv').config()
const express = require('express')

const path = require('path')

const router = express.Router()

// Route Home
router.get('/', (req, res) => res.sendFile(path.join(path.dirname(__dirname), '/html/index.html')))

// Controllers
const { login, register, verifyToken } = require('../controllers/auth')
const { getUser, updateUser } = require('../controllers/user')
const { getImages, addImage, deleteImage } = require('../controllers/image')
const { getJourneys, getJourney, addJourney } = require('../controllers/journey')
const { getBookmarks, addBookmark, deleteBookmark } = require('../controllers/bookmark')

// Middlewares
const { auth } = require('../middlewares/auth')
const { uploadFile, updateFile } = require('../middlewares/upload')

// Route Auth
router.post('/login', login)
router.post('/register', register)
router.post('/verify', auth, verifyToken)

// Route User
router.get('/user/:id', getUser)
router.patch('/user', auth, updateFile('image'), updateUser)

// Route Journey
router.get('/journeys', getJourneys)
router.get('/journey/:id', getJourney)
router.post('/journey', auth, addJourney)

// Route Bookmark
router.get('/bookmarks', auth, getBookmarks)
router.post('/bookmark', auth, addBookmark)
router.delete('/bookmark/:id', auth, deleteBookmark)

// Route Image
router.get('/images', auth, getImages)
router.post('/image', auth, uploadFile('image'), addImage)
router.delete('/image', auth, deleteImage)

module.exports = router
