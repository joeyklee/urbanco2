var map = L.map('map', {
    // fullscreenControl: {
    //     pseudoFullscreen: false // if true, fullscreen to page width and height
    // }
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
// map.on('fullscreenchange', function() {
//     if (map.isFullscreen()) {
//         console.log('entered fullscreen');
//     } else {
//         console.log('exited fullscreen');
//     }
// });


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
    // call modal on page load
    $("#myModal").modal();

    var tower,
        meetingPoint,
        vehicles,
        trafficCounts,
        grid;
    // slider
    $(function() {
        var a = "0,1,2,3,4,5";
        var arr = a.split(",");
        var total = arr.length;

        // if showProcess is selected then call function at first
        $("#showProcess1").click(function() {
            var h = 2;
            var hs = $('#slider-range-max').slider();
            hs.slider('option', 'value', h);
            hs.slider('option', 'slide')
                .call(hs, null, {
                    handle: $('.ui-slider-handle', hs),
                    value: h
                });
        });

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
            min: 1,
            max: total,
            value: 1,
            slide: function(event, ui) {
                $(".ui-slider-handle").text(arr[ui.value - 1]);
                console.log(ui.value);

                if (ui.value == 1) {
                    $("#myModal").modal();
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
        $(".ui-slider-handle").text(arr[$("#slider-range-max").slider("value") - 1]);

        // add slider dots
        // var foo = total;
        // var mar = $(".ui-slider").width() / foo;
        // for (var x = 0; x < foo; x++) {
        //     $(".ui-slider").append("<span class='dots' style='left:" + x * mar + "px'></span>");
        // }

        // Get the options for this slider (specified above)
        // var opt = $("#slider-range-max").slider("option","value");
        // var opt = $("#slider-range-max").slider("values");

        // Get the number of possible values
        var vals = 5
        // console.log(vals)

        // Position the labels
        for (var i = 0; i < vals; i++) {

            // Create a new element and position it with percentages
            // var el = $('<label>' + (i + opt.min) + '</label>').css('left', (i/vals*100) + '%');
            var el = "<span class='dots' style='left:" + i/vals * 100 + "%'></span>";
            // Add the element inside #slider
            $(".ui-slider").append(el);

        }
    });


    function showTower() {
        if (tower != null) map.removeLayer(tower);
        if (tower != null) map.removeLayer(meetingPoint);
        tower = L.circle([49.226493, -123.079078], 100).addTo(map);
        var text = $('#towerInfo').html();
        tower.bindPopup(text);
        // tower.openPopup();
        map.setView([49.226493, -123.079078], 15);
    }

    function showMeetup() {
    	if (vehicles != null) map.removeLayer(vehicles);
        if (meetingPoint != null) map.removeLayer(meetingPoint);
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
        meetingPoint.bindPopup(text);
        // meetingPoint.openPopup();
    }


    function showTraverse() {

    	if (vehicles != null) map.removeLayer(vehicles);
        // meetingPoint.closePopup();
        if (trafficCounts != null) map.removeLayer(trafficCounts);

        map.setView([49.260538, -123.108692], 12);

        vehicles = L.layerGroup([]).addTo(map);
        animatePoints('api/points/sid/0108', "red");
        animatePoints('api/points/sid/1641', "blue");
        // animatePoints('api/points/sid/0205', "green");
        // animatePoints('api/points/sid/0150', "orange");
        // animatePoints('api/points/sid/0151', "purple");


        //'/api/points/sid/0108'
        function animatePoints(sensorreq, linecol) {
            d3.json(sensorreq, function(data) {

                var animMarkers = L.polyline([], {
                    color: linecol,
                    opacity: 0.5,
                    weight: 1
                }).addTo(vehicles);

                var i = 0;
                setInterval(function() {
                    var item = data[i++];
                    var coords = item.geometry.coordinates;
                    animMarkers.addLatLng(
                        L.latLng(coords[1], coords[0]));

                    if (i >= data.length) i = 0;
                }, 1);
            });
        }
    }

    function showTraffic() {
    	if (tower != null) map.removeLayer(tower);
        if (tower != null) map.removeLayer(meetingPoint);
        if (vehicles != null) map.removeLayer(vehicles);
        if (grid != null) map.removeLayer(grid);

        d3.json("api/traffic", function(data) {

            var min = d3.min(data, function(d) {
                return d.properties.h_10_TO_14
            });
            var max = d3.max(data, function(d) {
                return d.properties.h_10_TO_14
            });
            var med = d3.median(data, function(d) {
                return d.properties.h_10_TO_14
            });

            // var color = d3.scale.linear()
            //     .domain([min, med, max])
            //     .range(["white", "orange", "red"]);
            var color = d3.scale.quantize()
                .domain([min, max])
                // .range(["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#b30000","#7f0000"]);
                // .range(["#f7fcfd","#e0ecf4","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#810f7c","#4d004b"]);
                .range(["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"]);
                // .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

            var linewt = d3.scale.linear()
                .domain([min, med, max])
                .range([0.5, 1, 5])

            function myStyle(feature) {
                // console.log(color(feature.properties['h_10_TO_14']));
                return {
                    "color": color(feature.properties['h_10_TO_14']),
                    "weight": linewt(feature.properties['h_10_TO_14']),
                    "opacity": 0.65
                };
            };

            trafficCounts = L.geoJson(null, {
                style: myStyle
            }).addTo(map);

            data.forEach(function(item) {
                    trafficCounts.addData(item);
                });
        })
    }


    function showGrid() {
    	if (tower != null) map.removeLayer(tower);
        if (tower != null) map.removeLayer(meetingPoint);
        if (vehicles != null) map.removeLayer(vehicles);
        if (trafficCounts != null) map.removeLayer(trafficCounts);

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

            // var color = d3.scale.linear()
            //     .domain([min, max])
            //     .range(["orange", "red"]);

            var color = d3.scale.quantize()
                .domain([min, max])
                // .range(["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#b30000","#7f0000"]);
                // .range(["#f7fcfd","#e0ecf4","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#810f7c","#4d004b"]);
                .range(["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"]);
                // .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));


            function myStyle(feature) {
                // console.log(color(feature.properties['h_10_TO_14']));
                return {
                    "fillColor": color(feature.properties['co2_avg_e']),
                    "weight": 0,
                    "fillOpacity": 0.85
                };
            };

            grid = L.geoJson(null, {
                style: myStyle
            }).addTo(map);

            data.forEach(function(item) {
                    // console.log(item);
                    grid.addData(item);
                })
        })
    }



    // $("#showProcess1").click(function() {
    //     processFunctions[0]();
    // });

    // $(document).on('click', '#towerNext', function() {
    //     processFunctions[1]();
    // });

    // $(document).on('click', '#meetingNext', function() {
    //     processFunctions[2]();
    // });

    // $(document).on('click', '#animNext', function() {
    //     processFunctions[3]();
    // });
    // $(document).on('click', '#trafficNext', function() {
    //     processFunctions[4]();
    // });

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
