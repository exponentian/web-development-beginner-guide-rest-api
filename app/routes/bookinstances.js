const express = require('express');
const bookInstancesRouter = express.Router();

// use a bearer token for authorization
// Note: you can get the token after logged in
const verifyToken = require('../middlewares/verify-token');


const bookInstancesCtrl = require('../controllers/bookinstances');

// Chained route handlers
// https://expressjs.com/en/guide/routing.html

// CRD (create, read, delete) for bookinstances
bookInstancesRouter.route('/bookinstances')
  .get(verifyToken, bookInstancesCtrl.readBookInstances)
  .post(verifyToken, bookInstancesCtrl.createBookInstances)
  .delete(verifyToken, bookInstancesCtrl.deleteBookInstances);


// RUD (read, update, delete) for each bookinstance
bookInstancesRouter.route('/bookinstances/:bookinstanceId')
  .get(verifyToken, bookInstancesCtrl.readBookInstance)
  .put(verifyToken, bookInstancesCtrl.updateBookInstance)
  .delete(verifyToken, bookInstancesCtrl.deleteBookInstance);

module.exports = bookInstancesRouter;
