# توحيد والنور 🕌

متجر إلكتروني شامل، مبني بـ **Next.js 16 (App Router) + React 19** و **MongoDB/Mongoose 9**، بتصميم عملي على غرار Noon (أخضر داكن + كريمي) باستخدام **Tailwind CSS v4** ومكونات **Preline UI v5**، مع لوحة تحكم أدمن كاملة.

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
- **Node.js 20.19 أو أحدث** (مطلوب لـ Mongoose 9 وNext.js 16 — تأكد من نسختك بـ `node --version`)
- حساب MongoDB (يُفضّل [MongoDB Atlas](https://www.mongodb.com/atlas) المجاني، لازم يكون Replica Set — الافتراضي في Atlas، مطلوب عشان الـ transactions)

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

ده هيضيف 13 قسم و25 منتج تجريبي، كل منتج بـ 3 صور حقيقية (من [LoremFlickr](https://loremflickr.com)) مرتبطة بنوع المنتج — تقدر تستبدلها لاحقاً بصور منتجاتك الفعلية من لوحة التحكم (حقل "روابط الصور"، افصل بين كل رابط وتاني بفاصلة).

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
  admin/          → لوحة التحكم (محمية بـ proxy.js)
  products/       → صفحات المتجر (قائمة + تفاصيل)
  cart, checkout, orders, login, register, account
  globals.css     → كل تصميم Tailwind v4 (ألوان، خطوط) — CSS-first، مفيش tailwind.config.js
components/
  Navbar/         → Navbar.jsx (حاوية) + Desktop/Mobile/SearchBar/CategoriesBar
  Sidebar/        → MobileSidebar.jsx (قائمة جانبية Preline، معزولة عن الـ Navbar) + AdminSidebar + SidebarCategories
  common/         → TNLogo وأي عنصر بصري عام
  ProductCard, CartContext, ProductForm... (مكونات مستقلة)
models/           → موديلات Mongoose (User, Product, Category, Order, Cart)
lib/
  services/       → منطق الأعمال (orderService: حساب الأسعار، خصم المخزون بـ transaction)
  validation.js   → Zod schemas
  authHelpers.js  → requireAuth / requireAdmin
  rateLimit.js    → in-memory rate limiter
scripts/seed.js   → بيانات تجريبية
proxy.js          → (بديل middleware.js في Next.js 16) حماية المسارات المحمية
```

### الـ Sidebar (Preline UI)

القائمة الجانبية (`components/Sidebar/MobileSidebar.jsx`) مكوّن مستقل تماماً عن الـ Navbar — بتتفعّل من أي زرار في أي مكان في الموقع عن طريق `data-hs-overlay="#hs-sidebar"` (مكتبة [Preline](https://preline.co) بتتولى الفتح/الإغلاق والـ animation). زرار القائمة موجود في الـ Navbar لكن المكوّن نفسه بيتعرض لوحده في `app/layout.js`.

شريط الأقسام في الـ Navbar (`CategoriesBar.jsx`) بقى `flex-wrap` بدل `overflow-x-auto` — يعني مفيش سكرول أفقي في الـ Navbar خالص.

## ملاحظات هامة قبل النشر (Production)

- فعّل webhook حقيقي من Stripe يشاور على `https://yourdomain.com/api/webhooks/stripe`
- غيّر `NEXTAUTH_URL` و`NEXT_PUBLIC_BASE_URL` لدومينك الحقيقي
- فعّل صلاحيات IP Whitelist في MongoDB Atlas
- ارفع الصور على خدمة تخزين سحابي (مثل Cloudinary) بدل روابط خارجية عشوائية

## الأمان وجودة الكود (تحديث)

- **خصم المخزون**: بيحصل تلقائياً وبشكل آمن (atomic transaction) عند تأكيد الطلب — COD وقت إنشاء الطلب، والدفع الإلكتروني وقت تأكيد الدفع عبر Webhook. لو المخزون غير كافٍ، الطلب بيتوقف برسالة واضحة بدل ما يسمح بمخزون سالب.
- **Rate Limiting**: محاولات تسجيل الدخول (5/15 دقيقة)، إنشاء حساب (3/ساعة)، والدفع الإلكتروني (10/15 دقيقة) — كلها محدودة لكل IP. الحل الحالي in-memory (مناسب لحجم استخدام متوسط)، وجاهز للترقية لـ Upstash Redis لاحقاً (اختياري، شوف `.env.example`).
- **Validation بـ Zod**: كل البيانات القادمة من المستخدم (تسجيل، عنوان شحن، تعديل الحساب) بتتفحص بدقة (رقم هاتف مصري صحيح، إيميل، كلمة مرور قوية) قبل ما توصل لقاعدة البيانات.
- **استجابات API موحّدة**: كل الأخطاء بترجع بنفس الشكل `{ success: false, message }`.
- **lib/services و lib/authHelpers**: منطق الطلبات والتحقق من الصلاحيات متجمّع في مكان واحد بدل ما يتكرر في كل route.


## نشر المشروع

المشروع جاهز للنشر مباشرة على [Vercel](https://vercel.com) (المنصة الرسمية لـ Next.js):

```bash
npx vercel
```

لا تنسَ إضافة نفس متغيرات `.env.local` في إعدادات المشروع على Vercel.
