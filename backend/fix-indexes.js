import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function fixIndexes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    const db = mongoose.connection.db;
    const collection = db.collection("days");

    // Mevcut index'leri listele
    const indexes = await collection.indexes();
    console.log("Current indexes:", indexes);

    // Eski id_1 unique index'ini sil
    try {
      await collection.dropIndex("id_1");
      console.log("✅ Dropped old id_1 index");
    } catch (error) {
      console.log("Index id_1 doesn't exist or already dropped");
    }

    // Yeni composite unique index'i oluştur (userId + id)
    await collection.createIndex({ userId: 1, id: 1 }, { unique: true });
    console.log("✅ Created new composite unique index (userId + id)");

    // Performance index'i oluştur
    await collection.createIndex({ userId: 1, id: -1 });
    console.log("✅ Created performance index (userId + id desc)");

    console.log("✅ Index operations completed successfully");
  } catch (error) {
    console.error("❌ Error fixing indexes:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

fixIndexes();
