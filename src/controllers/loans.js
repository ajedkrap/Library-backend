const userModel = require('../models/users')
const bookModel = require('../models/books')
const loansModel = require('../models/loans')

const bcrypt = require('../utils/bcrypt')
const pagination = require('../utils/pagination')

const moment = require('moment')

const getSort = (_sort) => {
  const sortInfo = parseInt(_sort)
  if (sortInfo && sortInfo !== '' && !isNaN(sortInfo)) {
    return 'DESC'
  } else {
    return 'ASC'
  }
}

const getLoanId = (_loanId) => {
  const loanId = parseInt(_loanId)
  if (loanId && loanId !== '' && !isNaN(loanId)) {
    return `= ${loanId}`
  } else {
    return 'LIKE \'%%\''
  }
}

const getConfirmation = (_confirm) => {
  if (_confirm === 'Y' || _confirm === 'y') {
    return true
  } else {
    return false
  }
}

module.exports = {
  getLoanList: async (request, response) => {
    const { page, limit, sort, id } = request.query

    const sortInfo = getSort(sort)
    const loansInfo = getLoanId(id)
    const sliceEnd = (pagination.getPage(page) * pagination.getPerPage(limit))
    const sliceStart = sliceEnd - pagination.getPerPage(limit)

    const condition = [
      loansInfo,
      sortInfo,
      sliceEnd,
      sliceStart
    ]

    const totalData = await loansModel.getLoansCount(condition)
    const totalPage = Math.ceil(totalData / pagination.getPerPage(limit))

    const prevLink = pagination.getPrevLinkQueryString(pagination.getPage(page), request.query)
    const nextLink = pagination.getNextLinkQueryString(pagination.getPage(page), totalPage, request.query)

    const getLoanData = await loansModel.getLoanList(condition)
    for (let listCount = 0; listCount < getLoanData.length; listCount++) {
      if (moment() > getLoanData[listCount].date_return) {
        await loansModel.updateLoan([{ status_id: 2, updated_at: moment().format('YYYY-MM-DD, HH:mm:ss') }, { id: getLoanData[listCount].id }])
      }
    }
    const newLoanData = await loansModel.getLoanList(condition)
    for (let listCount = 0; listCount < newLoanData.length; listCount++) {
      const loanedBookList = []
      const getLoanedBook = await loansModel.getLoanedBook({ loan_id: newLoanData[listCount].id })
      for (let bookCount = 0; bookCount < getLoanedBook.length; bookCount++) {
        loanedBookList.push(getLoanedBook[bookCount].book_title)
      }
      newLoanData[listCount].books = loanedBookList
    }

    const data = {
      success: true,
      msg: 'List all loans',
      data: newLoanData,
      pageInfo: {
        page: pagination.getPage(page),
        totalPage,
        perPage: pagination.getPerPage(limit),
        totalData,
        nextLink: nextLink && `https://localhost:8080/loans?${nextLink}`,
        prevLink: prevLink && `https://localhost:8080/loans?${prevLink}`
      }
    }
    response.status(200).send(data)
  },
  createNewLoans: async (request, response) => {
    const { email, password, books, confirmation } = request.body
    if (email && password && email !== '' && password !== '') {
      // check form
      const checkAccount = await userModel.getUserDetailByCondition({ email })
      if (checkAccount.length > 0) {
        // check email
        const passwordMatch = bcrypt.comparePassword(password, checkAccount[0].password)
        if (passwordMatch) {
          // compare bcrypt
          if (checkAccount[0].active === 1) {
            // check active account
            if (checkAccount[0].roles === 2) {
              // check roles, only user can loan
              const getBookList = books.split(',')
              for (let listCount = 0; listCount < getBookList.length; listCount++) {
                const checkBook = await bookModel.getBooksByCondition({ id: getBookList[listCount] })
                if (checkBook.length < 1) {
                  const data = {
                    success: false,
                    message: `Book not found with id: ${getBookList[listCount]} not found!`
                  }
                  response.status(400).send(data)
                }
              }
              // check whether books is available based on id
              const isConfirmed = getConfirmation(confirmation)
              // loans confirmation
              if (isConfirmed) {
                const loansData = {
                  user_id: checkAccount[0].id,
                  user_name: checkAccount[0].name,
                  date_loaned: moment().format('YYYY-MM-DD, HH:mm:ss'),
                  date_return: moment().add(7, 'days').format('YYYY-MM-DD'),
                  status_id: 1,
                  created_at: moment().format('YYYY-MM-DD, HH:mm:ss'),
                  updated_at: moment().format('YYYY-MM-DD, HH:mm:ss'),
                  deleted_at: null
                }
                const loans = await loansModel.setLoan(loansData)
                if (loans) {
                  const loanBookList = books.split(',')
                  const bookList = []
                  for (let listCount = 0; listCount < loanBookList.length; listCount++) {
                    const getBook = await bookModel.getBooksByCondition({ id: loanBookList[listCount] })
                    const loanedBookData = {
                      loan_id: loans,
                      book_id: parseInt(getBook[0].id),
                      book_title: getBook[0].title,
                      created_at: moment().format('YYYY-MM-DD, HH:mm:ss'),
                      updated_at: moment().format('YYYY-MM-DD, HH:mm:ss'),
                      deleted_at: null
                    }
                    await loansModel.setLoanedBook(loanedBookData)
                    bookList.push(getBook[0].title)
                  }
                  const data = {
                    success: true,
                    message: `Loan id:${loans} has been added`,
                    data: {
                      loan_id: loans,
                      user_id: checkAccount[0].id,
                      name: checkAccount[0].name,
                      email: checkAccount[0].email,
                      book: bookList,
                      date_loaned: moment().format('YYYY-MM-DD'),
                      date_return: moment().add(7, 'days').format('YYYY-MM-DD'),
                      status: 'ON LOAN'
                    }
                  }
                  response.status(201).send(data)
                } else {
                  const data = {
                    success: false,
                    message: 'Failed to Loan'
                  }
                  response.status(400).send(data)
                }
              } else {
                const data = {
                  success: false,
                  message: 'Fill the confirmation box with \'Y\' to proceed'
                }
                response.status(400).send(data)
              }
            } else {
              const data = {
                success: false,
                message: 'Please login as users, restricted for users only'
              }
              response.status(401).send(data)
            }
          } else {
            const data = {
              success: false,
              message: 'Inactivated account, please log-in first'
            }
            response.status(401).send(data)
          }
        } else {
          const data = {
            success: false,
            message: 'Email and Password not match'
          }
          response.status(400).send(data)
        }
      } else {
        const data = {
          success: false,
          message: 'Email not found'
        }
        response.status(400).send(data)
      }
    } else {
      const data = {
        success: false,
        message: 'All form need to be filled'
      }
      response.status(400).send(data)
    }
  },
  returnBook: async (request, response) => {
    const { loanId } = request.body
    const checkLoanId = await loansModel.getLoanByCondition({ id: parseInt(loanId) })
    if (checkLoanId.length > 0) {
      const returnData = [
        { status_id: 3, updated_at: moment().format('YYYY-MM-DD, HH:mm:ss') },
        { id: parseInt(loanId) }
      ]
      const updateLoan = loansModel.updateLoan(returnData)
      if (updateLoan) {
        const getLoanedBook = await loansModel.getLoanedBook({ loan_id: parseInt(loanId) })
        const results = await loansModel.getLoanByCondition({ id: parseInt(loanId) })
        if (getLoanedBook.length > 0) {
          for (let listCount = 0; listCount < getLoanedBook.length; listCount++) {
            await loansModel.deleteLoanedBook({ loan_id: parseInt(loanId) })
          }
          const data = {
            success: true,
            msg: 'Book Returned !',
            data: results[0]
          }
          response.status(200).send(data)
        } else {
          const data = {
            success: true,
            msg: 'Book had already returned',
            data: results[0]
          }
          response.status(400).send(data)
        }
      } else {
        const data = {
          success: true,
          msg: 'Failed to return'
        }
        response.status(400).send(data)
      }
    } else {
      const data = {
        success: false,
        msg: `Loan id:${loanId}, not found`
      }
      response.status(400).send(data)
    }
  }
}
