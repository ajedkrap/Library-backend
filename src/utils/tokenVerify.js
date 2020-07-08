require('dotenv').config()
const { APP_TOKEN_KEY } = process.env
const jwt = require('jsonwebtoken')
const resData = require('../helper/response')

module.exports = (request, response, next) => {
  const header = request.header('Authorization')
  if (typeof (header) !== 'undefined') {
    const token = header.split(' ')[1]
    jwt.verify(token, APP_TOKEN_KEY, (error, authData) => {
      if (error) {
        console.log(error)
        response.status(401).send(resData(
          false, 'Token Error'
        ))
      } else {
        request.payload = authData
        next()
      }
    })
  } else {
    response.status(401).send(resData(
      false, 'No Token'
    ))
  }
}
