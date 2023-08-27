const { connect, connection } = require("mongoose");

// Connect to the Mongo DB
const connectDB = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/socialNetworkDB';

connect(connectDB);

module.exports = connection;