var express = require('express');
var config = require('../configLocal');
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
var Playlist = require('../model/playlist');

//offline
var base = '';
var appKey = 'ec702ad09c13419c944c88121847a2f6';
var appSecret = '';
var callbackPort = config.callbackPort;
var callbackAdress = config.callbackAdress;

var userCounter = 1;






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

/**
 * Make a new Spotify strategy
 * Go to the welcome page
 */
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
					return done(null, profile, {accessToken: accessToken, refreshToken: refreshToken});
				});

			})
		);
	res.redirect(base+ '/welcome');
});

router.get(base+'/welcome', function (req, res) {
  //INIT GLOBAL COOKIE VARIABLES
  var array = [];
  res.cookie('selectedSliders', JSON.stringify(array));
  
  var targetValues = {
    min_acousticness: 0, max_acousticness: 100,
    min_danceability: 0, max_danceability: 100,
    min_duration: 0, max_duration:100,
    min_energy: 0, max_energy: 100,
    min_instrumentalness: 0, max_instrumentalness: 100,
    min_liveness: 0, max_liveness: 100,
    min_loudness: 0, max_loudness: 100,
    min_popularity: 0, max_popularity: 100,
    min_speechiness: 0, max_speechiness: 100,
    min_tempo: 0, max_tempo: 250,
    min_valence: 0, max_valence: 100
  };
  res.cookie('targetValues', JSON.stringify(targetValues));
	res.render('welcome' )
});

router.get(base+'/login', function (req, res) {
	res.render('login')
});

router.get(base+'/calibration', function (req, res) {
  res.render('calibration')
});

router.get(base+'/questionnaires', function (req, res) {
	res.cookie('interfaceDev', '0');
  var d = new Date();
  var day = parseInt(d.getDate());
  var hours = parseInt(d.getHours())
  var minutes = parseInt(d.getMinutes())
  var usernumber = (day * 10000000) + hours*100000 + minutes*1000 + userCounter;
  
  res.cookie('userId', usernumber);
  userCounter++;
	res.render('questionnaires')
});

router.get(base+'/demo', function (req, res) {
	var nbInterface = parseInt(req.query.number);
	if (nbInterface === 1){
    res.cookie('playable', true);
    res.cookie('baseline', false);
    res.cookie('unplayable', false);
    res.cookie('relaxing', true);
    res.cookie('fun', false);
    res.cookie('sport', false);
    res.render('home')
	}
	else if (nbInterface === 2){
    res.cookie('playable', false);
    res.cookie('baseline', true);
    res.cookie('unplayable', false);
    res.cookie('relaxing', true);
    res.cookie('fun', false);
    res.cookie('sport', false);
    res.render('home')
	}
	else{
    res.cookie('playable', false);
    res.cookie('baseline', false);
    res.cookie('unplayable', true);
    res.cookie('relaxing', true);
    res.cookie('fun', false);
    res.cookie('sport', false);
    res.render('home')
	}
	
});

router.get(base+'/attributes', function (req, res) {
  var array = [];
  res.cookie('selectedSliders', JSON.stringify(array));
	res.render('attributes')
});

router.get(base+'/sliderPage', function (req, res) {
  res.render('sliderPage')
});

router.get(base+'/task', function (req, res) {
	res.render('task')
});

/**
 * Render home page
 */


