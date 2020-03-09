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

  /* 1930s DS data */
  var ds = L.tileLayer('data/tiles/DS/{z}/{x}/{y}.png', {
    tms: true,
    opacity: 1,
    attribution: "| This work is based on data provided through www.VisionofBritain.org.uk and uses historical Land Utilisation Survey map material which is copyright of The Land Utilisation Survey of Great Britain, 1933-49, copyright Audrey N. Clark.",
    minZoom: 12,
    maxNativeZoom: 14,
    maxZoom: 20
  });


  // Contemporary FBs

  var landuse_now = L.geoJSON(land_use_now, {
      minZoom: 8,
      maxNativeZoom: 17,
    maxZoom: 20,
    style: function(feature) {
      return {
        color: feature.properties.Style,
        fillColor: feature.properties.Style,
        fillOpacity: 0.5
      };
    }
  });


  // 1840s land use tiles
  var landuse_1840s = L.tileLayer('data/tiles/1840s_land_use_tiles/{z}/{x}/{y}.png', {
    minZoom: 10,
    maxNativeZoom: 14,
    maxZoom: 18,
    opacity: 0.7
  });

  // ALC2 Grades
  var ALC2 = L.tileLayer('data/tiles/ALC2/{z}/{x}/{y}.png', {
      minZoom: 5,
      attribution: "| © Crown copyright. Mapping derived from soils data © Cranfield University (NSRI) and for the Controller of HMSO 2020 © Crown copyright 2020, the Met Office. Contains OS data © Crown copyright and database right 2020. Contains Natural Resources Wales information © Natural Resources Wales and Database Right.",
    maxNativeZoom: 13,
    maxZoom: 20,
    opacity: 0.5
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
    center: [52.55, -4.06],
    zoom: 10,
    minZoom: 9,
    maxZoom: 18,
    fadeAnimation: false,
    layers: [osmgray]
  });

  var basemaps = {
    "OpenStreetMap Grayscale": osmgray,
    "No background": white
  }



  /******** LOAD OVERLAYS ******/
  /*  var Boundary = $.ajax({url:"/data/boundary.geojson", dataType: "json",
      success: console.log("County data successfully loaded."),
      error: function (xhr) {
        alert(xhr.statusText)
      }}) */

  var extramaps = {
    "Land Use <span class='text-info'>(1840s)</span>": landuse_1840s,
    "Land Use <span class='text-info'>(Dudley Stamp 1930s)</span>": ds,
      "Land Use <span class='text-info'>(Contemporary)</span>": landuse_now,
      "Predictive ALC map v.2 <span class='text-info'>(Contemporary)</span>": ALC2
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
    ALC2.addTo(map);


  spinner.show();
  setTimeout(function() {
    spinner.hide()
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
          <svg width="20" height="20">
            <circle fill="#be9b6c" r="10" cx="10" cy="10"></circle>
          </svg>
          Arable
        </div>
        <div>
          <svg width="20" height="20">
            <circle fill="#f3fe5f" r="10" cx="10" cy="10"></circle>
          </svg> Pasture
        </div>
        <div>
          <svg width="20" height="20">
            <circle fill="#83BD89" r="10" cx="10" cy="10"></circle>
          </svg> Woodland
        </div>
        <div>
          <svg width="20" height="20">
            <circle fill="#AB6FAC" r="10" cx="10" cy="10"></circle>
          </svg> Settlement
        </div>
      </div>
    <div class="d-flex flex-column">
        <div d-flex flex-row>
          <svg width="20" height="20">
            <circle fill="#0182fe" r="10" cx="10" cy="10"></circle>
          </svg>
          Excellent quality agr. land
        </div>
        <div>
          <svg width="20" height="20">
            <circle fill="#c1f9ff" r="10" cx="10" cy="10"></circle>
          </svg> 
          Very good quality agr. land
        </div>
        <div>
          <svg width="20" height="20">
            <circle fill="#008200" r="10" cx="10" cy="10"></circle>
          </svg>
          Good quality agr. land
        </div>
        <div>
          <svg width="20" height="20">
            <circle fill="#a7fca4" r="10" cx="10" cy="10"></circle>
          </svg>
          Moderate quality agr. land
        </div>
        <div>
          <svg width="20" height="20">
            <circle fill="#fbfa65" r="10" cx="10" cy="10"></circle>
          </svg>
          Poor quality agr. land
        </div>
        <div>
          <svg width="20" height="20">
            <circle fill="#b4875e" r="10" cx="10" cy="10"></circle>
          </svg>
          Very poor quality agr. land
        </div>
        <div>
          <svg width="20" height="20">
            <circle fill="#fec355" r="10" cx="10" cy="10"></circle>
          </svg>
          Non-agricultural
        </div>
        <div>
          <svg width="20" height="20">
            <circle fill="#fe6256" r="10" cx="10" cy="10"></circle>
          </svg>
          Urban
        </div>
      </div>
</div></div>
    `
      var draggable = new L.Draggable(div);
      draggable.enable()

      return div;
  };

  legend.addTo(map);

  /*********************/

  // Fit to overlay bounds
  //map.fitBounds([[52.330180936, -3.36476263021], [52.885998209, -4.39698523643]]);

});
