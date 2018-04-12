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

		getTopArtists: function (limitNum) {
			return spotifyApi.getMyTopArtists({
				time_range: 'long_term',
				limit: limitNum,
			}).then(function (data) {
				return data.body.items
			}, function (err) {
				return err;
			});
		},

		getTrackPreview: function (trackId) {
			console.log(trackId)
			return spotifyApi.getTrack(trackId)
				.then(function (data) {
					return data.body.preview_url
			}, function (err) {
				return err;
			});
		},

		getTopGenres: function () {
			return spotifyApi.getAvailableGenreSeeds()
				.then(function (data) {
					return data.body.genres
				}, function (err) {
					return err
				})
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
				return data.body.tracks
			}, function (err) {
				return err;
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
						return data.body.artists.items;
					},
					function (err) {
						return err;
					})
		}

	}
};


module.exports = recommender;
