/**
 * Created by jin on 12/11/2016.
 */
var recommender = function (token) {
	var SpotifyWebApi = require('spotify-web-api-node');
	var appKey = 'ec702ad09c13419c944c88121847a2f6';
	var appSecret = '29e5d61f97e24cdfaf66300e39a35df3';
	// redirectUrl = 'http://spotify-avi.us-3.evennode.com/callback';
	redirectUrl = 'http://localhost:3000/callback';

	var spotifyApi = new SpotifyWebApi({
		clientId: appKey,
		clientSecret: appSecret,
		redirectUri: redirectUrl
	});

	spotifyApi.setAccessToken(token);

	return {

		getArtist: function (artistId) {
			return spotifyApi.getArtist(artistId).then(function (data) {
				return {data: data.body, error: false};
			}, function (err) {
				return {data: err, error: true};
			});
		},

		getTopArtists: function (limitNum) {
			return spotifyApi.getMyTopArtists({
				time_range: 'medium_term',
				limit: limitNum
			}).then(function (data) {
				console.log(data.body.items.length)
				return {data: data.body.items, error: false};
			}, function (err) {
				return {data: err, error: true};
			});
		},

		getTopSongs: function (limitNum) {
			return spotifyApi.getMyTopTracks({
				time_range: 'medium_term',
				limit: limitNum
			}).then(function (data) {
				return {data: data.body.items, error: false};
			}, function (err) {
				return {data: err, error: true};
			});
		},

		getTrackPreview: function (trackId) {
			return spotifyApi.getTrack(trackId)
				.then(function (data) {
					return {data: data.body.preview_url, error: false};
			}, function (err) {
				return {data: err, error: true};
			});
		},


		getRecArtistsTargets: function (limit, artists, acousticness, danceability, energy, valence, instrumentalness) {
			return spotifyApi.getRecommendations({
				limit: limit,
				seed_artists: artists,
				target_acousticness: acousticness,
				target_danceability: danceability,
				target_energy: energy,
				target_valence: valence,
				target_instrumentalness: instrumentalness
			}).then(function (data) {
				return {data: data.body.tracks, error: false};
			}, function (err) {
				return {data: err, error: true};
			})
		},

		getUserId: function () {
			return spotifyApi.getMe()
				.then(
					function (data) {
						return {
							userId: data.body.id,
							userName: data.body.display_name
						};
					},
					function (err) {
						return err;
					})
		},

		getSearchArtist: function (query, limit) {
			return spotifyApi.searchArtists(
				query,
				{
					limit: limit
				}
			)
				.then(
					function (data) {
						return {data: data.body.artists.items, error: false};
					},
					function (err) {
						return {data: err, error: true};
					})
		},

		getAudioFeaturesForTrack: function (id) {
			return spotifyApi.getAudioFeaturesForTrack(id)
				.then(
					function (data) {
						return {data: data.body, error: false};
					},
					function (err) {
						return {data: err, error: true};
					})
		},

		getAudioFeaturesForTracks: function (ids) {
			return spotifyApi.getAudioFeaturesForTracks([ids ])
				.then(
					function (data) {
						return {data: data.body, error: false};
					},
					function (err) {
						return {data: err, error: true};
					})
		},

		refreshAccessToken: function (refreshToken) {
			spotifyApi.setRefreshToken(refreshToken);
			return spotifyApi.refreshAccessToken()
				.then(
					function (data) {
						return {data: data, error: false};
					},
					function (err) {
						return {data: err, error: true};
					})
		},

		getSongFromId: function (trackId) {
			return spotifyApi.getTrack(trackId)
				.then(
					function (data) {
						return {data: data, error: false};
					},
					function (err) {
						return {data: err, error: true};
					})
		},

		createPlaylist: function (userId, playlistName) {
			return spotifyApi.createPlaylist(userId, playlistName, {public:false})
				.then(
					function (data) {
						return {data: data, error: false};
					},
					function (err) {
						return {data: err, error: true};
					})
		},

		addTracksToPlaylist: function (userId, playlistId, tracks) {
			return spotifyApi.addTracksToPlaylist(userId, playlistId, '["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"]')
				.then(
					function (data) {
						return {data: data, error: false};
					},
					function (err) {
						return {data: err, error: true};
					})
		}

	}
};


module.exports = recommender;
