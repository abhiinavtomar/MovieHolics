var express     = require("express"),
    router      = express.Router(),
    User        = require("../models/user"),
    request     = require("request"),
    passport    = require("passport");

router.get("/", function(req, res){
    res.render("index/index");
});

router.get("/login", function(req, res){
    res.render("index/login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: "Welcome back to MovieHolics"
}), function(req, res){});

router.get("/logout", function(req, res) {
    req.flash("success", "Logged you out, come back soon ...");    
    req.logout();
    res.redirect("/");
});

router.get("/register", function(req, res) {
    res.render("index/register");
});

router.post("/register", function(req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
        if(err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        } else {
                passport.authenticate("local")(req, res, function(){
                    req.flash("success", "Welcome to MovieHolics");
                    res.redirect("/");
            });
        }    
    });
});



router.get("/:id", isLoggedIn, function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if(err) {
            res.render("other");
        } else {
            res.render("index/show", { user: user }); 
        }
    })
    
});

// router.put("/:id", isLoggedIn, function(req, res) {
//     User.findByIdAndUpdate(req.params.id, req.user, function(err, user) {
//         if(err) {
//             res.redirect("/" + req._id);
//         } else {
//             res.redirect("/" + req._id);
//         }
//     }) 
// });

router.get("*", function(req, res) {
    res.render("other"); 
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } 
    res.redirect("/login");
}

module.exports  = router;