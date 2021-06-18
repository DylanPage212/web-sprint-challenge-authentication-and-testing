const router = require('express').Router();
const bcrypt = require('bcryptjs');
const tokenjs = require('./token');
const Users = require('../users/users-model.js');



const {checkUsernameExists, validateCredentials, checkUsernameUnique} = require('../middleware/middleware');



router.post('/register', validateCredentials, checkUsernameUnique, async (req, res, next) => {

		let user = req.user;

		const rounds = process.env.BCRYPT_ROUNDS || 6;

		const hash = bcrypt.hashSync(user.password, rounds);

		user.password = hash;

		Users.addUser(user)
			.then(newUser => {
				res.status(201).json(newUser);
			})
			.catch(next);
	}
);

router.post('/login', validateCredentials, checkUsernameExists, (req, res, next) => {

		const { username, password, id } = req.user;

		if (bcrypt.compareSync(password, req.validUser.password)) {
			const token = tokenjs({
        id,
				username
			});
			res.status(200).json({
				message: `welcome, ${username}`,
				token
			});
      
		} else {
			next({
				status: 401,
				message: 'invalid credentials'
			});
		}
	}
);

module.exports = router;