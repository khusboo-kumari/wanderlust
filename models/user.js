const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({ // we dont have to mention about the username or pswrd because the passportLocalMongoose automatically does this along with some salting and hashing  in pswrd. 
    email:{
        type: String,
        required: true 
    }
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',userSchema);   