#! /usr/bin/env node

console.log(
	'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true'
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async');
const Post = require('./models/post');
const User = require('./models/user');
const Comment = require('./models/comment');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const posts = [];
const users = [];
const comments = new Array();

function postCreate(title, timestamp, content, author, cb) {
	const newPost = new Post({
		title: title,
		timestamp: timestamp,
		content: content,
		author: author
	});

	newPost.save(function (err) {
		if (err) {
			cb(err, null);
			return;
		}
		console.log('New Post: ' + newPost);
		posts.push(newPost);
		cb(null, newPost);
	});
}

function commentCreate(timestamp, content, user_ref, post_ref, cb) {
	const newComment = new Comment({
		timestamp: timestamp,
		content: content,
		user_ref,
		post_ref
	});

	newComment.save(function (err) {
		if (err) {
			cb(err, null);
			return;
		}
		console.log('New Comment: ' + newComment);
		comments.push(newComment);
		cb(null, newComment);
	});
}

function userCreate(username, password, cb) {
	const newUser = new User({
		username: 'saltest1@gmail.com',
		password: '123',
		has_account: false
	});

	newUser.save(function (err) {
		if (err) {
			cb(err, null);
			return;
		}
		console.log('New User: ' + newUser);
		users.push(newUser);
		cb(null, newUser);
	});
}

function createUsers(cb) {
	async.parallel(
		[
			function (callback) {
				userCreate('sal', 123, callback);
			}
		],
		// optional callback
		cb
	);
}

function createPosts(cb) {
	async.parallel(
		[
			function (callback) {
				postCreate(
					'First Post',
					new Date(),
					'I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.',
					users[0],
					callback
				);
			},
			function (callback) {
				postCreate(
					'Second Post',
					new Date(),
					'Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.',
					users[0],
					callback
				);
			},
			function (callback) {
				postCreate(
					'Third Post',
					new Date(),
					'Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in the heart of this forgotten place.',
					users[0],
					callback
				);
			},
			function (callback) {
				postCreate(
					'Fourth Post',
					new Date(),
					'Humankind headed out to the stars not for conquest, nor exploration, nor even for curiosity. Humans went to the stars in a desperate crusade to save intelligent life wherever they found it. A wave of death is spreading through the Milky Way galaxy, an expanding sphere of lethal gamma ...',
					users[0],
					callback
				);
			}
		],
		// optional callback
		cb
	);
}

function createComments(cb) {
	async.parallel(
		[
			function (callback) {
				commentCreate(
					new Date(),
					'First Comment',
					users[0],
					posts[0],
					callback
				);
			},
			function (callback) {
				commentCreate(
					new Date(),
					'Second Comment',
					users[0],
					posts[1],
					callback
				);
			},
			function (callback) {
				commentCreate(
					new Date(),
					'Third Comment',
					users[0],
					posts[2],
					callback
				);
			},
			function (callback) {
				commentCreate(
					new Date(),
					'Fourth Comment',
					users[0],
					posts[3],
					callback
				);
			}
		],
		// optional callback
		cb
	);
}

async.series(
	[createUsers, createPosts, createComments],
	// Optional callback
	function (err, results) {
		if (err) {
			console.log('FINAL ERR: ' + err);
		} else {
			console.log('BOOKInstances: ' + results);
		}
		// All done, disconnect from database
		mongoose.connection.close();
	}
);
