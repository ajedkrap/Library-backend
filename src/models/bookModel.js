const db = require('../utils/db')

module.exports = {
  getBook: (data, start, end) => {
    let sql = 'SELECT * FROM books '

    if (data.search) {
      sql += `WHERE title LIKE '%${data.search}%' `
    }

    if (data.genre_id) {
      if (data.search) {
        sql += `AND genre_id LIKE '%${data.genre_id}%' `
      } else {
        sql += `WHERE genre_id LIKE '%${data.genre_id}%' `
      }
    }

    if (parseInt(data.sort)) {
      sql += 'ORDER BY title DESC '
      sql += `LIMIT ${start}, ${end}`
    } else {
      sql += 'ORDER BY title ASC '
      sql += `LIMIT ${start}, ${end}`
    }

    return new Promise((resolve, reject) => {
      db.query(sql, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results)
      })
    })
  },
  getBookCount: (data) => {
    let sql = 'SELECT COUNT(*) as total FROM books '
    sql += `${data.search ? `WHERE title LIKE '%${data.search}%'` : ''}`

    if (data.genre_id) {
      if (data.search) {
        sql += `AND genre_id LIKE '%${data.genre_id}%' `
      } else {
        sql += `WHERE genre_id LIKE '%${data.genre_id}%' `
      }
    }

    return new Promise((resolve, reject) => {
      if (data.search || data.genre_id) {
        db.query(sql, (error, results) => {
          if (error) {
            reject(Error(error))
          }
          resolve(results[0].total)
        })
      } else {
        db.query(sql, data, (error, results) => {
          if (error) {
            reject(Error(error))
          }
          resolve(results[0].total)
        })
      }
    })
  },
  checkBook: (data) => {
    const sql = 'SELECT * FROM books WHERE ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results)
      })
    })
  },
  checkBookByGenre: (data) => {
    const sql = `SELECT genre_id FROM books WHERE genre_id LIKE '%${data.id}%'`
    return new Promise((resolve, reject) => {
      db.query(sql, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results)
      })
    })
  },
  createBook: (data) => {
    const sql = 'INSERT INTO books SET ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results.insertId)
      })
    })
  },
  updateBook: (data) => {
    const sql = 'UPDATE books SET ? WHERE ?'
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
    const sql = 'DELETE FROM books WHERE ?'
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
