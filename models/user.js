const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema =new Schema({
    email:{
        type:String,
        required:true,
    },  
})


// we are adding a plugin  beacause the passportLocalMongoose plugin will add a username and password field to the schema
userSchema.plugin(passportLocalMongoose);
        
module.exports = mongoose.model("User",userSchema);
