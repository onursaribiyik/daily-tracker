import mongoose from "mongoose";
import Day from "./models/Day.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function migrateStepCount() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    // Update all days that don't have stepCount field
    const result = await Day.updateMany(
      { stepCount: { $exists: false } },
      { $set: { stepCount: 0 } }
    );

    console.log(`✅ Updated ${result.modifiedCount} days with stepCount: 0`);

    // Verify the update
    const daysAfter = await Day.find({})
      .select("id stepCount waterIntake")
      .limit(10);

    console.log("\n📊 Days after migration:");
    console.log("========================");

    daysAfter.forEach((day) => {
      console.log(`Day: ${day.id}`);
      console.log(`  stepCount: ${day.stepCount}`);
      console.log(`  waterIntake: ${day.waterIntake}`);
      console.log("---");
    });
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("✅ MongoDB disconnected");
    process.exit(0);
  }
}

migrateStepCount();
