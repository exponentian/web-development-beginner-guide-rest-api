const { JWT_SECRET_KEY } = require('../../config');

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
	try {
		const auth = req.headers.authorization;
		const token = auth.split(' ')[1];
		req.verifiedData = jwt.verify(token, JWT_SECRET_KEY);
		next();
	} catch(error) {
		res.status(401).json({message: 'Authorization failed'});
	}

};

module.exports = verifyToken;