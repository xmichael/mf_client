'use strict';

import histories_data from '../data/histories/histories_data.js';
import {descriptions} from './histories_ui.js'

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
      `<b>${props["Name of Farmer"]}</b><br/>
      ${props["Name of Farm"]}<br/>
      ${props["Date of Recording"]}`
      : 'Click on a <b>mic</b> icon');
  };

  return info.addTo(_map);
}

/** Create an HTML div to display a histories feature */
function create_html_popup( feature ){
  var props = feature.properties;
  // image path is base/picture[X].jpg
  var base = props["Clip Name"];
  var pics = props["Pictures"]? props["Pictures"][0] : undefined
  return `
  <div>
      <h4>${props["Name of Farmer"]}</h4>
      <h5>${props["Name of Farm"]}</h5>
      <h6>${props["Date of Recording"]}</h6>
      <hr/>
      <div>
        <p class="text-justify">${window.location.search=="?lang=cy"?props["Cymraeg"]:props["Summary"]}<p>
<p class="text-center">
  <button type="button"
  onclick="GLOBALS.descriptions.modal('${base}','${pics}')">
    See more
  </button>
</p>
      </div>
      <div>
        <audio controls>
          <source src="./data/histories/opus/${base}.opus" type="audio/ogg">
          <source src="./data/histories/mp3/${base}.mp3" type="audio/mpeg">
          Your browser does not support the audio element
        </audio>
      </div>
    </div>
  `
}

/** Add the markers on map and with dynamic popup content */
function add_histories_markers(_map, _histories, _info){


    var historiesIcon = L.icon({
      iconUrl: 'data/histories/mic.png',
      iconSize: [32,47]
    })

    /** Add markers */
    var hist_layer = L.geoJSON(_histories, {
      minZoom: 1,
      maxZoom: 18,
      pointToLayer: function(feature, latlng){
        return L.marker(latlng, {icon: historiesIcon})
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
          click: function(e){
            _map.panTo(e.target.getLatLng());
          }
        });
        layer.bindPopup(create_html_popup(feature))
      }
    });

    hist_layer.addTo(_map);
    //marker.bindPopup(popup_long);
    //L.popup().setLatLng(e.latlng).setContent("test").openOn(_map)
}

$(document).ready(function() {

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

  // Map
  var map = L.map('map', {
    center: [52.6, -3.76],
    zoom: 10,
    minZoom: 9,
    maxZoom: 18,
    fadeAnimation: false,
    layers: [osm]
  });

  /* sequence matters for click events on map (lastest grabs clicks) */
  boundary.addTo(map);

  var info = add_info(map);
  add_histories_markers(map, histories_data, info);

  spinner.show();
  setTimeout(function() {
    spinner.hide()
  }, 1000);

 /** export Globals -- needed for inline onclick events and for debugging */
window.GLOBALS = {
  descriptions : descriptions,
  leaflet_map : map
}

  /*********************/

  // Fit to overlay bounds
  //map.fitBounds([[52.330180936, -3.36476263021], [52.885998209, -4.39698523643]]);

});
