const db = require('../utils/db')

module.exports = {
  getAllBook: (data = []) => {
    const sql = `SELECT * FROM books WHERE title ${data[0]} ${data[1]}
                  ORDER BY title ${data[2]} LIMIT ${data[3]} OFFSET ${data[4]}`
    return new Promise((resolve, reject) => {
      db.query(sql, (error, results, fields) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results)
      })
    })
  },
  getBooksCount: (data = []) => {
    const sql = `SELECT COUNT(*) as total FROM books WHERE title ${data[0]} ${data[1]}
                  ORDER BY title ${data[2]} LIMIT ${data[3]} OFFSET ${data[4]}`
    return new Promise((resolve, reject) => {
      db.query(sql, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results[0].total)
      })
    })
  },
  getBooksByCondition: (data) => {
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
  getGenreByCondition: (data) => {
    const sql = 'SELECT * FROM genre WHERE ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        console.log(sql)
        if (error) {
          reject(Error(error))
        }
        console.log(results)
        resolve(results)
      })
    })
  },
  getAuthorByCondition: (data) => {
    const sql = 'SELECT * FROM author WHERE ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results)
      })
    })
  },
  createNewBook: (data) => {
    const sql = 'INSERT INTO books SET ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          console.log(sql)
          console.log(data)
          reject(Error(error))
        }
        resolve(results.insertId)
      })
    })
  },
  createNewGenre: (data) => {
    const sql = 'INSERT INTO genre SET ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          console.log(sql)
          console.log(data)
          reject(Error(error))
        }
        resolve(results.insertId)
      })
    })
  },
  createNewAuthor: (data) => {
    const sql = 'INSERT INTO author SET ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          console.log(sql)
          console.log(data)
          reject(Error(error))
        }
        resolve(results.insertId)
      })
    })
  },
  updateBook: (data) => {
    const sql = 'UPDATE books SET ? WHERE ?'
    console.log(data)
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        console.log(sql)
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
