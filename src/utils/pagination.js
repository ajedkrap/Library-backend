const qs = require('querystring')

const pagination = {

  getPage: (_page) => {
    const page = parseInt(_page)
    if (page && page > 0 && !isNaN(page)) {
      return page
    } else {
      return 1
    }
  },
  getPerPage: (_perPage) => {
    const perPage = parseInt(_perPage)
    if (perPage && perPage > 0 && !isNaN(perPage)) {
      return perPage
    } else {
      return 5
    }
  },
  getPrevLinkQueryString: (page, currentQuery) => {
    if (page > 1) {
      const generatedPage = {
        page: page - 1
      }
      return qs.stringify({ ...currentQuery, ...generatedPage })
    } else {
      return null
    }
  },
  getNextLinkQueryString: (page, totalPage, currentQuery) => {
    if (page < totalPage) {
      const generatedPage = {
        page: page + 1
      }
      return qs.stringify({ ...currentQuery, ...generatedPage })
    } else {
      return null
    }
  }
}

module.exports = pagination
