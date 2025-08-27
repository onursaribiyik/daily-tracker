import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  tr: {
    translation: {
      // Genel
      appTitle: "Daily Tracker",
      loading: "Yükleniyor...",
      today: "Bugün",
      allDays: "Tüm Günler",
      caloriesInfo: "Kaç Kalori?",
      recipes: "Yemek Tarifleri",
      user: "Kullanıcı",
      save: "Kaydet",
      saving: "Kaydediliyor...",
      edit: "Düzenle",
      cancel: "İptal",
      delete: "Sil",
      date: "Tarih",
      welcome: "Hoş geldin, {{name}}!",
      footer: "Made with ❤️ – React + JSON Server",

      // Auth
      login: "Giriş Yap",
      register: "Kayıt Ol",
      username: "Kullanıcı Adı",
      password: "Şifre",
      name: "Ad",
      surname: "Soyad",
      gender: "Cinsiyet",
      weight: "Kilo (kg)",
      height: "Boy (cm)",
      age: "Yaş",
      male: "Erkek",
      female: "Kadın",
      selectGender: "Seçiniz",
      noAccount: "Hesabınız yok mu?",
      hasAccount: "Zaten hesabınız var mı?",
      fillAllFields: "Lütfen tüm alanları doldurun!",
      wrongCredentials: "Kullanıcı adı veya şifre hatalı!",
      usernameExists: "Bu kullanıcı adı zaten mevcut!",
      authError: "Bir hata oluştu. Lütfen tekrar deneyin.",

      // Meals
      meals: "Öğünler",
      breakfast: "Sabah",
      snack: "Ara Öğün",
      lunch: "Öğlen",
      dinner: "Akşam",
      addFood: "Yiyecek ekle...",

      // Activities
      activities: {
        title: "Günlük Aktiviteler",
        add: "Ekle",
        placeholder: "Aktivite ekle...",
        noActivity: "Henüz aktivite eklenmemiş",
      },
      dailyActivities: "Adım Sayım",
      addActivity: "Aktivite ekle...",
      noActivity: "Henüz aktivite eklenmemiş",
      stepCount: "Adım Sayım",
      stepsLabel: "Adım Sayacı",
      steps: "adım",

      // Water Intake
      dailyWaterIntake: "Su İçme Miktarım",
      waterIntake: "Su Tüketimi",
      waterAmount: "Su miktarı (ml)",
      waterConsumed: "💧 {{amount}} ml içtin",
      waterTarget: "({{percentage}}% / Günlük hedef: 2.5L)",
      water: "Su Tüketimi",

      // Foods
      noFood: "Henüz yiyecek eklenmemiş",

      // Calories
      totalCalories: "Günlük Aldığım Toplam Kalori",
      caloriesAmount: "Kalori miktarı (kcal)",

      // Calories Info Page
      whatIsCalorie: "Kalori Nedir?",
      calorieDefinition:
        "Kalori, vücudumuzun enerji ihtiyacını karşılamak için besinlerden aldığı enerji birimidir. 1 kalori = 4.18 joule enerji demektir. Günlük aktivitelerimiz için gereken enerjinin ölçümüdür.",

      calorieDeficit: "Kalori Açığı Nedir?",
      calorieDeficitDefinition:
        "Kalori açığı, aldığınız kaloriden daha fazla kalori yakmanız durumudur. Kilo vermek için günlük 300-500 kalori açığı oluşturmanız gerekir. Bu sağlıklı kilo verme hızını destekler.",

      howManyCalories: "Kaç Kalori Almalıyım?",
      howManyCaloriesDefinition:
        "Günlük kalori ihtiyacınız yaş, cinsiyet, kilo, boy ve aktivite seviyenize göre değişir. Ortalama bir yetişkin için günde 1800-2500 kalori arası normaldir. Kişiselleştirilmiş hesaplama için uzman desteği alın.",

      healthyTips: "Sağlıklı Kalori Takibi İpuçları",
      tip1: "🥗 Sebze ve meyveleri bol tüketin (düşük kalori, yüksek vitamin)",
      tip2: "💧 Günde en az 2.5L su için (metabolizmayı hızlandırır)",
      tip3: "🏃‍♂️ Düzenli egzersiz yapın (kalori yakımını artırır)",
      tip4: "😴 Kaliteli uyku alın (hormon dengesini korur)",

      learnFoodCalories: "Besinler Kaç Kalori? Hemen Öğren",

      // Recipes Page
      healthyRecipes: "Sağlıklı Tarifler",
      healthyRecipesDescription:
        "Besleyici ve lezzetli yemekler hazırlamak sağlıklı yaşamın temelidir. Taze malzemeler kullanarak, az yağlı pişirme yöntemleri tercih ederek hem sağlığınızı koruyabilir hem de damak tadınıza hitap eden yemekler yapabilirsiniz.",

      cookingTips: "Pişirme İpuçları",
      cookingTipsDescription:
        "Yemekleri buharla pişirmek, ızgara yapmak veya fırında az yağla pişirmek kaloriyi düşürür. Baharatları bol kullanmak hem lezzet katlar hem de metabolizmayı hızlandırır. Porsiyon kontrolü yapmayı unutmayın.",

      mealPlanning: "Öğün Planlaması",
      mealPlanningDescription:
        "Haftalık yemek planı yapmak hem sağlıklı beslenmenizi destekler hem de zaman tasarrufu sağlar. Market alışverişinden önce liste hazırlayın ve mevsim sebze-meyvelerini tercih edin.",

      recipeTips: "Tarif İpuçları",
      recipeTip1: "🍳 Az yağda pişirme yöntemlerini tercih edin",
      recipeTip2: "🌿 Taze baharat ve otlar kullanın",
      recipeTip3: "🥕 Mevsim sebzelerini tercih edin",
      recipeTip4: "⚖️ Porsiyon kontrolü yapmaya dikkat edin",

      discoverRecipes: "Nefis Tarifleri Keşfet",

      // User Profile
      userProfile: "Kullanıcı Profili",
      logout: "Çıkış Yap",
      personalInfo: "Kişisel Bilgiler",
      physicalInfo: "Fiziksel Bilgiler",
      fullName: "Ad Soyad:",
      bmi: "BMI:",
      underweight: "Zayıf",
      normal: "Normal",
      overweight: "Fazla Kilolu",
      obese: "Obez",

      // Pagination
      showing: "Gösteriliyor",
      days: "gün",
      previous: "Önceki",
      next: "Sonraki",
    },
  },
  en: {
    translation: {
      // General
      appTitle: "Daily Tracker",
      loading: "Loading...",
      today: "Today",
      allDays: "All Days",
      caloriesInfo: "Calories?",
      recipes: "Recipes",
      user: "User",
      save: "Save",
      saving: "Saving...",
      edit: "Edit",
      cancel: "Cancel",
      delete: "Delete",
      date: "Date",
      welcome: "Welcome, {{name}}!",
      footer: "Made with ❤️ – React + JSON Server",

      // Auth
      login: "Login",
      register: "Register",
      username: "Username",
      password: "Password",
      name: "Name",
      surname: "Surname",
      gender: "Gender",
      weight: "Weight (kg)",
      height: "Height (cm)",
      age: "Age",
      male: "Male",
      female: "Female",
      selectGender: "Select",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      fillAllFields: "Please fill all fields!",
      wrongCredentials: "Wrong username or password!",
      usernameExists: "This username already exists!",
      authError: "An error occurred. Please try again.",

      // Meals
      meals: "Meals",
      breakfast: "Breakfast",
      snack: "Snack",
      lunch: "Lunch",
      dinner: "Dinner",
      addFood: "Add food...",

      // Activities
      activities: {
        title: "Daily Activities",
        add: "Add",
        placeholder: "Add activity...",
        noActivity: "No activities added yet",
      },
      dailyActivities: "Step Count",
      addActivity: "Add activity...",
      noActivity: "No activities added yet",
      stepCount: "Step Count",
      steps: "steps",
      stepsLabel: "Steps Count",

      // Water Intake
      dailyWaterIntake: "Water Intake",
      waterIntake: "Water Intake",
      waterAmount: "Water amount (ml)",
      waterConsumed: "💧 You drank {{amount}} ml",
      waterTarget: "({{percentage}}% / Daily target: 2.5L)",
      water: "Water Intake",

      // Foods
      noFood: "No food added yet",

      // Calories
      totalCalories: "My Daily Total Calories Intake",
      caloriesAmount: "Calories amount (kcal)",

      // Calories Info Page
      whatIsCalorie: "What is a Calorie?",
      calorieDefinition:
        "A calorie is a unit of energy that our body gets from food to meet its energy needs. 1 calorie = 4.18 joules of energy. It's the measurement of energy required for our daily activities.",

      calorieDeficit: "What is Calorie Deficit?",
      calorieDeficitDefinition:
        "Calorie deficit occurs when you burn more calories than you consume. To lose weight healthily, you need to create a daily deficit of 300-500 calories. This supports a healthy weight loss rate.",

      howManyCalories: "How Many Calories Should I Eat?",
      howManyCaloriesDefinition:
        "Your daily calorie needs vary based on age, gender, weight, height, and activity level. For an average adult, 1800-2500 calories per day is normal. Consult an expert for personalized calculations.",

      healthyTips: "Healthy Calorie Tracking Tips",
      tip1: "🥗 Eat plenty of fruits and vegetables (low calorie, high vitamins)",
      tip2: "💧 Drink at least 2.5L water daily (boosts metabolism)",
      tip3: "🏃‍♂️ Exercise regularly (increases calorie burn)",
      tip4: "😴 Get quality sleep (maintains hormone balance)",

      learnFoodCalories: "Learn Food Calories Now",

      // Recipes Page
      healthyRecipes: "Healthy Recipes",
      healthyRecipesDescription:
        "Preparing nutritious and delicious meals is the foundation of healthy living. By using fresh ingredients and choosing low-fat cooking methods, you can both protect your health and create dishes that appeal to your taste.",

      cookingTips: "Cooking Tips",
      cookingTipsDescription:
        "Steaming, grilling, or baking with little oil reduces calories. Using plenty of spices adds flavor and boosts metabolism. Don't forget to practice portion control.",

      mealPlanning: "Meal Planning",
      mealPlanningDescription:
        "Creating weekly meal plans supports healthy eating and saves time. Prepare a shopping list before going to the market and prefer seasonal fruits and vegetables.",

      recipeTips: "Recipe Tips",
      recipeTip1: "🍳 Choose low-fat cooking methods",
      recipeTip2: "🌿 Use fresh spices and herbs",
      recipeTip3: "🥕 Prefer seasonal vegetables",
      recipeTip4: "⚖️ Pay attention to portion control",

      discoverRecipes: "Discover Delicious Recipes",

      // User Profile
      userProfile: "User Profile",
      logout: "Logout",
      personalInfo: "Personal Information",
      physicalInfo: "Physical Information",
      fullName: "Full Name:",
      bmi: "BMI:",
      underweight: "Underweight",
      normal: "Normal",
      overweight: "Overweight",
      obese: "Obese",

      // Pagination
      showing: "Showing",
      days: "days",
      previous: "Previous",
      next: "Next",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("language") || "tr", // Varsayılan dil
  fallbackLng: "tr",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
