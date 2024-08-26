const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { format } = require('date-fns');

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

PostSchema.virtual('formattedTimestamp').get(function() {
  return format(this.timestamp, 'd MMM yyyy');
});

PostSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("Post", PostSchema);