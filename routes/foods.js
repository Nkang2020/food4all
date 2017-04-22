var express = require("express");
var router  = express.Router();
var Food = require("../models/food");
var middleware = require("../middleware");
var geocoder = require('geocoder');


//index route
router.get('/', function(req,res){
	Food.find({}, function(err, allFoods){
		if(err){
			console.log(err);
		} else{
			res.render('foods/index', {foods:allFoods});
		}
	})
});

router.post('/',middleware.isLoggedIn, function(req,res){
	var name = req.body.name;
	var cost = req.body.cost;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.location, function(err,data){
    	var lat = data.results[0].geometry.location.lat;
    	var lng = data.results[0].geometry.location.lng;
    	var location = data.results[0].formatted_address;
    	var newFood = {name:name, image:image, cost:cost, description:desc, author:author, location: location, lat: lat, lng: lng};
	Food.create(newFood, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else{
			res.redirect('/foods');
		}
	});
});
});
	

//create route
router.get('/new',middleware.isLoggedIn, function(req,res){
	res.render('foods/new')
})

router.get('/:id', function(req,res){
	Food.findById(req.params.id).populate('comments').exec(function(err,foundFood){
		if(err){
			console.log(err);
		} else{
			res.render('foods/show', {food:foundFood});
		}
	});
});

// EDIT FOOD ROUTE
router.get("/:id/edit", middleware.checkFoodOwnership, function(req, res){
    Food.findById(req.params.id, function(err, foundFood){
        res.render("foods/edit", {food: foundFood});
    });
});

// UPDATE FOOD ROUTE
router.put("/:id",middleware.checkFoodOwnership, function(req, res){
	geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, cost: req.body.cost, location: location, lat: lat, lng: lng};
    Food.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, updatedFood){
       if(err){
       		req.flash('error',err.message);
           res.redirect("/foods");
       } else {
       		req.flash('success', "Successfully Updated!");
           res.redirect("/foods/" + req.params.id);
       }
    });
});
});

// DESTROY FOOD ROUTE
router.delete("/:id",middleware.checkFoodOwnership, function(req, res){
   Food.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/foods");
      } else {
          res.redirect("/foods");
      }
   });
});


module.exports = router;




