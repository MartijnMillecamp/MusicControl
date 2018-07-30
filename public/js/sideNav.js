function openNav() {
	$('#column4').css('width', '400px');
	$('#mySidenav').css('width', '400px');
	addInteraction('sideNav', 'click', 'open')
}

function closeNav() {
	$('#mySidenav').css('width', '0');
	$('#column4').css('width', '100px');
	addInteraction('sideNav', 'click', 'close')
}



