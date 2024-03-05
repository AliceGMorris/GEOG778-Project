require([
    "esri/config", 
    "esri/Map", 
    "esri/views/MapView",
    "esri/widgets/Locate",
    "esri/widgets/Search",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Expand",
    "esri/layers/FeatureLayer",
    "esri/widgets/Legend",
    "esri/widgets/Editor",
    "esri/renderers/UniqueValueRenderer",
    "esri/widgets/LayerList",
    "esri/rest/support/Query",
    "esri/layers/GraphicsLayer",
    "esri/Graphic",
    "esri/renderers/Renderer",
    "esri/renderers/SimpleRenderer",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/layers/CSVLayer",
    "esri/layers/GroupLayer",
	"esri/layers/GeoJSONLayer",
	"esri/symbols/SimpleLineSymbol"
    ], function(
    esriConfig, 
    Map, 
    MapView,
    Locate,
    Search,
    BasemapGallery,
    Expand,
    FeatureLayer,
    Legend,
    Editor,
    UniqueValueRenderer,
    LayerList,
    Query,
    GraphicsLayer,
    Graphic,
    Renderer,
    SimpleRenderer,
    SimpleMarkerSymbol,
    CSVLayer,
    GroupLayer,
	GeoJSONLayer,
	SimpleLineSymbol
    ) {
	//ApiKey and set up map
	esriConfig.apiKey = "AAPK14ceecbe50e741a8abf64505c88e0ae2hbmy5FKYTlNO8r9NgEY1n0spf5bQg4X-Ws2mCUoXrQMECei8f3MgQr4g6cglMzjO";
	const map = new Map({ 
		basemap: "arcgis-topographic" // Basemap layer service
	});
	const view = new MapView({
		map: map,
		center: [-145, 61.5], // Longitude, latitude
		zoom: 6, // Zoom level
		container: "map" // Div element
	});
	
	//Basemap gallery
	const basemapGallery = new BasemapGallery({
		view: view,
		container: document.createElement("BasemapGallerydiv")
	});
	const bgExpand = new Expand({
		view: view,
		content: basemapGallery
	});
	view.ui.add(bgExpand, "top-left");

	let genRender = {
        type: "unique-value",  
        field: "Generalize",
        uniqueValueInfos: [{
          value: "VOLCANIC ROCKS",
          symbol: {
            "type": "simple-fill",
            color: [ 204, 0, 0 ],
			style: "solid",
			outline: { 
				width: 0
			}
          }
        }, {
          value: "TECTONIC ASSEMBLAGES AND MÉLANGE",
          symbol: {
            "type": "simple-fill",
            color: [ 32, 32, 32 ],
			style: "solid",
			outline: { 
				width: 0
			}
          }
        }, {
          value: "SEDIMENTARY ROCKS; METAMORPHIC ROCKS",
          symbol: {
            "type": "simple-fill",
            color: [ 60, 139, 54 ],
			style: "solid",
			outline: { 
				width: 0
			}
          }
        }, {
          value: "METAMORPHIC ROCKS",
          symbol: {
            "type": "simple-fill",
            color: [ 51, 51, 255 ],
			style: "solid",
			outline: { 
				width: 0
			}
          }
        }, {
          value: "BEDROCK",
          symbol: {
            "type": "simple-fill",
            color: [ 204, 0, 102 ],
			style: "solid",
			outline: {  
				width: 0
			}
          }
        }, {
			value: "INTRUSIVE ROCKS",
			symbol: {
			  "type": "simple-fill",
			  color: [ 255, 153, 51 ],
			  style: "solid",
			  outline: {  
				  width: 0
			  }
			}
		  }, {
			value: "SEDIMENTARY ROCKS",
			symbol: {
			  "type": "simple-fill",
			  color: [ 255, 255, 0 ],
			  style: "solid",
			  outline: {  
				  width: 0
			  }
			}
		  }, {
			value: "UNCONSOLIDATED DEPOSITS",
			symbol: {
			  "type": "simple-fill",
			  color: [ 102, 102, 0 ],
			  style: "solid",
			  outline: {  
				  width: 0
			  }
			}
		  }]
      };

	let ageRender = {
        type: "unique-value", 
		field: "AgeGen",
        uniqueValueInfos: [{
          value: "Quaternary",
          symbol: {
            "type": "simple-fill",
            color: [ 255, 255, 77 ],
			style: "solid",
			outline: { 
				width: 0
			}
          }
        }, {
          value: "Tertiary",
          symbol: {
            "type": "simple-fill",
            color: [ 255, 179, 77 ],
			style: "solid",
			outline: { 
				width: 0
			}
          }
        }, {
			value: "Mesozoic",
			symbol: {
			  "type": "simple-fill",
			  color: [ 85, 209, 229 ],
			  style: "solid",
			  outline: { 
				  width: 0
			  }
			}
		  }, {
			value: "Cretaceous",
			symbol: {
			  "type": "simple-fill",
			  color: [ 128, 255, 77 ],
			  style: "solid",
			  outline: { 
				  width: 0
			  }
			}
		  }, {
			value: "Jurassic",
			symbol: {
			  "type": "simple-fill",
			  color: [ 102, 255, 153 ],
			  style: "solid",
			  outline: { 
				  width: 0
			  }
			}
		  }, {
			value: "Triassic",
			symbol: {
			  "type": "simple-fill",
			  color: [ 102, 255, 204 ],
			  style: "solid",
			  outline: { 
				  width: 0
			  }
			}
		  }, {
			value: "Permian",
			symbol: {
			  "type": "simple-fill",
			  color: [ 102, 255, 255 ],
			  style: "solid",
			  outline: { 
				  width: 0
			  }
			}
		  }, {
			value: "Carboniferous",
			symbol: {
			  "type": "simple-fill",
			  color: [ 95, 182, 181 ],
			  style: "solid",
			  outline: { 
				  width: 0
			  }
			}
		  }, {
			value: "Pennsylvanian",
			symbol: {
			  "type": "simple-fill",
			  color: [ 102, 204, 255 ],
			  style: "solid",
			  outline: { 
				  width: 0
			  }
			}
		  }, {
			value: "Mississippian",
			symbol: {
			  "type": "simple-fill",
			  color: [ 153, 179, 230 ],
			  style: "solid",
			  outline: { 
				  width: 0
			  }
			}
		  }, {
			value: "Devonian",
			symbol: {
			  "type": "simple-fill",
			  color: [ 128, 153, 255 ],
			  style: "solid",
			  outline: { 
				  width: 0
			  }
			}
		  }, {
			value: "Silurian",
			symbol: {
			  "type": "simple-fill",
			  color: [ 179, 128, 255 ],
			  style: "solid",
			  outline: { 
				  width: 0
			  }
			}
		  }, {
			value: "Ordovician",
			symbol: {
			  "type": "simple-fill",
			  color: [ 255, 128, 230 ],
			  style: "solid",
			  outline: { 
				  width: 0
			  }
			}
		  }, {
			value: "Cambrian",
			symbol: {
			  "type": "simple-fill",
			  color: [ 255, 128, 153 ],
			  style: "solid",
			  outline: { 
				  width: 0
			  }
			}
		  }, {
			value: "Proterozoic",
			symbol: {
			  "type": "simple-fill",
			  color: [ 153, 153, 102 ],
			  style: "solid",
			  outline: { 
				  width: 0
			  }
			}
		  }, {
			value: "Neoproterozoic",
			symbol: {
			  "type": "simple-fill",
			  color: [ 222, 235, 179 ],
			  style: "solid",
			  outline: { 
				  width: 0
			  }
			}
		  }, {
			value: "Paleoproterozoic",
			symbol: {
			  "type": "simple-fill",
			  color: [ 222, 204, 222 ],
			  style: "solid",
			  outline: { 
				  width: 0
			  }
			}
		  }]
	};

	const geoPopup = {
		"title": "{STATE_UNIT}",
		"content": "<b>Map unit: </b> {STATE_LABE} <br><b>Age: </b> {Age} <br><b> Rock generalization: </b>{Generalize}"
	}

	/*
	const basementGEO = new GeoJSONLayer({
		title: "Alaska Basement Geology",
		url: "data/Alaska_GEO_Basement_AgeGen.geojson",
		copyright: "Geological Survey Scientific Investigations",
		outFields: ["STATE_UNIT", "STATE_LABE", "AGE_RANGE", "Generalize", "Age", "AgeGen"],
		popupTemplate: geoPopup,
		renderer: genRender
	})
	*/

	const basementGEO = new FeatureLayer({
		title: "Alaska Basement Geology",
		url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Alaska_GEO_Basement_AgeGen/FeatureServer",
		copyright: "Geological Survey Scientific Investigations",
		outFields: ["STATE_UNIT", "STATE_LABE", "AGE_RANGE", "Generalize", "Age", "AgeGen"],
		popupTemplate: geoPopup,
		renderer: genRender
	})

	const GEO = new FeatureLayer({
		title: "Alaska Geology",
		url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Alaska_GEO/FeatureServer",
		copyright: "Geological Survey Scientific Investigations",
		outFields: ["STATE_UNIT", "STATE_LABE", "AGE_RANGE", "Generalize", "Age", "AgeGen"],
		popupTemplate: geoPopup,
		renderer: genRender
	})

	let Alaska_Geology = new GroupLayer({
		title: "Alaska Geology",
		visibilityMode: "exclusive",
		layers: [GEO, basementGEO]
	});
	map.add(Alaska_Geology)


	const faultsPopup = {
		"title": "{NAME}",
		"content": "<b>Fault type: </b> {SLIPSENSE} <br><b>Slip Rate: </b> {SLIPRATE} mm/yr<br><b> Dip Direction: </b>{DIPDIRECTI}<br><b>Fault location: </b>{FTYPE}"
	}

	const faultRender = new SimpleRenderer({
		symbol: new SimpleLineSymbol({
		  width: 1.5,
		  color: "#000",
		})
	  });

	const faults = new GeoJSONLayer({
		title: "Quaternary Faults",
		url: "data/QFaults.geojson",
		copyright: "Alaska Division of Geological & Geophysical Surveys",
		outFields: ["NAME", "SLIPSENSE", "SLIPRATE", "DIPDIRECTI", "FTYPE"],
		popupTemplate: faultsPopup,
		renderer: faultRender
	})
	map.add(faults)

	//Legend and its expand container
	let legend = new Legend({
		view: view,
		container: document.createElement("legend"),
		hideLayersNotInCurrentView: true
	});
	const lgExpand = new Expand({
		view: view,
		content: legend
	});
	view.ui.add(lgExpand, "bottom-right");

	//Layerlist
	let layerList = new LayerList({
		view: view,
		container: document.createElement("layerList")
	});
	const listExpand = new Expand({
		view: view,
		content: layerList
	});
	view.ui.add(listExpand, "bottom-left");


	view.ui.add("optionsDiv", "bottom-left");

	const queryOpts = document.getElementById("query-type");

	queryOpts.addEventListener("change", () => {
		switch (queryOpts.value) {
			// values set based on trail type
			case "gen":
				map.remove(Alaska_Geology);
				map.remove(faults);
				basementGEO.renderer = genRender;
				GEO.renderer = genRender;
				map.add(Alaska_Geology);
				map.add(faults);
				
				break
			case "age":
				map.remove(Alaska_Geology);
				map.remove(faults);
				basementGEO.renderer = ageRender;
				GEO.renderer = ageRender;
				map.add(Alaska_Geology);
				map.add(faults);

				break;
		}
	});
}); 