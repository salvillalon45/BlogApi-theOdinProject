const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
require('dotenv').config();

async function checkUserExists(username) {
	try {
		const isUserInDB = await User.find({ username });
		if (isUserInDB.length > 0) {
			return true;
		}

		return false;
	} catch (err) {
		throw {
			message: 'CHECK USER EXISTS: Error when checking for users exists',
			context: err.message
		};
	}
}

async function genPassword(userPassword) {
	try {
		const saltRounds = 10;
		const hashPassword = await bcrypt.hash(userPassword, saltRounds);

		return hashPassword;
	} catch (err) {
		throw {
			message: 'GEN PASSWORD: Error when trying to hash password',
			context: err.message
		};
	}
}

function issueJWT(user) {
	const _id = user._id;
	const expiresIn = '7d';
	const payload = {
		sub: _id,
		iat: Date.now()
	};
	const signedToken = jwt.sign(payload, process.env.SECRET_KEY, {
		expiresIn: expiresIn
	});

	return {
		token: `Bearer ${signedToken}`,
		expiresIn: expiresIn
	};
}

module.exports = {
	issueJWT,
	genPassword,
	checkUserExists
};
