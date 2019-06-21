$( document ).ready(function() {
  var src = "https://docs.google.com/forms/d/e/1FAIpQLScR0w7wqu6D4ZQg_Zy5VlYBbbMIB3nukTyd0JfnmPEgykur2A/viewform?usp=pp_url&entry.452024117=";
  src += userId  + '&hl=en';
  document.getElementById('iframePostTask').src = src;
  
  $('#button_postTaskQuestionnairesUnplayable').click(function (event) {
    addInteraction('button_postTaskQuestionnaires', 'click', 'click');
    
    window.location.href = getNextLocationPostTask();
  });
});


var countPT = 0;
function loadPostTask() {
  countPT++
  if(countPT===1){
    $('#button_postTaskQuestionnairesUnplayable').css('display', 'flex')
  }
}