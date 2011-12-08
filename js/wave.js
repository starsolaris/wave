/**
 * Module for genarating and drawing Labyrinth
 *
 * @author Andrey Starostin
 */

(function (window){
	"use strict";
	
	window.Wave = Wave;
	
	function Wave()
	{
		var self = this;

		this.canvas = null;

		this.width = 50;
		this.height = 50;

		this.canvasWidth = 600;
		this.canvasHeight = 600;

		this.elementSize = Math.floor(this.canvasWidth / this.width);
		this.grid = null;

		this.start = {
			x: 10,
			y: 10
		};
		this.finish = {
			x: this.width - 3,
			y: this.height - 3
		};

		this.init = function(selector)
		{
			this.canvas = $(selector)[0].getContext("2d");

			this.canvas.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
			//this.canvas.translate(10, 10);
			//this.canvas.scale(0.4, 0.4);

			//this.canvas.strokeStyle = "black";
			//this.canvas.fillStyle = "black";
			this.canvas.lineWidth = 1;
			this.canvas.lineCap = "round";
		};

		this.draw = function(finish)
		{
			this.canvas.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

			this.clearGrid();
			this.drawGrid();

			finish && this.go(finish);
		};

		this.createGrid = function()
		{
			this.grid = new Array(this.width);
			for (var i = 0; i < this.grid.length; i++)
			{
				var row = this.grid[i] = new Array(this.height);
				for (var j = 0; j < row.length; j++)
				{
					var rand = Math.round(Math.random() * 100);
					var val = 0;
					if (rand > 75)
						val = -1;
					row[j] = val;
				}
			}
			// walls
			for (var i = 0; i < this.grid.length; i++)
			{
				var row = this.grid[i];
				for (var j = 0; j < row.length; j++)
				{
					this.grid[0][j] = -1;
					this.grid[this.grid.length - 1][j] = -1;
				}
				this.grid[i][0] = -1;
				this.grid[i][this.height - 1] = -1;
			}
			/*for (var i = 0; i < this.grid.length; i++)
			{
				this.grid[0][i] = -1;
				this.grid[0][i] = -1;
			}*/

			this.grid[0][0] = 0;
			this.grid[this.width - 1][this.height - 1] = 0;

			this.grid[this.start.x][this.start.y] = 0;
		};

		this.clearGrid = function()
		{
			for (var i = 0; i < this.grid.length; i++)
			{
				var row = this.grid[i];
				for (var j = 0; j < row.length; j++)
				{
					if (row[j] > 0)
						row[j] = 0;
				}
			}
		};

		this.drawGrid = function()
		{
			var size = this.elementSize;

			for (var i = 0; i < this.grid.length; i++)
			{
				var row = this.grid[i];
				for (var j = 0; j < row.length; j++)
				{
					if (row[j] == 0)
						this.canvas.fillStyle = "black";
					else
					if (row[j] == 1)
						this.canvas.fillStyle = "red";
					else
						this.canvas.fillStyle = "green";

					this.canvas.fillRect(i * size, j * size, size, size);
				}
			}
		};

		this.drawCell = function(i, j, color)
		{
			var size = this.elementSize;

			if (color)
			{
				this.canvas.fillStyle = color;
			} else {
				if (this.grid[i][j] < 0)
					this.canvas.fillStyle = "black";
				else
				if (this.grid[i][j] > 0)
					this.canvas.fillStyle = "blue";
			}

			this.canvas.fillRect(i * size, j * size, size, size);
			this.canvas.fillStyle = "white";
			//this.canvas.fillText(this.grid[i][j], i * size, j * size + size)
		};

		this.stop = false;

		this.d = [
			{x: 0, y: -1},
			{x: +1, y: 0},
			{x: 0, y: +1},
			{x: -1, y: 0}
		];

		this.go = function(finish)
		{
			if (!finish) return;
			if (finish.x >= this.width || finish.y >= this.height) return;

			var wave = [];
			var oldWave = [
				{x: this.start.x, y: this.start.y}
			];
			var step = 1;
			this.grid[this.start.x][this.start.y] = 1;

			var finded = false;
			calcPath:
			// calc wave
			while (!finded && oldWave.length > 0)
			{
				wave = [];
				step++;
				for (var i = 0; i < oldWave.length; i++)
				{
					for (var dd = 0; dd < this.d.length; dd++)
					{
						var newX = oldWave[i].x + this.d[dd].x;
						var newY = oldWave[i].y + this.d[dd].y;
						if (this.grid[newX][newY] == 0)
						{
							wave.push({x: newX, y: newY});
							this.grid[newX][newY] = step;
							//this.drawCell(newX, newY, "blue");
							if (newX == finish.x && newY == finish.y)
							{
								finded = true;
								break calcPath;
							}
						}
					}
				}
				oldWave = wave;
			}

			this.drawPath(finish);
		};

		this.drawPath = function(finish)
		{
			var x = finish.x;
			var y = finish.y;
			var wave = [
				{x: x, y: y}
			];

			this.drawCell(x, y, "red");
			// draw path
			while (this.grid[x][y] != -1 && this.grid[x][y] != 0 && this.grid[x][y] != 1)
			{
				for (var dd = 0; dd < this.d.length; dd++)
				{
					var newX = x + this.d[dd].x;
					var newY = y + this.d[dd].y;
					if (this.grid[x][y] - 1 == this.grid[newX][newY])
					{
						x = newX;
						y = newY;
						wave.push({x: newX, y: newY});
						this.drawCell(newX, newY, "red");
						break;
					}
				}
			}
		};
	}
	
})(window);