var attrArray = ["AFT", "AHe"], //list of attributes
    expressedChart = attrArray[0];

//chart frame dimensions
var chartWidth = d3.select('#chart').node().getBoundingClientRect().width - 50,
	chartHeight = 720,
	leftPadding = 50,
	rightPadding = 2,
	topBottomPadding = 40,
	chartInnerWidth = chartWidth - leftPadding - rightPadding,
	chartInnerHeight = chartHeight - topBottomPadding * 2,
	translate = "translate(" + leftPadding + "," + topBottomPadding + ")";

//create a scale to size bars proportionally to frame and for axis
var yScale = d3.scaleLinear()
	.range([463, 0])
	.domain([0, 100]);
 
function initialize() {
    createGraphDropdown();
	getGraphData();
}

function getGraphData(){
	var csvLoc = "data/" + expressedChart + "Data.csv";
	var promises = []; 
		promises.push(d3.csv(csvLoc));
	Promise.all(promises).then(callback);		
		
	function callback(data) {
		csvData = data[0];
		makeGraph(csvData);
	}
}

//Create histogram (adapted from: https://d3-graph-gallery.com/graph/histogram_basic.html)
function makeGraph(csvData) {
	if(!chart) {
		//make chart
		var chart = d3.select("#chart")
			.append("svg")
				.attr("width", chartWidth)
				.attr("height", chartHeight)
				.attr("class", "chart")
			.append("g")
				.attr("transform", "translate(" + leftPadding + "," + topBottomPadding + ")");
		//make chart title position
		var chartTitle = chart.append("text")
				.attr("x", 150)
				.attr("y", 40)
				.attr("class", "chartTitle")
	}
	//x axis
	var x = d3.scaleLinear()
		.domain([0, d3.max(csvData, function(d) { return +d.Age })])
		.range([0, chartInnerWidth]);
	chart.append("g")
		.attr("transform", "translate(0," + chartInnerHeight + ")")
		.call(d3.axisBottom(x));

	var bins = Math.ceil(d3.max(csvData, function(d) { return +d.Age }) / 2) //Creates bin size of 2 Ma

	//set the parameters for the histogram
	var histogram = d3.histogram()
		.value(function(d) { return d.Age; }) 
		.domain(x.domain()) 
		.thresholds(x.ticks(bins));

	var bins = histogram(csvData);

	//y axis
	var y = d3.scaleLinear()
		.range([chartInnerHeight, 0]);
		y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
	chart.append("g")
		.call(d3.axisLeft(y));

	//append the bar rectangles
	chart.selectAll("rect")
		.data(bins)
		.enter()
		.append("rect")
			.attr("x", 1)
			.attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
			.attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
			.attr("height", function(d) { return chartInnerHeight - y(d.length); })
			.style("fill", "#FFB612")
			
	chart.append("text")	//text label for the x axis
		.attr("x", chartWidth / 2 )
		.attr("y",  chartHeight - topBottomPadding * 1.24)
		.style("text-anchor", "middle")
		.text("Ages Ma");
		
	chart.append("text")	//text label for the y axis
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - leftPadding)
        .attr("x",0 - (chartInnerHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("n");
		
	chartTitle = d3.select(".chartTitle") //chart title
				.text(expressedChart + " (n: " + csvData.length + ")");
}

//function to create a dropdown menu for attribute selection
function createGraphDropdown(){
	//add select element
	var dropdown = d3.select("#dropdownGraph")
		.append("select")
		.attr("class", "dropdown")
		.on("change", function(){
			expressedChart = this.value;
			changeGraphData();
		});
	//add initial option
	var titleOption = dropdown.append("option")
	.attr("class", "titleOption")
	.attr("disabled", "true")
	.text("Select Data");
	
	//add attribute name options
	var attrOptions = dropdown.selectAll("attrOptions")
		.data(attrArray)
		.enter()
		.append("option")
		.attr("value", function(d){ return d })
		.text(function(d){ return d });
};

function changeGraphData() {
	d3.selectAll("#chart > .chart").remove();
    getGraphData();
}

document.addEventListener('DOMContentLoaded', initialize)