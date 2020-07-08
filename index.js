require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { APP_PORT } = process.env
const os = require('os')

const app = express()

// form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// form-data
app.use(bodyParser.json())

// Cross-Origins Resource Sharing Initialization
app.use(cors())

app.use('/profile_picture', express.static('uploads/users'))
app.use('/cover', express.static('uploads/books'))

app.get('/', (request, response) => {
  const data = {
    name: 'BackEnd is Running'
  }
  response.send(data)
})

app.get('/home', (request, response) => {
  const home = {
    name: 'Welcome home, braw'
  }
  response.send(home)
})

const books = require('./src/routes/bookRoute')
const auth = require('./src/routes/authRoute')
const genre = require('./src/routes/genreRoute')
// const user = require('./src/routes/users')
const loans = require('./src/routes/loansRoute')

app.use('/books', books)
app.use('/auth', auth)
app.use('/genre', genre)
// app.use('/user', user)
app.use('/loans', loans)

app.get('*', (request, response) => {
  response.status(404).send('Page not found 404')
})

app.listen(APP_PORT, () => {
  console.log(os.networkInterfaces())
  console.log(`Express app is listening on port ${APP_PORT}`)
})
