'use strict';

/* sidebar with crops list in two languages */
import {html_legend_lu} from './lu_ui.js';
import {get_transtext, flip_l10n} from './mf_i18n.js';

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

    // Add overlays (no base maps)
    var extramaps = {};
    extramaps[`${get_transtext("lu_land_use")} <span class='text-info'>(${get_transtext("lu_1840s")})</span>`] = landuse_1840s;
    extramaps[`${get_transtext("lu_land_use")} <span class='text-info'>(Dudley Stamp ${get_transtext("lu_1930s")})</span>`] = ds;
    extramaps[`${get_transtext("lu_land_use")} <span class='text-info'>(${get_transtext("lu_contemporary")})</span>`] = landuse_now;

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

    // there is a bug in leaflet-sidebar and the close button has
    // lower z-index than map
    $(".leaflet-sidebar > .close").css('z-index',800);
    setTimeout(function () {
        sidebar.show();
    }, 500);

    flip_l10n();
    /*********************/
    /****** LEGEND ********/
    var legend = L.control({
	position: 'bottomright'
    });

    legend.onAdd = function(map) {
	var div = L.DomUtil.create('div', 'info legend');
	div.innerHTML += `
    <div id="lu_legend" class="d-flex flex-column">
    </div>
    `;
	var draggable = new L.Draggable(div);
	draggable.enable();

	return div;
    };

    legend.addTo(map);

    /*********************/

    $('#lu_legend').html(html_legend_lu);

    // Fit to overlay bounds
    //map.fitBounds([[52.330180936, -3.36476263021], [52.885998209, -4.39698523643]]);

});
