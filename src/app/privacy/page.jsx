export default function PrivacyPage() {
  return (
    <div className="w-11/12 max-w-5xl mx-auto py-12">
      {/* Page Title */}
      <h1 className="text-4xl font-extrabold mb-6 text-gray-900">Privacy Policy</h1>
      <p className="text-gray-600 mb-6 text-lg">
        At <span className="font-semibold">NextTour</span>, your privacy is our priority.
        This policy outlines how we collect, use, and safeguard your personal information when you
        interact with our website and services.
      </p>

      {/* Section 1 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">1. Information We Collect</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Personal details such as name, email address, phone number, and shipping address.</li>
          <li>Payment details processed securely through our payment gateway partners.</li>
          <li>Browsing data such as IP address, device information, and interaction history.</li>
        </ul>
      </section>

      {/* Section 2 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">2. How We Use Your Data</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>To process your orders and deliver your purchases.</li>
          <li>To personalize your shopping experience and recommend products.</li>
          <li>To improve our website, customer service, and marketing campaigns.</li>
        </ul>
      </section>

      {/* Section 3 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">3. Data Protection & Security</h2>
        <p className="text-gray-700 leading-relaxed">
          We use industry-standard encryption and security measures to keep your personal data safe.
          Your payment details are never stored on our servers — transactions are processed securely
          through trusted third-party payment gateways.
        </p>
      </section>

      {/* Section 4 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">4. Sharing of Information</h2>
        <p className="text-gray-700 leading-relaxed">
          We do not sell or trade your personal data to third parties. However, we may share your
          information with trusted partners (e.g., shipping carriers, payment processors) solely to
          fulfill your orders or provide services.
        </p>
      </section>

      {/* Section 5 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">5. Your Rights</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Request access to the data we hold about you.</li>
          <li>Request corrections or updates to your information.</li>
          <li>Request deletion of your data, subject to legal and contractual obligations.</li>
        </ul>
      </section>

      {/* Last Updated */}
      <p className="text-sm text-gray-500 italic">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}
