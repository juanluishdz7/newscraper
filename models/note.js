var mongoose = require("mongoose");
//Schema constructor
var Schema = mongoose.Schema;

var noteSchema = new Schema({
  title: String,
  body: String
});

// creates model from the above schema, using mongoose's model method
var note = mongoose.model("note", noteSchema);

// Export the Note model
module.exports = note;
