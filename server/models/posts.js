const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    comments: [{
      user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }],
    likes: [{
      user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    }]
});

module.exports = mongoose.model("Post", PostSchema);