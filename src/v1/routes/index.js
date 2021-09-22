const express = require('express')

const path = require('path')

const router = express.Router()

router.get('/', function (req, res) {
    res.sendFile(path.join(path.dirname(__dirname), '/html/index.html'))
})

module.exports = router
