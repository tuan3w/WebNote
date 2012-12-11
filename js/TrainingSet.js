/**
 * TrainingSet object
 * @param inputCount sizeOf input len
 * @param outputCount length of output
 * @param size  size of training set
 */
function TrainingSet(inputCount, outputCount){
	this.inputCount = inputCount;
	this.outputCount = outputCount;
	this.trainingSetCount = 0;

	this.input = null;
	this.output =null;

	this.classify = null;
}

TrainingSet.prototype.getOutputCount = function(){
	return this.outCount;
};
TrainingSet.prototype.setTrainingSetCount = function(trainingSetCount){
	this.trainingSetCount = trainingSetCount;
	this.input = Matrix.create(trainingSetCount,this.inputCount);
	this.output = Matrix.create(this.trainingSetCount, this.outputCount);
	Matrix.fill(this.input, 0);
	Matrix.fill(this.output, 0);
	this.classify = new Array(this.trainingSetCount);

}
TrainingSet.prototype.getTrainingSetCount = function(){
	return this.trainingSetCount;
};
TrainingSet.prototype.getInputCount = function(){
	return this.inputCount;
};
TrainingSet.prototype.setInputSet = function(sets){
	this.input = sets;
};
TrainingSet.prototype.setInput = function(set, index, value){
	this.input[set][index] = value;
};
TrainingSet.prototype.setOutput = function(set, index, value){
	this.output[set][index] = value;
};
TrainingSet.prototype.setClassify = function (set, value) {
	this.classify[set] = value;
};
TrainingSet.prototype.getOutput= function(set,index) {
	return this.output[set][index];	
};
TrainingSet.prototype.getInput = function(set, index){
	return this.input[set][index];
};

TrainingSet.prototype.getOutputSet = function(set){
	return this.output[set];
};
TrainingSet.prototype.getInputSet = function(set){
	return this.input[set];
};
