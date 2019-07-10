

$( document ).ready(function() {
  $('#userCode').html('Your id: ' + userId);
  
  $('#button_calibrate').click(function (event) {
    window.location.href = base + "/login";
  });
});