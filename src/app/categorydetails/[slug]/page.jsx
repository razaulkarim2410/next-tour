// src/app/categorydetails/[slug]/page.jsx
import CategoryDetailsPage from "@/components/CategoryDetailsPage";

export default function CategoryDetails({ params }) {
  const slug = params.slug; // ✅ no need for await here in Next.js 13 app router

  return (
    <main className="py-10">
      <CategoryDetailsPage slug={slug} />
    </main>
  );
}
