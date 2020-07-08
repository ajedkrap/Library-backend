const route = require('express').Router()
const loansController = require('../controllers/loansController')
const auth = require('../utils/tokenVerify')
const roles = require('../utils/roles')

route.get('/', auth, roles.permitAdmin, loansController.getLoanList)
  .get('/:id', auth, roles.permitUser, loansController.getLoanListByUser)
  .get('/book', auth, roles.permitAdmin, loansController.getAllLoanedBook)
  .post('/', auth, roles.permitUser, loansController.createNewLoans)
  .patch('/', auth, roles.permitUser, loansController.returnBook)

module.exports = route
