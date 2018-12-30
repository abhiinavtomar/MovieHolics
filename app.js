var express         = require("express"),
    request         = require("request"),
    app             = express();
    
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", function(req, res){
    res.render("index"); 
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.get("/results", function(req, res) {
        var query = req.query.search;
        var url = "http://omdbapi.com/?s=" + query + "&apikey=thewdb";
        request(url, function(error, response, body){
            if(!error && response.statusCode == 200) {
                var data = JSON.parse(body)
                res.render("results", {data: data});
            }
        });
});

app.get("/about", function(req, res) {
    res.render("about"); 
});

app.listen(process.env.PORT, process.env.IP, function(req, res){
    console.log("Server Started"); 
});



