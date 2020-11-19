'use strict';

import op_data from '../data/opportunities/opport_wgs84.js';
import {get_transtext, flip_l10n} from './mf_i18n.js';

/** global namespace */
window.GLOBALS = {};
/*********************/

/* Show intro modal and change visibility of all elements that have a class "en" or "cy"
 * depending on "lang" parameter 
 */

function add_intro_modal(_id) {
    var html = get_transtext("op_intro_html");
    $('#' + _id).html(html);
}


function set_spinner(timeout){
    var spinner = $('.spinner');
    spinner.show();
    document.body.style.cursor = 'wait';    
    setTimeout(function() {
        spinner.hide();
        document.body.style.cursor = 'default';
    }, timeout);

}

function calculate_opportunity_score_algorithm(_carbonscore, _erosionscore, _historical, _constraints){
    if (_constraints.force_historical && (_historical == 0)){
        //console.log(`force_historical=${_constraints.force_historical} historical=${_historical}  `);
        return 0;
    }
    
    var score_nom = _constraints.carbonweight*_carbonscore + _constraints.erosionweight*_erosionscore + _constraints.historicalweight*_historical;
    //var score_denom = _constraints.carbonweight + _constraints.erosionweight + _constraints.historicalweight;
    var score_denom = 3;
    var score = score_nom / score_denom;
    //console.log(`score=${score} nom=${score_nom} denom=${score_denom}  `);
    //console.log(`${_constraints.carbonweight}*${_carbonscore} + ${_constraints.erosionweight} * ${_erosionscore} + ${_constraints.historicalweight} * ${_historical} ) / (${_constraints.carbonweight} + ${_constraints.erosionweight} + ${_constraints.historicalweight}`);
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
        this._div.innerHTML = props ?
      `<b>${get_transtext("op_erosion_risk")}</b>: ${parseFloat(props["erosionrisk-11072020"]).toFixed(2)}<br/>
      <b>${get_transtext("op_carbon_risk")}</b>: ${props["carbonrisk"]}<br/>
      <b>${get_transtext("op_erosion_score")} (0-5)</b>: ${props["erosion_score"]}<br/>
      <b>${get_transtext("op_carbon_score")} (0-5)</b>: ${props["carbon_score"]}<br/>
      <b>${get_transtext("op_historical_score")} (0,1)</b>: ${props["historical_score"]}<br/>
      <b>${get_transtext("op_opp_score")}</b>: ${calculate_opportunity_score(props)}`
                               : get_transtext('op_map_hover');
    };

    return info.addTo(_map);
}

