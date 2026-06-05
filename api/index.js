const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
dns.setDefaultResultOrder('ipv4first');

require('dotenv').config();
const app = require('../backend/app');
const connectDB = require('../backend/config/db');

connectDB();

module.exports = app;
