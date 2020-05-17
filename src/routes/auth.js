const route = require('express').Router()
const authController = require('../controllers/auth')
const token = require('../utils/tokenVerification')
const upload = require('../utils/multer-user')

route.post('/login', token.verifyToken, upload.single('image'), authController.userLogin)
route.post('/register', authController.userRegister)

module.exports = route
