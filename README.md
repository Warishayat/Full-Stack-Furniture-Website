<div align="center">
  <h1>🛋️ Elite Seating Full-Stack Furniture Website</h1>
  <p><i>The Ultimate E-Commerce Architecture & Project Report</i></p>

  <!-- Badges -->
  <img src="https://img.shields.io/badge/Frontend-React%20(Vite)-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green?style=for-the-badge&logo=nodedotjs" alt="Node" />
  <img src="https://img.shields.io/badge/Database-MongoDB-darkgreen?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Payments-Stripe-635BFF?style=for-the-badge&logo=stripe" alt="Stripe" />
  <img src="https://img.shields.io/badge/Finance-PayItMonthly-FF9900?style=for-the-badge&logo=money" alt="PayItMonthly" />
  <img src="https://img.shields.io/badge/Deployment-Render-46E3B7?style=for-the-badge&logo=render" alt="Render" />
  <img src="https://img.shields.io/badge/Security-Cloudflare-F38020?style=for-the-badge&logo=cloudflare" alt="Cloudflare" />

  <h3>🚀 Live Demo: <a href="YOUR_LIVE_LINK_HERE">View Live Project Here</a></h3>
</div>

<br />

## 📖 1. Project Abstract & Overview

This document serves as the **Comprehensive Project Report and Developer Handover Guide** for the Elite Seating E-Commerce platform. It is designed to help any new developer instantly understand the system architecture, feature sets, third-party integrations, and directory structures.

The platform is a high-performance, responsive, and secure full-stack web application tailored for a luxury furniture business. It bridges the gap between a stunning client-facing shopping experience and an immensely powerful administrative control panel.

---

## 🏗️ 2. Detailed Folder & File Structure (Where is what happening?)

To ensure a smooth transition for new developers, here is the exact breakdown of the repository and the purpose of each directory.

### 📂 Backend (Node.js + Express)
The `Backend` folder contains all server-side logic, database schemas, and API routes.

*   **`Backend/index.js`**: The main entry point. Sets up Express, connects to MongoDB, configures security middlewares (Helmet, CORS, Rate Limit), and registers all routes.
*   **`Backend/Controller/`**: Contains the business logic.
    *   `Admin/`: Handles logic for admin dashboard stats, CRUD operations for products and categories.
    *   `Auth/`: Manages user registration, login, JWT token generation, and profile fetching.
    *   `Orders/`: 
        *   `orderController.js`: Manages standard order creation, Stripe webhook handling, and status updates.
        *   `payItMonthlyController.js`: **Integration logic for PayItMonthly** financing options.
    *   `Cart/`, `User/`, `Filter/`, `Support/`, `Review/`: Dedicated controllers for specific user interactions.
*   **`Backend/Schemas/` (Database Models)**: Mongoose schemas defining how data is stored in MongoDB.
    *   `Product.js`: Extremely detailed schema including variants, materials, colors, legs, and dimensions.
    *   `Order.js`, `User.js`, `Category.js`, `Review.js`, `Wishlist.js`, `Contact.js`, `Newsletter.js`.
*   **`Backend/Routes/`**: Maps API endpoints to their respective controllers (e.g., `authRoutes.js`, `orderRoutes.js`).
*   **`Backend/Utils/`**: Helper files.
    *   `cache.js`: Implements `node-cache` for server-side caching to speed up product queries.
    *   `cloudinarySetup.js`: Configuration for Multer and Cloudinary for image uploads.
    *   `verifyToken.js`: Middleware to protect private routes using JWT.

### 📂 Frontend (React + Vite)
The `Frontend` folder contains the client-side UI, built as a Single Page Application (SPA).

*   **`Frontend/src/pages/`**: All the screens visible to normal users.
    *   `Home.jsx`, `Products.jsx`, `ProductDetail.jsx`: Shopping journey.
    *   `Cart.jsx`, `Checkout.jsx`, `Success.jsx`, `Cancel.jsx`: The checkout pipeline.
    *   `Bespoke.jsx`: Form for custom furniture requests.
    *   `Account.jsx`, `MyOrders.jsx`, `OrderDetail.jsx`, `OrderTracking.jsx`: User dashboard.
    *   `Auth.jsx`: Login/Signup.
    *   Policy pages: `PrivacyPolicy`, `ReturnsPolicy`, `ShippingPolicy`, `Warranty`, `About`, `Contact`, `HelpCenter`, `Inspiration`.
*   **`Frontend/src/admin/`**: The protected admin dashboard views.
    *   `Dashboard.jsx`: Analytics and quick stats.
    *   `ManageProducts.jsx`: Complex form to Add/Edit products, upload images to Cloudinary, and manage deep variants (fabrics, sizes).
    *   `ManageOrders.jsx`: Track all user orders and update their statuses.
    *   `ManageCategories.jsx`: Add or remove product categories.
    *   `ManageMessages.jsx`: Read contact and bespoke requests.
    *   `ManageSubscribers.jsx`: View newsletter signups.
*   **`Frontend/src/components/`**: Reusable UI parts (`Navbar.jsx`, `Footer.jsx`, `Hero.jsx`, `ProductCard.jsx`).
*   **`Frontend/src/services/api.js`**: Centralized Axios instance with interceptors to automatically attach JWT tokens to outgoing requests.

---

## 🔌 3. Core Third-Party Integrations

This system heavily relies on industry-standard external services.

