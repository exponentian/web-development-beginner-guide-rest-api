exports.API = '/v1/api';


// [TODO] Please add your MongoDB URI
// exports.MONGODB_URI = '<YOUR MONGODB URI>';
exports.MONGODB_URI = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/local-library';

// [TODO] Please add your JWT_SECRET_KEY (jsonwebtoken key)
// exports.JWT_SECRET_KEY = '<YOUR JWT SECRET KEY>';
exports.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'jwt-secret-key';