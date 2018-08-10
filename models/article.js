var mongoose = require("mongoose");

//Schema constructor
var Schema = mongoose.Schema;

// new UserSchema object
var articleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },

  note: {
    type: Schema.Types.ObjectId,
    ref: "note"
  }
});

var article = mongoose.model("article", articleSchema);

// Export the Article model
module.exports = article;
