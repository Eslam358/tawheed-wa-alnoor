"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-2xl text-brand-900 text-center mb-6">
        إنشاء حساب جديد
      </h1>

      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="w-full mb-4 flex items-center justify-center gap-2 rounded-full border border-sand-200 bg-white py-3 font-medium hover:bg-sand-100 transition"
      >
        <span>🔎</span> التسجيل بحساب جوجل
      </button>

      <div className="flex items-center gap-3 my-4 text-xs text-ink/40">
        <span className="flex-1 h-px bg-sand-200" /> أو <span className="flex-1 h-px bg-sand-200" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          required
          placeholder="الاسم بالكامل"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-lg border border-sand-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sale-600"
        />
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
          placeholder="كلمة المرور (6 أحرف على الأقل)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full rounded-lg border border-sand-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sale-600"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-brand-900 py-3 font-semibold text-sand-50 hover:bg-brand-800 transition disabled:opacity-60"
        >
          {loading ? "جارِ الإنشاء..." : "إنشاء الحساب"}
        </button>
      </form>

      <p className="text-center text-sm text-ink/60 mt-6">
        لديك حساب بالفعل؟{" "}
        <Link href="/login" className="text-brand-800 font-semibold">
          تسجيل الدخول
        </Link>
      </p>
    </div>
  );
}
