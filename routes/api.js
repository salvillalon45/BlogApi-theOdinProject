const express = require('express');
const router = express.Router();
// const auth_controller = require('../controllers/authController');

router.get('/', function (req, res, next) {
	res.status(200).json('You reached the blog api');
});

// SIGNUP
// ------------------------------------------------------------
// router.get('/sign-up', auth_controller.sign_up_get);
// router.post('/sign-up', auth_controller.sign_up_post);

// LOGIN/LOGOUT
// ------------------------------------------------------------
// router.get('/log-in', auth_controller.log_in_get);
// router.post('/log-in', auth_controller.log_in_post);
// router.get('/log-out', auth_controller.log_out_get);

// MESSAGE
// ------------------------------------------------------------
// router.get('/create-message', message_controller.create_message_get);
// router.post('/create-message', message_controller.create_message_post);
// router.get('/delete-message/:id', message_controller.message_delete);

module.exports = router;