router.get('/exploration', function (req, res) {
  var userId = req.query.userId;
  //Done this way to provide the possibility to refresh without changing the interface
  User.findOne({ 'userId' : userId }, function (err, result) {
    if(err) throw err;
    else if (result === [] || result === null){
      console.log('user not found');
      res.render('error')
    }
    else{
      var playable = result.playable;
      var baseline = result.baseline;
      
      var relaxing = result.relaxing;
      var fun = result.fun;
      
      var current = result.current;
      
      res.cookie('current', current);
      
      //(un)playable or baseline
      if (current === playable){
        res.cookie('playable', true);
        res.cookie('baseline', false);
        res.cookie('unplayable', false);
      }
      else if(current === baseline){
        res.cookie('playable', false);
        res.cookie('baseline', true);
        res.cookie('unplayable', false);
      }
      else {
        res.cookie('playable', false);
        res.cookie('baseline', false);
        res.cookie('unplayable', true);
      }
      
      //baseline or fun
      if (current === relaxing){
        res.cookie('relaxing', true);
        res.cookie('fun', false);
        res.cookie('sport', false);
        res.render('home')
      }
      else if(current === fun){
        res.cookie('relaxing', false);
        res.cookie('fun', true);
        res.cookie('sport', false);
        res.render('home')
      }
      else {
        res.cookie('relaxing', false);
        res.cookie('fun', false);
        res.cookie('sport', true);
        res.render('home')
        
      }
      
      
    }
  })
  
});


router.get('/home', function (req, res) {
	var userId = req.query.userId;
	//Done this way to provide the possibility to refresh without changing the interface
  User.findOne({ 'userId' : userId }, function (err, result) {
	  if(err) throw err;
	  else if (result === [] || result === null){
	  	console.log('user not found')
	  	res.render('error')
	  }
	  else{
	  	var playable = result.playable;
	  	var baseline = result.baseline;
    
      var relaxing = result.relaxing;
	  	var fun = result.fun;
	  	
	  	var current = result.current;
    
	  	
	  	//first
	  	if(current === 1){
        res.cookie('first', true);
		  }
		  else{
        res.cookie('first', false);
		  }
		  
		  //(un)playable or baseline
		  if (current === playable){
        res.cookie('playable', true);
        res.cookie('baseline', false);
        res.cookie('unplayable', false);
      }
      else if(current === baseline){
        res.cookie('playable', false);
        res.cookie('baseline', true);
        res.cookie('unplayable', false);
		  }
		  else {
        res.cookie('playable', false);
        res.cookie('baseline', false);
        res.cookie('unplayable', true);
		  }
    
		  //baseline or fun
      if (current === relaxing){
        res.cookie('relaxing', true);
        res.cookie('fun', false);
        res.cookie('sport', false);
        res.render('home')
      }
      else if(current === fun){
        res.cookie('relaxing', false);
        res.cookie('fun', true);
        res.cookie('sport', false);
        res.render('home')
      }
      else {
        res.cookie('relaxing', false);
        res.cookie('fun', false);
        res.cookie('sport', true);
        res.render('home')
  
      }
    
    
    }
  })
});

router.get(base+'/export', function (req, res) {
  var userId = req.query.userId;
  var current = req.query.current;
  var newInterfaceValue = parseInt(current) + 1;
  var newValues = { $set: {current : newInterfaceValue}};
  
  User.updateOne({ 'userId' : userId }, newValues, function (err, data) {
    if(err){
      res.render('error')
    }
    else{
      res.render('export')
    }
  })
});

router.get(base+'/postTaskQuestionnaire', function (req, res) {
	res.render('postTaskQuestionnaire')
});

router.get(base+'/postTaskQuestionnaireExpl', function (req, res) {
	res.render('postTaskQuestionnaireExpl')
});

router.get(base+'/postTaskQuestionnaireUnplayable', function (req, res) {
  res.render('postTaskQuestionnaireUnplayable')
});

router.get(base+'/evaluation', function (req, res) {
	res.render('evaluation')
});

router.get(base+'/pilotStudy', function (req, res) {
	res.render('pilotStudy')
});

router.get(base+'/thanks', function (req,res) {
	res.render('thanks')
});




router.get(base+'/error', function (req,res) {

	res.render('error')
})







/*
// Database interactions
 */
router.get(base + '/addPlaylistBaseline',function (req, res) {
	var playlistParsed = req.query.playlist.split(',');
  var dislikedParsed = req.query.disliked.split(',');
  
  var nbRecommendations = req.query.nbRecommendations;
	var playlist = new Playlist({
		userId: req.query.userId,
		interface: "baseline",
		playlist: playlistParsed,
		disliked: dislikedParsed,
		nbRecommendations: nbRecommendations
	});

	playlist.save(function (err) {
		if(err){
			res.json({message: err})
		}
		else{
			res.json({message: "playlist successful added to db"})
		}
	})
});

