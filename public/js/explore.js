$(document).ready(function() {

// vars
var studyArea,
	tower,
    meetingPoint,
    vehicles,
    trafficCounts,
    grid,
    drawing;

// Map
var map = L.map('map', {
    attributionControl: false,
    zoomControl:true
}).setView([49.25, -123.1], 12);

var attribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>';
var mapbox_tiles = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.run-bike-hike',
    opacity: 0.35
}).addTo(map);
// L.control.attribution({position:"bottomright"}).addTo(map);

// var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
// 	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
// 	subdomains: 'abcd',
// 	minZoom: 0,
// 	maxZoom: 20,
// 	ext: 'png'
// }).addTo(map);


// $("#sliderContainer").animate({
// 	bottom: "30px",
// 	opacity: "1"
// }, 1000, "linear");


drawing = d3.select("#drawing").append("svg")
	.attr("width", "100%")
	.attr("height", "90%")

drawing.append("g")
	.attr("id", "procedure")

d3.xml("public/images/process-explore.svg", function(xml){
	drawing.node().appendChild(xml.getElementsByTagName("svg")[0]);

	drawing.attr("transform", "translate(20), scale(1.5)");

	d3.selectAll("#grid, #studyarea, #tower_2_, #driving_2_, #movement_2_").attr("opacity", 0);
});


function toggler(divId) {
    $("#" + divId).toggle();
}

function infoToggle(divId){
	$("#infoContainer").css("display", "block")
	$("#infoBlob").children().css("display", "none");
	$("#infoBlob").find("." + divId).css("display", "block");
	$("#legendContainer").css("display", "block");
}


$("#closeInfo").click(function(){
	// $("." + "helpText").toggle();
	$("#helpModal").modal();
})


// call modal on page load
// $("#myModal").modal();


// slider
$(function() {
    var a = "1,2,3,4,5,6";
    var arr = a.split(",");
    var total = arr.length;

    // if showProcess is selected then call function at first
    $("#showProcess").click(function() {
        var h = 1;
        var hs = $('#slider-range-max').slider();
        hs.slider('option', 'value', h);
        hs.slider('option', 'slide')
            .call(hs, null, {
                handle: $('.ui-slider-handle', hs),
                value: h
            });
    });

    $("#forwards").click(function(){

    	var hs = $('#slider-range-max').slider();
    	var h = hs.slider("option", "value");
    	if (h < 6){
    	hs.slider('option', 'value', h+1);
    	// console.log(hs.slider("option", "value"))
    	// hs.slider('option', 'value', h);
    	hs.slider('option', 'slide')
    	    .call(hs, null, {
    	        handle: $('.ui-slider-handle', hs),
    	        value: h+1
    	    });

    	   }
    });

    $("#backwards").click(function(){


    	var hs = $('#slider-range-max').slider();
    	var h = hs.slider("option", "value");

    	if (h !== 0){

	    	hs.slider('option', 'value', h-1);
	    	// console.log(hs.slider("option", "value"))
	    	// hs.slider('option', 'value', h);
	    	hs.slider('option', 'slide')
	    	    .call(hs, null, {
	    	        handle: $('.ui-slider-handle', hs),
	    	        value: h-1
	    	    });

    	}

    })



    // if showData is selected then call function at last step
    $("#showData").click(function() {
        console.log("just showing the data");
        var h = 6;
        var hs = $('#slider-range-max').slider();
        hs.slider('option', 'value', h);
        hs.slider('option', 'slide')
            .call(hs, null, {
                handle: $('.ui-slider-handle', hs),
                value: h
            });
    });

    // the slider will call functions sequentially
    $("#slider-range-max").slider({
        range: "min",
        min: 0,
        max: total,
        value: 0,
        slide: function(event, ui) {
            // $(".ui-slider-handle").text(ui.value);
            $(".ui-slider-handle").text(ui.value);
            if(ui.value == 0){
            	showModal();
            }
            else if (ui.value == 1) {
            	panStudyArea();
            } else if (ui.value == 2) {
                showTower();

            } else if (ui.value == 3) {
                showMeetup();

            } else if (ui.value == 4) {
                showTraverse();

            } else if (ui.value == 5) {
                showTraffic()

            } else if (ui.value == 6) {
                showGrid()
            }

        }
    });
    // set the inital number
    $(".ui-slider-handle").text($("#slider-range-max").slider("value"));

    // Get the number of possible values
    var vals = 6
    // Position the labels
    for (var i = 0; i < vals; i++) {
        // Create a new element and position it with percentages
        // var el = $('<label>' + (i + opt.min) + '</label>').css('left', (i/vals*100) + '%');
        var el = "<span class='dots' style='left:" + i/vals * 100 + "%'></span>";
        $(".ui-slider").append(el);
    }
});

