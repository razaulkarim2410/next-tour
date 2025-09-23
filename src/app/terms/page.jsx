// src/app/terms/page.jsx
import Head from "next/head";

export default function TermsPage() {
  return (
    <>
      {/* ✅ SEO Meta Tags */}
      <Head>
        <title>Terms of Use | NextTour</title>
        <meta
          name="description"
          content="Read NextTour's Terms of Use to understand your rights, responsibilities, and our policies for a secure and fair shopping experience."
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="w-11/12 max-w-4xl mx-auto py-12">
          {/* ✅ Page Title */}
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">
            Terms of Use
          </h1>

          {/* ✅ Intro */}
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed text-center max-w-2xl mx-auto">
            By using NextTour, you agree to comply with these terms and conditions. Please read them
            carefully to understand your rights and responsibilities.
          </p>

          {/* ✅ Terms List */}
          <div className="mt-10 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                1. Product Availability
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                All purchases are subject to stock availability and successful payment confirmation.
                In case of unavailability, you will be notified and refunded promptly.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                2. Right to Refuse Service
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                We reserve the right to refuse service to anyone, at any time, for any reason
                including fraudulent activities or policy violations.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                3. Pricing & Updates
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Prices, promotions, and product availability are subject to change without prior
                notice. We aim to keep information accurate but errors may occur.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                4. User Responsibilities
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                You agree to provide accurate information when placing orders and to comply with all
                applicable laws when using our website.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                5. Limitation of Liability
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                NextTour is not liable for any indirect, incidental, or consequential damages
                resulting from your use of our website or services.
              </p>
            </div>
          </div>

          {/* ✅ Last Updated */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-10 text-center">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </section>
    </>
  );
}
