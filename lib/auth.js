import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const LOGIN_LIMIT = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 دقيقة

// أقل مدة بين كل تحديث وتاني لبيانات المستخدم في الـ token من قاعدة البيانات
const TOKEN_REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 ساعة

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "البريد الإلكتروني", type: "email" },
        password: { label: "كلمة المرور", type: "password" },
      },
      async authorize(credentials, req) {
        const ip = getClientIp(req);
        const rateLimit = checkRateLimit("login", ip, LOGIN_LIMIT, LOGIN_WINDOW_MS);
        if (!rateLimit.allowed) {
          throw new Error(
            `محاولات دخول كتير. حاول تاني بعد ${Math.ceil(rateLimit.retryAfterSeconds / 60)} دقيقة`
          );
        }

        await dbConnect();
        const user = await User.findOne({ email: credentials.email }).select(
          "+password"
        );
        if (!user || !user.password) {
          throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        }
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) {
          throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        }
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      // عند الدخول بجوجل لأول مرة، أنشئ يوزر جديد في قاعدة البيانات
      if (account.provider === "google") {
        await dbConnect();
        let dbUser = await User.findOne({ email: user.email });
        if (!dbUser) {
          const isAdmin =
            process.env.ADMIN_EMAIL &&
            user.email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase();
          dbUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            role: isAdmin ? "admin" : "customer",
          });
        }
      }
      return true;
    },
    // بيتنفذ في كل طلب بيحتاج الـ session، فلازم يكون سريع قدر الإمكان.
    // بنستعلم قاعدة البيانات بس وقت تسجيل الدخول لأول مرة، أو لو عدّى
    // 24 ساعة من آخر تحديث — الباقي بيتقرأ من الـ token نفسه مباشرة.
    async jwt({ token, user, trigger }) {
      const now = Date.now();
      const isFirstSignIn = !!user;
      const isStale =
        !token.lastRefreshedAt || now - token.lastRefreshedAt > TOKEN_REFRESH_INTERVAL_MS;

      if (isFirstSignIn || isStale || trigger === "update") {
        await dbConnect();
        const email = user?.email || token.email;
        const dbUser = await User.findOne({ email }).select("name role");
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
          token.name = dbUser.name;
          token.lastRefreshedAt = now;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.name = token.name || session.user.name;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
