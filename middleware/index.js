// all the middle ware goes there
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function checkCampgroundOwnership(req, res, next){
    // is user logged in
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error",err);
                res.redirect("/campgrounds");
            }else{
                // does user own the campground
                if(foundCampground.author.id.equals(req.user.id)){
                    return next();
                }else{
                    res.redirect("back");
                }
            }
        })
    }else{
        req.flash("error","Please log in first");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function checkCommentOwnership(req, res, next){
    // is user logged in
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error",err);
                res.redirect("back");
            }else{
                // does user own the campground
                if(foundComment.author.id.equals(req.user.id)){
                    return next();
                }else{
                    res.redirect("back");
                }
            }
        })
    }else{
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login First!");
    res.redirect("/login");
}

module.exports = middlewareObj;