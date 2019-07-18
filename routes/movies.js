var express     = require("express"),
    router      = express.Router(),
    User        = require("../models/user"),
    request     = require("request");
    
router.get("/", function(req, res) {
        var query = req.query.search;
        var genre = req.query.genre;
        var year  = req.query.year;
        if(query == "" && genre == "" && year == "") {
            req.flash("error", "Search something !!!");
            res.redirect("/");
        }
        var url = "http://omdbapi.com/?s=" + query + "&type=" + genre + "&y=" + year + "&apikey=thewdb";
        request(url, function(error, response, body){
            if(!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                res.render("movies/index", {data: data});
            }
        });
});

router.post("/", isLoggedIn, function(req, res) {
        var flag = 0;
        req.user.myMovies.forEach(function(movie){
            if(movie.id === req.body.movieid) {
                flag = 1;
                return;
            } 
        });
        if(flag == 0 ) {
            req.flash("success", "Movie added to your list");
            req.user.myMovies.push({id:req.body.movieid, name:req.body.moviename});
            req.user.save();
        } else {
            req.flash("error", "Movie is already added to your list");
        }
        res.redirect("/" + req.user._id);
});   

router.get("/recommend", isLoggedIn, function(req, res) {
    var movie = { id: req.query.movieid, name: req.query.moviename };
    res.render("movies/recommend", {movie: movie} ); 
});

router.post("/recommend", isLoggedIn, function(req, res) {
    var recommendedmovie = { name: req.body.moviename, id: req.body.movieid, owner: req.body.owner};
    User.findById(req.body.receiver, function(err, user) {
        if(err) {
            req.flash("error", "Movie not recommended ,try again !!!");
            res.redirect("/" + user._id);
        } else {
            var flag = 0;
            user.recommendation.forEach(function(movie) {
                if(movie.id == recommendedmovie.id) {
                    flag = 1;
                    return;
                }
            });
            if(flag == 0) {
            user.recommendation.push(recommendedmovie);
            user.save();
            } 
            res.redirect("/" + user._id);
        }
    });
});

router.delete("/recommend", isLoggedIn, function(req, res) {
    if(req.user._id.equals(req.body.ownerid)) {
        req.flash("success", "Recommendation deleted successfully ...");
        req.user.recommendation.id(req.body.movieid).remove();
        req.user.save();
        res.redirect("/" + req.body.ownerid);
    } else {
        req.flash("error", "You dont have permissions to delete this recommendation !!!");
        res.redirect("/" + req.body.ownerid); 
    }
});
    
router.get("/:id", function(req, res){
    var id= req.query.movieid;
    var url = "http://omdbapi.com/?i=" + id + "&apikey=thewdb";
        request(url, function(error, response, body){
            if(!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                res.render("movies/show", {data: data});
            }
        });
});

router.delete("/:id", isLoggedIn, function(req, res) {
    if(req.user._id.equals(req.body.ownerid)) {
        req.flash("success", "Movie deleted from your list");
        var myMovie;
        req.user.myMovies.forEach(function(movie){
            if(movie.id == req.params.id) {
                myMovie = movie;
                return;
            } 
        });
        req.user.myMovies.id(myMovie._id).remove();
        req.user.save();
        res.redirect("/" + req.user._id);
    } else {
        req.flash("error", "You dont have permissions to delete this movie from the list");
        res.redirect("/" + req.body.ownerid);
    }    
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } 
    req.flash("error", "Please login to continue");
    res.redirect("/");
}

module.exports = router;