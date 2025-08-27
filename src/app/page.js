import Image from "next/image";
import styles from "./page.module.css";
import AllProducts from "./component/AllProducts";
import Banner from "@/components/Banner";  // ✅ Import Banner
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Banner />   {/* ✅ Will show only on homepage */}
      <AllProducts />
      <Footer></Footer>
    </main>
  );
}
