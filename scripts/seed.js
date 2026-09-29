/**
 * سكريبت لتعبئة قاعدة البيانات ببيانات تجريبية
 * تشغيل: npm run seed
 */
require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  { name: String, slug: String, icon: String, image: String },
  { timestamps: true }
);
const ProductSchema = new mongoose.Schema(
  {
    name: String,
    slug: String,
    description: String,
    price: Number,
    compareAtPrice: Number,
    images: [String],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    stock: Number,
    isFeatured: Boolean,
    isActive: Boolean,
  },
  { timestamps: true }
);
ProductSchema.index({ name: "text", description: "text" });

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

const categories = [
  { name: "ملابس حريمي", icon: "👗", img: "women,fashion,clothing" },
  { name: "ملابس رجالي", icon: "👔", img: "men,fashion,clothing" },
  { name: "ملابس أطفال", icon: "🧸", img: "kids,clothing" },
  { name: "المطبخ والسفرة", icon: "🍳", img: "kitchen,cookware" },
  { name: "أجهزة منزلية", icon: "🔌", img: "homeappliances,electronics" },
  { name: "المنزل والمفروشات", icon: "🛋️", img: "livingroom,homedecor" },
  { name: "تكييفات ومبردات هواء", icon: "❄️", img: "airconditioner,cooling" },
  { name: "إلكترونيات", icon: "📱", img: "electronics,gadgets" },
  { name: "الأثاث والمراتب", icon: "🛏️", img: "furniture,bedroom" },
  { name: "الرياضة واللياقة", icon: "🏀", img: "sports,fitness" },
  { name: "أدوات مكتبية ومستلزمات المدارس", icon: "🖊️", img: "stationery,office" },
  { name: "الملابس الدينية والمناسبات", icon: "🎉", img: "celebration,gift" },
  { name: "حديثي الولادة", icon: "👶", img: "baby,newborn" },
];

function slugify(text) {
  return text.toString().trim().replace(/\s+/g, "-").replace(/[^\u0600-\u06FFa-zA-Z0-9-]/g, "");
}

