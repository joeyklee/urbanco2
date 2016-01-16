/**
 * scrollVis - encapsulates
 * all the code for the visualization
 * using reusable charts pattern:
 * http://bost.ocks.org/mike/chart/
 */
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
    var activateFunctions = [];
    // If a section has an update function
    // then it is called while scrolling
    // through the section with the current
    // progress through the section.
    var updateFunctions = [];

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
            svg = d3.select(this).selectAll("svg").data([0, 1, 2, 3, 4, 5, 6, 7]);
            svg.enter().append("svg").append("g");

            svg.attr("width", width + margin.left + margin.right);
            svg.attr("height", height + margin.top + margin.bottom);
            // svg.attr("viewBox", "0 0 600 500").attr("preserveAspectRatio", "xMinYMin meet");


            // this group element will be used to contain all
            // other elements.
            g = svg.select("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            setupVis();

            setupSections();

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
        g.append("text")
            .attr("class", "title openvis-title")
            .attr("x", width / 2)
            .attr("y", height / 3)
            .text("");
        g.append("text")
            .attr("class", "title openvis-title")
            .attr("x", width / 2)
            .attr("y", (height / 3) + (height / 5))
            .text("30-40%");
        g.selectAll(".openvis-title")
            .attr("opacity", 0);

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

        var map = g.append("svg")
            .attr("class", "map")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "translate(0 50)")
            .attr("opacity", 0);



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



        d3.json("public/data/world-countries-110m.json", function(error, world) {
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


            // d3.csv("public/data/cities.csv", function(data) {
            //     map.selectAll("path.point")
            //         .data(data)
            //         .enter().append("path")
            //         .datum(function(d) {
            //             // if (d.population > 100000){
            //             return circle
            //                 .origin([d.longitude, d.latitude])
            //                 .angle(0.4)();
            //             // }
            //         })
            //         .attr("class", "point")
            //         .attr("fill", "#ffffe5")
            //         .attr("opacity", "0.45")
            //         .attr("d", path);
            // });

        });

        // urban scale viz
        var urbanScale = g.append("g")
            .attr("class", "urbanscale");
        // read in the svg
        d3.xml("public/images/Figure-7-edited.svg", "image/svg+xml", function(xml) {
            var items = Array.from(xml.getElementsByTagName("svg")[0].childNodes);
            items.forEach(function(val) {
                urbanScale.node().appendChild(val);
            });
            // set the opacity
            g.selectAll('.inputs, .city-center, .waste')
                .attr("opacity", 0)
        });


        // urban box model
        var emissionsIllustration = g.append("g")
            .attr("class", "illustration")
            .attr("opacity", 0)
            .attr("transform", "translate(90), scale(2.5)");
        d3.xml("public/images/co2-emissions-model.svg", "image/svg+xml", function(xml) {
            // emissionsIllustration.node().appendChild(xml.getElementsByTagName("svg")[0]);
            var items = Array.from(xml.getElementsByTagName("svg")[0].childNodes);
            items.forEach(function(val) {
                emissionsIllustration.node().appendChild(val);
            });
        });

        g.append("text")
            .attr("class", "title filler")
            .attr("x", width / 2)
            .attr("y", (height / 3) + (height / 5))
            .text("<insert graphic here>");
        g.selectAll(".filler")
            .attr("opacity", 0);


        // var solutions = g.append("g")
        //     .attr("class", "solutions")
        //     .attr("width", width + margin.left + margin.right - 100)
        //     .attr("height", height + margin.top + margin.bottom - 100)
        //     .attr("opacity", 0);

        // // line chart - solutions
        // d3.csv("public/data/solutions.csv", function(data) {

        //     var x = d3.scale.linear().range([0, width]);
        //     var y = d3.scale.linear().range([height, 0]);


        //     var xAxis = d3.svg.axis()
        //         .scale(x)
        //         .ticks(0)
        //         .orient("bottom");

        //     var yAxis = d3.svg.axis()
        //         .scale(y)
        //         .ticks(0)
        //         .orient("left");

        //     // Define the line
        //     var valueline = d3.svg.line()
        //         .interpolate("cardinal")
        //         .x(function(d) {
        //             return x(d.id);
        //         })
        //         .y(function(d) {
        //             return y(d.co2);
        //         });

        //     // Scale the range of the data
        //     x.domain([1, 43]);
        //     y.domain([200, d3.max(data, function(d) {
        //         return d.co2;
        //     })]);

        //     // Add the valueline path.
        //     solutions.append("path")
        //         .attr("class", "solution-line")
        //         // .attr("transform", "translate(0 60 60 0)")
        //         .attr("d", valueline(data));

        //     solutions.append("g")
        //         .attr("class", "x axis")
        //         .attr("transform", "translate(0," + height + ")")
        //         .call(xAxis);

        //     solutions.append("g")
        //         .attr("class", "y axis")
        //         .call(yAxis);
        //     // .append("text")
        //     // .attr("transform", "rotate(-90)")
        //     // .attr("y", 6)
        //     // .attr("dy", ".71em")
        //     // .style("text-anchor", "end")
        //     // .text("CO2");
        // });



    }; // end of setup vis

    /**
     * setupSections - each section is activated
     * by a separate function. Here we associate
     * these functions to the sections based on
     * the section's index.
     *
     */
    setupSections = function() {
        // activateFunctions are called each
        // time the active section changes
        activateFunctions[0] = showTitle;
        activateFunctions[1] = showUrbanModel;
        activateFunctions[2] = showEmissionsIllustration;
        activateFunctions[3] = showEmissionsTransportation;
        activateFunctions[4] = showEmissionsHvac;
        activateFunctions[5] = showEmissionsBiological;
        activateFunctions[6] = showPotential;
        activateFunctions[7] = triggerPageTurn;
        // activateFunctions[8] = triggerPageTurn;
        // activateFunctions[9] = triggerPageTurn;


        // updateFunctions are called while
        // in a particular section to update
        // the scroll progress in that section.
        // Most sections do not need to be updated
        // for all scrolling and so are set to
        // no-op functions.
        for (var i = 0; i < 10; i++) {
            updateFunctions[i] = function() {};
        }
        // updateFunctions[1] = updateUrbanModelInput;
    };

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
        // g.selectAll(".openvis-title")
        //     .transition()
        //     .duration(600)
        //     .attr("opacity", 1.0);

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
        // .call(pulse);



        // g.selectAll(".urbanscale")
        //     .transition()
        //     .duration(900)
        //     .attr("opacity", 1);

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

        g.selectAll(".filler")
            .attr("opacity", 0);

        g.selectAll(".solutions")
            .attr("opacity", 0);
    }


    function showPotential() {
        g.selectAll(".illustration")
            .transition()
            .duration(600)
            .attr("fill", "#000")
            .attr("opacity", 0);

        // g.selectAll(".filler")
        // .transition()
        // .duration(600)
        // .attr("opacity", 1);

        // g.selectAll(".solutions")
        //     .attr("opacity", 1);

        g.selectAll(".filler")
            .attr("opacity", 0)

    }

    function triggerPageTurn() {
        g.selectAll(".solutions")
            .attr("opacity", 0);
        // console.log("hello");
        g.selectAll(".filler")
            .attr("opacity", 0)

        // g.selectAll(".solutions")
        // 	.attr("opacity", 1);
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
    var plot = scrollVis();
    d3.select("#vis")
        .datum([0, 1, 2, 3, 4, 5, 6, 7])
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

    scroll.on('progress', function(index, progress) {
        plot.update(index, progress);
    });
}

// load data and display
display();
