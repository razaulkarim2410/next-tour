// // src/app/all-products/page.jsx
// import AllProducts from "@/components/AllProducts";


// export default function AllProductsPage() {
//   return (
//     <div className="min-h-screen">
      
//       <AllProducts />
//     </div>
//   );
// }

import AllProducts from "@/components/AllProducts";

export default function AllProductsPage({ searchParams }) {
  return (
    <div className="min-h-screen">
      <AllProducts search={searchParams.search} />
    </div>
  );
}
