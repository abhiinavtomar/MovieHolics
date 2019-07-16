var express         = require("express"),
    request         = require("request"),
    app             = express(),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    mongoose        = require("mongoose"),
    methodOverride  = require("method-override"),
    bodyParser      = require("body-parser"),
    flash           = require("connect-flash"),
    passportLocal   = require("passport-local"),
    passport        = require("passport");
    
var indexRoutes     = require("./routes/index"),
    moviesRoutes    = require("./routes/movies");    
    
var url = process.env.DATABASEURL || "mongodb://localhost:27017/movieholics";
mongoose.connect(url, {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

    //  PASSPORT CONFIGURATION  
app.use(require("express-session")({
    secret: "abhiinavtomar",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user; 
    res.locals.success     = req.flash("success");
    res.locals.error       = req.flash("error");
    next();
});

app.use("/movies", moviesRoutes);
app.use("/", indexRoutes);

app.listen(8080, function(req, res){
    console.log("Server Started"); 
});



