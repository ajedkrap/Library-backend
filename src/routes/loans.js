const route = require('express').Router()
const loansController = require('../controllers/loans')

route.get('/', loansController.getLoanList)
route.post('/', loansController.createNewLoans)
route.patch('/', loansController.returnBook)

module.exports = route