router.get(base + '/addPlaylistPlayable',function (req, res) {
	var playlistParsed = req.query.playlist.split(',');
	var nbRecommendations = req.query.nbRecommendations;
	var playlist = new Playlist({
		userId: req.query.userId,
		interface: 'playable',
		playlist: playlistParsed,
		nbRecommendations: nbRecommendations
	});

	playlist.save(function (err) {
		if(err){
			res.json({message: err})
		}
		else{
			res.json({message: "playlist successful added to db"})
		}
	})
});

router.get(base + '/addPlaylistUnplayable',function (req, res) {
  var playlistParsed = req.query.playlist.split(',');
  var nbRecommendations = req.query.nbRecommendations;
  var playlist = new Playlist({
    userId: req.query.userId,
    interface: 'unplayable',
    playlist: playlistParsed,
    nbRecommendations: nbRecommendations
  });
  
  playlist.save(function (err) {
    if(err){
      res.json({message: err})
    }
    else{
      res.json({message: "playlist successful added to db"})
    }
  })
});



router.get(base + '/addUser',function (req, res) {
	var user = new User({
		userId: req.query.userId,
		screenSize : req.query.screenSize,
    
    playable: req.query.playable,
    baseline: req.query.baseline,
    unplayable: req.query.unplayable,
    relaxing: req.query.relaxing,
    fun: req.query.fun,
		sport: req.query.sport,
    current: req.query.current
	});

	user.save(function (err) {
		if(err){
			res.json({message: err})
		}
		else{
			res.json({message: "user successful added to db"})
		}
	})
});

