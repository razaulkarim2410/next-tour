// src/app/categorydetails/[slug]/page.jsx
import CategoryDetailsPage from "@/components/CategoryDetailsPage";

export default async function CategoryDetails({ params }) {
  const { slug } = params; // destructuring is fine

  return (
    <main className="py-10">
      <CategoryDetailsPage slug={slug} />
    </main>
  );
}
