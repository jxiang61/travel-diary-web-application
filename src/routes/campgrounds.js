var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");


router.get("/campgrounds", function(req,res) {
	//find all data from database;
	Campground.find({}, function(err, allCamgrounds) {
		if (err) {console.log(err);}
		// send the data to campgrounds.ejs;
		else { res.render("campgrounds/index", {campgrounds: allCamgrounds, currentUser:                                                                                  req.user});}
	});
});

router.get("/campgrounds/new", middleware.isLoggedIn, function(req,res) {
	res.render("campgrounds/new");
});

router.post("/campgrounds", middleware.isLoggedIn, function(req,res) {
	//get data from form and add to campgrounds array;
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var price = req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name:name, price:price, image:image, description:description, author:author};
	//campgrounds.push(newCampground);
	
	//get the name and url from the form and add it to DB;
	Campground.create(newCampground, function(err, newlyCreated) {
		if (err) {console.log(err);}
		else {res.redirect("/campgrounds");}
	});
	
	//redirect back to campgrounds page;
	//res.redirect("/campgrounds");
});
 
/*show the detailed info for every image;*/
router.get("/campgrounds/:id", function(req, res) {
	//find the data that has the id and send it to the show page;
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if (err) {console.log(err);}
		else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

//edit campground route
 router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {	
	Campground.findById(req.params.id, function(err, foundCampground) {
		res.render("campgrounds/edit", {campground: foundCampground});
	});
 });
	
	 

//update campground route
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res) {
	//find and update the correct campground;
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(
								err, updateCampground) {
		if (err) {res.redirect("/campgrounds");}
		else {res.redirect("/campgrounds/" + req.params.id);}
	});
});

//destroy campground route
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req,res) {

	Campground.findByIdAndRemove(req.params.id, function(err) {
		if (err) {res.redirect("/campgrounds");}
		else {res.redirect("/campgrounds");}
	});
});



module.exports =router;
