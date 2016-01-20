var MONGOCONNECTION = 'mongodb://localhost:27017/co2webdb';

var express = require('express');
var app = express();
var exphbs = require('express-handlebars');


var bodyParser = require('body-parser');
var _ = require('underscore');
var path = require("path");
var mongojs = require('mongojs');
var db = mongojs(MONGOCONNECTION);


var points = db.collection('co2points');
var grid = db.collection('co2grid');
var propertyMap = {
    'altitude': 'properties.altitude',
    'datetime': 'properties.datetime',
    'sid': 'properties.sensorid',
    'temperature': 'properties.tempout',
    'co2': 'properties.co2'
};



/* Points API */
app.use(bodyParser.json());

// grid data
app.get('/api/grid', function(req, res) {
    // TODO console.log(req.query.sensor_id)
    findAll(grid, {}, res);
});


// get all features - not recommended for points
app.get('/api/points', function(req, res) {
    // TODO console.log(req.query.sensor_id)
    findAll(points, {}, res);
});

// TODO check whether this really works = is everyting within that day
app.get('/api/points/sid/:sensornum', function(req, res){
	// TODO console.log(req.query.sensor_id)
	var sensorid = parseInt(req.params.sensornum);
	findAll(
		points,
		{$query:{"properties.sensorid": sensorid}, "properties.datetime":1},
		res
	);
});


// get points based on property greater than a threshold
app.get('/api/points/:property/gte/:threshold', function(req, res) {
    // TODO console.log(req.query.sensor_id)
    var property = propertyMap[req.params.property],
        threshold = parseFloat(req.params.threshold);
    if (!property) return handleError(null, req, res, 404, "doesn't exists");
    var query = {},
        orderby = {};
    query[property] = {
        $gte: threshold
    };
    // orderby[property] = 1;
    findAll(points, {
        $query: query,
        // orderby only returns 1000 - change to property:1
        property: 1
    }, res);
});


app.get('/api/points/:property/range/:low/:high', function(req, res) {
    // TODO console.log(req.query.sensor_id)
    var property = propertyMap[req.params.property],
        low = parseInt(req.params.low),
        high = parseInt(req.params.high),
        query = {};
    if (!property) return handleError(null, req, res, 404, "doesn't exists");
    var query = {},
        orderby = {};
    query[property] = {
        $gte: low,
        $lte: high
    };
    orderby[property] = 1;
    findAll(points, {
        $query: query,
        // orderby only returns 1000 - change to property:1
        property: 1
    }, res);
});

// app.get('/api/points/test', function(req, res){
// 	findAll(points, {"properties.sensorid": 0108}, res);
// });

function mongoError(res, err) {
    if (err) console.error('mongo error ->', err);
    return res.status(500).send('internal server error')
};

function findAll(collection, query, res) {
  collection.find(
    query, function(err, docs) {
      if (err) { return mongoError(res, err); };
      // if nothing is found (doc === null) return empty array
      res.send(docs === null ? [] : docs);
    }
  );
};


app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/cities', function(req, res) {
    res.render('cities');
});

app.get('/about', function(req, res) {
    res.render('about');
});

app.get('/monitoring', function(req, res) {
    res.render('monitoring');
});

app.get('/explore', function(req, res) {
    res.render('explore');
});



app.use('/public', express.static('public'));

var port = Number(process.env.Port || 5000);
app.listen(port);
console.log('Listening on port', port);

// https://www.youtube.com/watch?v=m5ribwPpIPw
// http://stackoverflow.com/questions/5178334/folder-structure-for-a-node-js-project
