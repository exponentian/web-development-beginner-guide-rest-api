const express = require('express');
const genresRouter = express.Router();

// use a bearer token for authorization
// Note: you can get the token after logged in
const verifyToken = require('../middlewares/verify-token');


const genresCtrl = require('../controllers/genres');

// Chained route handlers
// https://expressjs.com/en/guide/routing.html

// CRD (create, read, delete) for genres
genresRouter.route('/genres')
  .get(verifyToken, genresCtrl.readGenres)
  .post(verifyToken, genresCtrl.createGenres)
  .delete(verifyToken, genresCtrl.deleteGenres);


// RUD (read, update, delete) for each genre
genresRouter.route('/genres/:genreId')
  .get(verifyToken, genresCtrl.readGenre)
  .put(verifyToken, genresCtrl.updateGenre)
  .delete(verifyToken, genresCtrl.deleteGenre)


module.exports = genresRouter;
