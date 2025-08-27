# Daily Tracker - Günlük Takip Uygulaması

Bu uygulama günlük yemek takibi, kalori hesaplama, aktivite kaydetme ve su tüketimi takibi için geliştirilmiş bir web uygulamasıdır.

## 🌟 Özellikler

- ✅ Kullanıcı kayıt/giriş sistemi
- 🍽️ Günlük öğün takibi (sabah, ara öğün, öğle, ara öğün, akşam)
- 📊 Kalori hesaplama (toplam ve öğün bazında)
- 🏃‍♂️ Aktivite kaydetme
- 💧 Su tüketimi takibi
- 👣 Adım sayısı kaydetme
- 📱 Mobil uyumlu tasarım
- 🌐 Çoklu dil desteği (Türkçe/İngilizce)
- 📈 Geçmiş günlere göz atma

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js (v16 veya üzeri)
- MongoDB

### Kurulum

1. Repository'yi klonlayın:
\`\`\`bash
git clone https://github.com/[kullanici-adi]/daily-tracker.git
cd daily-tracker
\`\`\`

2. Backend bağımlılıklarını yükleyin:
\`\`\`bash
cd backend
npm install
\`\`\`

3. Frontend bağımlılıklarını yükleyin:
\`\`\`bash
cd ../frontend
npm install
\`\`\`

4. MongoDB bağlantısını ayarlayın (backend/server.js dosyasında)

5. Backend'i başlatın:
\`\`\`bash
cd backend
npm start
\`\`\`

6. Frontend'i başlatın:
\`\`\`bash
cd frontend
npm run dev
\`\`\`

## 📱 Deployment Seçenekleri

### 1. Vercel (Önerilen - Ücretsiz)
Frontend için ideal, kolay deployment

### 2. Railway (Backend + Database)
MongoDB ile birlikte backend için ücretsiz plan

### 3. Render (Full-stack)
Hem frontend hem backend için ücretsiz seçenekler

### 4. Netlify + MongoDB Atlas
Frontend için Netlify, database için MongoDB Atlas

## 🔧 Teknolojiler

**Frontend:**
- React.js
- Vite
- React Router
- i18next (çoklu dil)

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

## 📂 Proje Yapısı

\`\`\`
daily-tracker/
├── backend/          # Node.js backend
│   ├── models/       # MongoDB modelleri
│   ├── routes/       # API rotaları
│   ├── middleware/   # Authentication middleware
│   └── server.js     # Ana server dosyası
├── frontend/         # React frontend
│   ├── src/
│   │   ├── components/  # React bileşenleri
│   │   ├── api.js      # API client
│   │   └── App.jsx     # Ana uygulama
│   └── public/
└── README.md
\`\`\`

## 🌐 Demo

[Demo linki buraya gelecek]

## 📄 Lisans

MIT License

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Pull request gönderin

## 📞 İletişim

Sorularınız için issue açabilirsiniz.
