const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/student_task_manager';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️ MongoDB Connection Notice: ${error.message}`);
    console.log(`ℹ️ Server will continue running. Ensure MONGO_URI in server/.env has a valid MongoDB connection string.`);
  }
};

module.exports = connectDB;
