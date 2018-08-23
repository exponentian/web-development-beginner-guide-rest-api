const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../../config');


const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email required'],
    unique: [true, 'Email already exists'],
    validate: {
      validator: function(v) {
        return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(v);
      },
      message: 'Valid email required'
    }
  },
  password: {
    type: String, 
    required: [true, 'Password required']
  },
  username: { 
    type: String, 
    required: [true, 'Username required'],
    unique: [true, 'Username already exists']
  },
  firstname: { 
    type: String 
  },
  lastname: { 
    type: String 
  },
  borrowedBooks: [{type: Schema.ObjectId, ref: 'BookInstance'}]
});


// Instance methods
// http://mongoosejs.com/docs/guide.html#methods


// validation for login
UserSchema.methods.loginValidation = function loginValidation() {
  return this.email && this.password ? true : false;
};


// validation for signup
UserSchema.methods.signupValidation = function signupValidation() {
  return this.email && this.password && this.username && this.firstname && this.lastname ? true : false;
};


// get a json-web-token
UserSchema.methods.getJWT = function getJWT() {
  return jwt.sign({email: this.email, username: this.username}, JWT_SECRET_KEY, {expiresIn: '1d'});
};


// Reference: https://github.com/kelektiv/node.bcrypt.js/
// hash the req. password
UserSchema.methods.hashPassword = function hashPassword(reqPassword) {
  return bcrypt.hashSync(reqPassword, 10);
};


// verify the req. password
UserSchema.methods.verifyPassword = function verifyPassword(reqPassword) {
  return bcrypt.compareSync(reqPassword, this.password);
};


// check to contain a bookintance
UserSchema.methods.containsBookInstance = function(bookinstanceId) {
  console.log(bookinstanceId);
  console.log( this.borrowedBooks.indexOf(bookinstanceId) );
  return this.borrowedBooks.indexOf(bookinstanceId) >= 0 ? true : false;
}


// push a new bookinstance
UserSchema.methods.pushBookInstance = function pushBookInstance(bookinstanceId) {
  this.borrowedBooks.push(bookinstanceId);
}


// remove a bokinstance
UserSchema.methods.removeBookInstance = function removeBookInstance(bookinstanceId) {
  const index = this.borrowedBooks.indexOf(bookinstanceId);
  if (index >= 0) {
    this.borrowedBooks.splice(index, 1);
    return true;
  } else {
    return false;
  }

}

module.exports = mongoose.model('User', UserSchema);