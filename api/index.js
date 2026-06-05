require('dotenv').config();
const app = require('../backend/app');
const connectDB = require('../backend/config/db');

connectDB();

module.exports = app;
