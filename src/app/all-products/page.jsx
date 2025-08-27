// src/app/all-products/page.jsx
import AllProducts from "../component/AllProducts";

export default function AllProductsPage() {
  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold text-center my-6">All Products</h1>
      <AllProducts />
    </div>
  );
}
