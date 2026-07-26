# 🛋️ Full-Stack Furniture Website

A comprehensive, end-to-end e-commerce platform built for a premium furniture business. This application provides a seamless, highly responsive shopping experience for users, featuring extensive product browsing, dynamic filtering, secure payment processing, and a robust admin dashboard for complete inventory management.

## 🌟 Exhaustive Feature List

### 🛍️ User Experience & Shop
- **Dynamic Homepage**: Features modern layout sections, including the recently added **Sofa Cum Bed** section (replacing the old Dining section) for better product showcasing.
- **Product Catalog & Filtering**: Browse products seamlessly. Includes backend filtering (`filteringRoutes.js`) and dynamic categories (`categories.js`). Unwanted categories have been actively cleaned up for a focused UI.
- **Detailed Product Pages (`ProductDetail.jsx`)**: 
  - Displays comprehensive product information, multiple angles, and pricing.
  - **Responsive Dimension Images**: Product dimension images are fully optimized to scale correctly on mobile devices.
  - **Ratings & Reviews**: Users can leave and read reviews (`RatingReviewRoutes.js`).
  - **Warranty**: Integrated 2-Year warranty terms consistently across the UI and backend.
- **Cart & Checkout Flow**: 
  - Add to cart (`Cart.jsx`), adjust quantities, and proceed to checkout (`Checkout.jsx`).
  - **Secure Payments**: Complete Stripe integration with `Success.jsx` and `Cancel.jsx` handling.
- **Wishlist (`Wishlist.jsx`)**: Users can save their favorite furniture pieces for later (`wishlistRoutes.js`).
- **Order Management (`MyOrders.jsx` & `OrderDetail.jsx`)**: View past orders, check detailed breakdowns, and track order status (`OrderTracking.jsx`).

### 🔐 Authentication & Accounts
- **User & Admin Auth (`Auth.jsx`, `authRoutes.js`)**: Secure login and registration.
- **Security**: Passwords hashed with `bcrypt`, sessions managed securely via `jsonwebtoken` (JWT).
- **Account Dashboard (`Account.jsx`)**: Manage user profiles and addresses.

### 🛡️ Admin Dashboard & Management
- **Complete Inventory Control**: Create, Read, Update, and Delete (CRUD) operations for the furniture catalog.
- **Product Editing**: Fully functional `ManageProducts.jsx` allowing admins to edit existing products without affecting unrelated data.
- **Image Management**: Seamless integration with **Cloudinary** (via Multer) for hosting product images and dimension graphics.
- **Category Management**: Add, edit, or remove furniture categories dynamically.
- **Order & Feed Monitoring**: Admin monitoring for user orders and site feeds (`feedRoutes.js`).

### 📞 Customer Support & Engagement
- **Contact & Help Center**: Dedicated `Contact.jsx` and `HelpCenter.jsx` pages for customer inquiries (`contactRoutes.js`).
- **Newsletter Subscription**: Capture emails for marketing (`newsletterRoutes.js`).
- **Bespoke Furniture (`Bespoke.jsx`)**: Custom furniture request pages.
- **Policy Pages**: Comprehensive `PrivacyPolicy.jsx`, `ReturnsPolicy.jsx`, `ShippingPolicy.jsx`, and `Warranty.jsx`.

### ⚡ Performance & UI/UX
- **Caching**: Backend uses `node-cache` to speed up product retrieval and API responses.
- **Responsive Design**: Tailwind CSS ensures the site looks premium and works flawlessly on desktop, tablet, and mobile.
- **Email Notifications**: Automated emails via **Nodemailer** for orders and account activities.

---

## 💻 Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Icons & UI**: Lucide React, React Icons, React Toastify

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT & bcrypt
- **File Storage**: Cloudinary & Multer
- **Payments**: Stripe API
- **Emailing**: Nodemailer
- **Caching**: Node-cache
- **Utilities**: slugify, json2csv, compression, cors

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB instance (local or MongoDB Atlas)
- Cloudinary Account (for image hosting)
- Stripe Account (for payments)

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd Full-Stack-Furniture-Website
```

### 2. Backend Setup
```bash
cd Backend
npm install
```
Create a `.env` file in the `Backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
EMAIL_USER=your_smtp_email
EMAIL_PASS=your_smtp_password
```
Run the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../Frontend
npm install
```
Create a `.env` file in the `Frontend` directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```
Run the frontend:
```bash
npm run dev
```

---

## 📁 Project Structure

```text
Full-Stack-Furniture-Website/
├── Backend/                
│   ├── Controllers/        # Logic for Products, Admin, Users, Orders
│   ├── Models/             # Mongoose schemas (Product, User, Order, etc.)
│   ├── Routes/             # Express routes (authRoutes, productRoutes, etc.)
│   ├── Utils/              # Utilities (cache.js)
│   └── index.js            # Entry point
├── Frontend/               
│   ├── src/
│   │   ├── components/     # Navbar, Footer, UI elements
│   │   ├── pages/          # Home, Cart, Checkout, ProductDetail, Admin etc.
│   │   ├── services/       # API services (api.js)
│   │   └── App.jsx         # Main router
└── README.md               
```

## 📄 License

This project is licensed under the ISC License. See the `LICENSE` file for details.
