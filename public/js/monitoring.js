/**
 * scrollVis - encapsulates
 * all the code for the visualization
 * using reusable charts pattern:
 * http://bost.ocks.org/mike/chart/
 */
var activateFunctions;
var updateFunctions;

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
            showHardware,
            showResistanceApproach,
            showGridData,
            showExploreData,
            showExploreData
        ]
    // If a section has an update function
    // then it is called while scrolling
    // through the section with the current
    // progress through the section.
    updateFunctions = [];


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


	setupVis = function() {

		// count openvis title
		g.append("text")
			.attr("class", "title openvis-title")
			.attr("x", width / 2)
			.attr("y", height / 3)
			.text("");
		g.append("text")
			.attr("class", "title openvis-title")
			.attr("x", width / 2)
			.attr("y", (height / 3) + (height / 5))
			.text("hello");
		g.selectAll(".openvis-title")
			.attr("opacity", 0);

		// add image
		var sensorimage = g.append("g").attr("class", "sensorsImg")

		sensorimage.append("svg:image")

			.attr("width", "400")
            .attr("height", "500")
            .attr("opacity", 1)
            .attr("xlink:href", "public/images/sensorlineup.JPG");


		queue()
			.defer(d3.xml, "public/images/resistance-approach-2.svg")
			.await(addResistance)

		var resistanceApproach = g.append("g")
			.attr("class", "resistanceApproach")

		function addResistance(error, xml){
			console.log(xml);
			var items = Array.from(xml.getElementsByTagName("svg")[0].childNodes);
			items.forEach(function(val) {
			    resistanceApproach.node().appendChild(val);
			});

			g.selectAll(".resistanceApproach")
				.attr("transform", "translate(150), scale(5.0)");
			// set the opacity
			g.selectAll('.car, .resistance, .bike, .tower, .movement, .emissions')
			    .attr("opacity", 0)

		}


        queue()
        	.defer(d3.xml, "public/images/emissions-map.svg")
        	.await(addMap)

        var emissionsMap = g.append("g")
        	.attr("class", "emissionsMap");

        function addMap(error, xml){
        	console.log(xml);
        	var items = Array.from(xml.getElementsByTagName("svg")[0].childNodes);
        	items.forEach(function(val) {
        	    emissionsMap.node().appendChild(val);
        	});

        	g.selectAll(".emissionsMap")
        		.attr("transform", "translate(100), scale(0.5)");

        	g.selectAll(".legend")
				.attr("transform", "translate(-100 -400), scale(1.85)");
        	// set the opacity
        	g.selectAll('.highest-emissions, .zero-emissions, .streets-top, .streets-bottom,.legend, .bg, .grid-cells')
        	.attr("opacity", 0)

        }








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

	/**
	 * showTitle - initial title
	 *
	 * hides: count title
	 * (no previous step to hide)
	 * shows: intro title
	 *
	 */
	function showTitle() {
			// set the title text opacity to 1
		g.selectAll(".openvis-title")
			.transition()
			.duration(600)
			.attr("opacity", 1.0);

		g.selectAll(".sensorsImg")
			.attr("opacity", 0);



	}

	function showHardware(){
			// set the title text opacity to 1
		g.selectAll(".openvis-title")
			.transition()
			.duration(600)
			.attr("opacity", 0);

		g.selectAll(".sensorsImg")
			.transition()
			.duration(600)
			.attr("opacity", 1);

			// add the current viz components
			g.selectAll(".emissions")
			    .transition()
			    .duration(0)
			    .attr("opacity", 0);
			g.selectAll(".tower")
			    .transition()
			    .duration(0)
			    .attr("opacity", 0);
			g.selectAll(".car, .movement")
			    .transition()
			    .duration(0)
			    .attr("opacity", 0);
		    g.selectAll(".resistance")
			    .transition()
			    .duration(0)
			    .attr("opacity", 0);

	}

	function showResistanceApproach(){
		g.selectAll(".sensorsImg")
			.attr("opacity", 0)

		// add the current viz components
		g.selectAll(".emissions")
		    .transition()
		    .duration(600)
		    .delay(0)
		    .attr("opacity", 1);

		g.selectAll(".tower")
		    .transition()
		    .duration(600)
		    .delay(600)
		    .attr("opacity", 1);
		g.selectAll(".car, .movement")
		    .transition()
		    .duration(600)
		    .delay(1200)
		    .attr("opacity", 1);
	    g.selectAll(".resistance")
		    .transition()
		    .duration(600)
		    .delay(1800)
		    .attr("opacity", 1);



		// g.selectAll(".bike")
		//     .transition()
		//     .duration(600)
		//     .delay(1500)
		//     .attr("opacity", 1);

		g.selectAll(".legend, .grid-cells")
			.attr("opacity", 0)
		g.selectAll(".highest-emissions")
			.attr("opacity", 0)
		g.selectAll(".zero-emissions")
			.attr("opacity", 0)
		// g.selectAll(".highlighter")
		// 	.attr("opacity", 0)
		g.selectAll(".streets-top,.streets-bottom,.bg")
			.attr("opacity", 0)



	}

	function showGridData(){

		g.selectAll(".sensorsImg")
			.attr("opacity", 0)

		g.selectAll(".emissions")
		    .transition()
		    .duration(0)
		    .attr("opacity", 0);
		g.selectAll(".tower")
		    .transition()
		    .duration(0)
		    .attr("opacity", 0);
		g.selectAll(".car, .movement")
		    .transition()
		    .duration(0)
		    .attr("opacity", 0);
	    g.selectAll(".resistance")
		    .transition()
		    .duration(0)
		    .attr("opacity", 0);



		g.selectAll(".legend, .grid-cells")
			.transition()
			.duration(600)
			.attr("opacity", 1)
		g.selectAll(".streets-top,.streets-bottom,.bg")
			.transition()
			.duration(600)
			.attr("opacity", 0.1)

		g.selectAll(".highest-emissions")
			.transition()
			.duration(600)
			// .delay(600)
			.attr("opacity", 1)
		g.selectAll(".zero-emissions")
			.transition()
			.duration(600)
			// .delay(1200)
			.attr("opacity", 1)

	}

	function showExploreData(){

		g.selectAll(".legend, .grid-cells")
			.attr("opacity", 0)
		g.selectAll(".highest-emissions")
			.attr("opacity", 0)
		g.selectAll(".zero-emissions")
			.attr("opacity", 0)
		g.selectAll(".streets-top,.streets-bottom,.bg")
			.attr("opacity", 0)




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
        .datum(activateFunctions)
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

