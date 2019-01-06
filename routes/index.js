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
            User.find({}, function(err, allUsers){
                if(err) {
                    req.flash("error", "Something happened");
                    res.redirect("/");
                } else {
                    res.render("index/show", { user: user, allUsers: allUsers }); 
                }
            });
            
        }
    });
    
});

router.post("/:id", isLoggedIn, function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if(err) {
            console.log(err);
            res.redirect("/" + req.params.id);
        } else {
                var flag = 0;
                var myUser;
                req.user.following.forEach(function(user1){
                if(user1.name == user.username) {
                    myUser = user1;
                    flag = 1;
                    return;
                } 
            });
            if(flag == 0) {
                req.user.following.push({name: user.username, id: user._id});
                req.user.save();
                user.followers.push({name: req.user.username, id: req.user._id});
                user.save();
                req.flash("success", "Successfully followed ...");
                res.redirect("/" + req.params.id);
            } else {
                req.user.following.id(myUser._id).remove();
                req.user.save();
                user.followers.forEach(function(user1) {
                    if(user1.name == req.user.username) {
                        user1.remove();
                        user.save();
                    } 
                });
                req.flash("success", "Successfully unfollowed...");
                res.redirect("/" + req.params.id);
            }
        } 
    });
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
    req.flash("error", "Please login to continue");
    res.redirect("/login");
}

module.exports  = router;