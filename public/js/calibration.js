

$( document ).ready(function() {
  $('#userIdSpan').html('Your id: ' + userId);
  
  $('#button_calibrate').click(function (event) {
    window.location.href = base + "/login";
  });
});