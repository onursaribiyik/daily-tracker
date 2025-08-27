import mongoose from "mongoose";

const daySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      // unique kaldırıldı çünkü farklı kullanıcılar aynı günü kullanabilir
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    meals: {
      sabah: [
        {
          type: String,
          trim: true,
        },
      ],
      araOgun1: [
        {
          type: String,
          trim: true,
        },
      ],
      oglen: [
        {
          type: String,
          trim: true,
        },
      ],
      araOgun2: [
        {
          type: String,
          trim: true,
        },
      ],
      aksam: [
        {
          type: String,
          trim: true,
        },
      ],
    },
    activities: [
      {
        type: String,
        trim: true,
      },
    ],
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    weight: {
      type: Number,
      min: 0,
      max: 1000,
    },
    waterIntake: {
      type: Number,
      default: 0,
      min: 0,
      max: 10000,
    },
    stepCount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100000,
    },
    totalCalories: {
      type: Number,
      default: 0,
      min: 0,
      max: 10000,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
daySchema.index({ userId: 1, id: -1 });

// Composite unique index - aynı kullanıcı aynı günü iki kez yaratamaz
daySchema.index({ userId: 1, id: 1 }, { unique: true });

// Calculate total calories from meals
daySchema.virtual("calculatedCalories").get(function () {
  let total = 0;
  if (this.meals) {
    Object.values(this.meals).forEach((mealArray) => {
      if (Array.isArray(mealArray)) {
        mealArray.forEach((item) => {
          const match = item.match(/(\d+)\s*kcal/i);
          if (match) {
            total += parseInt(match[1], 10);
          }
        });
      }
    });
  }
  return total;
});

// Ensure virtual fields are serialized
daySchema.set("toJSON", {
  virtuals: true,
});

export default mongoose.model("Day", daySchema);