1.  **Stripe (Payments)**: Fully integrated into `Checkout.jsx` and `orderController.js`. It handles secure credit card processing, creates Stripe Checkout Sessions, and uses secure Webhooks to confirm payments in the backend.
2.  **PayItMonthly (Finance)**: Integrated via `payItMonthlyController.js`. Allows customers to spread the cost of luxury furniture over monthly installments. Handles application creation and status webhooks.
3.  **Cloudinary (Media Storage)**: Integrated via `cloudinarySetup.js`. All product images, category thumbnails, and dimension graphics uploaded by the admin are sent directly to Cloudinary via Multer, preventing the server from getting bloated.
4.  **Nodemailer (Email Automation)**: Automatically triggers transactional emails to users upon successful registration, order placement, or when they submit a Bespoke/Contact form.
5.  **MongoDB Atlas (Database)**: Cloud-hosted NoSQL database ensuring high availability and scalable data storage for all schemas.
6.  **Google Analytics (React-GA4)**: Configured in the frontend to track page views, user sessions, and e-commerce conversions.
7.  **Cloudflare (Security & CDN)**: Acts as the DNS provider and CDN. It caches frontend assets for ultra-fast global delivery, provides SSL encryption, and protects the Render servers from DDoS attacks.
8.  **Render (Hosting)**: The Node.js backend API and frontend build are hosted robustly on Render's cloud infrastructure.

---

## ✨ 4. Exhaustive Feature List (Not a Single Feature Missed)

### 🛍️ Client / Customer Facing
*   **Advanced Dynamic Catalog**: Browse products with real-time filtering (by Category, Price, Name). Handled optimally by server-side caching.
*   **Deep Product Pages (`ProductDetail.jsx`)**:
    *   Image carousel with multiple angles.
    *   Selection of Variants (e.g., 1 Seater, 2 Seater).
    *   Selection of Materials and Colors (e.g., Naples Fabric -> Black).
    *   Detailed specifications, dimensions, and dynamically scaled dimension images.
*   **Cart & Checkout Pipeline**:
    *   Add items, adjust quantities, calculate subtotals.
    *   Dual payment options: Pay in full (Stripe) or Finance (PayItMonthly).
*   **User Accounts & Orders**:
    *   Secure JWT Authentication.
    *   Save multiple delivery addresses.
    *   View order history (`MyOrders.jsx`).
    *   Visual timeline for **Order Tracking** (Pending -> Processing -> Shipped -> Delivered).
*   **Engagement Features**:
    *   **Wishlist**: Users can "heart" products and save them to their account.
    *   **Ratings & Reviews**: Users can leave 1-5 star ratings and text reviews on products they purchased.
    *   **Bespoke System**: A dedicated page (`Bespoke.jsx`) for users to request custom-built furniture dimensions or fabrics.
    *   **Help Center & Contact**: Ticketing and direct contact forms.

### 🛡️ Admin Dashboard (The Control Room)
*   **Analytics Dashboard**: Visual summary of total sales, active orders, and product counts.
*   **Advanced Product Management (`ManageProducts.jsx`)**:
    *   Create, Read, Update, Delete (CRUD) operations.
    *   Ability to define complex nested variants (Sizes -> Materials -> Colors -> Images).
    *   Direct Cloudinary upload integration from the browser.
*   **Order Fulfillment (`ManageOrders.jsx`)**:
    *   View every detail of a customer's order (items, shipping address, payment method).
    *   Change order status, which updates the customer's tracking page in real-time.
*   **Category Management**: Add new furniture categories dynamically.
*   **Communications Hub (`ManageMessages.jsx`)**: Review all bespoke requests, contact form submissions, and manage newsletter subscribers.

---

## 🔒 5. Security & Performance Measures

*   **Authentication**: Passwords are never stored in plain text; they are hashed using `bcrypt`. Sessions are managed immutably via `jsonwebtoken`.
*   **API Protection**:
    *   `helmet`: Secures Express apps by setting various HTTP headers.
    *   `express-mongo-sanitize`: Prevents NoSQL injection attacks.
    *   `xss-clean`: Sanitizes user input to prevent Cross-Site Scripting (XSS).
    *   `express-rate-limit`: Prevents brute-force attacks by limiting repeated API requests from the same IP.
*   **Performance Optimization**:
    *   `node-cache`: Caches database queries for products and categories on the server RAM, drastically reducing MongoDB load and improving response times by up to 90%.
    *   `compression`: Gzip compresses JSON payloads sent to the frontend.

---

## 🚀 6. Developer Setup Guide

For new developers taking over this project, follow these steps to run the platform locally:

### 1. Environment Setup
Create a `.env` in the `Backend` folder:
```env
PORT=8000
DATABASE_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API=your_api_key
CLOUDINARY_SECRET=your_api_secret
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
PAYITMONTHLY_ACCESS_KEY_ID=your_pim_key
PAYITMONTHLY_SECRET_ACCESS_KEY=your_pim_secret
EMAIL_USER=your_smtp_email
EMAIL_PASS=your_smtp_app_password
```

Create a `.env` in the `Frontend` folder:
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
VITE_GA_MEASUREMENT_ID=your_google_analytics_id
```

### 2. Run the App
**Backend Terminal:**
```bash
cd Backend
npm install
npm run dev
```

**Frontend Terminal:**
```bash
cd Frontend
npm install
npm run dev
```

---

## 📄 7. License & Acknowledgment
This project represents a complete, production-ready E-commerce architecture built on the MERN stack. Licensed under the ISC License.
