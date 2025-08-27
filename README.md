# NextTour - E-commerce Website

Live Site link -https://next-tour-gamma.vercel.app

NextTour is a modern e-commerce website built with **Next.js**, allowing users to browse products, log in, and add new products. The app uses **NextAuth.js** for authentication and **MongoDB** for storing product data.

---

## Short Project Description

NextTour provides a simple e-commerce platform where:

- Users can log in using **email/password** 
- Logged-in users can view products and add new products.
- Protected routes ensure only authenticated users can access product management pages.
- Real-time feedback is provided using toast notifications.

---

Tech Stack

Frontend: Next.js 15 (App Router), React, Tailwind CSS
Authentication: NextAuth.js (Email) 
Database: MongoDB
Notifications: react-hot-toast

Notes

Products are stored in MongoDB and dynamically displayed.
Middleware ensures non-authenticated users are redirected to the login page.
Toast notifications provide instant feedback for login, product addition, and errors.
