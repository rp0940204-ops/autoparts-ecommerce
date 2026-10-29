const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User");

async function run() {
  const email = process.argv[2];

  if (!email) {
    console.log("Usage: node makeAdmin.js your-email@example.com");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOneAndUpdate(
      { email },
      { isAdmin: true },
      { new: true }
    );
    if (user) {
      console.log(user.email + " is now an admin");
    } else {
      console.log("No user found with that email");
    }
  } catch (err) {
    console.log("Error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

run();