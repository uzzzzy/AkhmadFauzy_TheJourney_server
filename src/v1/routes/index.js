require('dotenv').config()
const express = require('express')

const router = express.Router()

// Controllers
const { login, register, verifyToken } = require('../controllers/auth')
const { getUser, updateUser } = require('../controllers/user')
const { getImages, addImage, deleteImage } = require('../controllers/image')
const { getJourneys, getJourney, addJourney } = require('../controllers/journey')
const { getBookmarks, addBookmark, deleteBookmark } = require('../controllers/bookmark')

// Middlewares
const { auth } = require('../middlewares/auth')
const { uploadFile, updateFile } = require('../middlewares/upload')
const { addComment } = require('../controllers/comment')
const { sendImage } = require('../middlewares/cloudinary')

// Route Auth
router.post('/login', login)
router.post('/register', register)
router.post('/verify', auth, verifyToken)

// Route User
router.get('/user/:id', getUser)
router.patch('/user', auth, uploadFile('image'), sendImage, updateUser)

// Route Journey
router.get('/journeys', getJourneys)
router.get('/journey/:id', getJourney)
router.post('/journey', auth, addJourney)

// Route Image
router.get('/images', auth, getImages)
router.post('/image', auth, uploadFile('image'), addImage)
router.delete('/image', auth, deleteImage)

// Route Bookmark
router.get('/bookmarks', auth, getBookmarks)
router.post('/bookmark', auth, addBookmark)
router.delete('/bookmark/:id', auth, deleteBookmark)

// Route Comment
router.post('/journey/:id/comment', auth, addComment)

module.exports = router
