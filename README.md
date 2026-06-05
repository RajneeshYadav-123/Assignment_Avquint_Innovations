# Task Management System (MERN Stack)

A complete MERN stack task management web application built for a college internship assignment evaluation. It contains user authentication, protected routes, task dashboard, task creation, editing, deletion, toggling status, searching, filtering, and pagination.

## Features

- **JWT Authentication**: Secure user registration, password hashing (using `bcryptjs`), JWT token generation, and secure session state in React Context.
- **Protected Routes**: Redirection logic to keep unauthorized users away from the dashboard and authenticated users away from login/register pages.
- **Task Management**: Create, view, update, and delete tasks.
- **Status Toggle**: Toggle tasks between `'Pending'` and `'Completed'`.
- **Search & Filters**: Search tasks by title and filter by status (All, Pending, Completed).
- **Pagination**: Supports pagination of tasks (6 tasks per page limit).
- **Dashboard Metrics**: Task counter showing total, pending, completed tasks, and a completed percentage bar.
- **Responsive Design**: Professional, clean UI designed with raw CSS (no frameworks like Bootstrap or Tailwind) matching a student-level assignment submission.

---

## Tech Stack

- **Frontend**: React.js (Vite), React Router DOM, Axios, CSS (Flexbox, Grid)
- **Backend**: Node.js, Express.js, JWT, bcryptjs, cors, dotenv
- **Database**: MongoDB (Mongoose ODM)

---

## Folder Structure

```
AvQuint Innovations/
├── backend/
│   ├── config/          # DB Connection
│   ├── controllers/     # Auth and Task controller logic
│   ├── middleware/      # JWT authentication middleware
│   ├── models/          # Mongoose Schemas (User, Task)
│   ├── routes/          # Express Routers
│   ├── .env.example     # Template env file
│   ├── .env             # Active env configuration (ignored in git)
│   ├── app.js           # Express app setup
│   ├── server.js        # Entry script to start the server
│   └── package.json     # Backend dependencies
├── src/
│   ├── components/      # Navbar, EditTaskModal
│   ├── context/         # AuthContext
│   ├── pages/           # Login, Register, Dashboard Pages & CSS
│   ├── services/        # Axios base configurations
│   ├── App.jsx          # Route declarations
│   └── main.jsx         # Render root
├── index.html           # HTML wrapper
├── package.json         # Frontend dependencies
├── vite.config.js       # Vite configuration with API proxy
└── sample_data.json     # Sample tasks for testing
```

---

## Setup Instructions

Follow these steps to run the application on your local machine:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v16+ recommended).

### 1. Database Setup
The backend is configured to connect to the MongoDB Atlas cluster.
If you need to change it, update the `MONGO_URI` in the backend environment variables.

### 2. Backend Installation & Startup
1. Open a terminal and navigate to the `backend/` folder:
   ```bash
   cd backend
   ```
2. Create your `.env` file using the example:
   ```bash
   cp .env.example .env
   ```
   *(Ensure you have your `MONGO_URI` and `JWT_SECRET` keys set in `.env`)*
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the backend server:
   - For development (with hot-reload):
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```
   *(The server will start listening on port `5000`)*

### 3. Frontend Installation & Startup
1. Open a second terminal and navigate to the project root folder:
   ```bash
   # Make sure you are at the root level (AvQuint Innovations/)
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *(The app will start running at `http://localhost:3000`)*

---

## API Endpoints

### Auth Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user & get token

### Task Routes (Protected - Bearer JWT Token Required)
- `GET /api/tasks` - Fetch all tasks of logged-in user (supports search, filter, page parameters)
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Edit title & description of a task
- `DELETE /api/tasks/:id` - Delete a task
- `PATCH /api/tasks/:id/status` - Toggle status between `Pending` and `Completed`

---

## Testing / Evaluation Guide

1. **User Sign Up**: Visit `http://localhost:3000/register`. Register a new user. It should validate inputs (password match, email regex) and auto-login.
2. **Dashboard**: Welcome message, navbar, and statistics are visible. Total tasks count shows `0` with a progress bar at `0%`.
3. **Task Creation**: Add tasks by filling the form. Notice the counts update in real-time.
4. **Search and Filters**: Enter letters in search and verify tasks filter instantly. Change filter to "Completed" or "Pending" to see status filtering.
5. **Mark Completed**: Click "Complete ✓". The status badge becomes green, text gets strike-through, and statistics recalculate.
6. **Task Pagination**: Create more than 6 tasks to see page numbers appear at the bottom.
7. **Logout**: Click the "Logout" button. The app redirects to `/login`. If you attempt to type `http://localhost:3000/` in the URL, you will be redirected back to the login page.
