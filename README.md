# Team Task Manager

A professional, full-stack project and task management application built with React, Node.js, Express, and Prisma.

##  Features

- **Authentication**: Secure JWT-based login and signup with password hashing.
- **RBAC**: Role-Based Access Control for Admins and Members.
- **Projects**: Create and manage projects, assign team members.
- **Tasks**: Kanban-style board for tracking tasks by status (Todo, In Progress, Completed).
- **Dashboard**: Real-time analytics and activity tracking.
- **Modern UI**: Clean, responsive design using Tailwind CSS and Framer Motion.

## 🛠 Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, React Router, Recharts, Lucide Icons.
- **Backend**: Node.js, Express.js, Prisma ORM, PostgreSQL.
- **Security**: JWT, bcrypt, Helmet, Express Rate Limit.

## Setup & Installation

### Prerequisites
- Node.js installed
- PostgreSQL database (or change provider in Prisma)

### Backend Setup
1. `cd backend`
2. `npm install`
3. Create a `.env` file based on the provided values.
4. Run `npx prisma generate`.
5. Run `npx prisma db push` to sync your database schema.
6. `npm run dev` to start the backend server.

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev` to start the frontend.

## Deployment (Railway)

1. Connect your GitHub repository to Railway.
2. Add a PostgreSQL database service in Railway.
3. Configure environment variables in the Railway project settings.
4. Set the build and start commands for both frontend and backend.

## Sample Test Users

### Admin
- **Email**: admin@taskflow.com
- **Password**: password123

### Member
- **Email**: member@taskflow.com
- **Password**: password123
