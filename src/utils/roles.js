module.exports = {
  getRoles: (_roles) => {
    const _result = parseInt(_roles)
    if (_result === 1) {
      const _newRoles = ['Admin', 1]
      return _newRoles
    } else {
      const _newRoles = ['Users', 2]
      return _newRoles
    }
  }
}
