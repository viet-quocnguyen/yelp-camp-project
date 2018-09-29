var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "Ha Long",
        image: "https://www.seaplanes.vn/blog/wp-content/uploads/2017/03/halong-696x464.jpg",
        description: "This is the best place in the world"
    },
    {
        name: "Da Nang",
        image: "https://sg2-cdn.pgimgs.com/developer-listing/3164442/OUPHO.100342549.V800/Wyndham-Soleil-Da-Nang-Da-Nang-Vietnam.jpg",
        description: "This is the second best place in the world"
    },
    {
        name: "Da Lat",
        image: "https://cdn3.ivivu.com/2015/11/du-lich-da-lat-ivivu1-540x305.jpg",
        description: "This is the third best place in the world"
    }
]

function seedDB(){
    // Remove all campgrounds
    Campground.remove({}, function(err){
        // if(err){
        //     console.log(err);
        // }else{
        //     console.log("DB removed"); 
        //     // Add a few campgrounds
        //     data.forEach(function(seed){
        //         Campground.create(seed, function(err, campground){
        //             if(err){
        //                 console.log(err);
        //             }else{
        //                 console.log("added a campground")
        //                 // create a comment
        //                 Comment.create(
        //                     {
        //                         text: "This place is great but I wish there was internet",
        //                         author: "Homer"
        //                     },function(err, comment){
        //                         if(err){
        //                             console.log(err);
        //                         }else{
        //                             campground.comments.push(comment);
        //                             campground.save();
        //                             console.log("Create new comment");
        //                         }
                                
        //                     }
        //                 )
        //             }
        //         })
        //     })
        // }
    });
}

module.exports = seedDB;
