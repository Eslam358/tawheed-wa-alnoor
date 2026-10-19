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

 
      {/* *********** */}
            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full mb-4 flex items-center justify-center gap-2 rounded-full border border-sand-200 bg-white py-3 font-medium hover:bg-sand-100 transition"
            >
              <span className="w-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" id="google"><path fill="#fbbb00" d="M113.47 309.408 95.648 375.94l-65.139 1.378C11.042 341.211 0 299.9 0 256c0-42.451 10.324-82.483 28.624-117.732h.014L86.63 148.9l25.404 57.644c-5.317 15.501-8.215 32.141-8.215 49.456.002 18.792 3.406 36.797 9.651 53.408z"></path><path fill="#518ef8" d="M507.527 208.176C510.467 223.662 512 239.655 512 256c0 18.328-1.927 36.206-5.598 53.451-12.462 58.683-45.025 109.925-90.134 146.187l-.014-.014-73.044-3.727-10.338-64.535c29.932-17.554 53.324-45.025 65.646-77.911h-136.89V208.176h245.899z"></path><path fill="#28b446" d="m416.253 455.624.014.014C372.396 490.901 316.666 512 256 512c-97.491 0-182.252-54.491-225.491-134.681l82.961-67.91c21.619 57.698 77.278 98.771 142.53 98.771 28.047 0 54.323-7.582 76.87-20.818l83.383 68.262z"></path><path fill="#f14336" d="m419.404 58.936-82.933 67.896C313.136 112.246 285.552 103.82 256 103.82c-66.729 0-123.429 42.957-143.965 102.724l-83.397-68.276h-.014C71.23 56.123 157.06 0 256 0c62.115 0 119.068 22.126 163.404 58.936z"></path></svg>
                </span> التسجيل بحساب جوجل
            </button>
            <button
              onClick={() => signIn("facebook", { callbackUrl: "/" })}
              className="w-full mb-4 flex items-center justify-center gap-2 rounded-full border border-sand-200 bg-white py-3 font-medium hover:bg-sand-100 transition"
            >
              <span className="w-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" id="facebook">
        <path fill="#1877F2" d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256c0 127.8 93.6 233.7 216 252.9V330H151v-74h65v-56.4c0-64.2 38.2-99.7 96.8-99.7 28.1 0 57.5 5 57.5 5v63.2h-32.4c-31.8 0-41.7 19.8-41.7 40.1V256h71.2l-11.4 74h-59.8v178.9C418.4 489.7 512 383.8 512 256z"/>
        <path fill="#FFFFFF" d="M346.5 330l11.4-74h-71.2v-40.1c0-20.3 9.9-40.1 41.7-40.1h32.4V112.6s-29.4-5-57.5-5c-58.6 0-96.8 35.5-96.8 99.7V256h-65v74h65v178.9c13.7 2.1 27.8 3.2 42 3.2s28.3-1.1 42-3.2V330h59.8z"/>
      </svg>
                </span> التسجيل بحساب فيس بوك
            </button>
      {/* ********** */}

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
