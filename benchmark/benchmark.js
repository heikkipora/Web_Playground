function Benchmark(repeatCount) {
	if (repeatCount == undefined) {
		repeatCount = 1000;
	}
	this.repeat = repeatCount;
};

Benchmark.prototype.createFunctionFromString = function(javascriptAsString) {
  return "var benchmarkedFunction = function(_benchmarkVar) { " + javascriptAsString + " }";
};

Benchmark.prototype.run = function(javascriptAsString) {
    if (typeof javascriptAsString != "string") {
      return { "implementation" : "ERROR: not a string", "single" : -1, "total" : -1 };
    }
    eval(this.createFunctionFromString(javascriptAsString));

    var count = this.repeat;
    var begin = new Date().getTime();
    while (count-- > 0) benchmarkedFunction();
    var end = new Date().getTime();
    
    var totalTimeMs = end - begin;
    var cycleTimeUs = totalTimeMs * 1000 / this.repeat;
    return { "implementation" : javascriptAsString,
    		 "single_usec" : cycleTimeUs,
    		 "total_msec" : totalTimeMs };
};

Benchmark.prototype.resultSorter = function(a,b) {
	if (a.single_usec > b.single_usec) return 1;
	if (a.single_usec < b.single_usec) return -1;
	return 0;
};

Benchmark.prototype.runAll = function(benchmarkedFunctions) {
	var results = [];
	var self = this;
	$.each(benchmarkedFunctions, function(index, functionAsString) {
		var result = self.run(functionAsString);
		results.push(result);
	});
	return results;
};

Benchmark.prototype.renderRow = function(result) {
	var resultTemplate = '<div class="result"><div class="implementation"><%= implementation %></div><div class="single"><%= single_usec %> µs</div></div>';
	return tpl.render(resultTemplate, result);
};

Benchmark.prototype.renderRows = function(results, targetElement) {
	results.sort(this.resultSorter);
	
	$(targetElement).empty();
	var self = this;
	$.each(results, function(index, result) {
		$(targetElement).append(self.renderRow(result));
	});
};

