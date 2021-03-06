'use strict';

import food_data from '../data/food/food.js';
import {descriptions, keywords, utils} from './food_ui.js';
import {get_transtext} from './mf_i18n.js';

/** global namespace */
window.GLOBALS = {};
/*********************/

/* Show intro modal */

function add_intro_modal(_id) {
    var html = `
      <!-- modal-{sm,lg,xl} -->
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${get_transtext('food_intro_title')}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
               ${get_transtext('food_intro_body')}
            </div>
          </div>
       </div>
      </div> <!-- modal-dialog -->
    `;
    $('#' + _id).html(html).modal();
}

function add_info(_map){
    /** create interactive info panel */
    var info = L.control({position:'topright'});
    info.onAdd = function (_map) {
	this._div = L.DomUtil.create('div', 'info legend');
	this.update();
	return this._div;
    };
    info.update = function (props) {
	this._div.innerHTML = props ?
			       `<b>${utils.get_translated_property(props,"Name")}</b><br/>
      ${props["Role"]}<br/>
      ${props["Address"]}` : get_transtext('food_click_on_food_icon');
    };

    return info.addTo(_map);
}

/** Create an HTML div to display a histories feature */
function create_html_popup( feature ){
   
}

/** Add the markers on map and with dynamic popup content */
function add_histories_markers(_map, _histories, _info){


    var storeIcon = L.icon({
	iconUrl: 'data/food/distributor.svg',
	iconSize: [28, 33]
    });
    var foodIcon = L.icon({
	iconUrl: 'data/food/producer.svg',
	iconSize: [28, 33]
    });

    /** Add markers */
    var hist_layer = L.geoJSON(_histories, {
	minZoom: 1,
	maxZoom: 20,
	pointToLayer: function(feature, latlng){
	    return feature.properties["Role"].startsWith('P')? L.marker(latlng, {icon: foodIcon}):  L.marker(latlng, {icon: storeIcon});
	},
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
		    /* NOTE: overriding short popup for now. Immediately open the modal when clicking an icon*/
		    GLOBALS.descriptions.modal('description_modal', GLOBALS.history_props[layer.feature.properties["ID"]]);
		}
            });
	    /* NOTE: overriding short popup for now. Immediately open the modal when clicking an icon*/
	    var props = feature.properties;
	    // image path is ID/picture[X]_scaled.jpg
	    var base = props["ID"];
	    var pics = props["Picture title"]? props["Picture title"][0] : undefined;
	    /* create index by-base needed by onclick handlers */
	    window.GLOBALS.history_props[base] = feature;
	}
    });

    hist_layer.addTo(_map);

    return hist_layer;
    //marker.bindPopup(popup_long);
    //L.popup().setLatLng(e.latlng).setContent("test").openOn(_map)
}

$(document).ready(function() {

    /** export Globals -- needed for inline onclick events and for debugging */
    window.GLOBALS = {
	history_props: {},   // features dictionary indexed by "Clip Name"
	descriptions : descriptions, // descriptions UI functions
	leaflet_map : undefined
    };

    var spinner = $('.spinner');

    // Base layers
    //  .. OpenStreetMap
    var osm = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 4,
	maxNativeZoom: 19,
	maxZoom: 20
    });

    /* Dyfi Biosphere Reserver outline */
    var boundary = L.geoJSON(dataservices_boundary, {
	minZoom: 3,
	maxZoom: 20,
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
	center: [52.6, -3.76],
	zoom: 11,
	minZoom: 9,
	maxZoom: 20,
	fadeAnimation: false,
	layers: [osm]
    });
    
    map.attributionControl.setPrefix('');
    
    window.GLOBALS.leaflet_map = map;

    /* sequence matters for click events on map (lastest grabs clicks) */
    boundary.addTo(map);

    var info = add_info(map);
    var hist_layer = add_histories_markers(map, food_data, info);

    spinner.show();
    setTimeout(function() {
	spinner.hide();
    }, 1000);

    add_intro_modal('description_modal');
    
    // console.log(food_data);
    var set = keywords.createSet(food_data,"Keywords");
    $('#food_keywords').html(keywords.createHTML(set));

    /* handler when user clicks on a filter */
    keywords.bind(
	(checked)=>{
	    hist_layer.eachLayer((layer) => {
		// corner-case: when the user deselects all-keywords then enable all features (i.e. none == all aka filters are disabled)
		if (checked.size == 0){
		    //console.log("empty filter. Enabling all features.");
		    layer.getElement().style.display = '';	      
		    return;
		}

		// check each feature's keywords have at least one keyword in the "checked" set.
		// If yes, make those features visible
		for ( var k of utils.get_translated_property(layer.feature.properties, "Keywords") ){
		    if (checked.has(k)){
			if ( layer.getElement().style.display == 'none'){
			    // console.log("re-adding removed layer:" + layer.feature.properties["Clip Name"]);
			    layer.getElement().style.display = '';
			}
			return;
		    }
		}
		// no keyword found. Hide the feature
		//console.log("removing layer:" + layer.feature.properties["Clip Name"]);
		layer.getElement().style.display = 'none';

		
	    });

	});

    /*********************/

    // Fit to overlay bounds
    //map.fitBounds([[52.330180936, -3.36476263021], [52.885998209, -4.39698523643]]);

});
