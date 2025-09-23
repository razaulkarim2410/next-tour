// src/app/about/page.jsx
import Head from "next/head";

export default function AboutPage() {
  return (
    <>
      {/* ✅ SEO Meta Tags */}
      <Head>
        <title>About Us | ShopEase</title>
        <meta
          name="description"
          content="Learn about ShopEase, our mission, values, and commitment to giving you the best online shopping experience with top-quality products and secure payments."
        />
        <meta name="keywords" content="about ShopEase, e-commerce, online shopping, trusted store" />
      </Head>

      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="w-11/12 max-w-5xl mx-auto py-12">
          {/* ✅ Page Title */}
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">
            About <span className="text-orange-500">NextTour</span>
          </h1>

          {/* ✅ Brand Story */}
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-center max-w-3xl mx-auto">
            NextTour was founded with one mission: to make online shopping simple, secure, and
            enjoyable for everyone. We partner with trusted suppliers and top brands to offer
            high-quality products at unbeatable prices — all delivered right to your doorstep.
          </p>

          {/* ✅ Key Highlights Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow text-center">
              <h3 className="text-3xl font-bold text-orange-500">10K+</h3>
              <p className="text-gray-700 dark:text-gray-300">Happy Customers</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow text-center">
              <h3 className="text-3xl font-bold text-orange-500">5+</h3>
              <p className="text-gray-700 dark:text-gray-300">Years of Service</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow text-center">
              <h3 className="text-3xl font-bold text-orange-500">100%</h3>
              <p className="text-gray-700 dark:text-gray-300">Secure Payments</p>
            </div>
          </div>

          {/* ✅ Values Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-gray-100 dark:bg-gray-800">
              <h4 className="font-semibold text-lg mb-2">🌟 Quality Products</h4>
              <p className="text-gray-600 dark:text-gray-300">
                We carefully select our products to guarantee durability and value for money.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-gray-100 dark:bg-gray-800">
              <h4 className="font-semibold text-lg mb-2">🔒 Secure Checkout</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Industry-standard SSL encryption ensures your data stays private and protected.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-gray-100 dark:bg-gray-800">
              <h4 className="font-semibold text-lg mb-2">⚡ Fast Delivery</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Reliable shipping partners get your orders to you on time, every time.
              </p>
            </div>
          </div>

          {/* ✅ CTA */}
          <div className="mt-10 text-center">
            <a
              href="/all-products"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition"
            >
              Start Shopping →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
