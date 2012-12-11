
function KohonenNetwork(inputCount, outputCount){

	this.NERON_ON = 0.9;
	this.NEURON_OFF = 0.1;
	this.inputCount = inputCount;
	this.outputCount = outputCount;
	//this.output = null;
	this.totalError = 1.0;	
	this.train = null;
	this.outputWeights = Matrix.create(outputCount, inputCount+1);
	Matrix.fill(this.outputWeights, 0);
	this.output = new Array(outputCount);
	for (var i=0; i< this.output.length; i++)
		this.output[i] = 0;
	this.learnRate = 0.4;
	this.quitError = 0.07;
	this.retries = 800;
	this.reduction =0.99;
}
/**
 * Learn prototype
 *
 */

KohonenNetwork.prototype.getOutput = function(){
	return this.output;
};

KohonenNetwork.prototype.setTrainingSet = function(set){
	this.train = set;

};
KohonenNetwork.prototype.copyWeights = function (dest, source){
	for (var i=0; i< dest.length; i++){
		for (var j=0; j< dest[0].length; j++){
			
			dest.outputWeights[i][j] =source.outputWeights[i][j];
		}
	}
};
KohonenNetwork.prototype.clearWeights = function(){
	Matrix.fill(this.outputWeights, 0);
};
KohonenNetwork.prototype.normalizeInput = function( input, normfac){
	var length, d;
	length = this.vectorLength(input);

	if (length < 1.E-30)
		length = 1.E-30;

	normfac[0] = 1.0/Math.sqrt(length);
	//alert("norm fac normail0" + normfac[0]);
};
KohonenNetwork.prototype.normalizeWeight = function(w){
	var length = this.vectorLength(w);

	if (length < 1.E-30)
		length = 1.E-30;

	length  = 1.0/ Math.sqrt(length);
	for (var i=0; i< w.length; i++)
		w[i] *= length;
	w[this.inputCount] = 0;
};
/**
 *
 *
 */
KohonenNetwork.prototype.vectorLength = function(v){
	var rtn = 0.0;
	for (var i=0; i< v.length; i++)
		rtn += v[i] * v[i];
	return rtn;
};

KohonenNetwork.prototype.winner = function(input, normfac){
	var i, win;
	var biggest, optr;

	this.normalizeInput(input, normfac);
	biggest = 1.E-30;
	//alert(biggest);
	for (var i=0; i<this.outputCount; i++){
		optr = this.outputWeights[i];
		//console.log("output length: "+this.output.length);
		this.output[i] = this.dotProduct(input, optr) * normfac[0];

		//remap to bipolar
		this.output[i] = 0.5 * (this.output[i] + 1);
		if (this.output[i] > biggest){
			biggest = this.output[i];
			win = i;
			//alert("win is " + i);
		}
		if (this.output[i] >1.0)
			this.output[i] = 1.0;
		if (this.output[i] <0.0)
			this.output[i] = 0.0;
	}
	return win;
};
KohonenNetwork.prototype.evaluateErrors = function(rate, won, bigerr,correct, work){
	var best, size, tset;
	var dptr,cptr, wptr, length, diff, normfac = new Array(1);

	normfac[0] = 0;
	for (var i=0; i< correct.length; i++){
		for (var j=0; j< correct[i].length; j++){
			correct[i][j] = 0;
		}
	}

	for (var i=0; i< won.length; i++)
		won[i] = 0;

	bigerr[0] = 0;
	for (tset =0; tset < this.train.getTrainingSetCount(); tset++){
		dptr = this.train.getInputSet(tset);
		best = this.winner(dptr, normfac);
		won[best] ++;
		wptr = this.outputWeights[best];
		cptr = correct[best];
		//alert("cptr is " + cptr);
		length = 0.0;

		for (var i=0; i< this.inputCount; i++){
			diff = dptr[i] * normfac[0] - wptr[i];
			//alert("diff is "+ diff);
			length += diff * diff;

			//method 1
			cptr[i] += diff;
		}
		if (length > bigerr[0]){
			bigerr[0] = length;
		}
	}
	
	bigerr[0] = Math.sqrt(bigerr[0]);
};

KohonenNetwork.prototype.adjustWeights = function(rate, won, bigcorr, correct){
	var corr, cptr, wptr, length, f;

	bigcorr[0] = 0.0;

	for (var i=0; i< this.outputCount; i++){
		if (won[i] == 0)
			continue;
		wptr = this.outputWeights[i];
		cptr = correct[i];

		f = 1.0/ won[i];
		f *= rate;

		length = 0.0;
		for (var j=0; j< this.inputCount; j++){
			corr = f * cptr[j];
			wptr[j] +=corr;
			length += corr * corr;
		}
		if (length >bigcorr[0]){
			bigcorr[0] = length;
		}
		//scale
		bigcorr[0] = Math.sqrt(bigcorr[0]) / rate;
	}
};

