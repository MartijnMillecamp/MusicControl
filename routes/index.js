var express = require('express');
var config = require('../configLocalDocker');
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
var Song = require('../model/song');
var fs = require('fs');
var refresh = require('spotify-refresh');
//offline
var base = '';
var counter = 0;
var appKey = 'ec702ad09c13419c944c88121847a2f6';
var appSecret = '';
var callbackPort = config.callbackPort;
var callbackAdress = config.callbackAdress;






//offline
var callback = 'http://' + callbackAdress + callbackPort + '/callback';

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

router.get(base, function (req, res) {
	appSecret = config.secret;
	// Use the SpotifyStrategy within Passport.
	//   Strategies in Passport require a `verify` function, which accept
	//   credentials (in this case, an accessToken, refreshToken, and spotify
	//   profile), and invoke a callback with a user object.
	passport.use(
		new SpotifyStrategy({
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

			})
		);
	res.redirect(base+ '/auth/spotify');
	counter++;
});

router.get(base+'/attributes', function (req, res) {
	res.cookie('numberInterface', 0)
	res.render('attributes')
})

/**
 * Render home page
 * First render verbal
 * Second render button
 * Third render minibarchart
 * Fourth render no explanations
 */
router.get('/home', function (req, res) {
	var numberInterface = parseInt(req.query.numberInterface);
	if(numberInterface === 0){
		res.cookie('visual', "false");
		res.cookie('miniBarchart', "false");
		res.cookie('baseline', "false");

	}
	else if(numberInterface === 1){
		res.cookie('visual', "true");
		res.cookie('miniBarchart', "false");
		res.cookie('baseline', "false");

	}
	else if(numberInterface === 2){
		res.cookie('visual', "true");
		res.cookie('miniBarchart', "true");
		res.cookie('baseline', "false");

	}
	else if(numberInterface === 3){
		res.cookie('visual', "false");
		res.cookie('miniBarchart', "false");
		res.cookie('baseline', "true");
	}
	else{
		res.render('error')
	}
	var newNumber = numberInterface + 1;
	res.cookie('numberInterface', newNumber)
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
	var interfaceNumber = parseInt(req.query.interface);
	if (interfaceNumber === 1){
		res.render('questionnaire');
	}
	else{
		res.render('final')
	}
});

/*
// Database interactions
 */
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

router.get(base+'/addSong', function (req,res) {
	var song = new Song({
		trackId: req.query.trackId,
		artist: req.query.artist,
		title: req.query.title,
		duration: req.query.duration,
		url: req.query.url,
		preview: req.query.preview,
		image: req.query.image,

		acousticness: parseInt(req.query.acousticness * 100),
		danceability: parseInt(req.query.danceability * 100),
		energy: parseInt(req.query.energy * 100),
		instrumentalness: parseInt(req.query.instrumentalness * 100),
		tempo: parseInt(Math.min((req.query.tempo-40)/2,100)),
		valence: parseInt(req.query.valence *100),
		similarArtist: req.query.similarArtist
	});
	song.save(function (err) {
		if(err){
			res.json({message: err})
		}
		else{
			res.json({message: "song successful added to db"})
		}

	})
});

router.get(base+'/getSong', function (req, res) {
	var trackId = req.query.trackId;
	var similarArtist = req.query.similarArtist;
	Song.findOne({'$and': [{ 'trackId' : trackId },{'similarArtist': similarArtist}]}).then(function (data, err) {
		if(err){
			res.json({error: err})
		}
		else{
			res.json(data)
		}
	});
});

/*
 route for web API
 */

router.get(base+'/getArtist', function (req, res) {
	var artistId = req.query.artistId;
	recom(req.query.token).getArtist(artistId).then(function (data) {
		res.json(data)
	})
});


router.get(base+'/getTopArtists', function (req, res) {
	var limit = req.query.limit;
	recom(req.query.token).getTopArtists(limit).then(function (data) {
		res.json(data)
	})
});

router.get(base+'/getTopSongs', function (req, res) {
	var limit = req.query.limit;
	recom(req.query.token).getTopSongs(limit).then(function (data) {
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
	var limit = req.query.limit;
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

router.get(base+ '/searchArtist', function (req, res) {
	var q = req.query.q;
	var limit = req.query.limit;
	recom(req.query.token).getSearchArtist(q, limit)
		.then(function (data, err) {
			if(err){
				res.json({error: err})
			}
			else{
				res.json(data)
			}
		})

})

router.get(base+ '/getAudioFeaturesForTrack', function (req, res) {
	var trackId = req.query.trackId;
	recom(req.query.token).getAudioFeaturesForTrack(trackId)
		.then(function (data, err) {
			if(err){
				res.json({error: err})
			}
			else{
				res.json(data)
			}
		})

})

router.get(base+ '/getAudioFeaturesForTracks', function (req, res) {
	var trackIds = req.query.trackIds;
	recom(req.query.token).getAudioFeaturesForTracks(trackIds)
		.then(function (data, err) {
			if(err){
				res.json({error: err})
			}
			else{
				res.json(data)
			}
		})

})

router.get(base+ '/getSongFromId', function (req, res) {
	var trackId = req.query.trackId;
	recom(req.query.token).getSongFromId(trackId)
		.then(function (data, err) {
			if(err){
				res.json({error: err})
			}
			else{
				res.json(data)
			}
		})

})










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
	passport.authenticate('spotify', {failureRedirect: '/error'}),
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
			res.redirect(base+'/attributes');

		});


	});

// router.get(base+ '/refresh-token', function (req,res) {
// 	var refreshToken = req.query.refreshToken;
// 	console.log(appSecret)
// 	var body = refreshSpotifyToken(refreshToken, appKey, appSecret);
// 	console.log(body);
// 	res.json(body)
// });

function refreshSpotifyToken(refreshToken, appKey, appSecret) {
	refresh(refreshToken, appKey, appSecret, function (err, res, body) {
		if (err) return null;
		else{
			console.log(body);
			return body;
		}
	});
}







router.get(base+ '/refresh-token', function (req, res) {
	var authorizationField = 'Basic ' + new Buffer(appKey + ':' + appSecret).toString('base64');
	authorizationField.replace("'", '');
	// requesting access token from refresh token
	var refresh_token = req.query.refreshToken;
	var authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		headers: {'Authorization':  authorizationField},
		form: {
			grant_type: 'refresh_token',
			refresh_token: refresh_token
		},
		json: true
	};
	request.post(authOptions, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			var access_token = body.access_token;
			res.json({
				'access_token': access_token
			});
		}
	});
});




module.exports = router;

