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

  //  .. White background
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


  // 1840s FB & apportionment


  var tithe = L.geoJSON(land_use_1840s, {
    minZoom: 8,
    maxZoom: 17,
    style: function(feature) {
	return {
	  color: feature.properties.Style,
	  fillColor: feature.properties.Style,
	  fillOpacity: 0.5
	};
    },
    onEachFeature: function(feature, layer) {
      if (feature.properties) {
        var popupContent = '<h5>1840s Land Use</h5><dt>Land Use:</dt><dd>' +
          feature.properties.land_use_facet + '</dd>';
        popupContent += '<dt>Field Number:</dt><dd>' + feature.properties.field_number + '</dd>';
        popupContent += '<dt>Field Name:</dt><dd>' + feature.properties.field_name + '</dd>';
        popupContent += '<dt>Land owner:</dt><dd>' + feature.properties.landowner_facet + '</dd>';
        popupContent += '<dt>Occupier:</dt><dd>' + feature.properties.occupier_facet + '</dd>';
        popupContent += '</dl>'
        layer.bindPopup(popupContent);
      }
    }
  });

  // NDVI & FB modern tiles
  var ndvi_fb = L.tileLayer('data/tiles/modern_fb_ndvi_tiles/{z}/{x}/{y}.png', {
    minZoom: 10,
    maxNativeZoom: 14,
    maxZoom: 18
  });

  // NDVI & FB modern
  // var ndvi_fb = L.geoJSON(dyfi_field_productivity, {
  //   minZoom: 8,
  //   maxZoom: 17,
  //   style: function(feature) {
  //     return {
  //       color: feature.properties.colour_fil
  //     };
  //   }
  // });


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
    center: [52.45, -4.0],
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
    "NDVI Field Boundaries <span class='text-info'>(27 June 2019)</span>": ndvi_fb,
    "Land Use <span class='text-info'>(1840)</span>": tithe,
    "Land Use <span class='text-info'>(Dudley Stamp 1930s)</span>": ds
  };


  // Add base layers
  L.control.layers({}, extramaps, {
    collapsed: false
  }).addTo(map);

  // ndvi_fb should be on top
  map.on("overlayadd", function (event) {
     ndvi_fb.bringToFront();
  });


  /******** TABS ******/
  ///// Opportunity Maps
  $('#tab-opportunity').on('click', function() {
    $('#map').hide();
  });
  ///// ORAL HISTORIES
  $('#tab-oh').on('click', function() {
    $('#map').hide();
  });
  ////// NDVI
  $('#tab-ndvi').on('click', function() {
    $('#map').show();
  });

  /*********************/


  /* sequence matters for click events on map (lastest grabs clicks) */
  boundary.addTo(map);
  //ndvi_fb.addTo(map)
  tithe.addTo(map);
  ds.addTo(map);

  spinner.show();
  setTimeout(function() {
    spinner.hide()
  }, 1500);

  //spinner.hide();

  /*****Add Sidebar *****/
  var sidebar = L.control.sidebar('sidebar', {
    position: 'left'
  });
  setTimeout(function() {
    sidebar.show();
  }, 500);
  /*********************/

  /****** LEGEND ********/
  var legend = L.control({
    position: 'bottomright'
  });

  legend.onAdd = function(map) {

    var div = L.DomUtil.create('div', 'info legend');

    // loop through our density intervals and generate a label with a colored square for each interval
    div.innerHTML += `<h3>Legend</h3>
    <img src="/images/NDVI_Legend.jpg" width="25" height="50">
    <i>
      High Productivity (NDVI)<br>
      Low Productivity (NDVI)
    </i>
    `
    return div;
  };

  legend.addTo(map);

  /*********************/


  map.addControl(sidebar);



  // Fit to overlay bounds
  //map.fitBounds([[52.330180936, -3.36476263021], [52.885998209, -4.39698523643]]);

});
