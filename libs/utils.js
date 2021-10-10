const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { validationResult } = require('express-validator');
const ObjectId = require('mongoose').Types.ObjectId;
require('dotenv').config();

function isObjectIdValid(id) {
	return ObjectId.isValid(id)
		? String(new ObjectId(id) === id)
			? true
			: false
		: false;
}

function checkDBOperationResult(
	res,
	dbResult,
	successMessage,
	errorMessage,
	key
) {
	if (dbResult === null || dbResult.length === 0) {
		res.status(401).json({
			message: errorMessage,
			[key]: dbResult
		});
	} else {
		res.status(200).json({
			message: successMessage,
			[key]: dbResult
		});
	}
}

function checkIdExists(res, id, message, key) {
	console.log('Inside checkIdexists');
	if (isObjectIdValid(id) === false) {
		console.log('wrong id');
		res.status(200).json({
			message,
			[key]: null
		});
	} else {
		console.log('good id');
	}
}

function checkValidationErrors(req, res, message) {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		const validationErrors = errors.array().map((e) => {
			return e.msg;
		});
		res.status(200).json({
			message,
			context: validationErrors
		});
	}
}

async function checkValidPassword(foundUserPassword, inputPassword) {
	const match = await bcrypt.compare(inputPassword, foundUserPassword);

	return match ? true : false;
}

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
	isObjectIdValid,
	genPassword,
	checkValidationErrors,
	checkUserExists,
	checkIdExists,
	checkValidPassword,
	checkDBOperationResult
};
