const express = require('express');
const booksRouter = express.Router();

// use a bearer token for authorization
// Note: you can get the token after logged in
const verifyToken = require('../middlewares/verify-token');


const booksCtrl = require('../controllers/books');

// Chained route handlers
// https://expressjs.com/en/guide/routing.html

// CRD (create, read, delete) for books
booksRouter.route('/books')
  .get(verifyToken, booksCtrl.readBooks)
  .post(verifyToken, booksCtrl.createBooks)
  .delete(verifyToken, booksCtrl.deleteBooks);


// RUD (read, update, delete) for each book
booksRouter.route('/books/:bookId')
  .get(verifyToken, booksCtrl.readBook)
  .put(verifyToken, booksCtrl.updateBook)
  .delete(verifyToken, booksCtrl.deleteBook)


module.exports = booksRouter;
