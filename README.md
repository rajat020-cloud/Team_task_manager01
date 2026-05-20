# Team Task Manager

A professional full-stack project and task management application built with React, Node.js, Express, and MongoDB.

## Features

* **Authentication**: Secure JWT-based login and signup with password hashing.
* **RBAC**: Role-Based Access Control for Admins and Members.
* **Projects**: Create, manage, and assign team members to projects.
* **Tasks**: Create, assign, and track tasks with status updates (Todo, In Progress, Completed).
* **Dashboard**: Real-time analytics, overdue tasks, and activity tracking.
* **Modern UI**: Responsive and clean interface using Tailwind CSS and Framer Motion.

## 🛠 Tech Stack

* **Frontend**: React.js, Vite, Tailwind CSS, React Router, Recharts, Lucide Icons
* **Backend**: Node.js, Express.js, Prisma ORM
* **Database**: MySQL (configured via `DATABASE_URL`)
* **Security**: JWT Authentication, bcrypt, Helmet, Express Rate Limit

## Setup & Installation

### Prerequisites

* Node.js installed
* MongoDB Atlas account or local MongoDB setup

### Backend Setup

1. `cd backend`
2. `npm install`
3. Create a `.env` file and configure:
   - `DATABASE_URL` (MySQL connection string)
   - `JWT_SECRET`
   - any other env values required by your backend
4. `npm run dev` to start the backend server.

> If the Projects page is blank, confirm the backend is running on port `5000` and you are logged in.

### Frontend Setup

1. `cd frontend`
2. `npm install`
3. `npm run dev` to start the frontend server.

## Deployment (Vercel)

1. Connect your GitHub repository to Vercel.
2. Add MongoDB Atlas connection string in environment variables.
3. Configure frontend and backend services.
4. Deploy the application and verify all APIs work correctly.

## Sample Test Users

### Admin

* **Email**: [admin22@university.com](mailto:admin22@university.com)
* **Password**: 123456

### Member

* **Email**: [rahul@university.com](mailto:rahul@university.com)
* **Password**: 123456
