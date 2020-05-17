const route = require('express').Router()
const upload = require('../utils/multer-book')
const bookController = require('../controllers/books')

route.get('/', bookController.getAllBooks)
route.post('/', upload.single('image'), bookController.createBook)
route.delete('/:id', bookController.deleteBook)

module.exports = route
