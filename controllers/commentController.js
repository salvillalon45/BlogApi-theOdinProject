const Comment = require('../models/comment');
const Post = require('../models/post');
const utils = require('../libs/utils');
const { body } = require('express-validator');
const { checkValidationErrors, checkIdExists, checkDBOperationResult } = utils;

exports.get_comments = async function (req, res, next) {
	try {
		const { postid } = req.params;

		checkIdExists(
			req,
			res,
			postid,
			'GET COMMENTS: Post id not found',
			'comments'
		);

		const comments = await Comment.find({ post_ref: postid }).populate(
			'user_ref post_ref'
		);

		if (comments === null || comments.length === 0) {
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
	async function (req, res, next) {
		try {
			const { content, user_ref } = req.body;
			const { postid } = req.params;

			checkValidationErrors(
				req,
				res,
				'CREATE COMMENT: Error with fields'
			);
			checkIdExists(
				req,
				res,
				user_ref,
				'CREATE COMMENTS: User id not found',
				'comment'
			);
			checkIdExists(
				req,
				res,
				postid,
				'CREATE COMMENTS: Post id not found',
				'comment'
			);

			const postResult = await Post.findById(postid);

			if (postResult === null) {
				res.status(401).json({
					message: 'CREATE COMMENT: Post id not found',
					post: postResult
				});
			}

			const newComment = new Comment({
				timestamp: new Date(),
				content,
				user_ref,
				postid
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

		checkIdExists(
			req,
			res,
			commentid,
			'DELETE COMMENT: Comment id not found',
			'comment'
		);

		const deletedComment = await Comment.findByIdAndRemove(commentid);

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

exports.update_comment = [
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
	async function (req, res, next) {
		try {
			const { content, user_ref } = req.body;
			const { postid, commentid } = req.params;
			console.log({ postid, commentid });
			checkValidationErrors(
				req,
				res,
				'UPDATE COMMENT: Error with fields'
			);
			checkIdExists(
				req,
				res,
				user_ref,
				'UPDATE COMMENTS: User id not found',
				'comment'
			);
			checkIdExists(
				req,
				res,
				postid,
				'UPDATE COMMENTS: Post id not found',
				'comment'
			);

			const updatedComment = new Comment({
				timestamp: new Date(),
				content,
				user_ref,
				postid,
				_id: commentid
			});

			const postResult = await Post.findById(postid);

			if (postResult === null) {
				res.status(401).json({
					message: 'UPDATE COMMENT: Post id not found',
					post: postResult
				});
			}

			const commentResult = await Comment.findByIdAndUpdate(
				commentid,
				updatedComment
			);

			checkDBOperationResult(
				res,
				commentResult,
				'UPDATE COMMENT: Comment updated successfully',
				'UPDATE COMMENT: Could not find comment to udpate',
				'comment'
			);
		} catch (err) {
			res.status(500).json({
				message:
					'UPDATE COMMENT: Error while trying to update a comment',
				error: err.message
			});
		}
	}
];