/** Create an HTML div to display information for each polygon */
function create_html_popup( feature ){

    var props = feature.properties;
    var base = props["ogc_fid"];
    var join_message = props["fieldid_1840"] === null ?
        get_transtext("op_no_historical_lu_found") : `joined to ${props["fieldid_1840"]}`;

    var score = calculate_opportunity_score(props);
    var _constraints = window.GLOBALS.op_constraints;
    //var score_debug = `${score} = ( ${_constraints.carbonweight}*${props.carbon_score} + ${_constraints.erosionweight} * ${props.erosion_score} + ${_constraints.historicalweight} * ${props.historical_score} ) / (${_constraints.carbonweight} + ${_constraints.erosionweight} + ${_constraints.historicalweight})`;
    var score_debug = `${score} = ( ${_constraints.carbonweight}*${props.carbon_score} + ${_constraints.erosionweight} * ${props.erosion_score} + ${_constraints.historicalweight} * ${props.historical_score} ) / 3`;
    return `
  <div>
      <b>ogc_fid</b>: ${props["ogc_fid"]}<br/>
      <b>1840 ids</b>: ${props["id_1840"]}<br/>
      <b>fieldid</b>: ${props["fieldid"]}<br/>
      <b>${get_transtext("op_land_use_now")}</b>: ${props["class"]}<br/>
      <b>${get_transtext("op_land_use_1840s")} (${join_message})</b>: ${props["class_1840"]?props["class_1840"]:""}<br/>
      <b>${get_transtext("op_erosion_risk")}</b>: ${parseFloat(props["erosionrisk-11072020"]).toFixed(2)}<br/>
      <b>${get_transtext("op_carbon_risk")}</b>: ${props["carbonrisk"]}<br/>
      <b>${get_transtext("op_erosion_score")} (0-5)</b>: ${props["erosion_score"]}<br/>
      <b>${get_transtext("op_carbon_score")} (0-5)</b>: ${props["carbon_score"]}<br/>
      <b>${get_transtext("op_historical_score")} (0,1)</b>: ${props["historical_score"]}<br/>
      <b>${get_transtext("op_opp_score")}</b>: ${score}<br/>
      <b>Score Calculation</b>: ${score_debug}
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
            // d is fractional. Round to closest integer
            d = Math.round(d);
            /* debug known high score opportunities:
            var fid = feature.properties.fieldid;
            if (fid == "1166" || fid == "7088" || fid == "8712" || fid=="2052"){
                console.log("fieldid:", feature.properties.fieldid, "d: ",d);
            }*/
            style["fillColor"] =
                d>=5 ? '#b30000' :
                d==4 ? '#e34a33' :
                d==3 ? '#fc8d59' :
                d==2 ? '#fdcc8a' :
                d==1 ? '#fef0d9' : '#ffffff' ;
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
function op_constraints_refresh(){
    var historicalweight = parseFloat(document.getElementById("historicalweight").value);
    var carbonweight = parseFloat(document.getElementById("carbonweight").value);
    var erosionweight = parseFloat(document.getElementById("erosionweight").value);
    var force_historical = document.getElementById("force_historical").checked;

    /* NOTE: we use the 0.5 / 2.75 / 0.5 calibration that we came up with using known examples 
       -- In the dumbed down version we should get this calibration values when all sliders are in the middle (value 1) so that the users
       don't get "confused" by the weighting algorithm.
     */
    window.GLOBALS.op_constraints={
        "historicalweight" : 0.5 * historicalweight,
        "carbonweight" : 2.75 * carbonweight,
        "erosionweight" : 0.5 * erosionweight,
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

    flip_l10n();
    // hide sidebar until everything is ready using visibility trick (don't touch display) 
    $('#sidebar').removeClass('invisible');
    
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
        //center: [52.4380,-4.0318],
        zoom: 13,
        minZoom: 10,
        maxZoom: 18,
        fadeAnimation: false,
        layers: [osmgray]
    });
        
    map.attributionControl.setPrefix('');
    
    /* sequence matters for click events on map (lastest grabs clicks) */
    boundary.addTo(map);

    window.GLOBALS.leaflet_map = map;
    window.GLOBALS.info = add_info(map);

    /* Popup introduction when visiting page */
    add_intro_modal('help');

    /* default values are set here (and not really in the HTML val attribute ) */
    $('#historicalweight').val(1);
    $('#carbonweight').val(1);
    $('#erosionweight').val(1);
    //note: "checked" DOM property is value, but "checked" HTML attribute is default value
    //document.getElementById("force_historical").checked = true;
    document.getElementById("force_historical").checked = false;

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
      <div class="d-flex flex-row justify-content-center"><h5>${get_transtext("op_opp_score")}</h5></div>
      <div class="d-flex flex-row">
        <div class="d-flex flex-column">
          <div>
            <svg width="20" height="20">
              <circle fill="#b30000" r="10" cx="10" cy="10"></circle>
            </svg>
            5  ${get_transtext("op_highest")}
          </div>
          <div>
            <svg width="20" height="20">
              <circle fill="#e34a33" r="10" cx="10" cy="10"></circle>
            </svg>
            4
          </div>
          <div>
            <svg width="20" height="20">
              <circle fill="#fc8d59" r="10" cx="10" cy="10"></circle>
            </svg>
            3
          </div>
          <div>
            <svg width="20" height="20">
              <circle fill="#fdcc8a" r="10" cx="10" cy="10"></circle>
            </svg> 
            2
          </div>
          <div d-flex flex-row>
            <svg width="20" height="20">
              <circle fill="#fef0d9" r="10" cx="10" cy="10"></circle>
            </svg>
            1  ${get_transtext("op_lowest")}
          </div>
        </div>
    </div>
  </div>
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
