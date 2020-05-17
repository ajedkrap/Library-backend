// const jwt = require('jsonwebtoken')
const moment = require('moment')

// const bcrypt = require('../utils/bcrypt')
const pagination = require('../utils/pagination')

const userModel = require('../models/users')

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

const getUserRoles = (_roles) => {
  const getRoles = parseInt(_roles)
  if (getRoles === 1) {
    return 'AND roles LIKE \'%admin%\''
  } else if (getRoles === 2) {
    return 'AND roles LIKE \'%users%\''
  } else {
    return ''
  }
}

module.exports = {
  getAllUsers: async (request, response) => {
    const { page, limit, search, sort, roles } = request.query

    const sortInfo = getSort(sort)
    const searchInfo = getKeyword(search)
    const rolesInfo = getUserRoles(roles)

    const sliceStart =
      (pagination.getPage(page) *
        pagination.getPerPage(limit)) -
          pagination.getPerPage(limit)
    const sliceEnd =
      (pagination.getPage(page) *
         pagination.getPerPage(limit))

    const condition = [
      searchInfo,
      rolesInfo,
      sortInfo,
      sliceEnd,
      sliceStart]

    const totalData = await userModel.getUsersCount(condition)
    const totalPage = Math.ceil(totalData / pagination.getPerPage(limit))

    const prevLink =
      pagination.getPrevLinkQueryString(
        pagination.getPage(page), request.query)
    const nextLink =
      pagination.getNextLinkQueryString(
        pagination.getPage(page), totalPage, request.query)

    const userData = await userModel.getAllUser(condition)

    const data = {
      success: true,
      msg: 'List all user data',
      data: userData,
      pageInfo: {
        page: pagination.getPage(page),
        totalPage,
        perPage: pagination.getPerPage(limit),
        totalData,
        nextLink: nextLink && `https://localhost:8080/users?${nextLink}`,
        prevLink: prevLink && `https://localhost:8080/users?${prevLink}`
      }
    }
    response.status(200).send(data)
  },
  updateUser: async (request, response) => {
    const { id } = request.params // mendapatkan id dari parameter
    const { email, password } = request.body
    const checkId = await userModel.getUsersByCondition({ id: parseInt(id) })
    if (checkId.length > 0) {
      if (email && password && email !== '' && password !== '') {
        const userData = [
          { email, password, updated_at: moment().format('YYYY-MM-DD, HH:mm:ss') },
          { id: parseInt(id) }
        ]
        const checkEmail = await userModel.getUsersByCondition({ email })
        if (checkEmail.length > 0) {
          const results = await userModel.updateUser(userData)
          if (results) {
            const data = {
              success: true,
              msg: 'Users has been updated!',
              data: userData[0]
            }
            response.status(200).send(data)
          } else {
            const data = {
              success: true,
              msg: 'Failed to update user!',
              data: userData[0]
            }
            response.status(400).send(data)
          }
        } else {
          const data = {
            success: false,
            msg: 'Email already exist'
          }
          response.status(400).send(data)
        }
      } else {
        const data = {
          success: false,
          msg: 'All form must be filled'
        }
        response.status(400).send(data)
      }
    } else {
      const data = {
        success: false,
        msg: `Users with ${id} not found`
      }
      response.status(400).send(data)
    }
  },
  deleteUser: async (request, response) => {
    const { id } = request.params // mendapatkan id dari parameter
    const _id = { id: parseInt(id) }
    const checkId = await userModel.getUsersByCondition(_id)

    if (checkId.length > 0) {
      const results = await userModel.deleteUser(_id)
      if (results) {
        const data = {
          success: true,
          msg: `Users ${id} has been deleted`
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
