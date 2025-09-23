export default function CookiePage() {
  return (
    <div className="w-11/12 max-w-5xl mx-auto py-12">
      {/* Page Title */}
      <h1 className="text-4xl font-extrabold mb-6 text-gray-900">Cookie Policy</h1>
      <p className="text-gray-600 mb-6 text-lg">
        This Cookie Policy explains how <span className="font-semibold">NextTour</span> uses cookies and similar 
        technologies to enhance your experience on our website.
      </p>

      {/* What are cookies */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">1. What Are Cookies?</h2>
        <p className="text-gray-700 leading-relaxed">
          Cookies are small text files stored on your device when you visit a website. They help us
          remember your preferences, understand how you use our site, and provide a better shopping
          experience.
        </p>
      </section>

      {/* Types of cookies */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">2. Types of Cookies We Use</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>Essential Cookies:</strong> Required for basic website functionality such as
            login, shopping cart, and checkout process.
          </li>
          <li>
            <strong>Performance Cookies:</strong> Help us analyze site usage to improve performance
            and user experience.
          </li>
          <li>
            <strong>Functional Cookies:</strong> Remember your preferences such as language and
            location.
          </li>
          <li>
            <strong>Marketing Cookies:</strong> Used to deliver personalized ads and promotions
            relevant to your interests.
          </li>
        </ul>
      </section>

      {/* Managing cookies */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">3. Managing Your Cookie Preferences</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          You can control or disable cookies through your browser settings. Please note that
          disabling certain cookies may affect website functionality, such as your ability to add
          products to your cart or complete a purchase.
        </p>
        <p className="text-gray-700 leading-relaxed">
          For more information about managing cookies, visit{" "}
          <a
            href="https://www.allaboutcookies.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            allaboutcookies.org
          </a>
          .
        </p>
      </section>

      {/* Updates */}
      <section>
        <h2 className="text-2xl font-bold mb-2 text-gray-800">4. Updates to This Policy</h2>
        <p className="text-gray-700 leading-relaxed">
          We may update this Cookie Policy from time to time to reflect changes in technology, legal
          requirements, or our business practices. The latest version will always be posted on this
          page.
        </p>
      </section>

      {/* Last Updated */}
      <p className="text-sm text-gray-500 italic mt-8">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}
