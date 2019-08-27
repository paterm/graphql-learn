const mongoose = require('mongoose'),
  host = process.env.MONGO_HOST || 'localhost',
  port = process.env.MONGO_PORT || '27017',
  database = 'graphql';

let options = {
  useCreateIndex: true,
  dbName: database,
  useNewUrlParser: true
};

mongoose.Promise = global.Promise;

mongoose.connect(`mongodb://${host}:${port}/${database}`, options, err => {
  if (err) {
    console.error(err);
    return process.exit(1);
  }
});

const db = mongoose.connection;

db.on('error', err => {
  return console.error('Connection error:', err.message);
});

db.once('open', () => {
  if (database !== 'test') {
    return console.log('Connected to DB:', database);
  }
});

module.exports = mongoose;
