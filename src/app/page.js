import Image from "next/image";
import styles from "./page.module.css";
import AllProducts from "@/components/AllProducts";

import Banner from "@/components/Banner";  // ✅ Import Banner
import Footer from "@/components/Footer";
import CategorySection from "@/components/CategorySection";
import FlashSale from "@/components/FlashSale";

export default function Home() {
  return (
    <main>
      <Banner />
      <FlashSale/>
      <CategorySection/>
      <AllProducts />
      <Footer></Footer>
    </main>
  );
}
