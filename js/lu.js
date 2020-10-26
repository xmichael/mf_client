'use strict';

/* Change visibility of all elements that have a class "en" or "cy"
 * depending on "lang" parameter 
 */
function show_translated_text(){
    if (window.location.search=="?lang=cy"){
	$('.cy').show();
	$('.en').hide();
    }
    else{
	$('.en').show();
	$('.cy').hide();
    }
}

/** main **/
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

    /* 1930s DS data */
    var ds = L.tileLayer('data/tiles/DS/{z}/{x}/{y}.png', {
	opacity: 1,
	attribution: "| This work is based on data provided through www.VisionofBritain.org.uk and uses historical Land Utilisation Survey map material which is copyright of The Land Utilisation Survey of Great Britain, 1933-49, copyright Audrey N. Clark.",
	minZoom: 12,
	maxNativeZoom: 14,
	maxZoom: 20
    });


    // Contemporary FBs
//    var landuse_now =L.tileLayer('data/tiles/2019_land_use/{z}/{x}/{y}.png', {
    var landuse_now =L.tileLayer('data/tiles/2019_LU2/{z}/{x}/{y}.png', {	opacity: 1,
	minZoom: 10,
	maxNativeZoom: 14,
	maxZoom: 18
    });

    // 1840s land use tiles
    //    var landuse_1840s = L.tileLayer('data/tiles/1840s_LU_new/{z}/{x}/{y}.png', {
        var landuse_1840s = L.tileLayer('data/tiles/1840s_LU_documented_only2/{z}/{x}/{y}.png', {
	minZoom: 10,
	maxNativeZoom: 14,
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



    /******** LOAD OVERLAYS ******/
    /*  var Boundary = $.ajax({url:"/data/boundary.geojson", dataType: "json",
	success: console.log("County data successfully loaded."),
	error: function (xhr) {
        alert(xhr.statusText)
	}}) */

    var extramaps = {
	"Land Use <span class='text-info'>(1840s)</span>": landuse_1840s,
	"Land Use <span class='text-info'>(Dudley Stamp 1930s)</span>": ds,
	"Land Use <span class='text-info'>(Contemporary)</span>": landuse_now
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
    //landuse_1840s.addTo(map);
    //ds.addTo(map);
    landuse_now.addTo(map);
    //ALC2.addTo(map);


    spinner.show();
    setTimeout(function() {
	spinner.hide();
    }, 1500);

    //spinner.hide();

    var sidebar = L.control.sidebar('sidebar', {
        closeButton: true,
        position: 'left'
    });
    map.addControl(sidebar);

    show_translated_text();

    // there is a bug in leaflet-sidebar and the close button has
    // lower z-index than map
    $(".leaflet-sidebar > .close").css('z-index',800);
    setTimeout(function () {
        sidebar.show();
    }, 500);
    
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
        <div>
          <svg width="20" height="20">
            <circle fill="#2ece76" r="10" cx="10" cy="10"></circle>
          </svg> Common
        </div>
        <div>
          <svg width="20" height="20">
            <circle fill="#53ccbc" r="10" cx="10" cy="10"></circle>
          </svg> Upland
        </div>
      </div>
</div></div>
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
