

var map = L.map('map', {
	fullscreenControl: {
	        pseudoFullscreen: false // if true, fullscreen to page width and height
	    }
}).setView([49.25, -123.1], 12);

var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
}).addTo(map);


// map.isFullscreen() // Is the map fullscreen?
// map.toggleFullscreen() // Either go fullscreen, or cancel the existing fullscreen.

// `fullscreenchange` Event that's fired when entering or exiting fullscreen.
map.on('fullscreenchange', function () {
    if (map.isFullscreen()) {
        console.log('entered fullscreen');
    } else {
        console.log('exited fullscreen');
    }
});


var studyarea = 'public/data/studyarea.geojson';
d3.json(studyarea, function(data) {
    // console.log(data);

    function style(feature) {
        return {
            weight: 4,
            color: "#FF3300",
            opacity: 0.5,
            fillOpacity: 0
        };
    };

    L.geoJson(data, {
        style: style
    }).addTo(map);

}); // end d3


// var myLayer = L.geoJson().addTo(map);

// d3.json( "localhost:/api/points/co2/range/0/900", function( data ) {
// 	console.log(data.length);
// 	var dataMax = d3.max(data, function(d){
// 	    return d.properties.co2});
// 	var dataMin = d3.min(data, function(d){
// 	    return d.properties.co2});
// 	// Set the Color - Not necessary for this case
// 	var color = d3.scale.linear()
// 	              .domain([dataMin, dataMax])
// 	              .range(["red","purple"])
// 	// Set the Scale - Log Scale for emphasis
// 	var opac = d3.scale.log()
// 	              .domain([dataMin,dataMax])
// 	              .range([0.25, 0.75])
// 	// Set the Scale - SQRT for circle area
// 	var scale = d3.scale.sqrt()
// 	              .domain([dataMin,dataMax])
// 	              .range([1, 5])
// 	var pointStyle = function (feature, latlng) {
// 	    return L.circleMarker(latlng, {
// 	        radius: scale(feature.properties.co2),
// 	        fillColor: color(feature.properties.co2),
// 	        color: "#000",
// 	        weight: 1,
// 	        opacity: 0,
// 	        fillOpacity: opac(feature.properties.co2)
// 	    });
// 	}
// 	// Set the PopUp Content
// 	var pointPopUp = function onEachFeature(feature, layer) {
// 	    // does this feature have a property named popupContent?
// 	    var popupContent = "<p><center>CO<sub>2</sub> mixing ratio:"+ "<br/>"
// 	                        + feature.properties.co2+ "</center></p>";
// 	    layer.bindPopup(popupContent);
// 	}

// 	var dataPoints = L.geoJson(data, {
// 	    onEachFeature:pointPopUp,
// 	    pointToLayer: pointStyle
// 	}).addTo(map);

// });
