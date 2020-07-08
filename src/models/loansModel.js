const db = require('../utils/db')

module.exports = {
  getLoanList: (data) => {
    let sql = `SELECT loans.id as id,
                        loans.user_id as user_id,
                        users.email as email, 
                        users.username as username,
                        loans.loan_date as loan_date, 
                        loans.due_date as due_date,
                        loans.return_date as return_date,
                        loan_status.status as status
                          FROM loans INNER JOIN loan_status ON loans.status_id=loan_status.id
                          INNER JOIN users ON loans.user_id = users.id `

    if (parseInt(data.sort)) {
      sql += 'ORDER BY loan_date ASC'
    } else {
      sql += 'ORDER BY loan_date DESC'
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
  getLoanListByUser: (data) => {
    let sql = `SELECT loans.id as id,
                        loans.user_id as user_id,
                        users.email as email, 
                        users.username as username,
                        loans.loan_date as loan_date, 
                        loans.due_date as due_date,
                        loans.return_date as return_date,
                        loan_status.status as status
                          FROM loans INNER JOIN loan_status ON loans.status_id=loan_status.id
                          INNER JOIN users ON loans.user_id = users.id `

    sql += `WHERE user_id=${data.user_id} `

    if (parseInt(data.sort)) {
      sql += 'ORDER BY loan_date ASC '
    } else {
      sql += 'ORDER BY loan_date DESC '
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
  checkLoan: (data) => {
    const sql = 'SELECT * FROM loans WHERE ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results)
      })
    })
  },
  getAllLoanedBook: () => {
    const sql = 'SELECT book_title, COUNT(id) as total FROM loaned_books GROUP BY book_title'
    return new Promise((resolve, reject) => {
      db.query(sql, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results)
      })
    })
  },
  checkLoanedBook: (data) => {
    const sql = 'SELECT * FROM loaned_books INNER JOIN books ON loaned_books.book_id = books.id WHERE ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results)
      })
    })
  },
  createLoan: (data) => {
    const sql = 'INSERT INTO loans SET ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results.insertId)
      })
    })
  },
  setLoan: (data) => {
    const sql = 'INSERT INTO loans SET ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results.insertId)
      })
    })
  },
  setLoanedBook: (data) => {
    const sql = 'INSERT INTO loaned_books SET ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results.insertId)
      })
    })
  },
  updateLoan: (data) => {
    const sql = 'UPDATE loans SET ? WHERE ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results.affectedRows)
      })
    })
  },
  deleteLoanedBook: (data) => {
    const sql = 'DELETE FROM loaned_books WHERE ?'
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
