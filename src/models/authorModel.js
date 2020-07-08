const db = require('../utils/db')

module.exports = {

  checkAuthor: (data) => {
    const sql = 'SELECT * FROM authors WHERE ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results)
      })
    })
  },
  createAuthor: (data) => {
    const sql = 'INSERT INTO authors SET ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results.insertId)
      })
    })
  }
}
