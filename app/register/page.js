"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/lib/validation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validateField(field, value) {
    const fieldSchema = registerSchema.shape[field];
    const result = fieldSchema.safeParse(value);
    setFieldErrors((prev) => ({
      ...prev,
      [field]: result.success ? "" : result.error.issues[0].message,
    }));
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      const errors = {};
      for (const issue of parsed.error.issues) {
        errors[issue.path[0]] = issue.message;
      }
      setFieldErrors(errors);
      setError("في بيانات محتاجة تصحيح قبل ما نكمّل");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

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

      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        <div>
          <label htmlFor="name" className="block text-xs text-ink/50 mb-1">
            الاسم بالكامل
          </label>
          <input
            id="name"
            required
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            onBlur={(e) => validateField("name", e.target.value)}
            aria-invalid={!!fieldErrors.name}
            className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sale-600 ${
              fieldErrors.name ? "border-red-400" : "border-sand-200"
            }`}
          />
          {fieldErrors.name && <p className="text-red-600 text-xs mt-1">{fieldErrors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-xs text-ink/50 mb-1">
            البريد الإلكتروني
          </label>
          <input
            id="email"
            required
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            onBlur={(e) => validateField("email", e.target.value)}
            aria-invalid={!!fieldErrors.email}
            className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sale-600 ${
              fieldErrors.email ? "border-red-400" : "border-sand-200"
            }`}
          />
          {fieldErrors.email && <p className="text-red-600 text-xs mt-1">{fieldErrors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-xs text-ink/50 mb-1">
            كلمة المرور
          </label>
          <input
            id="password"
            required
            type="password"
            placeholder="8 أحرف على الأقل، فيها رقم وحرف"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            onBlur={(e) => validateField("password", e.target.value)}
            aria-invalid={!!fieldErrors.password}
            className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sale-600 ${
              fieldErrors.password ? "border-red-400" : "border-sand-200"
            }`}
          />
          {fieldErrors.password && <p className="text-red-600 text-xs mt-1">{fieldErrors.password}</p>}
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="w-full rounded-full bg-brand-900 py-3 font-semibold text-sand-50 hover:bg-brand-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
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
