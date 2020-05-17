const bookModel = require('../models/books')
const moment = require('moment')
const pagination = require('../utils/pagination')

const getSort = (_sort) => {
  const sortInfo = parseInt(_sort)
  if (sortInfo && sortInfo !== '' && !isNaN(sortInfo)) {
    return 'DESC'
  } else {
    return 'ASC'
  }
}

const getKeyword = (_keyword) => {
  if (_keyword !== '' && typeof (_keyword) !== 'undefined') {
    return `LIKE '${_keyword}%' OR title LIKE '%${_keyword}%' OR title LIKE '%${_keyword}'`
  } else {
    return 'LIKE \'%%\''
  }
}

const getGenre = (_genre) => {
  if (_genre && _genre !== '' && typeof (_genre) !== 'undefined') {
    return _genre
  } else {
    return ''
  }
}

const getGenreId = (_genreId) => {
  return `AND genre_id LIKE '%${_genreId.toString()}%' OR genre_id LIKE '%${_genreId.toString()}' OR genre_id LIKE '${_genreId.toString()}%'`
}

module.exports = {
  getAllBooks: async (request, response) => {
    const { page, limit, search, sort, genre } = request.query

    const sortInfo = getSort(sort)
    const searchInfo = getKeyword(search)
    const getGenreInfo = getGenre(genre)
    const genreId = await bookModel.getGenreByCondition({ genre: getGenreInfo })
    if (genreId.length > 0) {
      var genreInfo = getGenreId(genreId[0].id)
    } else {
      genreInfo = ''
    }

    const sliceEnd = (pagination.getPage(page) * pagination.getPerPage(limit))
    const sliceStart = sliceEnd - pagination.getPerPage(limit)

    const condition = [
      searchInfo,
      genreInfo,
      sortInfo,
      sliceEnd,
      sliceStart
    ]

    const totalData = await bookModel.getBooksCount(condition)
    const totalPage = Math.ceil(totalData / pagination.getPerPage(limit))

    const prevLink = pagination.getPrevLinkQueryString(pagination.getPage(page), request.query)
    const nextLink = pagination.getNextLinkQueryString(pagination.getPage(page), totalPage, request.query)

    const bookData = await bookModel.getAllBook(condition)

    for (let bookListCount = 0; bookListCount < bookData.length; bookListCount++) {
      const genreId = bookData[bookListCount].genre_id.split(',')
      const authorId = bookData[bookListCount].author_id.split(',')
      const genreList = []; const authorList = []

      for (let listCount = 0; listCount < genreId.length; listCount++) {
        const checkGenre = await bookModel.getGenreByCondition({ id: genreId[listCount] })
        genreList.push(checkGenre[0].genre)
      }
      bookData[bookListCount].genre_id = genreList.join()
      for (let listCount = 0; listCount < authorId.length; listCount++) {
        const checkAuthor = await bookModel.getAuthorByCondition({ id: authorId[listCount] })
        authorList.push(checkAuthor[0].author)
      }
      bookData[bookListCount].author_id = authorList.join()
    }

    const data = {
      success: true,
      msg: 'List all books',
      data: bookData,
      pageInfo: {
        page: pagination.getPage(page),
        totalPage,
        perPage: pagination.getPerPage(limit),
        totalData,
        nextLink: nextLink && `https://localhost:8080/books?${nextLink}`,
        prevLink: prevLink && `https://localhost:8080/books?${prevLink}`
      }
    }
    response.status(200).send(data)
  },
  createBook: async (request, response) => {
    // mengambil data dari request.body
    const { title, description, genre, author, releaseDate } = request.body
    const genreList = genre.split(',')
    const authorList = author.split(',')
    // melakukan check apakah form buku diisi dengan benar
    if (title && title !== '') { // judul buku terisi dengan benar
      const isExist = await bookModel.getBooksByCondition({ title })
      if (isExist < 1) {
        const getGenreId = []
        for (let listCount = 0; listCount < genreList.length; listCount++) {
          const genreInput = genreList[listCount].trim().toLowerCase()
          const checkGenre = await bookModel.getGenreByCondition({ genre: genreInput })
          console.log(checkGenre.length)
          if (checkGenre.length > 0) {
            getGenreId.push(checkGenre[0].id)
          } else {
            const data = {
              genre: genreInput,
              created_at: moment().format('YYYY-MM-DD, HH:mm:ss'),
              updated_at: moment().format('YYYY-MM-DD, HH:mm:ss'),
              deleted_at: null
            }
            const newGenre = await bookModel.createNewGenre(data)
            getGenreId.push(newGenre)
          }
        }
        const getAuthorId = []
        for (let listCount = 0; listCount < authorList.length; listCount++) {
          const authorInput = authorList[listCount].trim().toLowerCase()
          const checkAuthor = await bookModel.getAuthorByCondition({ author: authorInput })
          if (checkAuthor.length > 0) {
            getAuthorId.push(checkAuthor[0].id)
          } else {
            const data = {
              author: authorInput,
              created_at: moment().format('YYYY-MM-DD, HH:mm:ss'),
              updated_at: moment().format('YYYY-MM-DD, HH:mm:ss'),
              deleted_at: null
            }
            const newAuthor = await bookModel.createNewAuthor(data)
            getAuthorId.push(newAuthor)
          }
        }
        const genreId = getGenreId.sort((a, b) => a - b).join()
        const authorId = getAuthorId.sort((a, b) => a - b).join()
        const bookData = {
          title,
          description,
          image: request.file.filename,
          genre_id: genreId,
          author_id: authorId,
          status: 'Available',
          release_date: moment(releaseDate).format('YYYY-MM-DD'),
          created_at: moment().format('YYYY-MM-DD, HH:mm:ss'),
          updated_at: moment().format('YYYY-MM-DD, HH:mm:ss'),
          deleted_at: null
        }
        const results = await bookModel.createNewBook(bookData)
        if (results) {
          const data = {
            success: true,
            msg: 'Book has been added successfully!',
            data: bookData
          }
          response.status(201).send(data)
        } else {
          const data = {
            success: false,
            msg: 'Failed to add book!'
          }
          response.status(400).send(data)
        }
      } else { // jika judul buku sudah digunakan
        const data = {
          success: false,
          msg: 'Book has been added!'
        }
        response.status(400).send(data)
      }
    } else { // jika form kosong akan jadi false
      const data = {
        success: false,
        msg: 'All form must be filled!'
      }
      response.status(400).send(data)
    }
  },
  deleteBook: async (request, response) => {
    const { id } = request.params // mendapatkan id dari parameter
    const _id = { id: parseInt(id) }
    const checkId = await bookModel.getBooksByCondition(_id)
    if (checkId.length > 0) {
      const results = await bookModel.deleteBook(_id)
      if (results) {
        const data = {
          success: true,
          msg: `Book ${id} has been deleted`
        }
        response.status(200).send(data)
      } else {
        const data = {
          success: false,
          msg: 'failed to delete user'
        }
        response.status(400).send(data)
      }
    } else {
      const data = {
        success: false,
        msg: 'Cannot delete data, user not found'
      }
      response.status(400).send(data)
    }
  }
}
