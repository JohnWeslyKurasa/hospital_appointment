const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb+srv://johnkurasa_db_user:kn8bWmO8jUiOVGYi@cluster0.p5umgl4.mongodb.net/medicare?retryWrites=true&w=majority&appName=Cluster0';
    console.log('[MEDICARE DB] Connecting to Cloud MongoDB Atlas...');
    const conn = await mongoose.connect(connStr);
    console.log(`[MEDICARE DB SUCCESS] MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MEDICARE DB ERROR] Atlas Connection Failed: ${error.message}`);
  }
};

module.exports = connectDB;
