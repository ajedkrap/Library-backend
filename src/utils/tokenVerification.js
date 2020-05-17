module.exports = {
  verifyToken: (request, response, next) => {
    const bearerHeader = request.headers.authorization
    if (typeof (bearerHeader) !== 'undefined') {
      const bearer = bearerHeader.split(' ')
      const bearerToken = bearer[1]
      request.token = bearerToken
      next()
    } else {
      const data = {
        success: false,
        message: 'Forbidden'
      }
      response.status(403).send(data)
    }
  }
}