// صور حقيقية (من LoremFlickr) مرتبطة بكلمات مفتاحية مطابقة للمنتج،
// مع "lock" ثابت لكل منتج عشان الصور متتغيرش في كل تحميل
function productImages(keyword, seedBase, count = 3) {
  const urls = [];
  for (let i = 0; i < count; i++) {
    urls.push(
      `https://loremflickr.com/800/800/${encodeURIComponent(keyword)}?lock=${seedBase + i}`
    );
  }
  return urls;
}

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("متصل بقاعدة البيانات...");

  await Category.deleteMany({});
  await Product.deleteMany({});

  const created = await Category.insertMany(
    categories.map((c, i) => ({
      name: c.name,
      icon: c.icon,
      slug: slugify(c.name),
      image: `https://loremflickr.com/600/400/${encodeURIComponent(c.img)}?lock=${5000 + i}`,
    }))
  );
  console.log(`تم إنشاء ${created.length} قسم بصور حقيقية`);

  const byName = Object.fromEntries(created.map((c) => [c.name, c._id]));

  const sampleProducts = [
    { name: "فستان صيفي قطن مطبع", price: 180, compareAtPrice: 250, category: byName["ملابس حريمي"], stock: 40, isFeatured: true, description: "فستان صيفي خفيف من القطن الطبيعي، مناسب للإطلالة اليومية.", img: "summer,dress,woman" },
    { name: "عباية سوداء تطريز أنيق", price: 220, category: byName["ملابس حريمي"], stock: 15, description: "عباية بقماش فاخر وتطريز يدوي أنيق.", img: "abaya,black,fashion" },
    { name: "قميص رجالي قطن كلاسيك", price: 110, compareAtPrice: 150, category: byName["ملابس رجالي"], stock: 60, isFeatured: true, description: "قميص رجالي مريح بقصة كلاسيكية مناسب للعمل والمناسبات.", img: "men,shirt,fashion" },
    { name: "بنطلون جينز رجالي سليم فيت", price: 140, category: byName["ملابس رجالي"], stock: 35, description: "جينز عالي الجودة بقصة عصرية مريحة.", img: "men,jeans,denim" },
    { name: "طقم ملابس أطفال قطن (3 قطع)", price: 95, compareAtPrice: 130, category: byName["ملابس أطفال"], stock: 50, isFeatured: true, description: "طقم قطن ناعم على البشرة، مناسب للعب واليوميات.", img: "kids,clothing,children" },
    { name: "طقم أواني طهي غير لاصقة 10 قطع", price: 420, compareAtPrice: 550, category: byName["المطبخ والسفرة"], stock: 20, isFeatured: true, description: "طقم أواني طهي عالي الجودة مقاوم للالتصاق.", img: "cookware,kitchen,pots" },
    { name: "خلاط كهربائي متعدد السرعات", price: 260, category: byName["المطبخ والسفرة"], stock: 25, description: "خلاط قوي بسعة 1.5 لتر وعدة سرعات.", img: "blender,kitchen,appliance" },
    { name: "غسالة أوتوماتيك 10 كجم", price: 3200, compareAtPrice: 3800, category: byName["أجهزة منزلية"], stock: 8, isFeatured: true, description: "غسالة فعالة بسعة كبيرة وبرامج غسيل متعددة.", img: "washing,machine,laundry" },
    { name: "مكنسة كهربائية بدون كيس", price: 650, category: byName["أجهزة منزلية"], stock: 18, description: "مكنسة قوية سهلة الاستخدام والتفريغ.", img: "vacuum,cleaner,home" },
    { name: "طقم كنب 3 مقاعد قماش", price: 2800, compareAtPrice: 3400, category: byName["المنزل والمفروشات"], stock: 6, isFeatured: true, description: "طقم كنب مريح بتصميم عصري وقماش متين.", img: "sofa,livingroom,furniture" },
    { name: "سجادة غرفة معيشة مقاس كبير", price: 380, category: byName["المنزل والمفروشات"], stock: 12, description: "سجادة ناعمة بتصميم عصري تناسب جميع الديكورات.", img: "carpet,rug,home" },
    { name: "مكيف سبليت 1.5 حصان", price: 5400, compareAtPrice: 6200, category: byName["تكييفات ومبردات هواء"], stock: 10, isFeatured: true, description: "مكيف موفر للطاقة بتبريد سريع.", img: "airconditioner,cooling" },
    { name: "مروحة أرضية 18 بوصة", price: 220, category: byName["تكييفات ومبردات هواء"], stock: 30, description: "مروحة قوية بثلاث سرعات وتصميم آمن.", img: "electricfan,fan" },
    { name: "سماعات لاسلكية بخاصية عزل الضوضاء", price: 850, compareAtPrice: 1100, category: byName["إلكترونيات"], stock: 22, isFeatured: true, description: "صوت نقي وعزل ضوضاء فعال مع بطارية تدوم طويلاً.", img: "headphones,wireless,tech" },
    { name: "شاحن متنقل 20000 مللي أمبير", price: 180, category: byName["إلكترونيات"], stock: 45, description: "شحن سريع لجميع الأجهزة الذكية.", img: "powerbank,charger,tech" },
    { name: "سرير مزدوج خشب زان مع مرتبة", price: 3100, compareAtPrice: 3700, category: byName["الأثاث والمراتب"], stock: 5, isFeatured: true, description: "سرير متين مع مرتبة طبية مريحة.", img: "bed,bedroom,furniture" },
    { name: "مرتبة طبية مقاس 160 سم", price: 950, category: byName["الأثاث والمراتب"], stock: 14, description: "مرتبة تدعم العمود الفقري وتوزع الوزن بالتساوي.", img: "mattress,bed" },
    { name: "دراجة تمارين منزلية", price: 1200, compareAtPrice: 1500, category: byName["الرياضة واللياقة"], stock: 9, isFeatured: true, description: "دراجة ثابتة لتمارين القلب في المنزل.", img: "exercisebike,fitness,gym" },
    { name: "طقم أوزان حديد قابل للتعديل", price: 340, category: byName["الرياضة واللياقة"], stock: 20, description: "أوزان متعددة الاستخدامات لتمارين القوة.", img: "dumbbells,gym,fitness" },
    { name: "حقيبة مدرسية ظهر متعددة الجيوب", price: 130, compareAtPrice: 165, category: byName["أدوات مكتبية ومستلزمات المدارس"], stock: 40, isFeatured: true, description: "حقيبة مريحة ومتينة مناسبة لجميع المراحل الدراسية.", img: "backpack,schoolbag" },
    { name: "طقم أدوات مكتبية 12 قطعة", price: 60, category: byName["أدوات مكتبية ومستلزمات المدارس"], stock: 55, description: "طقم متكامل يشمل أقلام، مسطرة، ومقص.", img: "stationery,office,school" },
    { name: "سجادة صلاة مخملية فاخرة", price: 89, category: byName["الملابس الدينية والمناسبات"], stock: 30, description: "سجادة صلاة ناعمة الملمس بتصميم أنيق.", img: "prayer,rug,islamic" },
    { name: "طقم هدايا مناسبات فاخر", price: 220, compareAtPrice: 280, category: byName["الملابس الدينية والمناسبات"], stock: 10, isFeatured: true, description: "طقم هدايا بتغليف فاخر مناسب لجميع المناسبات.", img: "giftbox,gift,present" },
    { name: "طقم ملابس مولود جديد (5 قطع)", price: 150, category: byName["حديثي الولادة"], stock: 25, description: "طقم قطن ناعم وآمن على بشرة الأطفال الرضّع.", img: "baby,newborn,clothing" },
    { name: "عربة أطفال قابلة للطي", price: 980, compareAtPrice: 1200, category: byName["حديثي الولادة"], stock: 7, isFeatured: true, description: "عربة خفيفة وسهلة الطي والنقل.", img: "stroller,baby,pram" },
  ];

  const createdProducts = await Product.insertMany(
    sampleProducts.map((p, index) => {
      const { img, ...rest } = p;
      return {
        ...rest,
        slug: slugify(p.name) + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        images: productImages(img, index * 10, 3),
        isActive: true,
      };
    })
  );
  console.log(`تم إنشاء ${createdProducts.length} منتج بصور حقيقية`);

  console.log("اكتملت التعبئة بنجاح ✓");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
