import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { notFound } from "next/navigation";
import ProductForm from "@/components/ProductForm";

export const dynamic = "force-dynamic";

async function getProduct(id) {
  await dbConnect();
  try {
    const product = await Product.findById(id);
    if (!product) return null;
    return JSON.parse(JSON.stringify(product));
  } catch {
    return null;
  }
}

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return notFound();

  return (
    <div>
      <h1 className="font-display text-2xl text-brand-900 mb-6">
        تعديل المنتج
      </h1>
      <ProductForm initialProduct={product} />
    </div>
  );
}
