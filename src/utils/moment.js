const moment = require('moment')

module.exports = {
  set: (data) => moment(data, ['DD-MM-YYYY', 'DDMMYYYY'], true).format('YYYY-MM-DD, HH:mm:ss'),
  create: (data) => {
    const log = {
      created_at: moment().format('YYYY-MM-DD, HH:mm:ss'),
      updated_at: moment().format('YYYY-MM-DD, HH:mm:ss'),
      deleted_at: null
    }
    Object.assign(data, log)
    return data
  },
  update: (data) => {
    const log = {
      updated_at: moment().format('YYYY-MM-DD, HH:mm:ss')
    }
    Object.assign(data, log)
    return data
  }
}
