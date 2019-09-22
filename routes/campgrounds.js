var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");
var NodeGeocoder = require("node-geocoder");

var options = {
  provider: "google",
  httpAdapter: "https",
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};

var geocoder = NodeGeocoder(options);
// ====================
// CAMPGROUNDS ROUTES
// ====================
/********************** DISPLAY ALL ROUTE **************************/
// SHOW ALL CAMPGROUND
router.get("/campgrounds", function(req, res) {
  // Get all campgrounds in DB
  Campground.find({}, function(err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {
        campgrounds: allCampgrounds,
        currentUser: req.user
      });
    }
  });
  // res.render("campgrounds", {campgrounds: campgrounds});
});

/********************** DISPLAY SPECIFIC ROUTE **************************/
// SHOW INFO SPECIFIC CAMPGROUND
router.get("/campgrounds/:id", function(req, res) {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function(err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});

/********************** NEW ROUTE **************************/
// ROUTE TO A FORM FOR NEW CAMPGROUND
router.get("/newCampground", middleware.isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
});

/********************** CREATE ROUTE **************************/
// ADD NEW CAMPGROUND TO DATABASE
router.post("/campgrounds", middleware.isLoggedIn, function(req, res) {
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var description = req.body.description;
  var location = req.body.location;
  var author = {
    id: req.user.id,
    username: req.user.username
  };

  geocoder.geocode(location, (err, data) => {
    if (err || !data.length) {
      req.flash("err", "Invalid address");
      return res.redirect("back");
    }
    var newCampground = {
      name: name,
      price: price,
      image: image,
      description: description,
      author: author,
      location: data[0].formattedAddress,
      latitude: data[0].latitude,
      longtitude: data[0].longitude
    };

    // campgrounds.push(newCampground);
    Campground.create(newCampground, function(err, newlyCreated) {
      if (err) {
        console.log("There is an error!");
      } else {
        res.redirect("/campgrounds");
      }
    });
  });
});

/********************** EDIT ROUTE **************************/
// EDIT CAMPGROUND ROUTE
router.get(
  "/campgrounds/:id/edit",
  middleware.checkCampgroundOwnership,
  function(req, res) {
    // is user logged in
    Campground.findById(req.params.id, function(err, foundCampground) {
      res.render("campgrounds/edit", { campground: foundCampground });
    });
  }
);

/********************** UPDATE ROUTE **************************/
// UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id", function(req, res) {
  var { name, price, image, description, location } = req.body.campground;

  var author = {
    id: req.user.id,
    username: req.user.username
  };

  geocoder.geocode(location, (err, data) => {
    if (err || !data.length) {
      req.flash("err", "Invalid address");
      return res.redirect("back");
    }

    var newCampground = {
      name: name,
      price: price,
      image: image,
      description: description,
      author: author,
      location: data[0].formattedAddress,
      latitude: data[0].latitude,
      longtitude: data[0].longitude
    };

    // campgrounds.push(newCampground);
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, newCampground, function(
      err,
      updatedCampground
    ) {
      if (err) {
        res.redirect("/campgrounds");
      } else {
        res.redirect("/campgrounds/" + req.params.id);
      }
    });
    // redirect somewhere
  });
});

/********************** DESTROY ROUTE **************************/
//DESTROY CAMPGROUND ROUTE
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(
  req,
  res
) {
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
