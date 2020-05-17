const db = require('../utils/db')

module.exports = {
  getLoanList: (data = []) => {
    const sql = `SELECT loans.id as id, loans.user_id as user_id,
                        users.email as email, loans.user_name as user_name,
                        loan_status.status as status,
                        loans.date_loaned as date_loaned, 
                        loans.date_return as date_return
                          FROM loans INNER JOIN loan_status ON loans.status_id=loan_status.id
                          INNER JOIN users ON loans.user_id = users.id
                          WHERE loans.id ${data[0]}
                          ORDER BY loans.id ${data[1]} LIMIT ${data[2]} OFFSET ${data[3]}`
    return new Promise((resolve, reject) => {
      db.query(sql, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results)
      })
    })
  },
  getLoansCount: (data = []) => {
    const sql = `SELECT COUNT(*) as total FROM loans 
                  INNER JOIN loan_status ON loans.status_id=loan_status.id
                   INNER JOIN users ON loans.user_id = users.id
                    WHERE loans.id ${data[0]}
                     ORDER BY loans.id ${data[1]} LIMIT ${data[2]} OFFSET ${data[3]}`
    return new Promise((resolve, reject) => {
      db.query(sql, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results[0].total)
      })
    })
  },
  getLoanByCondition: (data) => {
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
  getLoanedBook: (data) => {
    const sql = 'SELECT * FROM loaned_books WHERE ?'
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
