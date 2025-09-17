import Link from "next/link";
import Image from "next/image";

const categories = [
  { name: "Electronics", slug: "electronics", image: "/images/electronics.jpg" },
  { name: "Furniture", slug: "furniture", image: "/images/furniture.jpg" },
  { name: "Accessories", slug: "accessories", image: "/images/accessories.jpg" },
  { name: "Wearables", slug: "wearables", image: "/images/wearables.jpg" },
  // { name: "Books", slug: "books", image: "/images/books.jpg" },
];

export default function CategorySection() {
  return (
    <section className="w-11/12 mx-auto py-10">
      <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categorydetails/${cat.slug}`}
            className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition overflow-hidden group"
          >
            <div className="relative w-full h-32 overflow-hidden">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3 text-center">
              <h3 className="text-lg font-semibold">{cat.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
