import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

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
      async authorize(credentials) {
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
    async jwt({ token, user }) {
      await dbConnect();
      if (user) {
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
        }
      } else if (token.email) {
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
