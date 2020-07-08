const route = require('express').Router()
const genreController = require('../controllers/genreController')
const auth = require('../utils/tokenVerify')
const roles = require('../utils/roles')

route
  .get('/', auth, genreController.getAllGenres)
  .post('/', auth, roles.permitAdmin, genreController.createGenre)
  .patch('/:id', auth, roles.permitAdmin, genreController.updateGenre)
  .delete('/:id', auth, roles.permitAdmin, genreController.deleteGenre)

module.exports = route
