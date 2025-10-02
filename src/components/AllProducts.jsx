
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import AllProductsClient from "./AllProductsClient";

export const dynamic = "force-dynamic";

export default async function AllProducts({ category, search }) {
  await dbConnect();

  const query = category ? { category } : {};
  if (search) {
    query.title = { $regex: search, $options: "i" }; // filter by search term
  }

  const products = await Product.find(query).lean();

  const safeProducts = products.map((p) => ({
    ...p,
    _id: p._id.toString(),
    createdAt: p.createdAt?.toISOString(),
    updatedAt: p.updatedAt?.toISOString(),
  }));

  console.log("✅ PRODUCTS FETCHED:", safeProducts.length);

  return <AllProductsClient products={safeProducts} category={category} />;
}
