
const bookModel = require('../models/bookModel')
const loansModel = require('../models/loansModel')
const authorModel = require('../models/authorModel')
const genreModel = require('../models/genreModel')

const resData = require('../helper/response')

const moment = require('moment')
const date = require('../utils/moment')

module.exports = {
  getAllLoanedBook: async (request, response) => {
    const getLoanedBooks = await loansModel.getAllLoanedBook()
    response.status(200).send(resData(
      true, 'Get Loaned Book', getLoanedBooks
    ))
  },
  getLoanList: async (request, response) => {
    const loanData = await loansModel.getLoanList(request.query)

    for (let listCount = 0; listCount < loanData.length; listCount++) {
      const loanedBookList = []
      const getLoanedBook = await loansModel.checkLoanedBook({ loan_id: loanData[listCount].id })
      for (let bookCount = 0; bookCount < getLoanedBook.length; bookCount++) {
        loanedBookList.push(getLoanedBook[bookCount].book_title)
      }
      loanData[listCount].books = loanedBookList
    }

    response.status(200).send(resData(
      true, 'Get Loan success', loanData
    ))
  },
  getLoanListByUser: async (request, response) => {
    const { id } = request.params
    const { sort } = request.query
    const data = {
      sort,
      user_id: parseInt(id)
    }
    const loanData = await loansModel.getLoanListByUser(data)
    if (loanData.length > 0) {
      for (let listCount = 0; listCount < loanData.length; listCount++) {
        const loanedBookList = []
        const getLoanedBook = await loansModel.checkLoanedBook({ loan_id: loanData[listCount].id })
        for (let bookCount = 0; bookCount < getLoanedBook.length; bookCount++) {
          const genreId = getLoanedBook[bookCount].genre_id.split(',')
          const authorId = getLoanedBook[bookCount].author_id.split(',')
          const genreList = []; const authorList = []

          for (let listCount = 0; listCount < genreId.length; listCount++) {
            const checkGenre = await genreModel.checkGenre({ id: genreId[listCount] })
            genreList.push(checkGenre[0].genre)
          }
          getLoanedBook[bookCount].genre = genreList
          delete getLoanedBook[bookCount].genre_id
          for (let listCount = 0; listCount < authorId.length; listCount++) {
            const checkAuthor = await authorModel.checkAuthor({ id: authorId[listCount] })
            authorList.push(checkAuthor[0].author)
          }
          getLoanedBook[bookCount].author = authorList
          delete getLoanedBook[bookCount].author_id
          loanedBookList.push(getLoanedBook[bookCount])
        }
        loanData[listCount].books = loanedBookList
      }

      response.status(200).send(resData(
        true, 'Get genre success', loanData
      ))
    } else {
      response.status(400).send(resData(
        false, `No Loan Recored for Loan Id.${id}`
      ))
    }
  },
  createNewLoans: async (request, response) => {
    const { books } = request.body
    const { id, username, email } = request.payload
    if (books && books !== '') {
      const getBookList = books.split(',')
      for (let listCount = 0; listCount < getBookList.length; listCount++) {
        const checkBook = await bookModel.checkBook({ id: getBookList[listCount] })
        if (checkBook.length < 1) {
          response.status(400).send(resData(
            false, `Book not found with id: ${getBookList[listCount]} not found!`
          ))
          break
        }
      }
      // check whether books is available based on id
      const data = {
        user_id: request.payload.id,
        username: request.payload.username,
        loan_date: moment().format('YYYY-MM-DD, HH:mm:ss'),
        due_date: moment().add(getBookList.length, 'days').format('YYYY-MM-DD'),
        return_date: null,
        status_id: 1
      }
      const loansData = date.create(data)
      const loans = await loansModel.setLoan(loansData)
      if (loans) {
        const bookList = []
        for (let listCount = 0; listCount < getBookList.length; listCount++) {
          const getBook = await bookModel.checkBook({ id: getBookList[listCount] })
          const data = {
            loan_id: loans,
            book_id: parseInt(getBook[0].id),
            book_title: getBook[0].title
          }
          const loanedBookData = date.create(data)
          await loansModel.setLoanedBook(loanedBookData)
          bookList.push(getBook[0].title)
        }
        const data = {
          id: loans,
          user_id: id,
          username,
          email,
          book: bookList,
          loan_date: moment().format('YYYY-MM-DD'),
          due_date: moment().add(getBookList.length, 'days').format('YYYY-MM-DD'),
          status: 'On Loan'
        }

        response.status(201).send(resData(
          true, `Loan No.${loans} has been added, on behalf of ${username}`, data
        ))
      } else {
        response.status(400).send(resData(
          false, 'Failed to Loan'
        ))
      }
    } else {
      response.status(400).send(resData(
        false, 'No Book Inserted'
      ))
    }
  },
  returnBook: async (request, response) => {
    const { loanId } = request.body
    const checkLoanId = await loansModel.checkLoan({ id: parseInt(loanId) })
    if (checkLoanId.length > 0) {
      if (checkLoanId[0].status_id !== 3) {
        if (moment() < checkLoanId[0].due_date) {
          const data = {
            status_id: 3,
            return_date: moment().format('YYYY-MM-DD, HH:mm:ss')
          }
          const returnData = date.update(data)
          const updateLoan = loansModel.updateLoan([returnData, { id: parseInt(loanId) }])
          if (updateLoan) {
            const results = await loansModel.checkLoan({ id: parseInt(loanId) })
            response.status(200).send(resData(
              true, 'Book Returned On Time!', results[0]
            ))
          } else {
            response.status(400).send(resData(
              false, 'Failed to return'
            ))
          }
        } else {
          const data = {
            status_id: 2,
            return_date: moment().format('YYYY-MM-DD, HH:mm:ss')
          }
          const returnData = date.update(data)
          const updateLoan = loansModel.updateLoan([returnData, { id: parseInt(loanId) }])
          if (updateLoan) {
            const results = await loansModel.checkLoan({ id: parseInt(loanId) })
            response.status(200).send(resData(
              true, 'Book Returned, yet it is Overdue !', results[0]
            ))
          } else {
            response.status(400).send(resData(
              true, 'Failed to return'
            ))
          }
        }
      } else {
        response.status(400).send(resData(
          false, 'Books had been return at ' + moment(checkLoanId[0].return_date).format('DD MM YYYY')
        ))
      }
    } else {
      response.status(400).send(resData(
        false, `Loan id:${loanId}, not found`
      ))
    }
  }
}
