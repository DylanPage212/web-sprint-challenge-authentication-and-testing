const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../secrets');

module.exports = function (user) {

	const credentials = {
		subject: user.id,
		username: user.username
	};

	const options = {
		expiresIn: '1 day'
	};

	return jwt.sign(credentials, JWT_SECRET, options);
};