# tech Setup & File Structure Guide

This guide documents the step-by-step process of setting up the Campus Resource Management System.

## Step 1: Database Setup with Prisma & SQLite

We use **Prisma** as our ORM and **SQLite** for a lightweight, local database.

### Installation
Commands run:
1. `npm install prisma@5.22.0 --save-dev` - Installs Prisma CLI (downgraded to 5.22.0 for compatibility).
2. `npx prisma init --datasource-provider sqlite` - Initializes Prisma.
3. `npm install @prisma/client@5.22.0` - Installs Prisma Client.

### Created Files:
- `prisma/schema.prisma`: The main configuration file for the database schema.
- `.env`: Contains the database connection URL (`file:./dev.db`).

## Step 2: Defining the Schema
I have defined two main models in `prisma/schema.prisma`:
- `Resource`: Represents labs, halls, and equipment.
- `Booking`: Represents a reservation for a resource by a user.

### Resource Model
- `id`: Unique identifier (CUID).
- `name`: Name of the resource.
- `type`: Category (Lab, Hall, Equipment).
- `description`: Optional details.
- `location`: Where it is located.
- `status`: Current availability (Available, Maintenance).

### Booking Model
- `id`: Unique identifier (CUID).
- `resourceId`: Reference to the booked resource.
- `userId`/`userName`: Identity of the person booking.
- `startTime`/`endTime`: The requested time slot.
- `purpose`: Reason for the booking.
- `status`: Approval status (Pending, Approved, Rejected, Cancelled).

## Step 3: Migration & Seed
Running the migration creates the tables in SQLite and generates the Prisma Client.
Command: `npx prisma migrate dev --name init`

I also created a seed script `prisma/seed.js` to populate initial data.
Command: `node prisma/seed.js`

## Step 4: Prisma Client Utility
Created `src/lib/prisma.ts` to provide a single, global instance of the Prisma Client throughout the application.

## Step 5: Frontend Structure & Components
The frontend is built with a minimalist Zinc/Black/White design using Tailwind CSS.

### Major Files & Purposes:
- `src/app/layout.tsx`: Root layout with global navigation.
- `src/app/page.tsx`: Resource Catalog with search and booking integration.
- `src/app/calendar/page.tsx`: A list-style calendar showing current bookings.
- `src/app/bookings/page.tsx`: User profile page to track their own booking statuses.
- `src/app/admin/page.tsx`: Management dashboard for approving/rejecting requests.
- `src/components/Navigation.tsx`: Minimalist tab-based navigation component.
- `src/components/BookingModal.tsx`: The core booking form with backend validation.
- `src/lib/prisma.ts`: Database client singleton.
- `src/lib/utils.ts`: Tailwind CSS utility for class merging.

## Step 6: Backend API Routes
- `/api/resources`: Handles fetching all resources and creating new ones.
- `/api/bookings`: Handles fetching bookings (with optional filters) and creating new bookings with **conflict validation**.
- `/api/bookings/[id]`: Handles status updates (Approve/Reject) by administrators.

## Step 7: Booking Validation Logic
The system prevents double-booking in the `POST /api/bookings` route by checking for any existing 'Pending' or 'Approved' bookings that overlap with the requested time slot for the same resource.
