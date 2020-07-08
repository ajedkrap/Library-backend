require('dotenv').config()
const { APP_URL } = process.env
const qs = require('querystring')

const getPage = (_page) => {
  const page = parseInt(_page)
  if (page && page > 0 && !isNaN(page)) {
    return page
  } else {
    return 1
  }
}

const getPerPage = (_perPage) => {
  const perPage = parseInt(_perPage)
  if (perPage && perPage > 0 && !isNaN(perPage)) {
    return perPage
  } else {
    return 9
  }
}

module.exports = {
  set: (query, length) => {
    const { page, limit } = query
    const totalPage = Math.ceil(length / getPerPage(limit))

    const startPage = (getPage(page) * getPerPage(limit)) - getPerPage(limit)
    const endPage = (getPage(page) * getPerPage(limit))

    const prevLink = (getPage(page) > 1) ? APP_URL + 'books?' + qs.stringify({ ...query, ...{ page: parseInt(getPage(page) - 1) } }) : null
    const nextLink = (getPage(page) < totalPage) ? APP_URL + 'books?' + qs.stringify({ ...query, ...{ page: parseInt(getPage(page) + 1) } }) : null

    return {
      page: getPage(page),
      perPage: getPerPage(limit),
      totalPage: totalPage,
      totalData: length,
      next: nextLink,
      prev: prevLink,
      start: startPage,
      end: endPage
    }
  }
}
