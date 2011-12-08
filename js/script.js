/**
 * Genarate and draw Labyrinth
 *
 * @author Andrey Starostin
 */
 
var wave = new Wave();

$(document).ready(function(){
	wave.init("#canvas");

	wave.createGrid();

	wave.draw();

	$("#canvas").mousemove(function(event){
		var position = $("#canvas").position();

		var finish = {
			x: Math.floor((event.originalEvent.layerX - position.left) / wave.elementSize),
			y: Math.floor((event.originalEvent.layerY - position.top) / wave.elementSize)
		};

		wave.draw(finish);
	});
});