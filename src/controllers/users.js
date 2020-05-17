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
  }
}
