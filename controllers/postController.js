const Post = require('../models/post');
const utils = require('../libs/utils');
const { body, validationResult } = require('express-validator');
const { genPassword, issueJWT, checkUserExists, checkValidPassword } = utils;

exports.get_posts = async function (req, res, next) {
	try {
		const posts = await Post.find().populate('author');

		if (posts === null) {
			res.status(200).json({
				message: 'No posts available for this post',
				posts
			});
		} else {
			res.status(200).json({
				message: 'Posts retrieved successfully',
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
				message: 'No posts available for this id',
				post
			});
		} else {
			res.status(200).json({
				message: 'Post retrieved successfully',
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
