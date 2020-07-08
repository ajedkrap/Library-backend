require('dotenv').config()
const { APP_TOKEN_KEY } = process.env

const authModel = require('../models/authModel')

const jwt = require('jsonwebtoken')

const resData = require('../helper/response')

const validate = require('../utils/validator')
const bcrypt = require('../utils/bcrypt')
const role = require('../utils/roles')
const date = require('../utils/moment')

module.exports = {
  userSignUp: async (request, response) => {
    const { username, email, password, roles } = request.body
    const userRoles = role.getRoles(roles)
    const validData = {
      username, email, password, roles: userRoles[0]
    }
    const { error } = validate.signUp(validData)
    if (error) {
      response.status(400).send(resData(
        false, error.details[0].message
      ))
    } else {
      const checkEmail = await authModel.findUser({ email })
      if (!checkEmail.length) {
        const usernameCheck = await authModel.findUser({ username })
        if (!usernameCheck.length) {
          const hashedPassword = bcrypt.hashPassword(password)
          const userData = {
            username,
            email,
            password: hashedPassword,
            roles_id: userRoles[1]
          }
          const data = date.create(userData)
          const userSignUp = await authModel.signUp(data)
          if (userSignUp) {
            response.status(202).send(resData(
              true, 'Register Successful', { username, email, roles: userRoles[0] }
            ))
          } else {
            response.status(400).send(resData(
              false, 'Failed to Register'
            ))
          }
        } else {
          response.status(400).send(resData(
            false, 'Username already exist'
          ))
        }
      } else {
        response.status(400).send(resData(
          false, 'Email already exist'
        ))
      }
    }
  },
  userLogin: async (request, response) => {
    const { username, password } = request.body
    const userExist = await authModel.findUser({ username })
    if (userExist.length > 0) {
      const passwordMatch = bcrypt.comparePassword(password, userExist[0].password)
      if (passwordMatch) {
        request.body.id = userExist[0].id
        request.body.username = userExist[0].username
        request.body.roles = userExist[0].roles
        const token = jwt.sign(request.body, APP_TOKEN_KEY)
        const data = {
          username: userExist[0].username,
          email: userExist[0].email,
          roles: userExist[0].roles,
          token
        }
        response.status(202).send(resData(
          true, 'Login Successful', data
        ))
      } else {
        response.status(400).send(resData(
          false, 'Password didn\'t match'
        ))
      }
    } else {
      response.status(400).send(resData(
        false, 'Username not Found'
      ))
    }
  }
}
