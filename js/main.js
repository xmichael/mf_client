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
    pointToLayer: function(feature, latlng) {
      //return L.circleMarker(latlng, geojsonMarkerOptions);
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
        return L.circleMarker(latlng, {radius: 8, weight: 1, opacity: 1, fillopacity: 0.8, color: "DarkGreen"});
          break;
        case 'pasture':
          return L.circleMarker(latlng, {radius: 8, weight: 1, opacity: 1, fillopacity: 0.8, color: "GoldenRod"});
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
    zoom: 13,
    minZoom: 13,
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
    "NDVI Field Boundaries (27/6/2019)": ndvi_fb,
    "Llangynfelin land use (1840)": tithe
  };


  // Add base layers
  L.control.layers(basemaps, extramaps, {
    collapsed: false
  }).addTo(map);


  boundary.addTo(map);

  spinner.hide();



  // Fit to overlay bounds
  //map.fitBounds([[52.330180936, -3.36476263021], [52.885998209, -4.39698523643]]);

});
