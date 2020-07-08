const resData = require('../helper/response')

module.exports = {
  getRoles: (_roles) => {
    const roles = (_roles === 'true')
    if (roles) {
      const newRoles = ['admin', 1]
      return newRoles
    } else {
      const newRoles = ['user', 2]
      return newRoles
    }
  },
  permitAdmin: (request, response, next) => {
    const isAllowed = role => role.includes('admin')
    const role = request.payload.roles
    if (role && isAllowed(role)) {
      next()
    } else {
      return response.status(401).send(resData(
        false, 'Not Allowed'
      ))
    }
  },
  permitUser: (request, response, next) => {
    const isAllowed = role => role.includes('user')
    const role = request.payload.roles
    if (role && isAllowed(role)) {
      next()
    } else {
      return response.status(401).send(resData(
        false, 'Not Allowed'
      ))
    }
  }
}
