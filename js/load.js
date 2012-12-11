


//fullscreen
//load.js
var IMG ={};
var SOUND= {};
var numItemLoaded = 0;
var numRequire = 0;

$(document).ready(function(){

	loadItems();
});
/**
 * function Load
 * count number of items, which was loaded
 * @param sound
 * @returns {load}
 */
function load() {
	numItemLoaded ++;
	if (numItemLoaded>=numRequire) {
		start();
	}
}
/*
 *  loadItems function
 */
function loadItems() {
	imageItems = {
		note_0: "0.png",
		note_1: "1.png",
		note_2: "2.png",
		note_3: "3.png",
		note_4: "4.png",
		note_5: "5.png",
		note_6: "6.png",
		note_7: "7.png",
		note_8: "8.png",
		note_9: "9.png",
		note_10: "10.png"
	};

	for(var i in imageItems)
			numRequire++;
	time = 0;
	for (var i in imageItems) {
		time +=10;
	    IMG[i] = new Image();
		IMG[i].src = "images/"+imageItems[i];
		applyLoad(IMG[i], time);
		//IMG[i].onload =load();
		
	}

	function applyLoad(img, t){
		setTimeout(function(){
			img.onload = load();
		}, t);
	}
}
