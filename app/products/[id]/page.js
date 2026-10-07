import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic";

async function getProduct(id) {
  await dbConnect();
  try {
    const product = await Product.findById(id).populate("category", "name");
    if (!product) return null;
    return JSON.parse(JSON.stringify(product));
  } catch {
    return null;
  }
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return notFound();

  return <ProductDetailClient product={product} />;
}
