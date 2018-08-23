const express = require('express');
const usersRouter = express.Router();

// use a bearer token for authorization
// Note: you can get the token after logged in
const verifyToken = require('../middlewares/verify-token');

const usersCtrl = require('../controllers/users');


// log in
usersRouter.post('/login', usersCtrl.login)

// sign up
usersRouter.post('/signup', usersCtrl.signup);

// RUD (read, update, delete) for each user
usersRouter.route('/:username')
  .get(verifyToken, usersCtrl.readUser)
  .put(verifyToken, usersCtrl.updateUser)
  .delete(verifyToken, usersCtrl.deleteUser);

usersRouter.put('/:username/change-password', verifyToken, usersCtrl.changeUserPassword);
usersRouter.put('/:username/borrow-books', verifyToken, usersCtrl.borrowBooks);
usersRouter.put('/:username/return-books', verifyToken, usersCtrl.returnBooks);

// Admin only
// RD (read, delete) for users
usersRouter.route('/')
  .get(verifyToken, usersCtrl.readUsers)
  .delete(verifyToken, usersCtrl.deleteUsers);

module.exports = usersRouter;
