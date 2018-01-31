// DOM Ready =============================================================
$(document).ready(function() {


	var acousticness_Slider = document.getElementById("acousticness_Slider");
	var popularity_Slider = document.getElementById("popularity_Slider");
	var danceability_Slider = document.getElementById("danceability_Slider");
	var happiness_Slider = document.getElementById("happiness_Slider");
	var energy_Slider = document.getElementById("energy_Slider");



	acousticness_Slider.oninput = function() {
		updateSlider("acousticness", this.value/100.0, this.value);
	};
	popularity_Slider.oninput = function() {
		updateSlider("popularity", parseInt(this.value), this.value);
	};
	danceability_Slider.oninput = function() {
		updateSlider("danceability", this.value/100.0, this.value);
	};
	happiness_Slider.oninput = function() {
		updateSlider("happiness", this.value/100.0, this.value);
	};
	energy_Slider.oninput = function() {
		updateSlider("energy", this.value/100.0, this.value);
	};


	$("input")
		.mousedown(function () {
			addRecord(userID, this.id, 'click drag', this.value);
		})
		.mouseup(function () {
			addRecord(userID, this.id, 'click drop', this.value);
		})




});

function updateSlider(id, targetValue, value){
	var output = document.getElementById(id);
	output.innerHTML = id + ": " + value;
	targetValues[id] = targetValue;
}