router.get(base+"/addInteraction", function(req, res){
	console.log(req.query.unplayable)
	var interaction = new Interaction({
		userId: req.query.userId,
		userName: req.query.userName,
		userNumber: req.query.userNumber,
		date: req.query.date,
		element: req.query.element,
		action: req.query.action,
		value: req.query.value,
		interface: req.query.interface,
		explanations: req.query.explanations,
		relaxing: req.query.relaxing,
		fun: req.query.fun,
		sport: req.query.sport,
		playable: req.query.playable,
		unplayable: req.query.unplayable,
		baseline: req.query.baseline
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
		preview: req.query.preview,
		image: req.query.image,

		acousticness: parseInt(req.query.acousticness * 100),
		danceability: parseInt(req.query.danceability * 100),
		duration: parseInt(req.query.duration / 1000),
		energy: parseInt(req.query.energy * 100),
		instrumentalness: parseInt(req.query.instrumentalness * 100),
		liveness: parseInt(req.query.liveness * 100),
		loudness: parseInt(req.query.loudness),
		popularity: parseInt(req.query.popularity),
		speechiness: parseInt(req.query.speechiness * 100),
		tempo: parseInt(req.query.tempo),
		valence: parseInt(req.query.valence *100),
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
	Song.findOne({'$and': [{ 'trackId' : trackId }]}).then(function (data, err) {
		if(err){
			res.json({error: err})
		}
		else{
			res.json(data)
		}
	});
});

router.get(base+'/getSongPlaylist', function (req, res) {
	var trackId = req.query.trackId;
	var similarArtist = req.query.similarArtist;
	Song.findOne({'trackId': trackId}).then(function (data, err) {
		if(err){
			res.json({error: err})
		}
		else{
			res.json(data)
		}
	});
});

router.get(base+'/getPlaylist', function (req, res) {
	var userId = req.query.userId;
	var interface = req.query.interface;
	Playlist.findOne({'$and' : [{userId: userId}, {interface: interface}]}).then(function (data, err) {
		if(err){
			res.json({error: err})
		}
		else{
			res.json(data)
		}
	});
});

router.get(base+'/getFirstInterface', function (req, res) {
	var userNumber = req.query.userNumber;
	User.findOne({ 'userNumber' : userNumber }).then(function (data, err) {
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

router.get(base+'/addTracksToPlaylist', function (req, res) {
	var userId = req.query.userId;
	var playlistId = req.query.playlistId;
	var tracks = req.query.tracks;
	var playlist = [];
	var trackIds = tracks.split(',');
	trackIds.forEach(function (trackId) {
		playlist.push('spotify:track:' + trackId)
	});
	recom(req.query.token).addTracksToPlaylist(userId, playlistId, playlist).then(function (data) {
		res.json(data)
	})
});

router.get(base+'/createPlaylist', function (req, res) {
	var userId = req.query.userId;
	var playlistName = req.query.playlistName;
	recom(req.query.token).createPlaylist(userId, playlistName).then(function (data) {
		res.json(data)
	})
});

router.get(base+'/getArtist', function (req, res) {
	var artistId = req.query.artistId;
	recom(req.query.token).getArtist(artistId).then(function (data) {
		res.json(data)
	})
});

router.get(base+'/getArtistTopTracks', function (req, res) {
  var artistId = req.query.artistId;
  recom(req.query.token).getArtistTopTracks(artistId).then(function (data) {
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

router.get(base+'/getRecRange', function (req, res) {
	var limit = req.query.limit;
	var artists = req.query.artists;
	var min_acousticness = req.query.min_acousticness /100.0;
	var max_acousticness = req.query.max_acousticness /100.0;
	var min_danceability = req.query.min_danceability /100.0;
	var max_danceability = req.query.max_danceability /100.0;
	var min_energy = req.query.min_energy /100.0;
	var max_energy = req.query.max_energy /100.0;
	var min_instrumentalness = req.query.min_instrumentalness /100.0;
	var max_instrumentalness = req.query.max_instrumentalness /100.0;
  var min_popularity = req.query.min_popularity ;
  var max_popularity = req.query.max_popularity ;
	var min_tempo = req.query.min_tempo;
	var max_tempo = req.query.max_tempo;
	var min_valence = req.query.min_valence /100.0;
	var max_valence = req.query.max_valence /100.0;



	recom(req.query.token).getRecArtistsRange(limit,artists,
		min_acousticness, max_acousticness,
		min_danceability, max_danceability,
		min_energy, max_energy,
		min_instrumentalness, max_instrumentalness,
		min_popularity, max_popularity,
		min_tempo, max_tempo,
		min_valence, max_valence
		 )
		.then(function (data, err) {
			if(err){
				res.json({error: err})
			}
			else{
				res.json(data)
			}
		});
});

router.get(base+'/getRecTarget', function (req, res) {
	var limit = req.query.limit;
	var artists = req.query.artists;
	var target_acousticness = req.query.target_acousticness /100.0;
	var target_danceability = req.query.target_danceability /100.0;
	var target_duration = req.query.target_duration * 100.0;
	var target_energy = req.query.target_energy /100.0;
	var target_instrumentalness = req.query.target_instrumentalness /100.0;
	var target_liveness = parseInt(req.query.target_liveness);
	var target_loudness = parseInt(req.query.target_loudness);
	var target_popularity = parseInt(req.query.target_popularity);
	var target_speechiness = req.query.target_speechiness /100.0;
	var target_tempo = parseInt(req.query.target_tempo);
	var target_valence = req.query.target_valence / 100.0;

	recom(req.query.token).getRecArtistsTargets(limit,artists, target_acousticness, target_danceability,
		target_duration, target_energy, target_instrumentalness, target_liveness, target_loudness, target_popularity,
		target_speechiness, target_tempo, target_valence
	)
		.then(function (data, err) {
			if(err){
				console.log(err)
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
		scope: ['playlist-modify-private'],
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
    res.cookie('spotifyId',req.user['id'] )
    res.cookie('spotify-token', req.authInfo.accessToken, {
			maxAge: 3600000
		});

		res.cookie('refresh-token', req.authInfo.refreshToken, {
			maxAge: 3600000
		});
		recom(req.authInfo.accessToken).getUserId().then(function (data) {
			res.redirect(base+'/attributes');
		});
	});

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

