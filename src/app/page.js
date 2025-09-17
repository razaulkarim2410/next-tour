import Image from "next/image";
import styles from "./page.module.css";
import AllProducts from "@/components/AllProducts";

import Banner from "@/components/Banner";  // ✅ Import Banner
import Footer from "@/components/Footer";
import CategorySection from "@/components/CategorySection";

export default function Home() {
  return (
    <main>
      <Banner />   {/* ✅ Will show only on homepage */}
      <CategorySection/>
      <AllProducts />
      <Footer></Footer>
    </main>
  );
}
