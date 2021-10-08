const User = require('../models/user');
const utils = require('../libs/utils');
const { body, validationResult } = require('express-validator');
const { genPassword, issueJWT, checkUserExists, checkValidPassword } = utils;

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

exports.log_in_post = async function (req, res, next) {
	try {
		const { username, password } = req.body;

		const foundUser = await User.findOne({ username });

		if (!foundUser) {
			throw {
				message: 'LOG IN: Error while trying to log in user',
				context: 'Cannot find user'
			};
		}

		if (checkValidPassword(foundUser.password, password)) {
			const { token, expiresIn } = issueJWT(foundUser);

			res.status(200).json({
				token: token,
				expiresIn: expiresIn,
				user: foundUser
			});
		} else {
			throw {
				message: 'LOG IN: Error while trying to log in user',
				context: 'Entered wrong password'
			};
		}
	} catch (err) {
		res.status(500).json({
			message: 'LOG IN: Error while trying to log in user',
			error: err
		});
	}
};

exports.log_out_get = function (req, res, next) {
	console.log('Made it logout');
	req.logout();
	res.status(200).json({
		message: 'LOG OUT'
	});
};
