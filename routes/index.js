var express = require('express');
var cookieParser = require('cookie-parser');
var router = express.Router();
var recom = require('./recommender');
var passport = require('passport');
var SpotifyStrategy = require('../node_modules/passport-spotify/lib/passport-spotify/index').Strategy;
var path = require('path');
var request = require('request');
var User = require('../model/user');
var Interaction = require('../model/interaction');
var Recommendation = require('../model/recommendation');
var Email = require('../model/email');
var base = '/spotify';
//offline
base = '';
var counter = 0;



var appKey = 'ec702ad09c13419c944c88121847a2f6';
var appSecret = 'f89629daaa4e4b20b530b2b527490c69';
//offline
var callback = 'http://localhost:3000/callback';
// var callback = 'http://augment-hci-spotify.eu-4.evennode.com/callback';

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session. Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing. However, since this example does not
//   have a database of user records, the complete spotify profile is serialized
//   and deserialized.
passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (obj, done) {
	done(null, obj);
});


// Use the SpotifyStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and spotify
//   profile), and invoke a callback with a user object.
passport.use(new SpotifyStrategy({
		clientID: appKey,
		clientSecret: appSecret,
		callbackURL: callback
	},
	function (accessToken, refreshToken, profile, done) {
		// asynchronous verification, for effect...

		process.nextTick(function () {
			// To keep the example simple, the user's spotify profile is returned to
			// represent the logged-in user. In a typical application, you would want
			// to associate the spotify account with a user record in your database,
			// and return that user instead.
			return done(null, profile, {accessToken: accessToken, refreshToken: refreshToken});
		});

	}));

//First page
router.get(base+"/", function (req, res) {
	res.redirect(base+ '/auth/spotify');
	counter++;
});

router.get(base, function (req, res) {
	res.redirect(base+ '/auth/spotify');
	counter++;
});

//new eye tracker
router.get(base+'/eyeTracker', function (req, res) {
	res.render('eyeTracker',{title: 'eyeTrackerTest' })
})

router.get('/test', function (req, res) {
	res.render('home');
});





router.get(base+'/overview', function (req,res) {
	res.render('overview')
});

router.get(base+'/demographic', function (req,res) {
	res.render('demographic')
});

router.get(base+'/task1', function (req,res) {
	res.render('task1')
});

router.get(base+'/first', function (req, res) {
	var random = 1;
	if (counter % 2 === 0){
		random = 0;
	}
	res.cookie('random', random);
	res.cookie('first', 0);
	if (parseInt(random) === 1){
		res.render("layout" )
	}
	else{
		res.render('layoutSliders')
	}
});

router.get(base+'/task2', function (req,res) {
	res.render('task2')
});

router.get(base+'/thanks', function (req,res) {
	res.render('thanks')
});


router.get(base+'/error', function (req,res) {
	res.render('error')
})



router.get(base+'/second', function (req, res) {
	var random = req.query.random;
	res.cookie('first', 1);
	if (parseInt(random) === 1){
		res.render("layoutSliders" )
	}
	else{
		res.render('layout')
	}
});

router.get(base+'/saveRecommendations', function (req, res) {
	var interface = parseInt(req.query.interface);
	if (interface === 1){
		res.render('questionnaire');
	}
	else{
		res.render('final')
	}
});

router.get(base+"/addInteraction", function(req, res){
	var date = new Date();
	var timestamp = date.getTime();
	var interaction = new Interaction({
		userId: req.query.userId,
		userName: req.query.userName,
		date: timestamp,
		element: req.query.element,
		action: req.query.action,
		value: req.query.value
	});
	interaction.save(function (err) {
		if(err){
			res.json({message: err})
		}
		else{
			res.json({message: "interaction successful added to db"})
		}

	})
});

router.get(base+"/addRecommendation", function(req, res){
	var date = new Date();
	var timestamp = date.getTime();
	var acousticness = req.query.target_acousticness;
	var danceability = req.query.target_danceability;
	var energy = req.query.target_energy;
	var valence = req.query.target_valence;
	var instrumentalness = req.query.target_instrumentalness;

	var recommendation = new Recommendation({
		userId: req.query.userId,
		userName: req.query.userName,
		date: timestamp,
		acousticness: acousticness,
		danceability: danceability,
		energy: energy,
		valence: valence,
		instrumentalness: instrumentalness,
		likedSongs: req.query.likedSongs,
		dislikedSongs: req.query.dislikedSongs
	});
	recommendation.save(function (err) {
		if (err) {
			res.json({message: err})
		}
		else {
			res.json({message: "interaction successful added to db"})
		}
	});
});

router.get(base+'/addEmail', function (req,res) {
	var email = new Email({
		email: req.query.email
	});
	email.save(function (err) {
		if(err){
			res.json({message: err})
		}
		else{
			res.json({message: "email successful added to db"})
		}

	})
});

/*
 route for web API
 */

//New routes
router.get(base+'/getArtist', function (req, res) {
	recom(req.query.token).getTopArtists().then(function (data) {
		res.json(data)
	})
});

router.get(base+'/getTrackPreview', function (req, res) {
	var trackId = req.query.trackId;
	recom(req.query.token).getTrackPreview(trackId).then(function (data) {
		res.json(data)
	})
});

router.get(base+'/getRec', function (req, res) {
	var limit = 8;
	var artists = req.query.artists;
	var acousticness = req.query.target_acousticness;
	var danceability = req.query.target_danceability;
	var energy = req.query.target_energy;
	var valence = req.query.target_valence;
	var instrumentalness = req.query.target_instrumentalness;
	recom(req.query.token).getRecArtistsTargets(limit,artists, acousticness, danceability, energy, valence, instrumentalness )
		.then(function (data, err) {
			if(err){
				res.json({error: err})
			}
			else{
				res.json(data)
			}
		});


});










// GET /auth/spotify
//   Use passport.authenticate() as route middleware to authenticate the
//   request. The first step in spotify authentication will involve redirecting
//   the user to spotify.com. After authorization, spotify will redirect the user
//   back to this application at /auth/spotify/callback
router.get(base+'/auth/spotify',
	passport.authenticate('spotify', {
		scope: ['user-read-email', 'user-read-private', 'user-top-read'],
		showDialog: true
	}),
	function (req, res) {
		// The request will be redirected to spotify for authentication, so this
		// function will not be called.
	});

// GET /auth/spotify/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request. If authentication fails, the user will be redirected back to the
//   login page. Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get(base+'/callback',
	passport.authenticate('spotify', {failureRedirect: '/'}),
	function (req, res) {
		res.cookie('spotify-token', req.authInfo.accessToken, {
			maxAge: 3600000
		});

		res.cookie('refresh-token', req.authInfo.refreshToken, {
			maxAge: 3600000
		});
		recom(req.authInfo.accessToken).getUserId().then(function (data) {
			res.cookie('userId', data.userId);
			res.cookie('userName', data.userName);
			res.redirect(base+'/test');

		});


	});


router.get(base+ '/refresh-token', function (req, res) {

	// requesting access token from refresh token
	var refresh_token = req.query.refresh_token;
	var authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		headers: {'Authorization': 'Basic ' + (new Buffer(appKey + ':' + appSecret).toString('base64'))},
		form: {
			grant_type: 'refresh_token',
			refresh_token: refresh_token
		},
		json: true
	};

	request.post(authOptions, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			var access_token = body.access_token;
			var refresh_token = body.refresh_token;
			res.json({
				'access_token': access_token,
				'refresh_token': refresh_token
			});
		}
	});
});

router.get('/logout', function (req, res) {
	req.logout();
	res.redirect("/logout")
});


module.exports = router;
