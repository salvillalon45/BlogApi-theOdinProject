const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth_controller = require('../controllers/authController');
const post_controller = require('../controllers/postController');
const comment_controller = require('../controllers/commentController');

router.get('/', function (req, res, next) {
	res.status(200).json('You reached the blog api');
});

router.get(
	'/protected',
	passport.authenticate('jwt', { session: false }),
	function (req, res, next) {
		res.status(200).json('Enter a protected route');
	}
);

// SIGNUP
// ------------------------------------------------------------
router.post('/sign-up', auth_controller.sign_up_post);

// LOGIN/LOGOUT
// ------------------------------------------------------------
router.post('/log-in', auth_controller.log_in_post);
router.get('/log-out', auth_controller.log_out_get);

// POSTS
// ------------------------------------------------------------
router.get('/posts', post_controller.get_posts);
router.get('/posts/:postid', post_controller.post_detail);
router.post('/posts', post_controller.create_post);
router.delete('/posts/:postid', post_controller.delete_post);
router.put('/posts/:postid', post_controller.update_post);

// COMMENTS
// ------------------------------------------------------------
router.get(
	'/posts/:postid/comments',
	passport.authenticate('jwt', { session: false }),
	comment_controller.get_comments
);
router.post('/posts/:postid/comments', comment_controller.create_comment);
router.delete(
	'/posts/:postid/comments/:commentid',
	comment_controller.delete_comment
);
router.put(
	'/posts/:postid/comments/:commentid',
	comment_controller.update_comment
);

module.exports = router;
