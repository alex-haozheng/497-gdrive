const mongoose = require('mongoose');

require('dotenv').config();
// database connection URI
const connectionString = process.env.DATABASE;

const connection = mongoose.createConnection(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const UserSchema = new mongoose.Schema({
    username: String,
    hash: String,
    salt: String,
    admin: Boolean
});

connection.model('User', UserSchema);
module.exports = connection;
