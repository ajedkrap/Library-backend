const db = require('../utils/db')

module.exports = {
  getGenre: () => {
    const sql = 'SELECT * FROM genres '

    return new Promise((resolve, reject) => {
      db.query(sql, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results)
      })
    })
  },
  getGenreCount: () => {
    const sql = 'SELECT COUNT(*) FROM genres'

    return new Promise((resolve, reject) => {
      db.query(sql, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results[0].total)
      })
    })
  },
  checkGenre: (data) => {
    const sql = 'SELECT * FROM genres WHERE ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results)
      })
    })
  },
  createGenre: (data) => {
    const sql = 'INSERT INTO genres SET ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results.insertId)
      })
    })
  },
  updateGenre: (data) => {
    const sql = 'UPDATE genres SET ? WHERE ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results.affectedRows)
      })
    })
  },
  deleteBook: (data) => {
    const sql = 'DELETE FROM genres WHERE ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results.affectedRows)
      })
    })
  }
}
