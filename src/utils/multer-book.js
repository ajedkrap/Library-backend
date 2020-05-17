const multer = require('multer')

const storage = multer.diskStorage({
  limits: { fileSize: 0.5 * 1024 * 1024 },
  destination: function (request, file, callback) {
    callback(null, './uploads/books')
  },
  fileFilter: function (request, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return callback(new Error('Only image files are allowed!'))
    }
    callback(null, true)
  },
  filename: function (request, file, callback) {
    callback(null, 'BOOKS_' + new Date().getTime() + '_' + file.originalname.slice(0, 5).toUpperCase() + file.originalname.slice(-4))
  }
})
const upload = multer({ storage })

module.exports = upload
