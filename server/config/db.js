const mongoose = require('mongoose');

const DEFAULT_URI = 'mongodb+srv://johnkurasa_db_user:kn8bWmO8jUiOVGYi@cluster0.p5umgl4.mongodb.net/medicare?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || DEFAULT_URI;
    console.log('[MEDICARE DB] Connecting to Cloud MongoDB Atlas...');
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
    });
    console.log(`[MEDICARE DB SUCCESS] MongoDB Atlas Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MEDICARE DB ERROR] Atlas Connection Failed: ${error.message}`);
    // If process.env.MONGO_URI failed, attempt default fallback connection
    if (process.env.MONGO_URI && process.env.MONGO_URI !== DEFAULT_URI) {
      try {
        console.log('[MEDICARE DB] Retrying with hardcoded fallback Atlas URI...');
        const conn = await mongoose.connect(DEFAULT_URI, { serverSelectionTimeoutMS: 5000 });
        console.log(`[MEDICARE DB SUCCESS] Fallback Atlas Connected: ${conn.connection.host}`);
        return conn;
      } catch (fallbackError) {
        console.error(`[MEDICARE DB ERROR] Fallback Connection Failed: ${fallbackError.message}`);
      }
    }
    return null;
  }
};

module.exports = connectDB;
