"use client";
import { Tag, Gift, Percent } from "lucide-react";
import Link from "next/link";

export default function CarouselThreePage() {
  const deals = [
    {
      id: 1,
      title: "Exclusive Discounts",
      description:
        "Enjoy price drops on trending products and save big every time you shop.",
      icon: <Tag className="w-10 h-10 text-green-600" />,
    },
    {
      id: 2,
      title: "Special Bundles",
      description:
        "Get more for less with bundle deals curated just for smart shoppers like you.",
      icon: <Gift className="w-10 h-10 text-green-600" />,
    },
    {
      id: 3,
      title: "Seasonal Offers",
      description:
        "Stay tuned for seasonal sales and festival discounts that bring extra savings.",
      icon: <Percent className="w-10 h-10 text-green-600" />,
    },
  ];

  return (
    <div className="w-11/12 mx-auto py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          From Shopping to Savings — All in One Place
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-600 mt-4">
          Discover exclusive deals, discounts, and bundles—smart shopping that
          keeps more money in your pocket.
        </p>
      </div>

      {/* Deals Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {deals.map((deal) => (
          <div
            key={deal.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl p-8 text-center transition"
          >
            <div className="flex justify-center mb-4">{deal.icon}</div>
            <h2 className="text-xl font-semibold text-gray-800">
              {deal.title}
            </h2>
            <p className="text-gray-600 mt-3">{deal.description}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-16">
        <Link href="/deals">
          <button className="px-8 py-3 bg-green-600 text-white rounded-lg text-lg font-medium hover:bg-green-700 transition">
            Start Saving Now
          </button>
        </Link>
      </div>
    </div>
  );
}
