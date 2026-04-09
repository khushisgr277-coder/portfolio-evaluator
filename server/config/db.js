const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Fallback to avoid crashing without DB if running without mongo for testing
    console.log('Running without DB fallback');
  }
};

module.exports = connectDB;
