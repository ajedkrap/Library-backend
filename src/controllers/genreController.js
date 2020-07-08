const genreModel = require('../models/genreModel')
const bookModel = require('../models/bookModel')

const resData = require('../helper/response')

const date = require('../utils/moment')

module.exports = {
  getAllGenres: async (request, response) => {
    const getGenre = await genreModel.getGenre()
    response.status(200).send(resData(
      true, 'Get genre success', getGenre
    ))
  },
  createGenre: async (request, response) => {
    const { genre } = request.body
    const checkGenre = await genreModel.checkGenre({ genre })
    if (checkGenre.length < 1) {
      const data = date.create({ genre })
      const createGenre = await genreModel.createGenre(data)
      if (createGenre) {
        response.status(200).send(resData(
          true, `${genre} is created`, data
        ))
      } else {
        response.status(400).send(resData(
          false, 'Failed to create genre'
        ))
      }
    } else {
      response.status(400).send(resData(
        false, 'Genre already Exist'
      ))
    }
  },
  updateGenre: async (request, response) => {
    const { id } = request.param
    const { genre } = request.body
    const checkGenre = await genreModel.checkGenre({ id: parseInt(id) })
    if (checkGenre.length > 0) {
      const data = date.update({ genre })
      const updateGenre = await genreModel.updateGenre([data, { id: parseInt(id) }])
      if (updateGenre) {
        response.status(200).send(resData(
          true, `Genre id:${id}, Updated with ${genre}`, data
        ))
      } else {
        response.status(400).send(resData(
          false, 'Failed to update genre'
        ))
      }
    } else {
      response.status(400).send(resData(
        false, `Genre with id:${id}, Not Found`
      ))
    }
  },
  deleteGenre: async (request, response) => {
    const { id } = request.param
    const checkGenre = await genreModel.checkGenre({ id: parseInt(id) })
    if (checkGenre > 0) {
      const getBooksGenre = await bookModel.checkBookByGenre({ id })
      for (let bookCount = 0; bookCount < getBooksGenre.length; bookCount++) {
        const genreId = getBooksGenre[bookCount].genre_id.split(',')
        for (let genreCount = 0; genreCount < genreId.length; genreCount++) {
          if (genreId[genreCount] === id) {
            genreId.splice(genreCount, 1)
          }
        }
        await bookModel.updateBook([{ genre_id: genreId }, { id: parseInt(getBooksGenre.id) }])
      }
      const results = await genreModel.deleteGenre({ id: parseInt(id) })
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
        false, `Genre with id:${id}, Not Found`
      ))
    }
  }
}
