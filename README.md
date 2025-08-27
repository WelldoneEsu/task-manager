# 📝 Task Manager App

A simple **full-stack task manager** built with **Node.js (Express)**, 
- **session-based authentication**, and a vanilla **HTML/JS frontend**.  
- Users can sign up, log in, and manage tasks with **priority tags** (Low/Medium/High).  

---

## 🚀 Features
- 🔐 **Session authentication** with `express-session`
- 👤 User signup, login, logout
- ✅ CRUD tasks (create, read, update, delete)
- 🎨 Color-coded task priorities:
  - Low = 🟢 Green  
  - Medium = 🟠 Orange  
  - High = 🔴 Red
- 💾 Data stored in JSON files (`users.json`, `tasks.json`)
- 📦 Simple frontend with login page & dashboard

---

## 🛠 Tech Stack
**Backend**
- Node.js + Express
- express-session (cookie-based sessions)
- bcryptjs (password hashing)
- uuid (unique IDs)
- fs-extra (file storage)

**Frontend**
- Vanilla HTML, CSS, JS (no frameworks)
- Fetch API for AJAX calls

---

## 📂 Project Structure
- task-manager-app/
│
├── backend/
│ ├── app.js # Express app
│ ├── routes/
│ │ ├── auth.js # Signup, login, logout
│ │ └── tasks.js # CRUD task routes
│ ├── middleware/
│ │ └── auth.js # Session protection
│ ├── data/
│ │ ├── users.json # User storage
│ │ └── tasks.json # Task storage
│ ├── package.json
│ └── .env
│
└── frontend/
├── index.html # Login page
├── dashboard.html # Task dashboard
└── script.js # Client logic


---

## ⚙️ Installation

### 1. Clone repository
```bash
git clone https://github.com/Welldoneesu/task-manager-app.git
cd task-manager-app

- ### 2.  Backend setup
cd backend
npm install

- ### 3. Create a .env file inside /backend:

SESSION_SECRET=your_secret_key
PORT=4000


- ### 4. Run server:
npm run dev
node server.js
- #Server runs at http://localhost:4000

---

## 5. Frontend setup

You can serve frontend/ with Live Server (VS Code extension) or any static server.

Example (with VS Code Live Server):
Open frontend/index.html
Right-click → "Open with Live Server"
Runs on http://localhost:5500 by default

🔗 API Endpoints

Auth

POST /auth/signup → register
POST /auth/login → login & set session
POST /auth/logout → logout & destroy session

Tasks (protected)

GET /tasks → list user’s tasks
POST /tasks → add new task { title, priority }
PATCH /tasks/:id → update task
DELETE /tasks/:id → delete task

🎨 Task Priority Colours
| Priority | Colour     |
| -------- | --------- |
| Low      | 🟢 Green  |
| Medium   | 🟠 Orange |
| High     | 🔴 Red    |
