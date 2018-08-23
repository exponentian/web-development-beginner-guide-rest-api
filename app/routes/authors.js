const express = require('express');
const authorsRouter = express.Router();

// use a bearer token for authorization
// Note: you can get the token after logged in
const verifyToken = require('../middlewares/verify-token');


const authorsCtrl = require('../controllers/authors');

// Chained route handlers
// https://expressjs.com/en/guide/routing.html

// CRD (create, read, delete) for authors
authorsRouter.route('/authors')
  .get(verifyToken, authorsCtrl.readAuthors)
  .post(verifyToken, authorsCtrl.createAuthors)
  .delete(verifyToken, authorsCtrl.deleteAuthors);


// RUD (read, update, delete) for each author
authorsRouter.route('/authors/:authorId')
  .get(verifyToken, authorsCtrl.readAuthor)
  .put(verifyToken, authorsCtrl.updateAuthor)
  .delete(verifyToken, authorsCtrl.deleteAuthor)


module.exports = authorsRouter;
