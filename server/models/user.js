const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String },
    email: { type: String, lowercase: true },
    password: { type: String },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
    // member: { type: Boolean, default: false },
    // admin: { type: Boolean, default: false },
});
  
module.exports = mongoose.model("User", UserSchema);