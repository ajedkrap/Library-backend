require('dotenv').config()
const { APP_URL } = process.env
const multer = require('multer')

const bookModel = require('../models/bookModel')
const genreModel = require('../models/genreModel')
const authorModel = require('../models/authorModel')

const resData = require('../helper/response')

const upload = require('../utils/multer-book')
const date = require('../utils/moment')
const pagination = require('../utils/pagination')
const validate = require('../utils/validator')

module.exports = {
  getAllBooks: async (request, response) => {
    const { search } = request.query

    const totalData = await bookModel.getBookCount({ search })
    const paginate = pagination.set(request.query, totalData)
    const getBook = await bookModel.getBook(request.query, paginate.start, paginate.end)

    for (let bookListCount = 0; bookListCount < getBook.length; bookListCount++) {
      const genreId = getBook[bookListCount].genre_id.split(',')
      const authorId = getBook[bookListCount].author_id.split(',')
      const genreList = []; const authorList = []

      for (let listCount = 0; listCount < genreId.length; listCount++) {
        const checkGenre = await genreModel.checkGenre({ id: genreId[listCount] })
        genreList.push(checkGenre[0].genre)
      }
      getBook[bookListCount].genre = genreList
      delete getBook[bookListCount].genre_id
      for (let listCount = 0; listCount < authorId.length; listCount++) {
        const checkAuthor = await authorModel.checkAuthor({ id: authorId[listCount] })
        authorList.push(checkAuthor[0].author)
      }
      getBook[bookListCount].author = authorList
      delete getBook[bookListCount].author_id
    }

    response.status(200).send(resData(
      true, 'Get book success', getBook, paginate
    ))
  },
  getBooksByGenre: async (request, response) => {
    const { genre } = request.params

    const checkGenre = await genreModel.checkGenre({ genre })
    request.query.genre_id = checkGenre[0].id
    const totalData = await bookModel.getBookCount({ genre_id: request.query.genre_id })
    const paginate = pagination.set(request.query, totalData)
    const getBook = await bookModel.getBook(request.query, paginate.start, paginate.end)

    for (let bookListCount = 0; bookListCount < getBook.length; bookListCount++) {
      const genreId = getBook[bookListCount].genre_id.split(',')
      const authorId = getBook[bookListCount].author_id.split(',')
      const genreList = []; const authorList = []

      for (let listCount = 0; listCount < genreId.length; listCount++) {
        const checkGenre = await genreModel.checkGenre({ id: genreId[listCount] })
        genreList.push(checkGenre[0].genre)
      }
      getBook[bookListCount].genre = genreList
      delete getBook[bookListCount].genre_id
      for (let listCount = 0; listCount < authorId.length; listCount++) {
        const checkAuthor = await authorModel.checkAuthor({ id: authorId[listCount] })
        authorList.push(checkAuthor[0].author)
      }
      getBook[bookListCount].author = authorList
      delete getBook[bookListCount].author_id
    }

    response.status(200).send(resData(
      true, 'Get book success', getBook, paginate
    ))
  },
  createBook: (request, response) => {
    upload(request, response, async (fileError) => {
      if (request.fileValidationError) {
        response.status(400).send(resData(
          false, request.fileValidationError
        ))
      } else if (fileError instanceof multer.MulterError) {
        response.status(400).send(resData(
          false, 'File size too large'
        ))
      }
      if (!request.file) {
        response.status(400).send(resData(
          false, 'Please select an image to upload'
        ))
      } else {
        const { error } = validate.createBooks(request.body)
        if (error) {
          response.status(400).send(resData(
            false, error.details[0].message
          ))
        } else {
          const { title, description, genre, author, releaseDate } = request.body
          const checkBook = await bookModel.checkBook({ title })
          const data = {
            title,
            description,
            image: 'cover/' + request.file.filename,
            genre,
            author,
            status: 'Available',
            release_date: date.set(releaseDate)
          }
          if (checkBook.length < 1) {
            // check genre
            const genreList = genre.split(',')
            const getGenreId = []
            for (let listCount = 0; listCount < genreList.length; listCount++) {
              const genreInput = genreList[listCount].trim().toLowerCase()
              const checkGenre = await genreModel.checkGenre({ genre: genreInput })
              if (checkGenre.length > 0) {
                getGenreId.push(checkGenre[0].id)
              } else {
                const genreData = {
                  genre: genreInput
                }
                const data = date.create(genreData)
                const newGenre = await genreModel.createGenre(data)
                getGenreId.push(newGenre)
              }
            }
            const genreId = getGenreId.sort((a, b) => a - b).join()

            // check author
            const authorList = author.split(',')
            const getAuthorId = []
            for (let listCount = 0; listCount < authorList.length; listCount++) {
              const authorInput = authorList[listCount].trim().toLowerCase()
              const checkAuthor = await authorModel.checkAuthor({ author: authorInput })
              if (checkAuthor.length > 0) {
                getAuthorId.push(checkAuthor[0].id)
              } else {
                const authorData = {
                  author: authorInput
                }
                const data = date.create(authorData)
                const newAuthor = await authorModel.createAuthor(data)
                getAuthorId.push(newAuthor)
              }
            }
            const authorId = getAuthorId.sort((a, b) => a - b).join()

            const inputData = {
              title,
              description,
              image: APP_URL + 'cover/' + request.file.filename,
              genre_id: genreId,
              author_id: authorId,
              status: 'Available',
              release_date: data.release_date
            }
            const insertData = date.create(inputData)
            const createBook = await bookModel.createBook(insertData)
            if (createBook) {
              response.status(201).send(resData(
                true, 'Book is added successfully', data))
            } else {
              response.status(400).send(resData(
                false, 'Failed to Add Book'))
            }
          } else {
            response.status(400).send(resData(
              false, 'Book is already Exist'))
          }
        }
      }
    })
  },
  updateBook: (request, response) => {
    upload(request, response, async (fileError) => {
      if (request.fileValidationError) {
        response.status(400).send(resData(
          false, request.fileValidationError
        ))
      } else if (fileError instanceof multer.MulterError) {
        response.status(400).send(resData(
          false, 'File size too large'
        ))
      }

      const imageData = (request.file) ? { image: 'cover/' + request.file.filename } : null
      const { id } = request.params
      const updateData = JSON.parse(JSON.stringify(request.body))

      // validator
      const { error } = validate.updateBooks(request.body)
      if (error) {
        response.status(400).send(resData(
          false, error.details[0].message
        ))
      } else {
        const getBook = await bookModel.checkBook({ id: parseInt(id) })
        if (getBook.length > 0) {
          // update genre
          if (updateData.genre) {
            const genreList = updateData.genre.split(',')
            const getGenreId = []
            for (let listCount = 0; listCount < genreList.length; listCount++) {
              const genreInput = genreList[listCount].trim().toLowerCase()
              const checkGenre = await genreModel.checkGenre({ genre: genreInput })
              if (checkGenre.length > 0) {
                getGenreId.push(checkGenre[0].id)
              } else {
                const genreData = {
                  genre: genreInput
                }
                const data = date.create(genreData)
                const newGenre = await genreModel.createGenre(data)
                getGenreId.push(newGenre)
              }
            }
            updateData.genre_id = getGenreId.sort((a, b) => a - b).join()
            delete updateData.genre
          }

          // update author
          if (updateData.author) {
            const authorList = updateData.author.split(',')
            const getAuthorId = []
            for (let listCount = 0; listCount < authorList.length; listCount++) {
              const authorInput = authorList[listCount].trim().toLowerCase()
              const checkAuthor = await authorModel.checkAuthor({ author: authorInput })
              if (checkAuthor.length > 0) {
                getAuthorId.push(checkAuthor[0].id)
              } else {
                const authorData = {
                  author: authorInput
                }
                const data = date.create(authorData)
                const newAuthor = await authorModel.createAuthor(data)
                getAuthorId.push(newAuthor)
              }
            }
            updateData.author_id = getAuthorId.sort((a, b) => a - b).join()
            delete updateData.author
          }

          // update release_date
          if (updateData.releaseDate) {
            updateData.release_date = date.set(updateData.releaseDate)
            delete updateData.releaseDate
          }

          const data = Object.assign(updateData, imageData)

          const updateBook = await bookModel.updateBook([data, { id: parseInt(id) }])
          if (updateBook) {
            response.status(200).send(resData(
              true, `Book with ID ${id} Updated`, updateBook[0]
            ))
          } else {
            response.status(400).send(resData(
              false, `Book with ID ${id} failed to update`
            ))
          }
        } else {
          response.status(400).send(resData(
            false, `Book with ID ${id} not found`))
        }
      }
    })
  },
  deleteBook: async (request, response) => {
    const { id } = request.params // mendapatkan id dari parameter
    const checkId = await bookModel.checkBook({ id: parseInt(id) })
    if (checkId.length > 0) {
      const results = await bookModel.deleteBook({ id: parseInt(id) })
      if (results) {
        response.status(200).send(resData(
          true, `Book with ID ${id} deleted`
        ))
      } else {
        response.status(400).send(resData(
          false, `Book with ID ${id} failed to delete`
        ))
      }
    } else {
      response.status(400).send(resData(
        false, `Book with ID ${id} not found`
      ))
    }
  }
}
