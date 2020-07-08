const joi = require('@hapi/joi')
  .extend(require('@hapi/joi-date'))

const valid = {
  email: joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .messages({
      'string.empty': 'Email is missing',
      'string.email': 'Email invalid',
      'any.required': 'Email address is required'
    }),
  password: joi.string()
    .messages({
      'string.empty': 'Password is missing',
      'any.required': 'Password is required'
    }),
  string: joi.string()
    .messages({
      'any.required': 'Form need to be filled, string'
    }),
  username: joi.string()
    .pattern(/^[A-Za-z0-9_]*$/, 'letter,number,underscore')
    .messages({
      'any.required': 'Form need to be filled, string'
    }),
  date: joi.date()
    .format(['DDMMYYYY', 'DD-MM-YYYY'])
    .messages({
      'date.format': 'Date format incorrect',
      'any.required': 'Form need to be filled, date'
    })
}

exports.signUp = (data) => {
  const authSchema = joi.object().keys({
    username: valid.username.required(),
    email: valid.email.required(),
    password: valid.password.required(),
    roles: valid.string
  })
  return authSchema.validate(data)
}

exports.login = (data) => {
  const authSchema = joi.object().keys({
    email: valid.email.required(),
    password: valid.password.required()
  })
  return authSchema.validate(data)
}

exports.createBooks = (data) => {
  const createBookSchema = joi.object().keys({
    title: valid.string.required(),
    description: valid.string.required(),
    genre: valid.string.required(),
    author: valid.string.required(),
    releaseDate: valid.date.required()
  })
  return createBookSchema.validate(data)
}

exports.createGenre = (data) => {
  const createGenreSchema = joi.object().keys({
    genre: valid.string.required()
  })
  return createGenreSchema.validate(data)
}
exports.createAuthor = (data) => {
  const createGenreSchema = joi.object().keys({
    author: valid.string.required()
  })
  return createGenreSchema.validate(data)
}
exports.updateGenre = (data) => {
  const createGenreSchema = joi.object().keys({
    genre: valid.string
  })
  return createGenreSchema.validate(data)
}
exports.updateAuthor = (data) => {
  const createGenreSchema = joi.object().keys({
    author: valid.string
  })
  return createGenreSchema.validate(data)
}

exports.updateBooks = (data) => {
  const updateBookSchema = joi.object().keys({
    title: valid.string,
    description: valid.string,
    genre: valid.string,
    author: valid.string,
    releaseDate: valid.date
  })
  return updateBookSchema.validate(data)
}
