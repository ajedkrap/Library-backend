const bcrypt = require('bcryptjs')

module.exports = {
  hashPassword: (text) => {
    const salt = bcrypt.genSaltSync(10)
    const password = bcrypt.hashSync(text, salt)
    return password
  },
  comparePassword: (text, hash) => {
    const isMatch = bcrypt.compareSync(text, hash)

    if (isMatch) {
      return true
    } else {
      return false
    }
  }
}
