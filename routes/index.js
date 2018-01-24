var express = require('express');
var cookieParser = require('cookie-parser');
var router = express.Router();
var recom = require('./recommender');
var passport = require('passport');
var SpotifyStrategy = require('../node_modules/passport-spotify/lib/passport-spotify/index').Strategy;
var path = require('path');
var request = require('request');
var User = require('../model/user');

var appKey = 'ec702ad09c13419c944c88121847a2f6';
var appSecret = '29e5d61f97e24cdfaf66300e39a35df3';

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
		// callbackURL: 'http://spotify-avi.us-3.evennode.com/callback'
		callbackURL: 'http://localhost:3000/callback'
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

router.get("/", function (req, res) {
	res.redirect('/auth/spotify');
});

//New code
router.get('/test', function (req, res) {
	res.render("layout" )
})


/*
 route for web API
 */

//New routes
router.get('/getArtist', function (req, res) {
	recom(req.query.token).getTopArtists().then(function (data) {
		res.json(data)
	})
});

router.get('/getTrackPreview', function (req, res) {
	var trackId = req.query.trackId;
	recom(req.query.token).getTrackPreview(trackId).then(function (data) {
		res.json(data)
	})
});

router.get('/getRec', function (req, res) {
	var limit = req.query.limit;
	var artists = req.query.artists;
	var acousticness = req.query.target_acousticness;
	var danceability = req.query.target_danceability;
	var energy = req.query.target_energy;
	var valence = req.query.target_valence;
	var popularity = req.query.target_popularity;
	recom(req.query.token).getRecArtistsTargets(limit,artists, acousticness, danceability, energy, valence, popularity )
		.then(function (data) {
			res.json(data)
	})
});










// GET /auth/spotify
//   Use passport.authenticate() as route middleware to authenticate the
//   request. The first step in spotify authentication will involve redirecting
//   the user to spotify.com. After authorization, spotify will redirect the user
//   back to this application at /auth/spotify/callback
router.get('/auth/spotify',
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
router.get('/callback',
	passport.authenticate('spotify', {failureRedirect: '/'}),
	function (req, res) {

		res.cookie('spotify-token', req.authInfo.accessToken, {
			maxAge: 3600000
		});

		res.cookie('refresh-token', req.authInfo.refreshToken, {
			maxAge: 3600000
		});
		res.redirect('/test');

	});


router.get('/refresh-token', function (req, res) {

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
