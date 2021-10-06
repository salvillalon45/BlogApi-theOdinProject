const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
	timestamp: {
		type: Date,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	user_ref: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	post_ref: {
		type: Schema.Types.ObjectId,
		ref: 'Post',
		required: true
	}
});

module.exports = mongoose.model('Comment', CommentSchema);
