const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // force Node to use Google DNS

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ DB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;