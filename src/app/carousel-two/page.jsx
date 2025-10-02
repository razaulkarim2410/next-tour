"use client";
import { Heart, Package, Truck } from "lucide-react";
import Link from "next/link";

export default function CarouselTwoPage() {
  const steps = [
    {
      id: 1,
      title: "Add to Wishlist",
      description:
        "Save your favorite items in one place. Never lose track of products you love.",
      icon: <Heart className="w-10 h-10 text-pink-600" />,
    },
    {
      id: 2,
      title: "Place Your Order",
      description:
        "Securely checkout your wishlist products with fast and safe payment options.",
      icon: <Package className="w-10 h-10 text-pink-600" />,
    },
    {
      id: 3,
      title: "Track Delivery",
      description:
        "Stay updated with real-time tracking and get your dream products at your door.",
      icon: <Truck className="w-10 h-10 text-pink-600" />,
    },
  ];

  return (
    <div className="w-11/12 mx-auto py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          From Wishlist to Delivery — All in One Place
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-600 mt-4">
          Save your favorites, place your order, and track deliveries—your dream
          products brought straight to your door.
        </p>
      </div>

      {/* Steps Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <div
            key={step.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl p-8 text-center transition"
          >
            <div className="flex justify-center mb-4">{step.icon}</div>
            <h2 className="text-xl font-semibold text-gray-800">
              {step.title}
            </h2>
            <p className="text-gray-600 mt-3">{step.description}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-16">
        <Link href="/wishlist">
          <button className="px-8 py-3 bg-pink-600 text-white rounded-lg text-lg font-medium hover:bg-pink-700 transition">
            View Your Wishlist
          </button>
        </Link>
      </div>
    </div>
  );
}
