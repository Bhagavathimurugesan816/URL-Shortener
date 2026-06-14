# ⚡ LinkSnap — URL Shortener with Analytics

A full-stack URL Shortener with analytics, built for the Katomaran Hackathon 2026.

---

## 🎥 Demo Video
https://www.loom.com/share/891eb7b203244c52901b3cb4ee5c7d92 

---

## 🧠 AI Planning Document

### Planning Process
This application was planned and built using Claude AI (Anthropic) as the primary AI tool.

### Step 1 — Feature Planning
Before writing any code, I listed all features:
- User authentication (signup/login with JWT)
- URL shortening with unique short codes (nanoid)
- Custom alias support
- Click tracking and analytics
- QR code generation
- Link expiry
- Public stats page
- 7-day click trend charts

### Step 2 — Architecture Design
Decided on:
- React + Vite + Tailwind CSS (frontend)
- Node.js + Express (backend)
- MongoDB Atlas (database)
- JWT for auth, bcrypt for password hashing
- nanoid for short code generation
- Recharts for analytics charts

### Step 3 — Database Modeling
Three collections:
- `users` — stores name, email, hashed password
- `urls` — stores longUrl, shortCode, clicks, userId, expiresAt
- `clicks` — stores urlId, timestamp, browser, OS per click

### Step 4 — API Design
REST endpoints planned before coding:
- POST /api/auth/signup
- POST /api/auth/login
- GET/POST/PUT/DELETE /api/urls
- GET /api/analytics/:id
- GET /api/public/:shortCode
- GET /:shortCode (redirect)

### Step 5 — UI Design
Dark-mode glassmorphism design with:
- Violet/teal gradient color scheme
- Plus Jakarta Sans font
- Animated cards with hover effects
- Responsive grid layout

---

## 🏗️ Architecture Diagram
┌─────────────────────────────────┐

│   React Frontend (Port 5173)    │

│  Login │ Dashboard │ Analytics  │

└──────────────┬──────────────────┘

│ REST API (JWT)

▼

┌─────────────────────────────────┐

│   Express Backend (Port 5000)   │

│  /api/auth │ /api/urls          │

│  /api/analytics │ /:shortCode   │

└──────────────┬──────────────────┘

│ Mongoose ODM

▼

┌─────────────────────────────────┐

│       MongoDB Atlas             │

│  users │ urls │ clicks          │

└─────────────────────────────────┘

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/Bhagavathimurugesan816/URL-Shortener.git
cd url-shortener
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in `backend/`:
```env
PORT=5000
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/urlshortener?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_here
BASE_URL=http://localhost:5000
```

```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Open the app
Visit `http://localhost:5173`

---

## 📦 Tech Stack & Libraries

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS v4 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, bcryptjs |
| Short codes | nanoid v3 |
| Charts | Recharts |
| QR Codes | qrcode.react |
| Toasts | react-hot-toast |
| Validation | express-validator |
| User Agent | express-useragent |

---

## ✅ Features Implemented

### Mandatory
- ✅ User signup and login with JWT authentication
- ✅ Protected dashboard routes
- ✅ Each user manages only their own URLs
- ✅ URL shortening with unique short codes
- ✅ Server-side redirect handling
- ✅ URL validation (frontend + backend)
- ✅ Dashboard with all URL details
- ✅ Delete and copy short URL
- ✅ Click count tracking
- ✅ Analytics page with visit history

### Bonus
- ✅ Custom alias for short URLs
- ✅ QR code generation
- ✅ Link expiry dates
- ✅ Browser and OS analytics
- ✅ 7-day click trend bar chart
- ✅ Public stats page (no login required)
- ✅ Edit destination URL

---

## 🔧 Assumptions Made

1. Short codes are 6 characters long using nanoid (collision probability is negligible)
2. JWT tokens expire after 7 days
3. Analytics track browser and OS (not geolocation, to avoid paid APIs)
4. MongoDB Atlas free tier (M0) is sufficient for this application
5. The app runs locally on `localhost:5000` (backend) and `localhost:5173` (frontend)
6. Passwords require minimum 6 characters

---

## 📸 Sample Output

### Dashboard
![Dashboard](screenshots/Dashboard page.png)

### Analytics Page
![Analytics](screenshots/Analytics page.png)

### Create URL Modal
![Create URL](screenshots/Create url.png)

### Sign In / Sign Up
![Sign In or Sign Up](screenshots/Sign in or Sign up.png)

### MongoDB - URLs Collection
![DB URLs](screenshots/MongoDB urls.png)

### MongoDB - Clicks Collection
![DB Clicks](screenshots/MongoDB clicks.png)

### MongoDB - Users Collection
![DB Users](screenshots/MongoDB users.png)

### Backend Logs
```
MongoDB connected
Server running on port 5000
```
### DB Collections
- Users collection: stores hashed passwords ✅
- URLs collection: stores shortCode, longUrl, clicks, userId ✅
- Clicks collection: stores per-click data with browser/OS ✅

---

This project is a part of a hackathon run by https://katomaran.com