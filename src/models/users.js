const db = require('../utils/db')

module.exports = {
  getAllUser: (data) => {
    const sql = `SELECT name, email, roles, date_of_birth FROM users 
                  INNER JOIN user_details ON users.id = user_details.user_id 
                    INNER JOIN roles ON users.roles_id = roles.id  
                      WHERE name ${data[0]} ${data[1]}
                      ORDER BY user_details.name ${data[2]} LIMIT ${data[3]} OFFSET ${data[4]}`
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results, fields) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results)
      })
    })
  },
  getUsersCount: (data = []) => {
    const sql = `SELECT COUNT(*) as total FROM users 
                  INNER JOIN user_details ON users.id = user_details.user_id 
                    INNER JOIN roles ON users.roles_id = roles.id  
                      WHERE name ${data[0]} ${data[1]}
                       ORDER BY users.id ${data[2]} LIMIT ${data[3]} OFFSET ${data[4]}`
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results[0].total)
      })
    })
  },
  createUser: (data) => {
    const sql = 'INSERT INTO users SET ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results.insertId)
      })
    })
  },
  createUserDetails: (data) => {
    const sql = 'INSERT INTO user_details SET ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results.insertId)
      })
    })
  },
  getUsersByCondition: (data) => {
    const sql = 'SELECT * FROM users WHERE ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results)
      })
    })
  },
  getUserDetailByCondition: (data) => {
    const sql = `SELECT users.id as id, 
                  user_details.name as name, 
                    users.email as email, 
                      users.password as password, 
                        users.active as active,
                          users.roles_id as roles FROM users 
                            INNER JOIN user_details ON users.id = user_details.user_id 
                               WHERE ?`
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results)
      })
    })
  },
  getActivatedUser: (data) => {
    const sql = 'SELECT * FROM users WHERE ? AND active=1'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results)
      })
    })
  },
  getRegisteredUser: (data) => {
    const sql = 'SELECT * FROM users WHERE ? AND ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results)
      })
    })
  },
  updateUserActivation: (data) => {
    const sql = 'UPDATE users SET ? WHERE ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results.affectedRows)
      })
    })
  },
  updateUser: (data) => {
    const sql = 'UPDATE user_details SET ? WHERE ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results.affectedRows)
      })
    })
  },
  deleteUser: (data) => {
    const sql = 'DELETE FROM users WHERE ?'
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
