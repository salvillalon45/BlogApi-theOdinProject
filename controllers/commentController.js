const Comment = require('../models/comment');
const utils = require('../libs/utils');
const { body } = require('express-validator');
const { checkValidationErrors } = utils;

exports.get_comments = async function (req, res, next) {
	try {
		const { postid } = req.params;
		console.log(req.params);
		const comments = await Comment.find({ post_ref: postid }).populate(
			'user_ref post_ref'
		);
		if (comments === null) {
			res.status(200).json({
				message: 'GET COMMENTS: No comments available for this post',
				comments
			});
		} else {
			res.status(200).json({
				message: 'GET COMMENTS: Comments retrieved successfully',
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

exports.create_comment = [
	body('content')
		.isLength({ min: 1 })
		.trim()
		.escape()
		.withMessage('Comment content cannot be empty'),
	body('user_ref')
		.isLength({ min: 1 })
		.trim()
		.escape()
		.withMessage('User ref cannot be empty'),
	body('post_ref')
		.isLength({ min: 1 })
		.trim()
		.escape()
		.withMessage('Post ref cannot be empty'),
	async function (req, res, next) {
		checkValidationErrors(req, res, 'CREATE COMMENT: Error with fields');

		try {
			const { content, user_ref, post_ref } = req.body;
			const newComment = new Comment({
				timestamp: new Date(),
				content,
				user_ref,
				post_ref
			});

			await newComment.save();

			res.status(200).json({
				message: 'CREATE COMMENT: Comment created successfully',
				comment: newComment
			});
		} catch (err) {
			res.status(500).json({
				message:
					'CREATE COMMENT: Error while trying to create a comment',
				error: err
			});
		}
	}
];

exports.delete_comment = async function (req, res, next) {
	try {
		const { commentid } = req.params;
		const deletedComment = await Comment.findByIdAndRemove(commentid);
		console.log('What is deleteCOmment');
		console.log(deletedComment);
		if (deletedComment === null) {
			res.status(200).json({
				message: 'DELETE COMMENT: Comment id not found',
				comment: deletedComment
			});
		} else {
			res.status(200).json({
				message: 'DELETE COMMENT: Comment deleted successfully',
				comment: deletedComment
			});
		}
	} catch (err) {
		res.status(500).json({
			message: 'DELETE COMMENT: Error while trying to delete a comment',
			error: err
		});
	}
};
