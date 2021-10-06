const User = require('../models/user');
const utils = require('../libs/utils');
const { body, validationResult } = require('express-validator');
const { genPassword, issueJWT, checkUserExists } = utils;

exports.sign_up_post = [
	body('username')
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage('Username must be at least 6 characters'),
	body('password')
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage('Password must be at least 1 character'),

	async function (req, res, next) {
		try {
			const errors = validationResult(req);
			console.log(errors);
			if (!errors.isEmpty()) {
				console.log('THER ARE ERRORS');
				const errorsFilter = errors.filter(function (e) {
					console.log(e);
					return e.msg;
				});
				console.log('What is errorsFilter');
				console.log(errorsFilter);
				throw {
					message: 'SIGN UP: Error with fields',
					context: errorsFilter
				};
			}
			const { username, password } = req.body;

			if (await checkUserExists(username)) {
				throw {
					message:
						'CHECK USER EXISTS: Error when checking for users exists',
					context: 'User already exists'
				};
			}

			const hashPassword = await genPassword(password);
			const newUser = new User({
				username: username,
				password: hashPassword,
				has_account: false
			});

			const newUserResult = await newUser.save();
			const { token, expiresIn } = issueJWT(newUserResult);
			res.status(200).json({
				user: newUserResult,
				token: token,
				expiresIn: expiresIn
			});
		} catch (err) {
			res.status(500).json({
				message: 'SIGN UP: Error while trying to save new user in db',
				error: err
			});
		}
	}
];
