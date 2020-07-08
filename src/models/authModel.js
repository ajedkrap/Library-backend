const db = require('../utils/db')

module.exports = {
  findUser: (data) => {
    const sql = ` SELECT users.id, users.username, users.email, users.password, roles.roles 
                      FROM users LEFT JOIN roles ON users.roles_id = roles.id WHERE ?`
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results)
      })
    })
  },
  signUp: (data) => {
    const sql = 'INSERT INTO users SET ?'
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
