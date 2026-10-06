"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });
    setLoading(false);
    if (res?.error) {
      setError(
        res.error === "CredentialsSignin"
          ? "البريد الإلكتروني أو كلمة المرور غير صحيحة"
          : res.error
      );
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-2xl text-brand-900 text-center mb-6">
        تسجيل الدخول
      </h1>

      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="w-full mb-4 flex items-center justify-center gap-2 rounded-full border border-sand-200 bg-white py-3 font-medium hover:bg-sand-100 transition"
      >
        <span>🔎</span> الدخول بحساب جوجل
      </button>

      <div className="flex items-center gap-3 my-4 text-xs text-ink/40">
        <span className="flex-1 h-px bg-sand-200" /> أو <span className="flex-1 h-px bg-sand-200" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          required
          type="email"
          placeholder="البريد الإلكتروني"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-lg border border-sand-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sale-600"
        />
        <input
          required
          type="password"
          placeholder="كلمة المرور"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full rounded-lg border border-sand-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sale-600"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-brand-900 py-3 font-semibold text-sand-50 hover:bg-brand-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "جارِ الدخول..." : "دخول"}
        </button>
      </form>

      <p className="text-center text-sm text-ink/60 mt-6">
        ليس لديك حساب؟{" "}
        <Link href="/register" className="text-brand-800 font-semibold">
          إنشاء حساب جديد
        </Link>
      </p>
    </div>
  );
}
