'use strict';

import op_data from '../data/opportunities/opport_wgs84.js';

/** global namespace */
window.GLOBALS = {};
/*********************/

function set_spinner(timeout){
    var spinner = $('.spinner');
    spinner.show();
    setTimeout(function() {
	spinner.hide();
    }, timeout);

}

function calculate_opportunity_score_algorithm(_carbonscore, _erosionscore, _historical, _constraints){
    /* If any of carbon/erosion score is 0 then return 0 (not enforced in the interactive version!)
      if ( _carbonscore * _erosionscore == 0 ){
      return 0;
      }
    */
    if (_constraints.force_historical && (_historical == 0)){
	return 0;
    }
    
    var score = ((_constraints.carbonweight * _carbonscore) +
		 (_constraints.erosionweight * _erosionscore) + (_constraints.historicalweight * _historical)) / 3;
    
    //console.log( _carbonscore, _erosionscore, _historical, _constraints.historicalweight, _constraints.erosionweight, _constraints.carbonweight );
    return score.toFixed(1);
}

function calculate_opportunity_score( props ){
    var score = calculate_opportunity_score_algorithm(props["carbon_score"],props["erosion_score"],props["historical_score"],window.GLOBALS.op_constraints);
    return score;
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
	this._div.innerHTML = (props ?
			       `<b>Erosion risk</b>: ${parseFloat(props["erosionrisk-11072020"]).toFixed(2)}<br/>
      <b>Carbon risk</b>: ${props["carbonrisk"]}<br/>
      <b>Erosion score (0-5)</b>: ${props["erosion_score"]}<br/>
      <b>Carbon score (0-5)</b>: ${props["carbon_score"]}<br/>
      <b>Historical score (0,1)</b>: ${props["historical_score"]}<br/>
      <b>Opportunity score</b>: ${calculate_opportunity_score(props)}`
			       : 'Click on a <b>field</b> for extra info');
    };

    return info.addTo(_map);
}

/** Create an HTML div to display information for each polygon */
function create_html_popup( feature ){

    var props = feature.properties;
    var base = props["ogc_fid"];
    var join_message = props["fieldid_1840"] === null ?
	"No historical arable/pasture landuse found" : `joined to ${props["fieldid_1840"]}`;
    
    return `
  <div>
      <b>ogc_fid</b>: ${props["ogc_fid"]}<br/>
      <b>1840 ids</b>: ${props["id_1840"]}<br/>
      <b>fieldid</b>: ${props["fieldid"]}<br/>
      <b>land use now</b>: ${props["class"]}<br/>
      <b>land use 1840s (${join_message})</b>: ${props["class_1840"]}<br/>
      <b>Erosion risk</b>: ${parseFloat(props["erosionrisk-11072020"]).toFixed(2)}<br/>
      <b>Carbon risk</b>: ${props["carbonrisk"]}<br/>
      <b>Erosion score (0-5)</b>: ${props["erosion_score"]}<br/>
      <b>Carbon score (0-5)</b>: ${props["carbon_score"]}<br/>
      <b>Historical score (0,1)</b>: ${props["historical_score"]}<br/>
      <b>Opportunity score</b>: ${calculate_opportunity_score(props)}
    </div>
  `;
}

/** Add the opportunity features on map and with dynamic popup content */
function add_opportunities_polygons(_map, _opportunities, _info){
    /** Add features */

    function style(feature) {
	// var d = feature.properties["OPPORTUNITY_SCORE"];
	var d = calculate_opportunity_score( feature.properties );
	var style = {
            weight: 1,
            opacity: 0.65,
            color: '#000000',
            dashArray: '3',
	    fillOpacity: '0'
	};
	if (d > 0){
	    style["fillColor"] = d ==5 ? '#b30000' :
		d ==4 ? '#e34a33' :
		d ==3 ? '#fc8d59' :
		d ==2 ? '#fdcc8a' :
		'#fef0d9';
            style["fillOpacity"] = 0.7;
	}
	
	return style;
    }

    var op_layer = L.geoJSON(_opportunities, {
	minZoom: 1,
	maxZoom: 18,
	style: style,
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
		    _map.panTo(e.latlng);
		}
            });

	    //* TEMPORARILY DISABLE POPUP FOR NOW */
	    layer.bindPopup(create_html_popup(feature));
	}
    });

    op_layer.addTo(_map);

    //marker.bindPopup(popup_long);
    //L.popup().setLatLng(e.latlng).setContent("test").openOn(_map)

    return op_layer;
}

