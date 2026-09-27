# توحيد والنور 🕌

متجر إلكتروني شامل، مبني بـ **Next.js 14 (App Router)** و **MongoDB/Mongoose**، بتصميم عملي على غرار Noon (أخضر داكن + كريمي)، مع لوحة تحكم أدمن كاملة.

## المميزات

- 🛍️ كتالوج منتجات مع تصنيفات، بحث، وفلترة
- 🛒 سلة تسوق (تُحفظ في المتصفح)
- 📦 نظام طلبات كامل مع تتبع الحالة
- 💵 الدفع عند الاستلام + 💳 الدفع الإلكتروني عبر Stripe
- 🔐 تسجيل دخول بالبريد/كلمة المرور أو بحساب Google (NextAuth)
- 🧑‍💼 لوحة تحكم أدمن: إدارة المنتجات، التصنيفات، الطلبات، وإحصائيات
- 🌙 تصميم عربي RTL بالكامل بخط Cairo

## التشغيل محلياً

### 1. المتطلبات
- Node.js 18+
- حساب MongoDB (يُفضّل [MongoDB Atlas](https://www.mongodb.com/atlas) المجاني)

### 2. التثبيت

```bash
npm install
```

### 3. إعداد المتغيرات البيئية

انسخ `.env.example` إلى `.env.local` واملأ القيم:

```bash
cp .env.example .env.local
```

- **MONGODB_URI**: رابط الاتصال بقاعدة بياناتك على MongoDB Atlas
- **NEXTAUTH_SECRET**: أي نص عشوائي طويل (يمكنك توليده بـ `openssl rand -base64 32`)
- **GOOGLE_CLIENT_ID / SECRET**: من [Google Cloud Console](https://console.cloud.google.com/apis/credentials) (اختياري، فقط لو عايز تفعّل الدخول بجوجل)
- **STRIPE_SECRET_KEY / WEBHOOK_SECRET / PUBLISHABLE_KEY**: من [Stripe Dashboard](https://dashboard.stripe.com/apikeys) (اختياري، فقط لو عايز تفعّل الدفع الإلكتروني — الموقع يشتغل بدونه بالدفع عند الاستلام فقط)
- **ADMIN_EMAIL**: أي إيميل تسجّل بيه هيتحول تلقائياً لحساب أدمن

### 4. تعبئة بيانات تجريبية (اختياري لكن مفيد للتجربة)

```bash
npm run seed
```

ده هيضيف 6 تصنيفات و10 منتجات تجريبية.

### 5. تشغيل السيرفر

```bash
npm run dev
```

افتح http://localhost:3000

### 6. الدخول كأدمن

1. سجّل حساب جديد بنفس الإيميل اللي حطيته في `ADMIN_EMAIL`
2. هتلاقي رابط "لوحة التحكم" ظاهر في القائمة العلوية
3. من لوحة التحكم تقدر تضيف/تعدّل منتجات وتصنيفات، وتتابع الطلبات

## هيكل المشروع

```
app/
  api/            → كل الـ API routes (منتجات، طلبات، دفع، مصادقة)
  admin/          → لوحة التحكم (محمية بـ middleware)
  products/       → صفحات المتجر (قائمة + تفاصيل)
  cart, checkout, orders, login, register
components/       → مكونات مشتركة (Navbar, ProductCard, CartContext...)
models/           → موديلات Mongoose (User, Product, Category, Order)
lib/               → الاتصال بقاعدة البيانات وإعدادات NextAuth
scripts/seed.js   → بيانات تجريبية
```

## ملاحظات هامة قبل النشر (Production)

- فعّل webhook حقيقي من Stripe يشاور على `https://yourdomain.com/api/webhooks/stripe`
- غيّر `NEXTAUTH_URL` و`NEXT_PUBLIC_BASE_URL` لدومينك الحقيقي
- فعّل صلاحيات IP Whitelist في MongoDB Atlas
- ارفع الصور على خدمة تخزين سحابي (مثل Cloudinary) بدل روابط خارجية عشوائية

## نشر المشروع

المشروع جاهز للنشر مباشرة على [Vercel](https://vercel.com) (المنصة الرسمية لـ Next.js):

```bash
npx vercel
```

لا تنسَ إضافة نفس متغيرات `.env.local` في إعدادات المشروع على Vercel.
