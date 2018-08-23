const bcrypt = require('bcrypt');


const User = require('../models/user');
const BookInstance = require('../models/bookinstance');

// Reference: mongoose queires
// http://mongoosejs.com/docs/queries.html (e.g., find(), findOne(), findById())


// log in
exports.login = (req, res, next) => {

  // create a new user
  const newUser = new User(req.body);

  // input validation
  if ( newUser.loginValidation() ) {

    User.findOne({ email: req.body.email })
      .exec((err, user) => {
        if (err) return res.status(400).json(err);

        // if user is null, return false
        if ( !user ) {
          return res.status(400).json({ message: 'No user found' });
        }

        // if req. password is not verified, return false
        if ( !user.verifyPassword(req.body.password) ) {
          return res.status(400).json({ message: 'Failed to log in. Please try again.' });
        }

        res.json({
          username: user.username,
          token: user.getJWT()
        });

      });

  } else {
    res.status(400).json({ message: 'Invalid user inputs' });
  }

};



// sign up
exports.signup = (req, res, next) => {

  // create a new user
  const newUser = new User(req.body);

  // input validation
  if ( newUser.signupValidation() ) {

    newUser.password = newUser.hashPassword(req.body.password);
    User.create(newUser, (err, user) => {
      if (err) return res.status(409).json({ message: 'Failed to create a user. Please try again.' });

      res.json({
        username: user.username,
        token: user.getJWT()
      });
    });

  } else {
    res.status(400).json({ message: 'Invalid user inputs' });
  }

};



// RUD (read, update, delete) for each user
exports.readUser = (req, res, next) => {
  User.findOne({ username: req.params.username })
    .populate({
      path: 'borrowedBooks',
      model: 'BookInstance',
      populate: {
        path: 'book',
        model: 'Book',
        populate: [{ path: 'genre', model: 'Genre' }, { path: 'author', model: 'Author' }]
      }
    })
    .exec((err, user) => {
      if (err) return res.status(400).json(err);
      
      // if user is null, return false
      if (!user) {
        return res.status(400).json({ message: 'User does not exist' });
      }

      res.json({
        email: user.email,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        borrowedBooks: user.borrowedBooks
      });
    });
};

exports.updateUser = (req, res, next) => {
  User.findOneAndUpdate({ username: req.params.username }, req.body, {new: true}, (err, user) => {
    if (err) return res.status(400).json(err);

    res.json({
      message: 'Successfully updated',
      user: {
        email: user.email,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        borrowedBooks: user.borrowedBooks
      }
    });
  });
};


exports.changeUserPassword = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    if (err) return res.status(400).json(err);

    User.findOneAndUpdate({ username: req.params.username }, { password: hashedPassword }, {new: true}, (err, user) => {
      if (err) return res.status(400).json(err);
      
      // if user is null, return error
      if (!user) return noUser(res);

      res.json({
        message: 'Successfully updated'
      });
    });

  });

};


exports.borrowBooks = (req, res, next) => {
  User.findOne({username: req.params.username}, (err, user) => {
    if (err) return res.status(400).json(err);
    
    // if user is null, return error
    if (!user) return noUser(res);

    // if user contains bookinstance id, return error
    if ( !req.body.bookinstanceId || user.containsBookInstance(req.body.bookinstanceId) ) {
      return res.status(409).json({ message: 'Invalid bookinstance' });
    }

    user.pushBookInstance(req.body.bookinstanceId);
    user.save()
      .then(result => {        
        BookInstance.findOne({_id: req.body.bookinstanceId})
          .populate('book')
          .exec((err, bookinstance) => {
            if (err) return res.status(400).json(err);

            res.json({
              message: 'Successfully borrowed a book',
              bookinstance: bookinstance
            });
        });

      })
      .catch(err => res.status(400).json(err));
  });
};

exports.returnBooks = (req, res, next) => {
  User.findOne({username: req.params.username}, (err, user) => {
    if (err) return res.status(400).json(err);
    
    // if user is null, return error
    if (!user) return noUser(res);
    
    if ( !req.body.bookinstanceId || !user.containsBookInstance(req.body.bookinstanceId) ) {
      return res.status(409).json({ message: 'Invalid bookinstance' });
    }

    const isRemoved = user.removeBookInstance(req.body.bookinstanceId);
    if ( isRemoved ) {
      user.save()
        .then(result => {
          res.json({
            message: 'Successfully returned a book',
            bookinstanceId: req.body.bookinstanceId
          });
        })
        .catch(err => res.status(400).json(err));      
    } else {
      return res.status(400).json({ message: 'Failed to remove a bookinstance' });
    }

  });
};


exports.deleteUser = (req, res, next) => {
  User.findOneAndRemove({ username: req.params.username }, (err, user) => {
    if (err) return res.status(400).json(err);

    // if user is null, return error
    if (!user) return noUser(res);

    res.json({ 
      message: 'Successfully deleted',
      user: { username: user.username }
    });
  })
};



// RD (read, delete) for users
exports.readUsers = (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) return res.status(400).json(err);
    res.json(users);
  });
};

exports.deleteUsers = (req, res, next) => {
  User.remove({}, (err, users) => {
    if (err) return res.status(400).json(err);
    res.json({ message: 'Successfully deleted' });
  });
};




// helper functions

function noUser(res) {
  res.status(404).json({ message: 'User does not exist' });
}
