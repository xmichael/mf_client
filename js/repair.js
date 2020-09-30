'use strict';

/* global require */

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

    // Overlay layers

    // Overlay layers (TMS)

    // Contemporary FBs

    var landuse_now =L.tileLayer('data/tiles/2019_land_use/{z}/{x}/{y}.png', {
	opacity: 1,
	minZoom: 10,
	maxNativeZoom: 14,
	maxZoom: 18
    });

    // 1840s land use tiles
    var landuse_1840s = L.tileLayer('data/tiles/1840s_LU_repair/{z}/{x}/{y}.png', {
	minZoom: 12,
	maxNativeZoom: 16,
	maxZoom: 18,
	opacity: 1
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
	center: [52.47, -4.055],
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
	"Land Use <span class='text-info'>(1840s)</span>": landuse_1840s
    };


    // Add base layers
    L.control.layers({}, extramaps, {
	collapsed: false
    }).addTo(map);

    // landuse_1840s should be on top

    map.on("overlayadd", function(event) {
	landuse_1840s.bringToFront();
    });

    /*********************/


    /* sequence matters for click events on map (lastest grabs clicks) */
    boundary.addTo(map);
    landuse_1840s.addTo(map);
    //ds.addTo(map);
    //landuse_now.addTo(map);
    //ALC2.addTo(map);


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
      <div class="d-flex flex-row justify-content-center"><h5>Legend</h5></div>
    <div class="d-flex flex-row">
    <div class="d-flex flex-column mr-3 border-right">
        <div>
          <h6 class="text-center">Land use</h6>
        </div>
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
