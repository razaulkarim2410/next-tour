"use client";

import { useRef, useState, useEffect } from "react";
import emailjs from "emailjs-com";
import Swal from "sweetalert2";

export default function ContactPage() {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);

  // ✅ Initialize EmailJS
  useEffect(() => {
    emailjs.init("X_zU3KUqPCyEADWQS"); // Your EmailJS public key
  }, []);

  const sendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await emailjs.sendForm(
        "service_2jn79zf", // Your EmailJS Service ID
        "template_qba5pza", // Your EmailJS Template ID
        formRef.current,
        "X_zU3KUqPCyEADWQS"
      );

      console.log("✅ EmailJS Result:", result);

      // ✅ Show success popup
      Swal.fire({
        title: "Message Sent!",
        text: "Thank you for contacting us. We'll get back to you within 3 business days.",
        icon: "success",
        confirmButtonColor: "#2563eb",
        confirmButtonText: "Okay",
      });

      formRef.current.reset();
    } catch (error) {
      console.error("❌ EmailJS Error:", error);

      // ❌ Show error popup
      Swal.fire({
        title: "Failed to Send",
        text: "Something went wrong. Please try again later.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-11/12 mx-auto py-16">
      <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Contact Form */}
        <div className="flex-1 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>

          <form ref={formRef} onSubmit={sendEmail} className="space-y-5">
            {/* ✅ Hidden company_name field */}
            <input type="hidden" name="company_name" value="NextTour" />

            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
                Your Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
                Subject
              </label>
              <input
                type="text"
                name="title"
                placeholder="What is this about?"
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
                Message
              </label>
              <textarea
                name="message"
                rows="5"
                placeholder="Write your message..."
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        {/* Contact Info Sidebar */}
        <aside className="w-full lg:w-80 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <strong>Address:</strong> 123 Market Street, Dhaka, Bangladesh
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <strong>Email:</strong> farzankarim2410@gmail.com
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <strong>Phone:</strong> +880 1912278356
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Working Hours</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Mon - Fri: 9:00 AM - 6:00 PM
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Sat: 10:00 AM - 4:00 PM
            </p>
            <p className="text-gray-700 dark:text-gray-300">Sun: Closed</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
