const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Exercise = require('./exercise');

const userSchema = new Schema({
  username: { type: String, required: true },
  log: {type: Schema.Types.ObjectId, ref: 'Exercise'},
  count: { type: Number }
});

module.exports = mongoose.model("User", userSchema);