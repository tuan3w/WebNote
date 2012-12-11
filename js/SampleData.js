
function SampleData(letter, width, height){
	this.grid = Matrix.create(height, width);
	this.letter = letter;
};
SampleData.prototype.setData = function(x,y,v){
	this.grid[x][y] = v;
};
SampleData.prototype.getData = function(x,y){
	return this.grid[x][y];
};
SampleData.prototype.clear = function(){
	Matrix.fill(this.grid, 0);
};
SampleData.prototype.getHeight = function(){
	return this.grid.length;
};
SampleData.prototype.getWidth = function(){
	return this.grid[0].length;
};
SampleData.prototype.setLetter = function(letter){
	this.letter = letter;
};
SampleData.prototype.getLetter = function(){
	return this.letter;
};
SampleData.prototype.clone = function(){
	obj = SampleData(this.letter, this.getHeight()(), this.getWidth());
	obj.grid = Matrix.clone(this.grid);
	return obj;
}
