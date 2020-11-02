'use strict';

/* sidebar with crops list in two languages */
import {add_sidebar, add_intro_modal, html_legend_alc2, html_legend_cscp, gettext} from './crops_ui.js';

/** global namespace */
window.GLOBALS = {};
/*********************/

/** Get user selection for crop, scenario, year */
function get_selection(){
    var crops = $('#crops').val();
    var crops_u = crops[0].toUpperCase() + crops.substring(1);
    
    var scenario = $('input[name=scenario]:checked').val();
    var year = $('input[name=year]:checked').val();
    
    var tiff_filename = year === "current" ?
        `${crops_u}_current.tif` :
        `${crops_u}_${year}-${scenario}.tif`;

    var tiff_url = `./data/CSCP/${crops_u}/${tiff_filename}`;
    
    return tiff_url;
}

function CSCP_bind_all_inputs(_map){
    $("fieldset :input").change(function() {
        var url = get_selection();
        add_geotiff(_map,url);
    });
}

/** Add a geotiff on map */
function add_geotiff(_map, _url){
    /** Add GeoTIFFs */

    //clear map
    _map.eachLayer( function(x){
        if (x instanceof GeoRasterLayer){
            _map.removeLayer(x);
        }
    });

    //add new _url
    fetch(_url)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => {
            parseGeoraster(arrayBuffer).then(georaster => {
                //console.log("georaster:", georaster);
                var layer = new GeoRasterLayer({
                    georaster: georaster,
                    attribution: "Produced using outputs from the Welsh Government led Capability, Suitability and Climate Programme project",
                    minZoom: 1,
                    maxZoom: 18,
                    opacity: 0.7,
                    pixelValuesToColorFn: function(x){
                        if (x==0){
                            return '#bfbdb0';
                        }
                        if (x==1)
                        {
                            return '#00ea0b';
                        }
                        if (x==2){
                            return '#ff9827';
                        }
                        return null;
                    }
                });
                layer.addTo(_map);
            });
        });  
}

$(document).ready(function() {

    /** export Globals -- needed for inline onclick events and for debugging */
    window.GLOBALS = {
        leaflet_map : undefined
    };

    var spinner = $('.spinner');

    // Base layers
    //  .. OpenStreetMap
    var osm = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
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

    // ALC2 Grades
    var ALC2 = L.tileLayer('data/tiles/ALC2/{z}/{x}/{y}.png', {
        minZoom: 5,
        attribution: "| © Crown copyright. Mapping derived from soils data © Cranfield University (NSRI) and for the Controller of HMSO 2020 © Crown copyright 2020, the Met Office. Contains OS data © Crown copyright and database right 2020. Contains Natural Resources Wales information © Natural Resources Wales and Database Right.",
        maxNativeZoom: 13,
        maxZoom: 20,
        opacity: 0.5
    });
    
    // Map
    var map = L.map('map', {
        center: [52.6, -3.76],
        zoom: 11,
        minZoom: 10,
        maxZoom: 18,
        fadeAnimation: false,
        layers: [osm]
    });

    map.attributionControl.setPrefix('');
    
    window.GLOBALS.leaflet_map = map;

    // Add overlays (no base maps)
    var overlays = {};
    overlays[`${gettext("Predictive ALC map")} v.2 <span class='text-info'>(${gettext("Contemporary")})</span>`] = ALC2;
    L.control.layers({}, overlays, {
        collapsed: false
    }).addTo(map);


    /* sequence matters for click events on map (lastest grabs clicks) */
    boundary.addTo(map);

    var opportunities_layer = add_geotiff(map,'./data/CSCP/Barley/Barley_2020-high.tif');

    spinner.show();
    setTimeout(function() {
        spinner.hide();
    }, 1000);

    add_sidebar('sidebar');
    add_intro_modal('description_modal');
    /*********************/

    // Fit to overlay bounds
    //map.fitBounds([[52.330180936, -3.36476263021], [52.885998209, -4.39698523643]]);
    CSCP_bind_all_inputs(map);


    /*********************/
    /****** LEGEND ********/


    var legend = L.control({
        position: 'bottomright'
    });

    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML += `
<div id="crops_legend" class="d-flex flex-column">
</div>
    `;
        var draggable = new L.Draggable(div);
        draggable.enable();

        return div;
    };

    legend.addTo(map);
    
    //start with CSCP legend by default
    $('#crops_legend').html(html_legend_cscp);

    //switch legend when adding ALC2 overlay
    map.on('overlayadd', function(l){
	if (l.name.startsWith('Predictive') || l.name.startsWith('Map ALC')){
	    $('#crops_legend').html(html_legend_alc2);
	}
    });
    map.on('overlayremove', function(l){
	    $('#crops_legend').html(html_legend_cscp);
    });

});

