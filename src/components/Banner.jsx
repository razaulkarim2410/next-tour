"use client";

import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import image1 from "../../public/assets/pexels-negativespace-34577.jpg";
import image2 from "../../public/assets/pexels-karolina-grabowska-5632397.jpg";
import image3 from "../../public/assets/pexels-rdne-7947758.jpg";
import { Carousel } from "react-responsive-carousel";
import { useRouter } from "next/navigation";

export default function Banner() {
  const router = useRouter();

  return (
    <div className="w-11/12 mx-auto">
      <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false}>
        {/* Slide 1 */}
        <div
          className="hero h-[400px] w-full rounded-xl py-10 mt-14 bg-cover bg-center"
          style={{ backgroundImage: `url(${image1.src})` }}
        >
          <div className="hero-overlay bg-opacity-60"></div>
          <div className="hero-content text-neutral-content text-center">
            <div className="max-w-md text-start">
              <h1 className="mb-5 text-4xl font-bold">
                From Browsing to Checkout — All in One Place
.
              </h1>
              <p className="mb-5 font-bold">
                Shop the latest trends, add to your cart, and enjoy smooth, secure payments—effortless shopping every time.
              </p>
              <button
                onClick={() => router.push("/carousel-one")}
                className="btn bg-orange-600 text-white hover:bg-orange-700 transition"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* Slide 2 */}
        <div
          className="hero h-[400px] w-full rounded-xl py-10 mt-14 bg-cover bg-center"
          style={{ backgroundImage: `url(${image2.src})` }}
        >
          <div className="hero-overlay bg-opacity-60"></div>
          <div className="hero-content text-neutral-content text-center">
            <div className="max-w-md">
              <h1 className="mb-5 text-4xl font-bold">
                From Wishlist to Delivery — All in One Place
              </h1>
              <p className="mb-5 font-bold">
                Save your favorites, place your order, and track deliveries—your dream products brought straight to your door.
              </p>
              <button
                onClick={() => router.push("/carousel-two")}
                className="btn bg-orange-600 text-white hover:bg-orange-700 transition"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* Slide 3 */}
        <div
          className="hero h-[400px] w-full rounded-xl py-10 mt-14 bg-cover bg-center"
          style={{ backgroundImage: `url(${image3.src})` }}
        >
          <div className="hero-overlay bg-opacity-60"></div>
          <div className="hero-content text-neutral-content text-center">
            <div className="max-w-md text-end">
              <h1 className="mb-5 text-4xl font-bold">
                From Shopping to Savings — All in One Place
              </h1>
              <p className="mb-5 font-bold">
                Discover exclusive deals, discounts, and bundles—smart shopping that keeps more money in your pocket.
              </p>
              <button
                onClick={() => router.push("/carousel-three")}
                className="btn bg-orange-600 text-white hover:bg-orange-700 transition"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </Carousel>
    </div>
  );
}
