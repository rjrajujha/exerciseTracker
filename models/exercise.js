const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exSchema = new Schema({
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: String
});

module.exports = mongoose.model("Exercise", exSchema);