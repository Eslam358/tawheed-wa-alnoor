"use client";

import { useEffect, useState } from "react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", icon: "🏷️", image: "" });
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  function loadCategories() {
    setLoading(true);
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .finally(() => setLoading(false));
  }

  useEffect(loadCategories, []);

  function updateField(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function startEdit(cat) {
    setEditingId(cat._id);
    setForm({ name: cat.name, icon: cat.icon || "🏷️", image: cat.image || "" });
  }

  function resetForm() {
    setEditingId(null);
    setForm({ name: "", icon: "🏷️", image: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const url = editingId ? `/api/categories/${editingId}` : "/api/categories";
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "حدث خطأ");
      resetForm();
      loadCategories();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("حذف هذا التصنيف؟ (لن يُحذف المنتجات المرتبطة به)")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    loadCategories();
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-brand-900 mb-6">التصنيفات</h1>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-sand-200 bg-white p-5 mb-6 max-w-lg space-y-3"
      >
        <h2 className="font-semibold">
          {editingId ? "تعديل تصنيف" : "إضافة تصنيف جديد"}
        </h2>
        <div className="grid grid-cols-[80px_1fr] gap-3">
          <input
            name="icon"
            value={form.icon}
            onChange={updateField}
            placeholder="🏷️"
            className="rounded-lg border border-sand-200 px-3 py-2.5 text-center focus:outline-none focus:ring-2 focus:ring-sale-600"
          />
          <input
            required
            name="name"
            value={form.name}
            onChange={updateField}
            placeholder="اسم التصنيف (مثال: سجاد الصلاة)"
            className="rounded-lg border border-sand-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sale-600"
          />
        </div>
        <input
          name="image"
          value={form.image}
          onChange={updateField}
          placeholder="رابط صورة التصنيف (اختياري)"
          className="w-full rounded-lg border border-sand-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sale-600"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-full bg-brand-900 px-5 py-2 text-sm font-semibold text-sand-50 hover:bg-brand-800"
          >
            {editingId ? "حفظ التعديلات" : "إضافة"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-sand-200 px-5 py-2 text-sm"
            >
              إلغاء
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-ink/50">جارِ التحميل...</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="rounded-xl border border-sand-200 bg-white p-4 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">{cat.icon}</span>
                <span className="font-medium">{cat.name}</span>
              </span>
              <span className="flex gap-2 text-sm">
                <button onClick={() => startEdit(cat)} className="text-brand-700 hover:underline">
                  تعديل
                </button>
                <button onClick={() => handleDelete(cat._id)} className="text-red-600 hover:underline">
                  حذف
                </button>
              </span>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-ink/40 col-span-full text-center py-6">
              لا توجد تصنيفات بعد
            </p>
          )}
        </div>
      )}
    </div>
  );
}
