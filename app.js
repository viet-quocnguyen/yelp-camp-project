var express         = require("express"),
    app             = express(),    // using express
    bodyParser      = require("body-parser"),  // using bodyParser
    mongoose        = require("mongoose"), // using mongoose
    passport        = require("passport"), // using passport
    LocalStrategy   = require("passport-local"), // using local passport
    methodOverride = require("method-override"), // using method override
    Campground      = require("./models/campground"), // using campground model
    Comment         = require("./models/comment"), // using comment model
    User            = require("./models/user"), // using user model
    flash           = require("connect-flash");

// Requiring Routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Hello World",
    resave: false,
    saveUninitialized: false
}));

// mongoose.connect("mongodb://localhost/yelp_camp"); // connect to the db
mongoose.connect("mongodb://qvnguyen:gunnervn3@ds119273.mlab.com:19273/yelpcamp_qvnguyen");
app.use(bodyParser.urlencoded({extended: true})); // add body parser to app
app.use(express.static(__dirname + "/public")); // add public dir to use
app.set("view engine", "ejs"); // read all .ejs file
app.use(methodOverride("_method")); // overwrite method post
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// use currentUser as req.user
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})


// LANDING PAGE
app.get("/",function(req, res){
    res.render("landing");
});

// USING ROUTE
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

// =================
// CONNECT TO SERVER
// =================
app.listen(process.env.PORT, process.env.ID, function(){
    console.log("The YelpCamp server is ready");
});