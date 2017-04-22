var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	methodOverride = require('method-override'),
	flash = require('connect-flash'),
	Food = require('./models/food'),
  	User = require('./models/user'),
	Comment = require('./models/comment'),
	seedDB = require('./seeds');

//require routes
var commentRoutes = require('./routes/comments');
var foodRoutes = require('./routes/foods');
var indexRoutes = require('./routes/index');

mongoose.connect(process.env.DATABASEURL);
//mongoose.connect('mongodb://nkang:1124zing@ds115071.mlab.com:15071/food4all');
//mongoose.connect("mongodb://localhost/food4all");
console.log(process.env.DATABASEURL);

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(flash());
//seedDB();

//passport configuration
app.use(require("express-session")({
    secret: 'God Loves Ugly',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash('error');
   res.locals.success = req.flash('success');
   next();
});

app.use("/", indexRoutes);
app.use("/foods", foodRoutes);
app.use("/foods/:id/comments", commentRoutes);


app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log('The Food4All Server has started.');
});