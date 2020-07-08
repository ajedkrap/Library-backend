const route = require('express').Router()
const bookController = require('../controllers/bookController')
const auth = require('../utils/tokenVerify')
const roles = require('../utils/roles')

route
  .get('/', auth, bookController.getAllBooks)
  .get('/:genre', auth, bookController.getBooksByGenre)
  .post('/', auth, roles.permitAdmin, bookController.createBook)
  .patch('/:id', auth, roles.permitAdmin, bookController.updateBook)
  .delete('/:id', auth, roles.permitAdmin, bookController.deleteBook)

module.exports = route
