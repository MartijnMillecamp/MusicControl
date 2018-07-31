$( document ).ready(function() {



	$('#button_questionnaires').click(function (event) {
		var height = window.screen.availHeight;
		var width = window.screen.availWidth;
		var resolution = height + 'x' + width;
		var queryUser = 'userName=' + userName + '&userId=' + userID;
		var queryAdmin = '&userNumber=' + userNumber + '&screenSize=' + resolution;
		var query = base + '/addUser?' + queryUser + queryAdmin;

		$.getJSON( query, function( message ) {
			console.log(message)
			showExampleSongs()
			window.location.href = base + '/attributes';
		});

	});
});