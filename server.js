var express = require('express');
var app = express();
var exphbs  = require('express-handlebars');



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
app.use("/views/stylesheets",express.static("/views/stylesheets"));


var port = Number(process.env.Port || 5000);
app.listen(port);


// https://www.youtube.com/watch?v=m5ribwPpIPw