const User = require('../models/user');
const utils = require('../libs/utils');
const { body } = require('express-validator');
const {
	genPassword,
	issueJWT,
	checkUserExists,
	checkValidPassword,
	checkValidationErrors
} = utils;

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
			checkValidationErrors(req, res, 'SIGN UP: Error with fields');

			const { username, password } = req.body;

			if (await checkUserExists(username)) {
				console.log('user exists');
				throw {
					message: 'SIGN UP: Error when checking for users exists',
					errors: ['User already exists']
				};
			}

			const hashPassword = await genPassword(password);
			const newUser = new User({
				username: username,
				password: hashPassword,
				has_account: false
			});

			const newUserResult = await newUser.save();
			console.log('user does not exists');
			res.status(200).json({
				user: newUserResult
			});
		} catch (err) {
			console.log('SIGN UP: Error while trying to save new user in db');
			console.log(err);
			res.status(500).json({
				message: 'SIGN UP: Error while trying to save new user in db',
				errors: err.errors
			});
		}
	}
];

exports.log_in_post = async function (req, res, next) {
	try {
		const { username, password } = req.body;

		const foundUser = await User.findOne({ username });

		if (!foundUser) {
			throw {
				message: 'LOG IN: Error while trying to log in user',
				errors: ['Cannot find user']
			};
		}

		if (await checkValidPassword(foundUser.password, password)) {
			const { token, expiresIn } = issueJWT(foundUser);

			res.status(200).json({
				token: token,
				expiresIn: expiresIn,
				user: foundUser
			});
		} else {
			throw {
				message: 'LOG IN: Error while trying to log in user',
				errors: ['Entered wrong password']
			};
		}
	} catch (err) {
		console.log('LOG IN: Error while trying to log in user');
		console.log(err);
		res.status(500).json({
			message: 'LOG IN: Error while trying to log in user',
			errors: err.errors
		});
	}
};
