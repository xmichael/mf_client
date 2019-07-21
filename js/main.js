'use strict';

/* global require */

$(document).ready(function() {
  // require(['map', 'panel', 'config'], function(map, panel, config) {

  var spinner = $('.spinner');

  // Base layers
  //  .. OpenStreetMap
  var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 8,
    maxZoom: 17
  });

  var osmgray = L.tileLayer.grayscale('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 8,
    maxZoom: 17
  });

  //  .. White background
  var white = L.tileLayer("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAAA1BMVEX///+nxBvIAAAAH0lEQVQYGe3BAQ0AAADCIPunfg43YAAAAAAAAAAA5wIhAAAB9aK9BAAAAABJRU5ErkJggg==", {
    minZoom: 8,
    maxZoom: 17
  });

  // Overlay layers

  // 1840 NLW tithe data
  var tithe = L.geoJSON(nlw_1840, {
    minZoom: 8,
    maxZoom: 17,
    onEachFeature: function(feature, layer) {
      if (feature.properties) {
        var popupContent = '<h5>1840s Land Use</h5><dt>Land Use:</dt><dd>' +
          feature.properties.land_use + '</dd>';
          popupContent += '<dt>Tithe Value:</dt><dd>' + feature.properties.tithe_value + '</dd>';
          popupContent += '<dt>Land owner:</dt><dd>' + feature.properties.landowner + '</dd>';
          popupContent += '<dt>Occupier:</dt><dd>' + feature.properties.occupier + '</dd>';
        popupContent += '</dl>'
        layer.bindPopup(popupContent);
      }
    },
    pointToLayer: function(feature, latlng) {
      switch (feature.properties.land_use) {
        case 'Arable':
        case 'arable':
        case 'arable and pasture':
        case 'arable & pasture':
        case 'arable meadow & pasture':
        case 'arable and meadow':
        case 'arable meadow':
        case 'arable, meadow':
        case 'meadow and pasture':
        case 'meadow':
          return L.circleMarker(latlng, {
            radius: 8,
            weight: 1,
            opacity: 1,
            fillopacity: 0.8,
            color: "DarkGreen"
          });
          break;
        case 'pasture':
          return L.circleMarker(latlng, {
            radius: 8,
            weight: 1,
            opacity: 1,
            fillopacity: 0.8,
            color: "GoldenRod"
          });
          break;
        default:
          break;
      }
    }
  });


  // NDVI & FB modern
  var ndvi_fb = L.geoJSON(dyfi_field_productivity, {
    minZoom: 8,
    maxZoom: 17,
    style: function(feature) {
      return {
        color: feature.properties.colour_fil
      };
    }
  });

  // FB extra
  var fb_extra = L.geoJSON(fb_extra_geojson, {
    minZoom: 8,
    maxZoom: 17,
    onEachFeature: function(feature, layer) {
      if (feature.properties) {
        var popupContent = '<h5>1840s crop yield</h5><dt>Tithe Value(sum):</dt><dd>' +
          feature.properties.tithe_total + '</dd>';
        popupContent += '</dl>'
        layer.bindPopup(popupContent);
      }
    },
    style: function(feature) {
      switch (feature.properties.bins) {
        case 1:
          // return { color: '#edf8fb'};
          return { color: '#99d8c9'};
          break;
        case 2:
          // return { color: '#ccece6'};
          return { color: '#99d8c9'};
          break;
        case 3:
        // return { color: '#99d8c9'};
          return { color: '#66c2a4'};
          break;
        case 4:
          return { color: '#66c2a4'};
          break;
        case 5:
          return { color: '#41ae76'};
          break;
        case 6:
          return { color: '#238b45'};
          break;
        case 7:
          return { color: '#005824'};
          break;
        default:
          return { color: '#000' }
      }
    }
  });

  /* Dyfi Biosphere Reserver outline */
  var boundary = L.geoJSON(dataservices_boundary, {
    minZoom: 3,
    maxZoom: 17,
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
    center: [52.50, -4.0],
    zoom: 11,
    minZoom: 11,
    maxZoom: 17,
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
    "Llangynfelin land use <span class='text-info'>(1840)</span>": tithe,
    "Llangynfelin projected tithe values <span class='text-info'>(1840)</span>": fb_extra
  };


  // Add base layers
  L.control.layers({}, extramaps, {
    collapsed: false
  }).addTo(map);


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



  boundary.addTo(map);
  tithe.addTo(map);
  //ndvi_fb.addTo(map);
  spinner.show();
  setTimeout(function() {
    spinner.hide()
  }, 2500);

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
