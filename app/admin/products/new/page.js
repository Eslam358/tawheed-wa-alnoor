import ProductForm from "@/components/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-display text-2xl text-brand-900 mb-6">
        إضافة منتج جديد
      </h1>
      <ProductForm />
    </div>
  );
}
