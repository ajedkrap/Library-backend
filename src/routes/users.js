const route = require('express').Router()
const userController = require('../controllers/users')

route.get('/', userController.getAllUsers)
route.patch('/:id', userController.updateUser)
route.delete('/:id', userController.deleteUser)

module.exports = route