function showModal(){
	if (studyArea != null) studyArea.closePopup();
	if (tower != null) map.removeLayer(tower);
    if (meetingPoint != null) map.removeLayer(meetingPoint);
    if (vehicles != null) map.removeLayer(vehicles);
    if (grid != null) map.removeLayer(grid);
    if (trafficCounts != null) map.removeLayer(trafficCounts);

	$("#myModal").modal();

}

(function showStudyArea(){
		if (studyArea != null) map.removeLayer(studyArea);
		if (tower != null) map.removeLayer(tower);
	    if (meetingPoint != null) map.removeLayer(meetingPoint);
	    if (vehicles != null) map.removeLayer(vehicles);
	    if (grid != null) map.removeLayer(grid);
	    if (trafficCounts != null) map.removeLayer(trafficCounts);


		var filepath = 'public/data/studyarea.geojson';
		d3.json(filepath, function(data) {
			console.log(data);
		    var  style = {
		            weight: 1,
		            color: "#FF3300",
		            opacity: 0.8,
		            fillOpacity: 0
		        }

		    studyArea = L.polygon([], style).addTo(map);

		    data.features[0].geometry.coordinates[0].forEach(function(d){
		    	studyArea.addLatLng([d[1], d[0]])
		    });
		    studyArea.bindPopup("Hello, I'm the study area. This is where the magic happens.");
		});
	})();

function panStudyArea(){
	d3.selectAll("#studyarea").attr("opacity", 1);
	d3.selectAll("#tower_2_").attr("opacity", 0);
	infoToggle("areaText");
	map.setView([49.25, -123.1], 11);
	studyArea.openPopup();


}

function showTower() {
	d3.selectAll("#tower_2_").attr("opacity", 1);
	d3.selectAll("#driving_2_").attr("opacity", 0);
    infoToggle("towerText");
    if(studyArea !=null) studyArea.closePopup();
	if (tower != null) map.removeLayer(tower);
    if (meetingPoint != null) map.removeLayer(meetingPoint);
    if (vehicles != null) map.removeLayer(vehicles);
    if (grid != null) map.removeLayer(grid);
    if (trafficCounts != null) map.removeLayer(trafficCounts);

    tower = L.circle([49.226493, -123.079078], 100).addTo(map);
    var text = $('#towerInfo').html();
    tower.bindPopup("Hi! I'm an urban climate tower!");
    tower.openPopup();
    map.setView([49.226493, -123.079078], 15);


}

function showMeetup() {
	d3.selectAll("#driving_2_").attr("opacity", 1);
	d3.selectAll("#movement_2_").attr("opacity", 0);
	if (tower != null) tower.closePopup();
    if (meetingPoint != null) map.removeLayer(meetingPoint);
    if (vehicles != null) map.removeLayer(vehicles);
    if (grid != null) map.removeLayer(grid);
    if (trafficCounts != null) map.removeLayer(trafficCounts);
    // if (trafficCounts != null) map.removeLayer(trafficCounts);
    // tower.closePopup();
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
    meetingPoint.bindPopup("It sure is important to calibrate sensors before doing experiments.");
    meetingPoint.openPopup();

    infoToggle("meetText");
}


function showTraverse() {
	d3.selectAll("#movement_2_").attr("opacity", 1);
	d3.selectAll("#grid").attr("opacity", 0);
	if(meetingPoint != null) meetingPoint.closePopup();
    if (vehicles != null) map.removeLayer(vehicles);
    if (grid != null) map.removeLayer(grid);
    if (trafficCounts != null) map.removeLayer(trafficCounts);
    map.setView([49.260538, -123.108692], 12);

    vehicles = L.layerGroup([]).addTo(map);
    animatePoints('api/points/sid/0108', "red");
    animatePoints('api/points/sid/1641', "blue");
    // animatePoints('api/points/sid/0205', "green");
    // animatePoints('api/points/sid/0150', "orange");
    // animatePoints('api/points/sid/0151', "purple");

    infoToggle("animText");

    // $(".time").empty()
    // $(".animText").append("<h4 class='time'>Time:</h4><p class='time'></p>")
    //'/api/points/sid/0108'
    function animatePoints(sensorreq, linecol) {
        d3.json(sensorreq, function(data) {



            var animMarkers = L.polyline([], {
                color: linecol,
                opacity: 0.5,
                weight: 2
            }).addTo(vehicles);

            var i = 0;
            setInterval(function() {
                var item = data[i++];
                var coords = item.geometry.coordinates;
                // var timestamp = item.properties.datetime;
                // $(".animText").find(".time").text(timestamp);

                animMarkers.addLatLng(
                    L.latLng(coords[1], coords[0]));

                if (i >= data.length) i = 0;
            }, 1);
        });
    }
}

