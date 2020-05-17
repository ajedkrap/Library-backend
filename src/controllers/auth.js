require('dotenv').config()
const { APP_TOKEN_KEY } = process.env

const jwt = require('jsonwebtoken')
const moment = require('moment')

const bcrypt = require('../utils/bcrypt')
const getRoles = require('../utils/roles')
const userModel = require('../models/users')

module.exports = {
  userRegister: async (request, response) => {
    const { email, password, roles } = request.body
    if (email && password && email !== '' && password !== '') {
      const userRoles = getRoles.getRoles(roles)
      const emailExist = await userModel.getUsersByCondition([{ email }])
      if (emailExist < 1) {
        const hashPassword = bcrypt.hashPassword(password)
        const token =
        jwt.sign({ email, hashPassword, roles: userRoles[0] }, APP_TOKEN_KEY)
        const userData = {
          email,
          password: hashPassword,
          roles_id: userRoles[1],
          picture: null,
          active: false,
          created_at: moment().format('YYYY-MM-DD, HH:mm:ss'),
          updated_at: moment().format('YYYY-MM-DD, HH:mm:ss'),
          deleted_at: null
        }
        const registeredUser = await userModel.createUser([userData])
        if (registeredUser) {
          delete userData.password
          userData.token = token
          const data = {
            success: true,
            message: `${userRoles[0]} registered`,
            data: userData
          }
          response.status(201).send(data)
        } else {
          const data = {
            success: false,
            message: 'Failed to register user'
          }
          response.status(400).send(data)
        }
      } else {
        const data = {
          success: false,
          message: 'Email has been used, use another one'
        }
        response.status(406).send(data)
      }
    } else {
      const data = {
        success: false,
        message: 'All form need to be filled'
      }
      response.status(400).send(data)
    }
  },
  userLogin: async (request, response) => {
    const { email, password, roles, name, dob, phone } = request.body
    if (email && password && email !== '' && password !== '') { // FORM CHECKING
      const userRoles = getRoles.getRoles(roles)
      const checkAccount = await userModel.getRegisteredUser([{ email }, { roles_id: userRoles[1] }])
      if (checkAccount.length > 0) { // EMAIL CHECKING
        const passwordMatch = bcrypt.comparePassword(password, checkAccount[0].password)
        if (passwordMatch) { // PASSWORD CHECKING
          jwt.verify(request.token, APP_TOKEN_KEY, async (error, authData) => {
            if (error) {
              const data = {
                success: false,
                message: 'It is Forbidden'
              }
              response.status(403).send(data)
            } else {
              // USER AND TOKEN COMPATIBLE
              if (email === authData.email && userRoles[0] === authData.roles && bcrypt.comparePassword(password, authData.hashPassword)) {
                const activation = [{
                  picture: request.file.filename,
                  active: true,
                  updated_at: moment().format('YYYY-MM-DD, HH:mm:ss')
                },
                { email }]
                const sendActivation = await userModel.updateUserActivation(activation)
                if (sendActivation) {
                  const userData = {
                    user_id: checkAccount[0].id,
                    name,
                    date_of_birth: moment(dob).format('YYYY-MM-DD'),
                    phone,
                    created_at: moment().format('YYYY-MM-DD, HH:mm:ss'),
                    updated_at: moment().format('YYYY-MM-DD, HH:mm:ss'),
                    deleted_at: null
                  }
                  await userModel.createUserDetails(userData)
                }
                const data = {
                  success: true,
                  message: `Welcome ${authData.roles} ${name}, Log in success`,
                  data: {
                    email: authData.email,
                    roles: authData.roles,
                    active: true
                  }
                }
                response.status(201).send(data)
              } else {
                const data = {
                  success: false,
                  message: 'Email & Password & Roles are not acceptable'
                }
                response.status(406).send(data)
              }
            }
          })
        } else {
          const data = {
            success: false,
            message: 'Email & Password don\'t match'
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
  }
}
