const Post = require('../models/post');
const utils = require('../libs/utils');
const { body } = require('express-validator');
const { checkValidationErrors, isObjectIdValid, checkIdExists } = utils;

exports.get_posts = async function (req, res, next) {
	try {
		const posts = await Post.find().populate('author');

		if (posts === null) {
			res.status(200).json({
				message: 'GET POSTS: No posts available for this post',
				posts
			});
		} else {
			res.status(200).json({
				message: 'GET POSTS: Posts retrieved successfully',
				posts
			});
		}
	} catch (err) {
		res.status(500).json({
			message: 'GET POSTS: Error while trying to retrieve all posts',
			error: err
		});
	}
};

exports.post_detail = async function (req, res, next) {
	try {
		const { postid } = req.params;
		const post = await Post.findById(postid).populate('author');

		if (post === null) {
			res.status(200).json({
				message: 'GET POST DETAIL: No posts available for this id',
				post
			});
		} else {
			res.status(200).json({
				message: 'GET POST DETAIL: Post retrieved successfully',
				post
			});
		}
	} catch (err) {
		res.status(500).json({
			message:
				'GET POST DETAIL: Error while trying to retrieve post by id',
			error: err
		});
	}
};

exports.create_post = [
	body('content')
		.isLength({ min: 1 })
		.trim()
		.escape()
		.withMessage('Post content cannot be empty'),
	body('author')
		.isLength({ min: 1 })
		.trim()
		.escape()
		.withMessage('Author cannot be empty'),
	body('title')
		.isLength({ min: 1 })
		.trim()
		.escape()
		.withMessage('Title cannot be empty'),
	async function (req, res, next) {
		try {
			checkValidationErrors(req, res, 'CREATE POST: Error with fields');

			const { content, author, title } = req.body;
			const newPost = new Post({
				timestamp: new Date(),
				content,
				author,
				title
			});

			await newPost.save();

			res.status(200).json({
				message: 'CREATE POST: Post created successfully',
				comment: newPost
			});
		} catch (err) {
			res.status(500).json({
				message: 'CREATE POST: Error while trying to create a post',
				error: err
			});
		}
	}
];

exports.delete_post = async function (req, res, next) {
	try {
		const { postid } = req.params;

		console.log({ postid });
		checkIdExists(
			req,
			res,
			postid,
			'DELETE POST: Post id not found',
			'post'
		);

		const deletedPost = await Post.findByIdAndRemove(postid);

		if (deletedPost === null) {
			res.status(200).json({
				message: 'DELETE POST: Post id not found',
				post: deletedPost
			});
		} else {
			res.status(200).json({
				message: 'DELETE POST: Post deleted successfully',
				post: deletedPost
			});
		}
	} catch (err) {
		res.status(500).json({
			message: 'DELETE POST: Error while trying to delete a post',
			error: err
		});
	}
};
