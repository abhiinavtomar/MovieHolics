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
        }],
    followers: [{
            name: String,
            id: String
        }],
    recommendation: [{
            name: String,
            id: String,
            owner: String
        }]
    });
userSchema.plugin(passportLocalMongoose);

module.exports  = mongoose.model("User", userSchema);