/* Initialize window.GLOBALS.op_constraints from the input values on the sidebar controls */
async function op_constraints_refresh(){
    var historicalweight = document.getElementById("historicalweight_output").value;
    var carbonweight = document.getElementById("carbonweight_output").value;
    var erosionweight = document.getElementById("erosionweight_output").value;
    var force_historical = document.getElementById("force_historical").checked;

    window.GLOBALS.op_constraints={
	"historicalweight" : historicalweight,
	"carbonweight" : carbonweight,
	"erosionweight" : erosionweight,
	"force_historical" : force_historical
    };

    //remove previous op_layer if it exists
    if(window.GLOBALS.op_layer){
	window.GLOBALS.leaflet_map.removeLayer(window.GLOBALS.op_layer);
    }
    
    window.GLOBALS.op_layer = add_opportunities_polygons(window.GLOBALS.leaflet_map, op_data, window.GLOBALS.info);
}

/* submit/refresh button callback */
function submit_cb(){
    set_spinner(2000);
    op_constraints_refresh();
}

$(document).ready(function() {

    /** export Globals -- needed for inline onclick events and for debugging */
    window.GLOBALS = {
	leaflet_map : undefined,
	op_constraints: undefined,
	info: undefined,
	op_layer: undefined
    };

    // Base layers

    //  .. OpenStreetMap

    var osmgray = L.tileLayer.grayscale('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
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
	center: [52.6, -3.76],
	zoom: 13,
	minZoom: 10,
	maxZoom: 18,
	fadeAnimation: false,
	layers: [osmgray]
    });

    /* sequence matters for click events on map (lastest grabs clicks) */
    boundary.addTo(map);

    window.GLOBALS.leaflet_map = map;
    window.GLOBALS.info = add_info(map);

    
    $('#historicalweight').val(1);
    $('#carbonweight').val(1);
    $('#erosionweight').val(1);
    //note: "checked" DOM property is value, but "checked" HTML attribute is default value
    document.getElementById("force_historical").checked = true;

    op_constraints_refresh();
    
    /////////////////////////////
    set_spinner(1000);
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
    <div class="d-flex flex-column">
        <div>
          <h6 class="text-center">Opportunity score</h6>
        </div>
        <div d-flex flex-row>
          <svg width="20" height="20">
            <circle fill="#fef0d9" r="10" cx="10" cy="10"></circle>
          </svg>
          1  Lowest
        </div>
        <div>
          <svg width="20" height="20">
            <circle fill="#fdcc8a" r="10" cx="10" cy="10"></circle>
          </svg> 
          2
        </div>
        <div>
          <svg width="20" height="20">
            <circle fill="#fc8d59" r="10" cx="10" cy="10"></circle>
          </svg>
          3
        </div>
        <div>
          <svg width="20" height="20">
            <circle fill="#e34a33" r="10" cx="10" cy="10"></circle>
          </svg>
          4
        </div>
        <div>
          <svg width="20" height="20">
            <circle fill="#b30000" r="10" cx="10" cy="10"></circle>
          </svg>
          5  Highest
        </div>
      </div>
</div></div>
    `;
	var draggable = new L.Draggable(div);
	draggable.enable();

	return div;
    };

    legend.addTo(map);


    $('#submit').click(submit_cb);

    //enable all bootstrap tooltips (per documentation)
    $('[data-toggle="tooltip"]').tooltip();
    /*********************/

    // Fit to overlay bounds
    //map.fitBounds([[52.330180936, -3.36476263021], [52.885998209, -4.39698523643]]);

});
