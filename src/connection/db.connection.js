const mongoose = require("mongoose");

module.exports.connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected successfully to the database 🏡🏡🏡");
  } catch (err) {
    console.error("Database connection error:", err);
  }
};
