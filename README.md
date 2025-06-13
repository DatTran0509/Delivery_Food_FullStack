# 🍔 Food Delivery App (Full Stack)

This is a complete **Full Stack Food Ordering Website** built with **React JS**, **MongoDB**, **Express**, **Node.js**, and **Stripe**. It includes:

- 🌐 A user-facing **Frontend Website**
- ⚙️ An **Admin Panel** for managing the platform
- 🛠️ A **Backend Server** for handling APIs and database communication
- 💳 Integrated **Stripe** payment gateway
- 🔐 Full **Authentication System** with user registration & login
- 🛒 **Shopping Cart** and **Order Tracking** functionalities

---

## 📌 Features

- User signup/login and JWT-based authentication
- Browse food items, add to cart, place orders
- Secure Stripe payment integration
- Admin dashboard for managing orders, products, and users
- Real-time order status update
- Mobile responsive design

---

## 🛠 Technologies Used

### 📦 Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** for authentication
- **Stripe** API for payments
- **Multer** for file uploads

### 🎨 Frontend (User & Admin)
- **React.js**
- **React Router**
- **Vite** for faster development
- **Axios** for API communication
- **Tailwind CSS** or other UI library (if used)

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/food-delivery-app.git
cd food-delivery-app
```

### 2️⃣ Setup Environment Variables

Create a `.env` file in the `backend`:

```env
# backend/.env
PORT=4000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```


---

### 3️⃣ Run with Docker (Recommended)

#### 🐳 Build & Run All Services
```bash
docker-compose up --build
```

Wait for the containers to finish building and you can access:

| Service   | URL                       |
|-----------|---------------------------|
| Backend   | http://localhost:4000     |
| Frontend  | http://localhost:8386     |
| Admin     | http://localhost:8387     |

---

### 4️⃣ Run Manually (Dev Mode)

#### ▶️ Backend
```bash
cd backend
npm install
npm run dev
```

#### ▶️ Frontend
```bash
cd frontend
npm install
npm run dev
# Default port: http://localhost:5173
```

#### ▶️ Admin
```bash
cd admin
npm install
npm run dev
# Default port: http://localhost:5173 (change if conflict)
```

---

## 🌐 Explore the App

| Role       | URL                    | Description              |
|------------|------------------------|--------------------------|
| 👥 User     | http://localhost:8386  | Browse & order food      |
| 🔐 Admin    | http://localhost:8387  | Manage orders/products   |
| ⚙️ API      | http://localhost:4000  | Backend API endpoints    |

---

## 📝 License

This project is for educational and learning purposes. You may use it as a base for your own full stack app.

---

## 🙌 Author

Created with 💖 by [DatTran]. Thank you for your support: GreatStack
