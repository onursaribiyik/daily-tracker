// Demo API - JSONbin.io kullanacak basit backend
const DEMO_MODE = true;
const JSONBIN_URL = "https://api.jsonbin.io/v3/b";
const JSONBIN_API_KEY = "$2a$10$..."; // JSONbin.io'dan alacağınız

// Demo kullanıcı verisi
const DEMO_USER = {
  id: "demo-user",
  name: "Demo",
  surname: "Kullanıcı", 
  email: "demo@example.com",
  gender: "Erkek",
  weight: 70,
  height: 175,
  age: 25
};

// Demo günlük verisi
const createDemoDay = (id) => ({
  id,
  meals: {
    sabah: ["Ekmek 150 kcal", "Peynir 100 kcal"],
    araOgun1: ["Elma 50 kcal"],
    oglen: ["Pilav 200 kcal", "Tavuk 150 kcal"],
    araOgun2: ["Çay 5 kcal"],
    aksam: ["Makarna 250 kcal", "Salata 30 kcal"]
  },
  activities: ["30 dakika yürüyüş"],
  waterIntake: 8,
  stepCount: 5000,
  totalCalories: 935
});

// API URL'ini kontrol et ve demo mode'u belirle
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const IS_DEMO = !API_URL.includes("localhost") && !API_URL.includes("railway") && !API_URL.includes("render");

console.log("API URL:", API_URL);
console.log("Demo Mode:", IS_DEMO);
