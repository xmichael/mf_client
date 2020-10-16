'use strict';

/** globals */
const CSVURL;

// Dynamically updated GeoJSON layer
var missing = {};

var colourmap = {
    "Arable" : "#be9b6c",
    "Pasture" : "#fefb69",
    "Meadow" : "#17d41a",
    "Woodland" : "#018100",
    "Settlement" : "#e21ddc",
    "Water" : "#327eef",
    "Common land": "#FF0000",
    "Upland": "#FF0000",
    "Other": "#FF0000"
};

function create_filtered_geojson(_lu_map, _gj_map) {
    var featurecollection = {
	"type": "FeatureCollection",
	"name": "1840s_undocumented",
	"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
	"features": []
    };

    for (var k in _lu_map){
	if ( k in _gj_map ){
	    var feature = {};
	    feature = {
		"type": "Feature",
		"properties": { "rowid": k, "landuse": _lu_map[k], "colour": colourmap[_lu_map[k]] },
		"geometry": { "type": "Polygon", "coordinates": _gj_map[k] }
	    };
	    featurecollection.features.push(feature);
	}
    }

    return featurecollection;
}


/* Create a fast hash/lookup table from geojson to map rowid to geometry */
function geojson_map(gj){
    var gj_map = {};
    for (var f of gj.features){
	gj_map[f.properties.rowid] = f.geometry.coordinates;
    }
    return gj_map;
}

/* Create a geojson layer from the google forms CSV export */
function add_csv(_map, _url, _gj_map){

    //add new _url
    fetch(_url)
        .then(response => response.text())
        .then(csv => {

            var res = Papa.parse(csv,{
		delimiter: ',',
		header: true
	    });
	    
	    var lu_map = {};
	    
	    for (var row of res.data) {
		if (row["Field ID"].length != 0){
		    lu_map[row["Field ID"]] = row["Land use"];
		}
	    }

	    var filtered_geojson = create_filtered_geojson ( lu_map, _gj_map );
	    console.log(filtered_geojson);
	    //clear map
	    _map.removeLayer(missing);
	    //recreate
	    missing = L.geoJSON(filtered_geojson, {
		minZoom: 3,
		maxZoom: 18,
		style: function (feature){
		    return {
			"color": "#FF0000",
			"stroke": true,
			"fillColor": feature.properties.colour,
			"weight": 5,
			"opacity": 1
		    };
		}
	    });
	    missing.addTo(_map);
	    // missing should be on top
	    _map.on("overlayadd", function(event) {
		missing.bringToFront();
	    });
	    //_map.fitBounds(missing.getBounds());
        });
}

/* DOM ready */
$(document).ready(function() {
    // require(['map', 'panel', 'config'], function(map, panel, config) {

    var spinner = $('.spinner');

    // Base layers
    //  .. OpenStreetMap
    var osm = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 4,
	maxZoom: 17
    });

    var osmgray = L.tileLayer.grayscale('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 4,
	maxZoom: 17
    });

    //  white background
    var white = L.tileLayer("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAAA1BMVEX///+nxBvIAAAAH0lEQVQYGe3BAQ0AAADCIPunfg43YAAAAAAAAAAA5wIhAAAB9aK9BAAAAABJRU5ErkJggg==", {
	minZoom: 4,
	maxZoom: 17
    });

    // 1840s land use tiles (documented only - w/o keyword based classification)
    var landuse_1840s_documented_only = L.tileLayer('data/tiles/1840s_LU_documented_only/{z}/{x}/{y}.png', {
	minZoom: 12,
	maxNativeZoom: 16,
	maxZoom: 18,
	opacity: 1
    });

    // 1840s land use missing tiles (used for quick rendering before overlaying CSV colors)
    var missing_tiles = L.tileLayer('data/tiles/1840s_LU_missing/{z}/{x}/{y}.png', {
	minZoom: 12,
	maxNativeZoom: 16,
	maxZoom: 18,
	opacity: 1
    });

    var geometry_map = geojson_map(landuse_1840s_missing);

    /* Dyfi Biosphere Reserver outline */
    var boundary = L.geoJSON(dataservices_boundary, {
	minZoom: 3,
	maxZoom: 18,
	style: {
	    "color": "#000000",
	    "stroke": true,
	    "fill": false,
	    "weight": 5,
	    "opacity": 0.65
	}
    });

    // Map
    var map = L.map('map', {
	center: [52.48, -4.040],
	zoom: 14,
	minZoom: 9,
	maxZoom: 18,
	fadeAnimation: false,
	layers: [osmgray]
    });
    
    map.attributionControl.setPrefix('');

    var basemaps = {
	"OpenStreetMap Grayscale": osmgray,
	"No background": white
    };

    var extramaps = {
	"Land Use 1840s <span class='text-info'>(documented)</span>": landuse_1840s_documented_only,
	"missing information": missing_tiles
    };

    add_csv(map, 'CSVURL', geometry_map);
    
    // Add base layers
    L.control.layers({}, extramaps, {
	collapsed: false
    }).addTo(map);

    /*********************/


    /* sequence matters for click events on map (lastest grabs clicks) */
    boundary.addTo(map);
    //landuse_1840s_documented_only.addTo(map);
    missing_tiles.addTo(map);


    spinner.show();
    setTimeout(function() {
	spinner.hide();
    }, 1500);

    //spinner.hide();


    setInterval(function() {
	add_csv(map, 'CSVURL', geometry_map);
    }, 20000);
    /*********************/
    /****** LEGEND ********/
    var legend = L.control({
	position: 'bottomright'
    });

    legend.onAdd = function(map) {
	var div = L.DomUtil.create('div', 'info legend');
	div.innerHTML += `
    <div class="d-flex flex-column">
      <div class="d-flex flex-row justify-content-center"><h5>Land Use</h5></div>
    <div class="d-flex flex-row">
    <div class="d-flex flex-column mr-3 border-right">
        <div>
          <svg width="20" height="20">
            <circle fill="#be9b6c" r="10" cx="10" cy="10"></circle>
          </svg>
          Arable
        </div>
        <div>
          <svg width="20" height="20">
            <circle fill="#fefb69" r="10" cx="10" cy="10"></circle>
          </svg> Pasture
        </div>
        <div>
          <svg width="20" height="20">
            <circle fill="#17d41a" r="10" cx="10" cy="10"></circle>
          </svg> Meadow
        </div>
        <div>
          <svg width="20" height="20">
            <circle fill="#018100" r="10" cx="10" cy="10"></circle>
          </svg> Woodland
        </div>
        <div>
          <svg width="20" height="20">
            <circle fill="#e21ddc" r="10" cx="10" cy="10"></circle>
          </svg> Settlement
        </div>
        <div>
          <svg width="20" height="20">
            <circle fill="#327eef" r="10" cx="10" cy="10"></circle>
          </svg> Water
        </div>
      </div>
      </div>
    `;
	var draggable = new L.Draggable(div);
	draggable.enable();

	return div;
    };

    legend.addTo(map);

    /*********************/

    // Fit to overlay bounds
    //map.fitBounds([[52.330180936, -3.36476263021], [52.885998209, -4.39698523643]]);

});
