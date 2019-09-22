var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js");
// ====================
// COMMENTS ROUTES
// ====================

/********** ROUTE TO NEW COMMENT FORM **********/
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(
  req,
  res
) {
  // Find campground by ID
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground: campground });
    }
  });
});

/********** CREATE NEW COMMENT TO THAT CAMPGROUND **********/
// add a new comment to that campground
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(
  req,
  res
) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      Comment.create(req.body.comment, function(err, newComment) {
        if (err) {
          console.log(err);
        } else {
          //add username and id to comment
          newComment.author.id = req.user.id;
          newComment.author.username = req.user.username;

          //save comment
          newComment.save();
          campground.comments.push(newComment);
          campground.save();
          req.flash("success", "Comment added");
          res.redirect("/campgrounds/" + campground.id);
        }
      });
    }
  });
});

/********** ROUTE TO EDIT COMMENT FORM **********/
router.get(
  "/campgrounds/:id/comments/:comment_id/edit",
  middleware.checkCommentOwnership,
  function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        res.redirect("back");
      } else {
        res.render("comments/edit", {
          campground_id: req.params.id,
          comment: foundComment
        });
      }
    });
  }
);

/********** UPDATE COMMENT **********/
router.put(
  "/campgrounds/:id/comments/:comment_id",
  middleware.checkCommentOwnership,
  function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(
      err,
      updatedComment
    ) {
      if (err) {
        console.log(err);
        res.redirect("back");
      } else {
        res.redirect("/campgrounds/" + req.params.id);
      }
    });
  }
);

/********** COMMENT DESTROY ROUTE **********/
router.delete(
  "/campgrounds/:id/comments/:comment_id",
  middleware.checkCommentOwnership,
  function(req, res) {
    // findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
      if (err) {
        res.redirect("back");
      } else {
        res.redirect("/campgrounds/" + req.params.id);
      }
    });
  }
);

module.exports = router;
