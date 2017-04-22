var mongoose = require('mongoose');

var foodSchema = new mongoose.Schema({
	name:String,
	image:String,
	description:String,
	cost:String,
	location:String,
	lat: Number,
	lng: Number,
	author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
	comments: [
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Comment"
		}
	]
});

module.exports = mongoose.model('Food', foodSchema);