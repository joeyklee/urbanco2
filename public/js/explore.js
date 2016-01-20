var map = L.map('map', {
    fullscreenControl: {
        pseudoFullscreen: false // if true, fullscreen to page width and height
    }
}).setView([49.25, -123.1], 12);

// var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
// 	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
// 	subdomains: 'abcd',
// 	minZoom: 0,
// 	maxZoom: 20,
// 	ext: 'png'
// }).addTo(map);


var mapbox_tiles = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.run-bike-hike'
}).addTo(map);


// `fullscreenchange` Event that's fired when entering or exiting fullscreen.
map.on('fullscreenchange', function() {
    if (map.isFullscreen()) {
        console.log('entered fullscreen');
    } else {
        console.log('exited fullscreen');
    }
});


var studyarea = 'public/data/studyarea.geojson';
d3.json(studyarea, function(data) {
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
});



$(document).ready(function() {
    $("#myModal").modal();
    $("#myBtn").click(function() {
        // console.log("clicked");
        $("#myModal").modal();
    });

    // for testing purposes
    // $("#showProcess").click();

    var counter = 0;

    var processFunctions = [
    	showTower,
    	showMeetup,
    	showTraverse,
    	showTraffic,
    	showGrid
    ];


    var tower, meetingPoint, animText;
    function showTower(){
    	tower = L.circle([49.226493, -123.079078], 100).addTo(map);
    	var text = $('#towerInfo').html();
    	tower.bindPopup(text);
    	tower.openPopup();
    	map.setView([49.226493, -123.079078], 15);
    }

    function showMeetup(){
    	tower.closePopup();
    	map.setView([49.221352, -123.070012], 15);

    	var meetingPoint_bounds = [
    	    [49.220406, -123.071846],
    	    [49.221735, -123.069197]
    	];
    	meetingPoint = L.rectangle(meetingPoint_bounds, {
    	    color: "#ff7800",
    	    weight: 1
    	}).addTo(map);
    	var text = $('#meetupInfo').html();
    	meetingPoint.bindPopup(text);
    	meetingPoint.openPopup();
    }


    function showTraverse(){
    	meetingPoint.closePopup();
    	map.setView([49.260538, -123.108692], 12);

    	var text = $('#traverseInfo').html();
    	animText = L.divIcon({
    	  // Specify a class name we can refer to in CSS.
    	  className: 'css-icon',
    	  // Set marker width and height
    	  iconSize: 250,
    	  html: text
    	});

    	L.marker([49.294306, -123.205491], {icon: animText}).addTo(map);

        // animatePoints('api/points/sid/0108', "red");
        // animatePoints('api/points/sid/1641', "blue");
        // animatePoints('api/points/sid/0205', "green");
        // animatePoints('api/points/sid/0150', "orange");
        // animatePoints('api/points/sid/0151', "purple");


        //'/api/points/sid/0108'
	    function animatePoints(sensorreq, linecol) {
	        d3.json(sensorreq, function(data) {

	            var polyline = L.polyline([], {
	                color: linecol,
	                opacity: 0.5,
	                weight:1
	            }).addTo(map);

	            var i = 0;
	            setInterval(function() {
	                var item = data[i++];
	                var coords = item.geometry.coordinates;
	                polyline.addLatLng(
	                    L.latLng(coords[1], coords[0]));

	                if (i >= data.length) i = 0;
	            }, 1);
	        });
	    }
    }

    function showGrid(){
    	var text = $('#gridInfo').html();
    	animText = L.divIcon({
    	  // Specify a class name we can refer to in CSS.
    	  className: 'css-icon',
    	  // Set marker width and height
    	  iconSize: 250,
    	  html: text
    	});

    	L.marker([49.294306, -123.205491], {icon: animText}).addTo(map);

    	d3.json("api/grid", function(data){
    		console.log(data);
    		var test = L.geoJson().addTo(map);

    		data.forEach(function(item){
    			test.addData(item);
    		})
    		// L.geoJson(data).addTo(map);
    	})
    }

    function showTraffic(){
    	var text = $('#trafficInfo').html();
    	animText = L.divIcon({
    	  // Specify a class name we can refer to in CSS.
    	  className: 'css-icon',
    	  // Set marker width and height
    	  iconSize: 250,
    	  html: text
    	});

    	L.marker([49.294306, -123.205491], {icon: animText}).addTo(map);

    	d3.json("api/traffic", function(data){
    		console.log(data);
    		var test = L.geoJson().addTo(map);

    		data.forEach(function(item){
    			test.addData(item);
    		})
    		// L.geoJson(data).addTo(map);
    	})
    }

    $("#showProcess1").click(function() {
    	processFunctions[0]();
    });

    $(document).on('click', '#towerNext', function () {
         processFunctions[1]();
    });

    $(document).on('click', '#meetingNext', function () {
         processFunctions[2]();
    });

    $(document).on('click', '#animNext', function () {
         processFunctions[3]();
    });
    $(document).on('click', '#trafficNext', function () {
         processFunctions[4]();
    });




    $("#showData").click(function() {
        console.log("just showing the data");
    });




});


// /api/points/co2/range/600/900
// "/api/points/test"
// d3.json(  "/api/points/co2/range/475/600", function( data ) {
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
