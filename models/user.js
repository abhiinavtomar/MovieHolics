var mongoose                = require("mongoose"),
    passportLocalMongoose   = require("passport-local-mongoose");

var userSchema  = new mongoose.Schema({
    username: String,
    password: String,
    myMovies: [{
            name: String,
            id: String
        }],
    following: [{
            name: String,
            id: String
    }]
    });
userSchema.plugin(passportLocalMongoose);

module.exports  = mongoose.model("User", userSchema);

