import express from "express";
import Day from "../models/Day.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get all days for authenticated user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const days = await Day.find({ userId: req.user._id })
      .sort({ id: -1 }) // Sort by date descending
      .lean();

    // Fix undefined stepCount values
    const fixedDays = days.map((day) => ({
      ...day,
      stepCount: day.stepCount ?? 0,
      waterIntake: day.waterIntake ?? 0,
    }));

    res.json(fixedDays);
  } catch (error) {
    console.error("Get days error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get specific day
router.get("/:dayId", authenticateToken, async (req, res) => {
  try {
    const day = await Day.findOne({
      id: req.params.dayId,
      userId: req.user._id,
    }).lean();

    if (!day) {
      return res.status(404).json({ message: "Day not found" });
    }

    res.json(day);
  } catch (error) {
    console.error("Get day error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create new day
router.post("/", authenticateToken, async (req, res) => {
  try {
    const dayData = {
      ...req.body,
      userId: req.user._id,
    };

    // Check if day already exists
    const existingDay = await Day.findOne({
      id: dayData.id,
      userId: req.user._id,
    });

    if (existingDay) {
      return res.status(400).json({ message: "Day already exists" });
    }

    const day = new Day(dayData);

    await day.save();

    res.status(201).json(day);
  } catch (error) {
    console.error("Create day error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update day
router.put("/:dayId", authenticateToken, async (req, res) => {
  try {
    const day = await Day.findOneAndUpdate(
      {
        id: req.params.dayId,
        userId: req.user._id,
      },
      { ...req.body, userId: req.user._id },
      { new: true, upsert: true }
    );

    res.json(day);
  } catch (error) {
    console.error("Update day error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete day
router.delete("/:dayId", authenticateToken, async (req, res) => {
  try {
    const day = await Day.findOneAndDelete({
      id: req.params.dayId,
      userId: req.user._id,
    });

    if (!day) {
      return res.status(404).json({ message: "Day not found" });
    }

    res.json({ message: "Day deleted successfully" });
  } catch (error) {
    console.error("Delete day error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add photo to meal
router.post("/:dayId/photos/:mealType", authenticateToken, async (req, res) => {
  try {
    const { dayId, mealType } = req.params;
    const { photo } = req.body; // { id, url, calories }

    const validMeals = ["sabah", "araOgun1", "oglen", "araOgun2", "aksam"];
    if (!validMeals.includes(mealType)) {
      return res.status(400).json({ message: "Invalid meal type" });
    }

    const day = await Day.findOne({
      id: dayId,
      userId: req.user._id,
    });

    if (!day) {
      return res.status(404).json({ message: "Day not found" });
    }

    if (!day.mealPhotos) {
      day.mealPhotos = {};
    }
    if (!day.mealPhotos[mealType]) {
      day.mealPhotos[mealType] = [];
    }

    day.mealPhotos[mealType].push({
      id: photo.id || Date.now().toString(),
      url: photo.url,
      calories: photo.calories || 0,
      timestamp: new Date(),
    });

    await day.save();

    res.json(day);
  } catch (error) {
    console.error("Add photo error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete photo from meal
router.delete("/:dayId/photos/:mealType/:photoId", authenticateToken, async (req, res) => {
  try {
    const { dayId, mealType, photoId } = req.params;

    const validMeals = ["sabah", "araOgun1", "oglen", "araOgun2", "aksam"];
    if (!validMeals.includes(mealType)) {
      return res.status(400).json({ message: "Invalid meal type" });
    }

    const day = await Day.findOne({
      id: dayId,
      userId: req.user._id,
    });

    if (!day) {
      return res.status(404).json({ message: "Day not found" });
    }

    if (day.mealPhotos && day.mealPhotos[mealType]) {
      day.mealPhotos[mealType] = day.mealPhotos[mealType].filter(
        (photo) => photo.id !== photoId
      );
    }

    await day.save();

    res.json(day);
  } catch (error) {
    console.error("Delete photo error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
