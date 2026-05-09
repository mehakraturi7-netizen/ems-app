# Employee Management System (EMS)

A modern, high-density, and premium Employee Record Management System built with **Next.js 14**, **Supabase**, and **Tailwind CSS**. This system is designed for HR and Admin users to efficiently manage employee records with a sleek, dark-themed interface.

![EMS Preview](https://via.placeholder.com/1200x600/0a0a0a/ffffff?text=Employee+Management+System+Preview)

## 🚀 Key Features

-   **Admin-Only Access**: Secure role-based login system for HR and Administrators.
-   **Full CRUD Operations**:
    -   **Add**: Slide-over modal to create new employee records.
    -   **Edit**: Real-time updates for existing records and status changes.
    -   **Delete**: Permanent removal of records with confirmation.
    -   **View**: High-density table with advanced searching.
-   **Real-time Analytics**: Live "Total Staff" counter synchronized with the database.
-   **Export to CSV**: One-click download of the entire directory for reporting.
-   **Premium UI**: Custom-styled dark theme with glassmorphism, responsive grids, and subtle animations.
-   **Advanced Status Tracking**: Color-coded badges for Active, Inactive, and On Leave statuses.

## 🛠️ Technology Stack

-   **Frontend**: Next.js 14 (App Router), React, Tailwind CSS.
-   **Backend/Database**: Supabase (PostgreSQL).
-   **Authentication**: Supabase Auth with Role-Based Access Control (RBAC).
-   **Icons**: Lucide React.
-   **Deployment**: Optimized for Vercel.

## ⚙️ Setup Instructions

### 1. Prerequisites
-   Node.js 18+ installed.
-   A Supabase project created.

### 2. Environment Variables
Create a `.env` file in the `src/frontend/web` directory with the following:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Database Setup
Run the SQL script found in `src/backend/db/schema.sql` in your Supabase SQL Editor. This will:
-   Create the `profiles` table.
-   Set up RLS (Row Level Security) policies.
-   Implement the `is_admin()` security function.

### 4. Installation & Development
```bash
npm install
npm run dev
```
The app will be available at `http://localhost:3000`.

## 🔒 Security
-   **Row Level Security (RLS)**: Ensures that only authenticated admins can manage records.
-   **Non-Recursive Policies**: Optimized SQL functions to prevent performance loops.
-   **Middleware**: Protected dashboard routes to prevent unauthorized access.

---

Built with ❤️ for efficient HR Management.
