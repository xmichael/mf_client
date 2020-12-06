'use strict';

/** globals */
const JSONURL='../data/apport_wt.geojson';

const colourmap = {
    "1. " : "#007F5F", //1. Woodland
    "2. " : "#AACC00", //2. Woody places
    "3. " : "#DDA15E"  //3. Tree names
};

/** functions */

/* Create a fetch geojson and add it to map */
function add_geojson(_map, _info){

    //add new _url
    fetch(JSONURL)
        .then(response => response.json())
        .then(geojson => {
	    var layer = L.geoJSON(geojson, {
		minZoom: 3,
		maxZoom: 18,
		onEachFeature: function(feature, layer){
		    /** a) On mouse over/out (hover) update the info box.
		     *   b) On mouse click recenter the map
		     */
		    layer.on({
    			mouseover: function(e){
			    _info.update(layer.feature.properties);
			},
    			mouseout: function(e){
        		    _info.update();
			},
			click: function(e){ //re-center when user clicks a point
			    _map.panTo(e.target.getLatLng());
			}
		    });
		    const props = feature.properties;
		    layer.bindPopup(`
                      <div>
                        <b>Field number</b>: ${props["field_number"]}<br/>
                        <b>Name</b>: ${props["field_name"]}<br/>
                        <b>Keywords</b>: ${props["detected_keywords"]}<br/>
                        <b>Class</b>: ${props["wt_class"]}<br/>
                        <b>Subclass</b>: ${props["wt_subclasses"]}<br/>
                      </div>`
                    );
		},
		
		pointToLayer: (feature, latlng) => {
		    var colour = 0;
		    for (const k of Object.keys(colourmap)){
			// if it includes "1. " then colourmap "1. "
			// (if more then one then the last remains)
			if (feature.properties.wt_subclasses.includes(k)) {
			    colour = colourmap[k];
			}
		    }
		    
		    return L.circleMarker(latlng, {
			radius: 5,
			fillColor: colour,
			color: "#000",
			weight: 1,
			opacity: 1,
			fillOpacity: 0.8
		    });
		}
	    });

	    layer.addTo(_map);
	    _map.fitBounds(layer.getBounds());
	});
}

/** create interactive info panel */
function add_info(_map){
    var info = L.control({position:'topright'});
    info.onAdd = function (_map) {
	this._div = L.DomUtil.create('div', 'info legend');
	this.update();
	return this._div;
    };
    info.update = function (props) {
	this._div.innerHTML = props ?
	    `<b>Field number:</b> ${props["field_number"]}<br/>
      <b>Name:</b> ${props["field_name"]}<br/>
      <b>Keywords:</b> ${props["detected_keywords"]}<br/>
      <b>Class:</b> ${props["wt_class"]}<br/>
      <b>Subclass:</b> ${props["wt_subclasses"]}<br/>`
	    : "<b>Click</b> on a circle marker for more info";
    };

    return info.addTo(_map);
}


/* DOM ready */
$(document).ready(function() {
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
	center: [52.60, -4.040],
	zoom: 10,
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


    var info = add_info(map);

    add_geojson(map, info);
    

    /* sequence matters for click events on map (lastest grabs clicks) */
    boundary.addTo(map);
    //landuse_1840s_documented_only.addTo(map);

    spinner.show();
    setTimeout(function() {
	spinner.hide();
    }, 1500);

    //spinner.hide();


    /*********************/
    /****** LEGEND ********/
    var legend = L.control({
	position: 'bottomright'
    });

    legend.onAdd = function(map) {
	var div = L.DomUtil.create('div', 'info legend');
	div.innerHTML += `
    <div class="d-flex flex-column">
      <div class="d-flex flex-row justify-content-center"><h5>WT Subclasses</h5></div>
    <div class="d-flex flex-row">
    <div class="d-flex flex-column mr-3 border-right">
        <div>
          <svg width="20" height="20">
            <circle fill="#007F5F" r="8" cx="10" cy="10"></circle>
          </svg> Woodland
        </div>
        <div>
          <svg width="20" height="20">
            <circle fill="#AACC00" r="8" cx="10" cy="10"></circle>
          </svg> Woody places
        </div>
        <div>
          <svg width="20" height="20">
            <circle fill="#DDA15E" r="8" cx="10" cy="10"></circle>
          </svg> Tree names
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
});
