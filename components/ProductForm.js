"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductForm({ initialProduct = null }) {
  const router = useRouter();
  const isEdit = !!initialProduct;
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: initialProduct?.name || "",
    description: initialProduct?.description || "",
    price: initialProduct?.price || "",
    compareAtPrice: initialProduct?.compareAtPrice || "",
    category: initialProduct?.category?._id || initialProduct?.category || "",
    stock: initialProduct?.stock ?? 0,
    sku: initialProduct?.sku || "",
    images: initialProduct?.images?.join(", ") || "",
    isFeatured: initialProduct?.isFeatured || false,
    isActive: initialProduct?.isActive ?? true,
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  function updateField(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      ...form,
      price: parseFloat(form.price),
      compareAtPrice: form.compareAtPrice ? parseFloat(form.compareAtPrice) : undefined,
      stock: parseInt(form.stock, 10),
      images: form.images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const url = isEdit
        ? `/api/products/${initialProduct._id}`
        : "/api/products";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "حدث خطأ");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <input
        required
        name="name"
        value={form.name}
        onChange={updateField}
        placeholder="اسم المنتج"
        className="w-full rounded-lg border border-sand-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sale-600"
      />
      <textarea
        name="description"
        value={form.description}
        onChange={updateField}
        placeholder="وصف المنتج"
        rows={4}
        className="w-full rounded-lg border border-sand-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sale-600"
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <input
          required
          type="number"
          step="0.01"
          name="price"
          value={form.price}
          onChange={updateField}
          placeholder="السعر (ج.م)"
          className="rounded-lg border border-sand-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sale-600"
        />
        <input
          type="number"
          step="0.01"
          name="compareAtPrice"
          value={form.compareAtPrice}
          onChange={updateField}
          placeholder="السعر قبل الخصم (اختياري)"
          className="rounded-lg border border-sand-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sale-600"
        />
      </div>

      <select
        required
        name="category"
        value={form.category}
        onChange={updateField}
        className="w-full rounded-lg border border-sand-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sale-600"
      >
        <option value="">اختر التصنيف</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.icon} {c.name}
          </option>
        ))}
      </select>

      <div className="grid sm:grid-cols-2 gap-4">
        <input
          type="number"
          name="stock"
          value={form.stock}
          onChange={updateField}
          placeholder="الكمية بالمخزون"
          className="rounded-lg border border-sand-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sale-600"
        />
        <input
          name="sku"
          value={form.sku}
          onChange={updateField}
          placeholder="رمز المنتج SKU (اختياري)"
          className="rounded-lg border border-sand-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sale-600"
        />
      </div>

      <input
        name="images"
        value={form.images}
        onChange={updateField}
        placeholder="روابط الصور (افصل بينها بفاصلة ,)"
        className="w-full rounded-lg border border-sand-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sale-600"
      />

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isFeatured"
            checked={form.isFeatured}
            onChange={updateField}
          />
          منتج مميز (يظهر بالصفحة الرئيسية)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={updateField}
          />
          نشط (ظاهر بالمتجر)
        </label>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-brand-900 px-6 py-3 font-semibold text-sand-50 hover:bg-brand-800 transition disabled:opacity-60"
      >
        {loading ? "جارِ الحفظ..." : isEdit ? "حفظ التعديلات" : "إضافة المنتج"}
      </button>
    </form>
  );
}
