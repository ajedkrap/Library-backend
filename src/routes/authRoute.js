const route = require('express').Router()
const authController = require('../controllers/authController')

route.post('/signup', authController.userSignUp)
route.post('/login', authController.userLogin)

module.exports = route
