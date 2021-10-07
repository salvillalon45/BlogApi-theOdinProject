const Comment = require('../models/comment');
const utils = require('../libs/utils');
const { body, validationResult } = require('express-validator');
const { genPassword, issueJWT, checkUserExists, checkValidPassword } = utils;

exports.comment_get = async function (req, res, next) {
	try {
		const { postid } = req.params;
		console.log(req.params);
		const comments = await Comment.find({ post_ref: postid }).populate(
			'user_ref post_ref'
		);
		if (comments === null) {
			res.status(200).json({
				message: 'No comments available for this post',
				comments
			});
		} else {
			res.status(200).json({
				message: 'Comments retrieved successfully',
				comments
			});
		}
	} catch (err) {
		res.status(500).json({
			message:
				'GET COMMENTS: Error while trying to retrieve all comments for a post',
			error: err
		});
	}
};
