export const getTotalCaloriesFromMeals = (meals, mealPhotos) => {
  let total = 0;
  if (!meals) return 0;
  Object.values(meals).forEach((arr) => {
    (arr || []).forEach((txt) => {
      const kcalMatch = txt.match(/(\d+)\s*kcal/i);
      if (kcalMatch) total += parseInt(kcalMatch[1], 10);
    });
  });
  // Fotoğraflardan gelen kalorileri ekle
  if (mealPhotos) {
    Object.values(mealPhotos).forEach((photos) => {
      (photos || []).forEach((photo) => {
        total += parseInt(photo.calories) || 0;
      });
    });
  }
  return total;
};

export const isoToday = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const today = `${year}-${month}-${day}`;
  return today;
};

export const emptyDay = (id) => ({
  id,
  meals: {
    sabah: [],
    araOgun1: [],
    oglen: [],
    araOgun2: [],
    aksam: [],
  },
  activities: [],
  waterIntake: 0,
  stepCount: 0,
  totalCalories: 0,
});

export const createDemoDay = (id) => ({
  id,
  userId: "demo-user",
  meals: {
    sabah: ["Ekmek 150 kcal", "Peynir 100 kcal"],
    araOgun1: ["Elma 50 kcal"],
    oglen: ["Pilav 200 kcal", "Tavuk 150 kcal"],
    araOgun2: ["Çay 5 kcal"],
    aksam: ["Makarna 250 kcal", "Salata 30 kcal"],
  },
  activities: ["30 dakika yürüyüş"],
  waterIntake: 8,
  stepCount: 5000,
  totalCalories: 935,
});
