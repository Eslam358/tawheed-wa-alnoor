"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Skeleton from "@/components/Skeleton";

export default function AccountPage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  useEffect(() => {
    fetch("/api/account")
      .then((r) => r.json())
      .then((data) => {
        setProfile({ name: data.name || "", email: data.email || "", phone: data.phone || "" });
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleProfileSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const res = await fetch("/api/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profile.name, phone: profile.phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("تم تحديث بياناتك بنجاح");
      update();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("كلمة المرور الجديدة وتأكيدها غير متطابقين");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("تم تغيير كلمة المرور بنجاح");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-xl px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <h1 className="font-display text-2xl text-brand-900 mb-6">إعدادات الحساب</h1>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm p-3">
          {error}
        </p>
      )}
      {success && (
        <p className="mb-4 rounded-lg bg-brand-50 border border-brand-200 text-brand-800 text-sm p-3">
          ✓ {success}
        </p>
      )}

      {/* البيانات الأساسية */}
      <form onSubmit={handleProfileSubmit} className="rounded-xl border border-sand-200 bg-white p-5 mb-6 space-y-3">
        <h2 className="font-semibold">البيانات الشخصية</h2>
        <div>
          <label className="block text-xs text-ink/50 mb-1">الاسم بالكامل</label>
          <input
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full rounded-lg border border-sand-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>
        <div>
          <label className="block text-xs text-ink/50 mb-1">البريد الإلكتروني</label>
          <input
            value={profile.email}
            disabled
            className="w-full rounded-lg border border-sand-200 bg-sand-50 px-4 py-2.5 text-ink/50"
          />
        </div>
        <div>
          <label className="block text-xs text-ink/50 mb-1">رقم الهاتف</label>
          <input
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            placeholder="01xxxxxxxxx"
            className="w-full rounded-lg border border-sand-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-brand-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 transition disabled:opacity-60"
        >
          حفظ البيانات
        </button>
      </form>

      {/* تغيير كلمة المرور */}
      <form onSubmit={handlePasswordSubmit} className="rounded-xl border border-sand-200 bg-white p-5 space-y-3">
        <h2 className="font-semibold">تغيير كلمة المرور</h2>
        <div>
          <label className="block text-xs text-ink/50 mb-1">كلمة المرور الحالية</label>
          <input
            type="password"
            value={passwords.currentPassword}
            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
            placeholder="اتركها فاضية لو دخلت بحساب جوجل"
            className="w-full rounded-lg border border-sand-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>
        <div>
          <label className="block text-xs text-ink/50 mb-1">كلمة المرور الجديدة</label>
          <input
            type="password"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            className="w-full rounded-lg border border-sand-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>
        <div>
          <label className="block text-xs text-ink/50 mb-1">تأكيد كلمة المرور الجديدة</label>
          <input
            type="password"
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
            className="w-full rounded-lg border border-sand-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>
        <button
          type="submit"
          disabled={saving || !passwords.newPassword}
          className="rounded-md bg-brand-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 transition disabled:opacity-60"
        >
          تغيير كلمة المرور
        </button>
      </form>
    </div>
  );
}
