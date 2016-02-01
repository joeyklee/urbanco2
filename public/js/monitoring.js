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
    		showSensor,
            showResistanceApproach,
            show3dPlot,
            showPreview
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
            // svg = d3.select(this).selectAll("svg").data(activateFunctions);
            // svg.enter().append("svg").append("g");
            svg = d3.select(this).append("svg");
            svg.attr("width", width + margin.left + margin.right);
            svg.attr("height", height + margin.top + margin.bottom);
            // svg.attr("viewBox", "0 0 600 500").attr("preserveAspectRatio", "xMinYMin meet");


            // this group element will be used to contain all
            // other elements.
            g = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            setupVis();

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
			.text("");
		g.selectAll(".openvis-title")
			.attr("opacity", 0);


		// // add image
		g.append("g").attr("class", "sensorAnnotated").attr("opacity", 0)
		.append("image")
			.attr("width", "450")
            .attr("height", "500")
            .attr("margin-top", "50px")
            .attr("opacity", 1)
            .attr("xlink:href", "public/images/boxphoto-annotated-img.jpg");

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
			.defer(d3.xml, "public/images/3d-grid.svg")
			.await(addgrid3d)

		var grid3d = g.append("g")
			.attr("class", "grid3d")
			.attr("opacity",0)
			.attr("transform", "scale(0.8)");

		function addgrid3d(error, xml){
			console.log(xml);
			var items = Array.from(xml.getElementsByTagName("svg")[0].childNodes);
			items.forEach(function(val) {
			    grid3d.node().appendChild(val);
			});

		}

		// // add image
		g.append("g").attr("class", "previewimg").attr("opacity", 0)
		.append("image")
			.attr("width", "600")
            .attr("height", "500")
            .attr("opacity", 1)
            .attr("xlink:href", "public/images/preview.png");

		// queue()
		// 	.defer(d3.json, "api/grid/")
		// 	.await(addValidation)

		// var validation = g.append("g")
		// 	.attr("class", "validation")

		// function addValidation(error, data){
		// 	console.log(data);


		// 	data.forEach(function(d) {
		// 	    d.properties.co2_avg_e = +d.properties.co2_avg_e;
		// 	    d.properties.tot_co2_e = +d.properties.tot_co2e;
		// 	  });

		// 	var x = d3.scale.log()
		// 		.domain([1, 200])
		// 	    .range([0.5, 500]);

		// 	var y = d3.scale.log()
		// 		.domain([1, 200])
		// 	    .range([300, 0.5]);

		// 	// Define the axes
		// 	var xAxis = d3.svg.axis().scale(x)
		// 	    .orient("bottom").ticks(5);

		// 	var yAxis = d3.svg.axis().scale(y)
		// 	    .orient("left").ticks(5);

		// 	validation.selectAll(".dot")
		// 	      .data(data)
		// 	    .enter().append("circle")
		// 	    .filter(function(d) { return d.properties.tot_co2e > 0 })
		// 	      .attr("class", "dot")
		// 	      .attr("r", 1.5)
		// 	      .attr("cx", function(d) { return x(d.properties.co2_avg_e); })
		// 	      .attr("cy", function(d) { return y(d.properties.tot_co2e); })
		// 	      // .style("fill", function(d) { return color(d.properties.hoodgrouped); });

		// 	// Add the X Axis
		//     svg.append("g")
		//         .attr("class", "x axis")
		//         .attr("transform", "translate(50," + 450 + ")")
		//         .call(xAxis);

		//     // Add the Y Axis
		//     svg.append("g")
		//         .attr("class", "y axis")
		//         .attr("transform", "translate(50, 50)")
		//         .call(yAxis);

		// }

        // queue()
        // 	.defer(d3.xml, "public/images/results.svg")
        // 	.await(addResults)

        // var results = g.append("g")
        // 	.attr("class", "results")
        // 	.attr("opacity", 0)
        // 	.attr("transform", "scale(0.55)");

        // function addResults(error, xml){
        // 	console.log(xml);
        // 	var items = Array.from(xml.getElementsByTagName("svg")[0].childNodes);
        // 	items.forEach(function(val) {
        // 	    results.node().appendChild(val);
        // 	});

        // }


    //     queue()
    //     	.defer(d3.xml, "public/images/emissions-map.svg")
    //     	.await(addMap)

    //     var emissionsMap = g.append("g")
    //     	.attr("class", "emissionsMap");

    // //     function addMap(error, xml){
    // //     	console.log(xml);
    // //     	var items = Array.from(xml.getElementsByTagName("svg")[0].childNodes);
    // //     	items.forEach(function(val) {
    // //     	    emissionsMap.node().appendChild(val);
    // //     	});

    // //     	g.selectAll(".emissionsMap")
    // //     		.attr("transform", "translate(100), scale(0.5)");

    // //     	g.selectAll(".legend")
				// // .attr("transform", "translate(-100 -400), scale(1.85)");
    // //     	// set the opacity
    // //     	g.selectAll('.highest-emissions, .zero-emissions, .streets-top, .streets-bottom,.legend, .bg, .grid-cells')
    // //     	.attr("opacity", 0)

    // //     }

	}; // end of setup vis

	function showTitle() {
			// set the title text opacity to 1
		g.selectAll(".openvis-title")
			.transition()
			.duration(600)
			.attr("opacity", 1.0);

		g.selectAll(".sensorsImg")
			.attr("opacity", 0);

		g.selectAll(".sensorsImgs")
			.attr("opacity", 0);


	}

	function showSensor(){
		g.selectAll(".emissions")
		    .attr("opacity", 0);
		g.selectAll(".tower")
		    .attr("opacity", 0);
		g.selectAll(".car, .movement")
		    .attr("opacity", 0);
	    g.selectAll(".resistance")
		    .attr("opacity", 0);

		g.selectAll(".sensorAnnotated")
			.attr("opacity", 1)

	}




	function showResistanceApproach(){
		g.selectAll(".sensorAnnotated")
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
		    .delay(800)
		    .attr("opacity", 1);
	    g.selectAll(".resistance")
		    .transition()
		    .duration(600)
		    .delay(1200)
		    .attr("opacity", 1);

		g.selectAll(".results")
			.attr("opacity", 0)

			g.selectAll(".grid3d")
				.attr("opacity", 0);
	}


	function show3dPlot(){
			g.selectAll(".emissions")
			    .attr("opacity", 0);
			g.selectAll(".tower")
			    .attr("opacity", 0);
			g.selectAll(".car, .movement")
			    .attr("opacity", 0);
		    g.selectAll(".resistance")
			    .attr("opacity", 0);


			g.selectAll(".grid3d")
				.transition()
				.duration(600)
				.attr("opacity", 1);


			g.selectAll(".previewimg")
			.attr("opacity", 0)

	}

	function showPreview(){
		g.selectAll(".grid3d")
				.attr("opacity", 0);

		g.selectAll(".previewimg")
			.attr("opacity", 1)
	}

	// function showResults(){
	// 	// add the current viz components
	// 	g.selectAll(".emissions")
	// 	    .attr("opacity", 0);

	// 	g.selectAll(".tower")
	// 	    .attr("opacity", 0);
	// 	g.selectAll(".car, .movement")
	// 	    .attr("opacity", 0);
	//     g.selectAll(".resistance")
	// 	    .attr("opacity", 0);

	// 	 g.selectAll(".grid3d")
	// 			.attr("opacity", 0);

	// 	g.selectAll(".results")
	// 		.attr("opacity", 1)

	// }


	// function showGridData(){

	// 	g.selectAll(".sensorsImg")
	// 		.attr("opacity", 0)

	// 	g.selectAll(".emissions")
	// 	    .transition()
	// 	    .duration(0)
	// 	    .attr("opacity", 0);
	// 	g.selectAll(".tower")
	// 	    .transition()
	// 	    .duration(0)
	// 	    .attr("opacity", 0);
	// 	g.selectAll(".car, .movement")
	// 	    .transition()
	// 	    .duration(0)
	// 	    .attr("opacity", 0);
	//     g.selectAll(".resistance")
	// 	    .transition()
	// 	    .duration(0)
	// 	    .attr("opacity", 0);



	// 	g.selectAll(".legend, .grid-cells")
	// 		.transition()
	// 		.duration(600)
	// 		.attr("opacity", 1)
	// 	g.selectAll(".streets-top,.streets-bottom,.bg")
	// 		.transition()
	// 		.duration(600)
	// 		.attr("opacity", 0.1)

	// 	g.selectAll(".highest-emissions")
	// 		.transition()
	// 		.duration(600)
	// 		// .delay(600)
	// 		.attr("opacity", 1)
	// 	g.selectAll(".zero-emissions")
	// 		.transition()
	// 		.duration(600)
	// 		// .delay(1200)
	// 		.attr("opacity", 1)

	// }




	// function showExploreData(){

	// 	g.selectAll(".legend, .grid-cells")
	// 		.attr("opacity", 0)
	// 	g.selectAll(".highest-emissions")
	// 		.attr("opacity", 0)
	// 	g.selectAll(".zero-emissions")
	// 		.attr("opacity", 0)
	// 	g.selectAll(".streets-top,.streets-bottom,.bg")
	// 		.attr("opacity", 0)

	// }

	// function showTraces(){
	// 	g.selectAll(".measure")
	// 		.attr("opacity", 0);

	// 	g.selectAll(".traces")
	// 		.attr("opacity", 1);
	// }

	// function showHardware(){
	// 		// set the title text opacity to 1
	// 	g.selectAll(".openvis-title")
	// 		.transition()
	// 		.duration(600)
	// 		.attr("opacity", 0);

	// 	g.selectAll(".sensorsImg")
	// 	.attr("opacity", 1);

	// 		// add the current viz components
	// 		g.selectAll(".emissions")
	// 		    .transition()
	// 		    .duration(0)
	// 		    .attr("opacity", 0);
	// 		g.selectAll(".tower")
	// 		    .transition()
	// 		    .duration(0)
	// 		    .attr("opacity", 0);
	// 		g.selectAll(".car, .movement")
	// 		    .transition()
	// 		    .duration(0)
	// 		    .attr("opacity", 0);
	// 	    g.selectAll(".resistance")
	// 		    .transition()
	// 		    .duration(0)
	// 		    .attr("opacity", 0);

	// }




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

