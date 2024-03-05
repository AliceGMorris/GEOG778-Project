//global variables
var map,
	loc,
	attrArray = ["AFT", "AHe"], //list of attributes
	expressed = attrArray[0], //initial attribute
	masterData = [],
	Links = [],
	colourArray = [],
	points;
	
//create marker options
var options = {
	 color: "#000000",
	 weight: 1,
	 opacity: 1,
	 fillOpacity: 0.8
};
 
function initialize() {
	getMasterData();
}

function getMasterData() {
	//use Promise.all to parallelize asynchronous data loading
	var promises = []; 
	promises.push(d3.csv("data/masterData.csv")); //load masterData
	promises.push(d3.csv("data/Links.csv")); //load Links
	Promise.all(promises).then(callback);		
	
	function callback(data) {
		masterData = data[0],
		Links = data[1];
		
		randomColours();
		createMap();
		createDropdown();
	};
	
	fetch("data/QFaults.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){			
            //call function to create proportional symbols
            createFautlsSymbols(json);
		
        })
};

//Add circle markers for point features to the map
function createFautlsSymbols(data){
	//create marker options
	var Faultoptions = {
		 color: "#000000",
		 weight: 2,
		 opacity: 1,
		 fillOpacity: 0.8
	};
	//create a Leaflet GeoJSON layer and add it to the map
	var Faults = L.geoJson(data, Faultoptions).addTo(map);
	 
	Faults.eachLayer(function(layer){
		var slip;
		if (layer.feature.properties.SLIPSENSE == "SS") {
			slip = "Strike Slip Fault";
		} else if (layer.feature.properties.SLIPSENSE == "N") {
			slip = "Normal Fault";
		} else if (layer.feature.properties.SLIPSENSE == "R") {
			slip = "Reverse Fault";
		} else if (layer.feature.properties.SLIPSENSE == "T") {
			slip = "Thrust Fault";
		} else {
			slip = "unkown";
		}
		layer.bindPopup("<strong>" + layer.feature.properties.NAME +"</strong><br><b>Fault type: </b>"+ slip +"<br><b>Slip Rate: </b>"+ layer.feature.properties.SLIPRATE + " mm/yr<br><b> Dip Direction: </b>" + layer.feature.properties.DIPDIRECTI + "<br><b>Fault location: </b>"+layer.feature.properties.FTYPE);
	});
};

function createMap(){
	var USGS = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}', {
			 maxZoom: 20,
			 attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
		});
	
	var USGS_USImageryTopo = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
		maxZoom: 20,
		attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
	});

	var baseMaps = {
		"National Map": USGS,
		"USGS Topo" : USGS_USImageryTopo,
	};

    //create the map
	map = L.map('map', {
		fullscreenControl: true,
		fullscreenControlOptions: {
			position: 'bottomleft'
		},
		zoomControl: false,
		center: [61.5, -145],
		zoom: 6,
		layers: [USGS]
	});

	var layerControl = L.control.layers(baseMaps).addTo(map);

	L.control.zoom({
		position: 'topright'
	}).addTo(map);
	
	//call getData function
    getData();
};

function getData(){
	loc = "data/" + expressed + ".geojson";
    //load the data
    fetch(loc)
        .then(function(response){
            return response.json();
        })
        .then(function(json){			
            //call function to create proportional symbols
            createPropSymbols(json, attrArray);
		
        })
};

//Add circle markers for point features to the map
function createPropSymbols(data, attributes){
	 //create a Leaflet GeoJSON layer and add it to the map
	 points = L.geoJson(data, {
		pointToLayer: function(feature, latlng){
			return pointToLayer(feature, latlng, attributes);
		}
	 }).addTo(map);
};

//function to convert markers to circle markers
function pointToLayer(feature, latlng){
	
	//For each feature, determine its value for the selected attribute
	var attValue = feature.properties.Ref;
	 
	//Give each feature's circle marker a radius
	options.radius = 5;
	
	options.fillColor = makeColours(attValue);
	 
	//create circle marker layer
	var layer = L.circleMarker(latlng, options);
	 	 
	//build popup content string
	var popupContent = createPopupContent(feature.properties);
	
	//bind the popup to the circle marker 
	layer.bindPopup(popupContent, { offset: new L.Point(0,-options.radius) });
	 
	//return the circle marker to the L.geoJson pointToLayer option
	return layer;
};

function createPopupContent(properties){
	for (var i=0; i<Links.length; i++){
		if (properties.Ref == Links[i].Ref) {
			var sourceLink = Links[i].Links
		}
	}
	//add state to popup content string
	var popupContent = "<p><b>Sample:</b> " + properties.Sample + "</p>";
	popupContent += "<p><b>Age:</b> " + properties.Age + " Ma</p>";
	popupContent += "<p><b>STD:</b> " + properties.STD + " Ma</p>";
	popupContent += '<p><b>Paper:</b> <a href="'+ sourceLink +'" target="_blank"><b>'+ properties.Ref + '</b></a>';
	 
	 
	return popupContent;
};

function randomColours() {
	for (var j=0; j<Links.length; j++) {
		var colour = "rgb(";
			for (var i=0; i<3; i++){
				var random = Math.round(Math.random() * 255);
				colour += random;
				if (i<2){
					colour += ",";
				} else {
					colour += ")";
				}
			}
			colourArray[j] = colour;
	};
};

function makeColours(attValue) {
	var colours = "#000000"
	for (var i=0; i<Links.length; i++) {
		if(attValue==Links[i].Ref) {
			colours = colourArray[i];
		}
	}
	return colours;
};

//function to create a dropdown menu for attribute selection
function createDropdown(){
	//add select element
	var dropdown = d3.select("#dropdown")
		.append("select")
		.attr("class", "dropdown")
		.on("change", function(){
			expressed = this.value;
			changeData();
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

function changeData() {
	points.remove();
	
    getData();
}

document.addEventListener('DOMContentLoaded', initialize)