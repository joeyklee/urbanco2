var MONGOCONNECTION = 'mongodb://localhost:27017/helloworld';

var express = require('express');
var app = express();
var exphbs  = require('express-handlebars');


var bodyParser = require('body-parser');
var  _ = require('underscore');
var path = require("path");
var mongojs = require('mongojs');
var db = mongojs(MONGOCONNECTION);

// var points = db.collection('points')
var test = db.collection('helloworld');

	


// mongoose.connect('mongodb://localhost:5000');
app.use(bodyParser.json());
app.get('/api/test', function(req, res){
	// TODO console.log(req.query.sensor_id)
	findAll(test, {}, res);
});
function findAll(collection, query, res) {
	collection.find(
		query,
		function(err, docs) {
			if (err) { return mongoError(res, err); };
			// if nothing is found (doc === null) return empty array
			res.send(docs === null ? [] : docs);
		}
	);
};

function mongoError(res, err) {
  if (err) console.error('mongo error ->', err);
  return res.status(500).send('internal server error')
};


app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/about', function (req, res) {
    res.render('about');
});

app.get('/mobile', function (req, res) {
    res.render('mobile');
});

app.get('/explore', function (req, res) {
    res.render('explore');
});


// app.get('/', function(req, res){
// 	res.send('hello world');
// });

app.use('/public', express.static('public'));
// app.use('/views', express.static(__dirname + '/public'));
// app.use('/views', express.static('public'));
// app.use("/views/stylesheets",express.static("/views/stylesheets"));
// app.use("/views/js",express.static("/views/js"));


var port = Number(process.env.Port || 5000);
app.listen(port);


// https://www.youtube.com/watch?v=m5ribwPpIPw
// http://stackoverflow.com/questions/5178334/folder-structure-for-a-node-js-project