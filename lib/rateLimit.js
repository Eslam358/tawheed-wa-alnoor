/**
 * Rate limiter بسيط في الذاكرة (in-memory)، بيحسب عدد المحاولات لكل IP
 * لكل route على حدة، خلال نافذة زمنية معينة.
 *
 * ⚠️ ملحوظة مهمة: في بيئة serverless (زي Vercel) كل instance ليه ذاكرته
 * الخاصة، فالعداد ممكن يتصفّر لو Vercel شغّل instance جديد أو بعد فترة خمول.
 * يعني الحماية دي "أفضل من لا شيء" مش حماية مضمونة 100%. لو حابب حماية
 * أقوى وثابتة عبر كل الـ instances، ترقية مستقبلية بـ Upstash Redis
 * (@upstash/ratelimit) هي الحل الأمثل — الكود جاهز لدعمها لاحقاً
 * (شوف .env.example لمتغيرات Upstash الاختيارية).
 */

const buckets = new Map();

// تنظيف دوري للـ buckets القديمة عشان الذاكرة متكبرش بلا حدود
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupOldBuckets() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, bucket] of buckets.entries()) {
    if (now - bucket.windowStart > bucket.windowMs) {
      buckets.delete(key);
    }
  }
}

/**
 * @param {string} routeKey - معرّف الـ route (مثلاً "register" أو "login")
 * @param {string} identifier - معرّف الطالب (عادةً IP)
 * @param {number} limit - أقصى عدد محاولات مسموح بها
 * @param {number} windowMs - طول النافذة الزمنية بالميلي ثانية
 * @returns {{ allowed: boolean, remaining: number, retryAfterSeconds: number }}
 */
export function checkRateLimit(routeKey, identifier, limit, windowMs) {
  cleanupOldBuckets();

  const key = `${routeKey}:${identifier}`;
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.windowStart > windowMs) {
    buckets.set(key, { count: 1, windowStart: now, windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    const retryAfterSeconds = Math.ceil((bucket.windowStart + windowMs - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count, retryAfterSeconds: 0 };
}

/**
 * يستخرج IP الطالب من الـ request، مع مراعاة إن Vercel بيمرر IP الحقيقي
 * عبر x-forwarded-for.
 */
export function getClientIp(request) {
  const forwardedFor = request.headers.get?.("x-forwarded-for") || request.headers["x-forwarded-for"];
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = request.headers.get?.("x-real-ip") || request.headers["x-real-ip"];
  return realIp || "unknown";
}
