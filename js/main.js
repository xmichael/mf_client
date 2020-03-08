'use strict';

/* global require */

$(document).ready(function() {
  // require(['map', 'panel', 'config'], function(map, panel, config) {

  var spinner = $('.spinner');

  // Base layers
  //  .. OpenStreetMap
  var osm = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 8,
    maxZoom: 17
  });

  var osmgray = L.tileLayer.grayscale('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 8,
    maxZoom: 17
  });

  //  white background
  var white = L.tileLayer("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAAA1BMVEX///+nxBvIAAAAH0lEQVQYGe3BAQ0AAADCIPunfg43YAAAAAAAAAAA5wIhAAAB9aK9BAAAAABJRU5ErkJggg==", {
    minZoom: 8,
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
    maxZoom: 17,
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
    center: [52.47, -4.05],
    zoom: 13,
    minZoom: 11,
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
  landuse_1840s.addTo(map);
  ds.addTo(map);
  //landuse_now.addTo(map);

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

    // loop through our density intervals and generate a label with a colored square for each interval
    div.innerHTML += `<h3>Legend</h3>
    <div class="d-flex flex-column">
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
    `
    return div;
  };

  legend.addTo(map);

  /*********************/

  // Fit to overlay bounds
  //map.fitBounds([[52.330180936, -3.36476263021], [52.885998209, -4.39698523643]]);

});
