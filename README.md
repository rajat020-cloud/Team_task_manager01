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
* **Backend**: Node.js, Express.js
* **Database**: MongoDB with Mongoose
* **Security**: JWT Authentication, bcrypt, Helmet, Express Rate Limit

## Setup & Installation

### Prerequisites

* Node.js installed
* MongoDB Atlas account or local MongoDB setup

### Backend Setup

1. `cd backend`
2. `npm install`
3. Create a `.env` file and configure MongoDB URI and JWT secret.
4. `npm run dev` to start the backend server.

### Frontend Setup

1. `cd frontend`
2. `npm install`
3. `npm run dev` to start the frontend server.

## Deployment (Railway)

1. Connect your GitHub repository to Railway.
2. Add MongoDB Atlas connection string in environment variables.
3. Configure frontend and backend services.
4. Deploy the application and verify all APIs work correctly.

## Sample Test Users

### Admin

* **Email**: [admin@taskflow.com](mailto:admin@taskflow.com)
* **Password**: password123

### Member

* **Email**: [member@taskflow.com](mailto:member@taskflow.com)
* **Password**: password123
