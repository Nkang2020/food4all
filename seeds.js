var mongoose = require("mongoose");
var Food = require("./models/food");
var Comment   = require("./models/comment");

var data = [
    {
        name: "Cheesesteak Philly", 
        image: "http://i.imgur.com/pPtEGLj.jpg",
        description: "blah blah blah"
    },
    {
        name: "Sushi", 
        image: "http://i.imgur.com/mks0Gn4.jpg",
        description: "blah blah blah"
    },
    {
        name: "Burger", 
        image: "http://i.imgur.com/IkFRxPO.jpg",
        description: "blah blah blah"
    }
]

function seedDB(){
   //Remove all foods
   Food.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed foods!");
         //add a few foods
        data.forEach(function(seed){
            Food.create(seed, function(err, food){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a food");
                    //create a comment
                    Comment.create(
                        {
                            text: "This is the best tasting food ever! Donuts!",
                            author: "Marge"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                food.comments.push(comment);
                                food.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;