KohonenNetwork.prototype.forceWin = function(won){
	var i, tset, best, size, which = 0;
	var dptr, normfac = new Array(1), dist, optr;
		normfac[0] = 0;
		size = this.inputCount + 1;

		dist = 1.E30;
		for (tset = 0; tset < this.train.getTrainingSetCount(); tset++) {
			dptr = this.train.getInputSet(tset);
			best = this.winner(dptr, normfac);
			//alert("forcewin " + best);
			if (this.output[best] < dist) {
				dist = this.output[best];
				which = tset;
			}
		}

		dptr = this.train.getInputSet(which);
		best = this.winner(dptr, normfac);
		dist = -1.e30;
		i = this.outputCount;
		while ((i--) > 0) {
			if (won[i] != 0)
				continue;
			if (this.output[i] > dist) {
				dist = this.output[i];
				which = i;
			}
		}

		optr = this.outputWeights[which];
		for (var i= 0; i< dptr.length; i++){
			optr[i] = dptr[i];
		}

		optr[this.inputCount] = 0 ;
		this.normalizeWeight(optr);
};
KohonenNetwork.prototype.learn = function(){
	var i, key, tset, iter, n_retry, nwts;
		var  won, winners;
		var  work, correc, rate, best_err, dptr;
		var bigerr =[0];
		var bigcorr =[0];
		var bestnet; // Preserve best here

		this.totalError = 1.0;
		for (tset = 0; tset < this.train.length; tset++) {
			dptr = this.train.getInputSet(tset);
			if (this.vectorLength(dptr) < 1.E-30) {
				alert("too small :)");
			}

		}
		//alert("create best lest");
		bestnet = new KohonenNetwork(this.inputCount, this.outputCount);

		won = new Array(this.outputCount);
		correc = Matrix.create(this.outputCount, this.inputCount +1);
		Matrix.fill(correc, 0);
		work = null;

		rate = this.learnRate;

		this.initialize();
		best_err = 1.e30;

		// main loop:

		n_retry = 0;
		for (iter = 0;; iter++) {
			this.evaluateErrors(rate, won, bigerr, correc, work);
			this.totalError = bigerr[0];
			if (this.totalError < best_err) {
				best_err = this.totalError;
				this.copyWeights(bestnet, this);
			}

			winners = 0;
			for (i = 0; i < won.length; i++)
				if (won[i] != 0)
					winners++;

			if (bigerr[0] < this.quitError)
				break;

			if ((winners < this.outputCount)
					&& (winners < this.train.getTrainingSetCount())) {
				this.forceWin(won);
				continue;
			}
			this.adjustWeights(rate,won, bigcorr, correc);

			if (bigcorr[0] < 1E-5) {
				if (++n_retry > this.retries)
					break;
				this.initialize();
				iter = -1;
				rate = this.learnRate;
				continue;
			}

			if (rate > 0.01)
				rate *= 0.99;

		}

		// done

		this.copyWeights(this, bestnet);

		for (i = 0; i < this.outputCount; i++)
			this.normalizeWeight(this.outputWeights[i]);

		halt = true;
		n_retry++;
		// owner.updateStats(n_retry,totalError,best_err);
};
KohonenNetwork.prototype.initialize = function(){
		var optr;
		this.clearWeights();
		this.randomizeWeights(this.outputWeights);
		for (i = 0; i < this.outputCount; i++) {
			optr = this.outputWeights[i];
			this.normalizeWeight(optr);
		}
};
KohonenNetwork.prototype.dotProduct = function(vec1, vec2){
		var k, m, v;
		var rtn;


		rtn = 0.0;
		k = vec1.length / 4;
		m = vec1.length % 4;

		v = 0;
		while ((k--) > 0) {
			rtn += vec1[v] * vec2[v];
			rtn += vec1[v + 1] * vec2[v + 1];
			rtn += vec1[v + 2] * vec2[v + 2];
			rtn += vec1[v + 3] * vec2[v + 3];
			v += 4;
		}

		while ((m--) > 0) {
			rtn += vec1[v] * vec2[v];
			v++;
		}
		// for (var i=0; i< vec1.length; i++){
		// 	rtn += vec1[i] * vec2[i];
		// }
		//console.log("dotproduct result" +rtn);
		return rtn;
}
KohonenNetwork.prototype.randomizeWeights = function(weight){
	var r;

		var temp = 3.464101615 / (2.0 * Math.random()); 
		for (var y = 0; y < weight.length; y++) {
			for (var  x = 0; x < weight[0].length; x++) {
				r = -10 + Math.random() * 20;
				weight[y][x] = temp * r;
			}
		}
};