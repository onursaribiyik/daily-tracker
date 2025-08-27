import mongoose from "mongoose";
import Day from "./models/Day.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function checkStepCount() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    // Find all days
    const days = await Day.find({})
      .select("id stepCount waterIntake")
      .limit(10);

    console.log("\n📊 Days in database:");
    console.log("===================");

    days.forEach((day) => {
      console.log(`Day: ${day.id}`);
      console.log(`  stepCount: ${day.stepCount || "undefined"}`);
      console.log(`  waterIntake: ${day.waterIntake || "undefined"}`);
      console.log("---");
    });

    if (days.length === 0) {
      console.log("No days found in database");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("✅ MongoDB disconnected");
    process.exit(0);
  }
}

checkStepCount();