function showTraffic() {
	studyArea.off('click');
	if (tower != null) map.removeLayer(tower);
    if (meetingPoint != null) map.removeLayer(meetingPoint);
    if (vehicles != null) map.removeLayer(vehicles);
    if (grid != null) map.removeLayer(grid);
    if (trafficCounts != null) map.removeLayer(trafficCounts);
    infoToggle("trafficText");

    d3.json("api/traffic", function(data) {
    	console.log(data)
        var min = d3.min(data, function(d) {
            return d.properties.h_10_TO_14
        });
        var max = d3.max(data, function(d) {
            return d.properties.h_10_TO_14
        });
        var med = d3.median(data, function(d) {
            return d.properties.h_10_TO_14
        });

        var color = d3.scale.quantize()
            .domain([min, max])
            // .range(["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#b30000","#7f0000"]);
            // .range(["#f7fcfd","#e0ecf4","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#810f7c","#4d004b"]);
            .range(["#f7fcfd","#e0ecf4","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#810f7c","#4d004b"]);
            // .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

        var linewt = d3.scale.linear()
            .domain([min, med, max])
            .range([0, 2, 7])

        function myStyle(feature) {
            return {
                "color": color(feature.properties['h_10_TO_14']),
                "weight": linewt(feature.properties['h_10_TO_14']),
                "opacity": 0.65
            };
        }

        function onEachFeature(feature, layer){
        	layer.bindPopup("Traffic Counts 10 AM - 2:00 PM: <br>" + feature.properties.h_10_TO_14 );
        }


        trafficCounts = L.geoJson(null, {
            style: myStyle,
            onEachFeature: onEachFeature
        }).addTo(map);

        data.forEach(function(item) {
                trafficCounts.addData(item);
            });



        	if($("#tl")) d3.select("#tl").remove()
       		var svg = d3.select("#trafficLegend").append("svg").attr("id","tl").attr("width", "100%").attr("height", "20px");
       		svg.append("g")
       		  .attr("class", "legendQuant")
       		  .attr("transform", "translate(30,0)");

       		var legend = d3.legend.color()
       		  .labelFormat(d3.format(".0f"))
    	  .shapeWidth(50)
    	  .shapeHeight(7)
    	  .scale(color)
      	.labelOffset(5)
      	.labelDelimiter("-")
      	.labelAlign("middle")
      	.orient('horizontal');

       		svg.select(".legendQuant")
       		  .call(legend);

       		$("#tlegendTitle").css("visibility", "visible");


       });



}


function showGrid() {
	d3.selectAll("#grid, #studyarea, #tower_2_, #driving_2_, #movement_2_").attr("opacity", 1);
	studyArea.off('click');
    if (vehicles != null) map.removeLayer(vehicles);
    if (grid != null) map.removeLayer(grid);
    if (trafficCounts != null) map.removeLayer(trafficCounts);

    infoToggle("gridText");

    d3.json("api/grid", function(data) {
        var min = d3.min(data, function(d) {
            return d.properties.co2_avg_e
        });
        var max = d3.max(data, function(d) {
            return d.properties.co2_avg_e
        });
        var med = d3.median(data, function(d) {
            return d.properties.co2_avg_e
        });

        var color = d3.scale.quantize()
            .domain([min, max])
            // .range(["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#b30000","#7f0000"]);
            // .range(["#f7fcfd","#e0ecf4","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#810f7c","#4d004b"]);
            .range(["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"]);
            // .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

        function onEachFeature(feature, layer){
        	layer.bindPopup("Avg CO<sub>2</sub> Mixing Ratio (ppm): <br>" + Math.round(feature.properties.co2_avg) + "<br>" +
        		"Avg Emissions kgCO<sub>2</sub>hr<sup>-1</sup>: <br>" + Math.round(feature.properties.co2_avg_e) )
        }

        function myStyle(feature) {
            // console.log(color(feature.properties['h_10_TO_14']));
            return {
                "fillColor": color(feature.properties['co2_avg_e']),
                "weight": 0,
                "fillOpacity": 0.85
            };
        };

        grid = L.geoJson(null, {
            style: myStyle,
            onEachFeature: onEachFeature
        }).addTo(map);

        data.forEach(function(item) {
                // console.log(item);
                grid.addData(item);
            })



        if($("#gl")) d3.select("#gl").remove()
    	var svg = d3.select("#gridLegend").append("svg")
    			.attr("id","gl")
    			.attr("width", "100%").attr("height", "20px");
    	svg.append("g")
    	  .attr("class", "legendQuant")
    	  .attr("transform", "translate(70,0)");

    	var legend = d3.legend.color()
    	  .labelFormat(d3.format(".0f"))
    	  .shapeWidth(40)
    	  .shapeHeight(7)
    	  .scale(color)
      	.labelOffset(5)
      	.labelDelimiter("-")
      	.labelAlign("middle")
      	.orient('horizontal');

    	svg.select(".legendQuant")
    	  .call(legend);

    	$("#glegendTitle").css("visibility", "visible");


    })
}


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
