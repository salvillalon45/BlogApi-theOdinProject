const Post = require('../models/post');
const utils = require('../libs/utils');
const { body } = require('express-validator');
const { checkValidationErrors, checkIdExists, checkDBOperationResult } = utils;

exports.get_posts = async function (req, res, next) {
	try {
		const posts = await Post.find().populate('author');

		checkDBOperationResult(
			res,
			posts,
			'GET POSTS: Posts retrieved successfully',
			'GET POSTS: No posts available for this post',
			'posts'
		);
		// if (posts === null || posts.length === 0) {
		// 	res.status(200).json({
		// 		message: 'GET POSTS: No posts available for this post',
		// 		posts
		// 	});
		// } else {
		// 	res.status(200).json({
		// 		message: 'GET POSTS: Posts retrieved successfully',
		// 		posts
		// 	});
		// }
	} catch (err) {
		console.log('GET POSTS: Error while trying to retrieve all posts');
		console.log(err);
		console.log(err.message);
		res.status(500).json({
			message: 'GET POSTS: Error while trying to retrieve all posts',
			error: err.message
		});
	}
};

exports.post_detail = async function (req, res, next) {
	try {
		const { postid } = req.params;
		console.log({ postid });
		checkIdExists(
			res,
			postid,
			'GET POST DETAIL: Post id not found',
			'post'
		);

		const post = await Post.findById(postid).populate('author');
		console.log('What is post');
		console.log(post);
		checkDBOperationResult(
			res,
			post,
			'GET POST DETAIL: Post retrieved successfully',
			'GET POST DETAIL: No posts available for this id',
			'post'
		);
		// if (post === null) {
		// 	res.status(200).json({
		// 		message: 'GET POST DETAIL: No posts available for this id',
		// 		post
		// 	});
		// } else {
		// 	res.status(200).json({
		// 		message: 'GET POST DETAIL: Post retrieved successfully',
		// 		post
		// 	});
		// }
	} catch (err) {
		console.log(
			'GET POST DETAIL: Error while trying to retrieve post by id'
		);
		console.log(err);
		res.status(500).json({
			message:
				'GET POST DETAIL: Error while trying to retrieve post by id',
			error: err.message
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
			console.log('CREATE POST: Error while trying to create a post');
			console.log(err);
			res.status(500).json({
				message: 'CREATE POST: Error while trying to create a post',
				error: err.message
			});
		}
	}
];

exports.delete_post = async function (req, res, next) {
	try {
		const { postid } = req.params;

		checkIdExists(
			res,
			postid,
			'The Post you are trying to delete does not exist. Check the post id of this post.',
			'postid'
		);

		const deletedPost = await Post.findByIdAndRemove(postid);

		checkDBOperationResult(
			res,
			deletedPost,
			'Post deleted successfully',
			'Post id not found',
			'post'
		);
		// if (deletedPost === null) {
		// 	res.status(200).json({
		// 		message: 'DELETE POST: Post id not found',
		// 		post: deletedPost
		// 	});
		// } else {
		// 	res.status(200).json({
		// 		message: '',
		// 		post: deletedPost
		// 	});
		// }
	} catch (err) {
		console.log('DELETE POST: Error while trying to delete a post');
		console.log(err);
		res.status(500).json({
			message: 'DELETE POST: Error while trying to delete a post',
			errors: err.errors
		});
	}
};

exports.update_post = [
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
			const { postid } = req.params;
			const { content, author, title } = req.body;

			checkValidationErrors(req, res, 'UPDATE POST: Error with fields');

			checkIdExists(
				res,
				postid,
				'UPDATE POST: Post id not found',
				'post'
			);

			const updatedPost = new Post({
				content,
				timestamp: new Date(),
				author,
				title,
				_id: postid
			});

			const postResult = await Post.findByIdAndUpdate(
				postid,
				updatedPost
			);

			checkDBOperationResult(
				res,
				postResult,
				'UPDATE POST: Post updated successfully',
				'UPDATE POST: Could not find post to udpate',
				'post'
			);
		} catch (err) {
			console.log('UPDATE POST: Error while trying to update a post');
			console.log(err);
			res.status(500).json({
				message: 'UPDATE POST: Error while trying to update a post',
				errors: err.errors
			});
		}
	}
];
