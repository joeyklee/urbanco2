/**
 * scrollVis - encapsulates
 * all the code for the visualization
 * using reusable charts pattern:
 * http://bost.ocks.org/mike/chart/
 */

// var activateFunctions;
// var updateFunctions;

var scrollVis = function() {
    // constants to define the size
    // and margins of the vis area.
    var width = 600;
    var height = 520;
    var margin = {
        top: 40,
        left: 20,
        bottom: 40,
        right: 10
    };

    // Keep track of which visualization
    // we are on and which was the last
    // index activated. When user scrolls
    // quickly, we want to call all the
    // activate functions that they pass.
    var lastIndex = -1;
    var activeIndex = 0;


    // main svg used for visualization
    var svg = null;

    // d3 selection that will be used
    // for displaying visualizations
    var g = null;

    // When scrolling to a new section
    // the activation function for that
    // section is called.
    // var activateFunctions = [];
    activateFunctions = [
            showTitle,
            showUrbanModel,
            showEmissionsIllustration,
            showEmissionsTransportation,
            showEmissionsHvac,
            showEmissionsBiological,
            showMeasure,
            showReality
        ]
    // If a section has an update function
    // then it is called while scrolling
    // through the section with the current
    // progress through the section.
    updateFunctions = [];

    /**
     * chart
     *
     * @param selection - the current d3 selection(s)
     *  to draw the visualization in. For this
     *  example, we will be drawing it in #vis
     */
    var chart = function(selection) {
        selection.each(function(rawData) {
            // create svg and give it a width and height
            // svg = d3.select(this).selectAll("svg").data([0, 1, 2, 3, 4, 5, 6, 7]);
            svg = d3.select(this).selectAll("svg").data(activateFunctions);
            svg.enter().append("svg").append("g");

            svg.attr("width", width + margin.left + margin.right);
            svg.attr("height", height + margin.top + margin.bottom);
            // svg.attr("viewBox", "0 0 600 500").attr("preserveAspectRatio", "xMinYMin meet");


            // this group element will be used to contain all
            // other elements.
            g = svg.select("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            setupVis();

            // setupSections();

        });
    };


    /**
     * setupVis - creates initial elements for all
     * sections of the visualization.
     *
     * @param wordData - data object for each word.
     * @param fillerCounts - nested data that includes
     *  element for each filler word type.
     * @param histData - binned histogram data
     */
    setupVis = function() {


        // count openvis title
        // g.append("text")
        //     .attr("class", "title openvis-title")
        //     .attr("x", width / 2)
        //     .attr("y", height / 3)
        //     .text("");
        // g.append("text")
        //     .attr("class", "title openvis-title")
        //     .attr("x", width / 2)
        //     .attr("y", (height / 3) + (height / 5))
        //     .text("30-40%");
        // g.selectAll(".openvis-title")
        //     .attr("opacity", 0);


        // queue call for map
        queue()
        	.defer(d3.json, 'public/data/world-countries-110m.json')
        	.defer(d3.csv, 'public/data/cities.csv')
        	.await(makeGlobe);

        // setup the map
        var projection = d3.geo.orthographic()
            .scale(175)
            .translate([width / 2, height / 2])
            .rotate([20, -43])
            .clipAngle(90)
            .precision(.1);

        var path = d3.geo.path()
            .projection(projection)
            .pointRadius(function(d, i) {
                return 10;
            });
        var circle = d3.geo.circle();

        var graticule = d3.geo.graticule();

        var map = g.append("g")
	        .attr("class", "map")
        	.attr("opacity", 0)

        map
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "translate(0 50)")
            .attr("opacity", 1);

        map.append("defs").append("path")
            .datum({
                type: "Sphere"
            })
            .attr("id", "sphere")
            .attr("d", path);

        map.append("use")
            .attr("class", "stroke")
            .attr("xlink:href", "#sphere");

        map.append("use")
            .attr("class", "fill")
            .attr("xlink:href", "#sphere");

        map.append("path")
            .datum(graticule)
            .attr("class", "graticule")
            .attr("d", path);

        map.append("svg:circle")
            .attr('cx', width / 2)
            .attr('cy', height / 2)
            .attr('r', 180)
            .attr('class', 'geo-globe');


        function makeGlobe(error, world, cities){
        	if (error) throw error;

        	map.insert("path", ".graticule")
        	    .datum(topojson.feature(world, world.objects.land))
        	    .attr("class", "land")
        	    .attr("d", path);

        	map.insert("path", ".graticule")
        	    .datum(topojson.mesh(world, world.objects.countries, function(a, b) {
        	        return a !== b;
        	    }))
        	    .attr("class", "boundary")
        	    .attr("d", path);

        	// convert csv input into geojson objects
        	function reformat(array) {
        	    var data = [];
        	    array.map(function(d, i) {
        	    	//http://bl.ocks.org/sumbera/10463358
        	        data.push({
        	            id: i,
        	            type: "Feature",
        	            geometry: {
        	                coordinates: [+d.longitude, +d.latitude],
        	                type: "Point"
        	            }
        	        });
        	    });
        	    return data;
        	}
        	var geoData = {
        	    type: "FeatureCollection",
        	    features: reformat(cities)
        	};
        	// the d3 circle function seems expensive, trying this another way
        	map.selectAll('.point')
        	    .data(geoData.features)
        	    .enter()
        	    .append('path')
        	    .attr('d', path.pointRadius(1))
        	    .attr("opacity", "0.45")
        	    .attr("fill", "#ffffe5")
        	    .attr('class', 'point');
        }


        queue()
        	.defer(d3.xml, "public/images/Figure-7-edited.svg")
        	.await(addUrbanScale)

        // urban scale viz
        var urbanScale = g.append("g")
            .attr("class", "urbanscale");
        // read in the svg

        function addUrbanScale(error, xml){
        	var items = Array.from(xml.getElementsByTagName("svg")[0].childNodes);
        	items.forEach(function(val) {
        	    urbanScale.node().appendChild(val);
        	});
        	// set the opacity
        	g.selectAll('.inputs, .city-center, .waste')
        	    .attr("opacity", 0)
        }

        queue()
        	.defer(d3.xml, "public/images/co2-emissions-model.svg")
        	.await(addEmissionsIllustration)
        // urban box model
        var emissionsIllustration = g.append("g")
            .attr("class", "illustration")
            .attr("opacity", 0)
            .attr("transform", "translate(90), scale(2.5)");

        function addEmissionsIllustration(error, xml){
    	    var items = Array.from(xml.getElementsByTagName("svg")[0].childNodes);
        	    items.forEach(function(val) {
        	        emissionsIllustration.node().appendChild(val);
    	    });

        }


        // queue()
        // 	.defer(d3.xml, "public/images/actions.svg")
        // 	.await(addActionsIllustration)
        // // urban box model
        // var actionsIllustration = g.append("g")
        //     .attr("class", "actions")
        //     .attr("opacity", 0)
        //     .attr("transform", "scale(1.4)");
        //     // .attr("transform", "translate(90), scale(2.5)");

        // function addActionsIllustration(error, xml){
    	   //  var items = Array.from(xml.getElementsByTagName("svg")[0].childNodes);
        // 	    items.forEach(function(val) {
        // 	        actionsIllustration.node().appendChild(val);
    	   //  });

        // }






        queue()
        	.defer(d3.xml, "public/images/modelvsreality.svg")
        	.await(addRealityIllustration)
        // urban box model
        var realityIllustration = g.append("g")
            .attr("class", "reality")
            .attr("opacity", 0)
            .attr("transform", "translate(50), scale(0.85)");
            // .attr("transform", "translate(90), scale(2.5)");

        function addRealityIllustration(error, xml){
    	    var items = Array.from(xml.getElementsByTagName("svg")[0].childNodes);
        	    items.forEach(function(val) {
        	        realityIllustration.node().appendChild(val);
    	    });

        }


        queue()
        	.defer(d3.xml, "public/images/measure.svg")
        	.await(addMeasure)

        var measure = g.append("g")
        	.attr("class", "measure")
        	.attr("opacity", 0)
        	.attr("transform", "translate(50), scale(0.85)");

        function addMeasure(error, xml){
        	console.log(xml);
        	var items = Array.from(xml.getElementsByTagName("svg")[0].childNodes);
        	items.forEach(function(val) {
        	    measure.node().appendChild(val);
        	});

        }



        g.append("text")
            .attr("class", "title filler")
            .attr("x", width / 2)
            .attr("y", (height / 3) + (height / 5))
            .text("<insert graphic here>");
        g.selectAll(".filler")
            .attr("opacity", 0);



    }; // end of setup vis

    /**
     * ACTIVATE FUNCTIONS
     *
     * These will be called their
     * section is scrolled to.
     *
     * General pattern is to ensure
     * all content for the current section
     * is transitioned in, while hiding
     * the content for the previous section
     * as well as the next section (as the
     * user may be scrolling up or down).
     *
     */

    function showTitle() {
        g.selectAll(".map")
            .transition()
            .duration(600)
            .attr("opacity", 1.0);
        g.selectAll(".geo-globe")
            .attr("fill", "red")
            .attr("stroke", "red")
            .attr("stroke-opacity", 0.75)
            .attr("fill-opacity", 0.05)
            .call(pulse);

        // Make sure the subsequent viz is turn off when scrolling back
        g.selectAll(".inputs")
            .transition()
            .duration(0)
            .attr("opacity", 0);
        g.selectAll(".city-center")
            .transition()
            .duration(0)
            .attr("opacity", 0);
        g.selectAll(".waste")
            .transition()
            .duration(0)
            .attr("opacity", 0);

        // use the increasing co2 concentrations data from 1950 to 2015***
        function pulse() {
            var circle = d3.select("circle");
            (function repeat() {
                circle = circle.transition()
                    .attr("fill", "red")
                    .attr("stroke", "red")
                    .attr("stroke-opacity", 0.75)
                    .attr("fill-opacity", 0.05)
                    .duration(2000)
                    .attr("stroke-width", 1)
                    .attr("r", 185)
                    .transition()
                    .duration(2000)
                    .attr('stroke-width', 1)
                    .attr("r", 215)
                    .ease('sine')
                    .each("end", repeat);
            })();
        }
    }


    function showUrbanModel() {
        // turn off the previous viz
        g.selectAll(".openvis-title")
            .transition()
            .duration(0)
            .attr("opacity", 0);
        g.selectAll(".map")
            .transition()
            .duration(600)
            .attr("opacity", 0);
        g.selectAll(".geo-globe")
            .attr("fill", "red")
            .attr("stroke", "red")
            .attr("stroke-opacity", 0)
            .attr("fill-opacity", 0);

        // add the current viz components
        g.selectAll(".inputs")
            .transition()
            .duration(600)
            .delay(600)
            .attr("opacity", 1);
        g.selectAll(".city-center")
            .transition()
            .duration(600)
            .delay(0)
            .attr("opacity", 1);
        g.selectAll(".waste")
            .transition()
            .duration(600)
            .delay(1200)
            .attr("opacity", 1);

        // make sure the subsequent viz is turned off
        g.selectAll(".illustration")
            .transition()
            .duration(600)
            .attr("opacity", 0);
    }


    function showEmissionsIllustration() {
        // turns the title from the previous slide off
        g.selectAll(".inputs")
            .transition()
            .duration(0)
            .attr("opacity", 0);
        g.selectAll(".city-center")
            .transition()
            .duration(0)
            .attr("opacity", 0);
        g.selectAll(".waste")
            .transition()
            .duration(0)
            .attr("opacity", 0);

        // add current viz
        g.selectAll(".illustration")
            .transition()
            .duration(800)
            .attr("fill", "#000")
            .attr("opacity", 1.0);
        g.selectAll(".biological, .hvac, .photosynthesis")
            .transition()
            .duration(0)
            .attr("opacity", 1.0);

    }

    function showEmissionsTransportation() {
        g.selectAll(".illustration")
            .transition()
            .duration(600)
            .attr("fill", "#000")
            .attr("opacity", 1.0);

        // fade the nonfocus
        g.selectAll(".biological, .hvac, .photosynthesis")
            .transition()
            .duration(600)
            .attr("opacity", 0.15);
        // focus
        g.selectAll(".transportation")
            .transition()
            .duration(600)
            .attr("opacity", 1);
    }

    function showEmissionsHvac() {

        g.selectAll(".illustration")
            .transition()
            .duration(600)
            .attr("fill", "#000")
            .attr("opacity", 1.0);

        g.selectAll(" .transportation, .biological, .photosynthesis")
            .transition()
            .duration(0)
            .attr("opacity", 0.15);

        g.selectAll(".hvac")
            .transition()
            .duration(600)
            // .attr("fill", "#000")
            .attr("opacity", 1);
    }

    function showEmissionsBiological() {
        g.selectAll(".illustration")
            .transition()
            .duration(600)
            .attr("fill", "#000")
            .attr("opacity", 1.0);

        g.selectAll(" .transportation, .hvac, .combustion")
            .transition()
            .duration(0)
            .attr("opacity", 0.15);

        g.selectAll(".biological, .photosynthesis")
            .transition()
            .duration(600)
            // .attr("fill", "#000")
            .attr("opacity", 1);

        g.selectAll(".reality")
            .attr("opacity", 0)

    }

    function showActions(){
    	g.selectAll(".illustration")
    	    .transition()
    	    .duration(600)
    	    .attr("fill", "#000")
    	    .attr("opacity", 0);

        g.selectAll(".reality")
            .attr("opacity", 0)

    	g.selectAll(".actions")
	    	.transition()
            .duration(600)
    	    .attr("opacity", 1)
    }

    function showMeasure(){

    	g.selectAll(".illustration")
    	    .attr("fill", "#000")
    	    .attr("opacity", 0);

    	 g.selectAll(".reality")
	        .transition()
            .duration(600)
            .attr("opacity", 1)

    	g.selectAll(".measure")
    		.attr("opacity", 0);

    }



    function showReality() {
        g.selectAll(".actions")
            .attr("opacity", 0);

        g.selectAll(".reality")
            .attr("opacity", 0)

        g.selectAll(".measure")
            .transition()
            .duration(600)
			.attr("opacity", 1);

        // g.selectAll(".techniques")
        //     .attr("opacity", 1)

    }



    /**
     * activate -
     *
     * @param index - index of the activated section
     */
    chart.activate = function(index) {
        activeIndex = index;
        var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
        var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
        scrolledSections.forEach(function(i) {
            activateFunctions[i]();
        });
        lastIndex = activeIndex;
    };

    /**
     * update
     *
     * @param index
     * @param progress
     */
    chart.update = function(index, progress) {
        updateFunctions[index](progress);
    };

    // return chart function
    return chart;
};


/**
 * display - called once data
 * has been loaded.
 * sets up the scroller and
 * displays the visualization.
 *
 * @param data - loaded tsv data
 */
function display(data) {
    // create a new plot and
    // display it
    // console.log(data);
    var plot = scrollVis();
    d3.select("#vis")
        // .datum(activateFunctions)
        .call(plot);

    // setup scroll functionality
    var scroll = scroller()
        .container(d3.select('#graphic'));

    // pass in .step selection as the steps
    scroll(d3.selectAll('.step'));

    // setup event handling
    scroll.on('active', function(index) {
        // highlight current step text
        d3.selectAll('.step')
            .style('opacity', function(d, i) {
                return i == index ? 1 : 0.1;
            });

        // activate current section
        plot.activate(index);
    });

    // scroll.on('progress', function(index, progress) {
    // 	console.log(index);
    // 	console.log(progress);
    //     plot.update(activateFunctions[index], progress);
    // });
}

// load data and display
display();
