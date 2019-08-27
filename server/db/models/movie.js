const mongoose = require('../');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  name: String,
  genre: String,
  directorId: Schema.Types.ObjectId,
  rate: Number,
  watched: Boolean
});

module.exports = mongoose.model('Movie', movieSchema);
