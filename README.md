# Library Rental Service - Backend API

Book rental system backend built with Node.js, Express, and MongoDB.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Documentation:** Swagger
- **Security:** Helmet, CORS

## Features

- **Authentication & Authorization:** JWT-based authentication
- **Book Management:** CRUD operations, search functionality, inventory tracking
- **Reader Management:** Reader profiles with category-based discounts (student, senior, employee)
- **Rental System:** Book rentals with pricing, fines, and return management
- **API Documentation:** Swagger UI

## Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- npm (v9 or higher)

## Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd Library-Rental-Service_Backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the root directory:

   ```env
   # Server Configuration
   PORT=<your-port>
   NODE_ENV=development
   FRONTEND_URL=http://localhost:4200 <- Angular default port

   # Database
   MONGODB_URI=<your-URI>

   # JWT Configuration   
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars
   JWT_REFRESH_SECRET=your-refresh-token-secret-key
   JWT_EXPIRES_IN=15m
   ```

## Running the Application

In the terminal use this script:

```bash
npm run dev
```

The server will be available at `http://localhost:3000`

## API Documentation

Once the server is running, access the interactive API documentation at:

```bash
http://localhost:<your-port>/api-docs
```

## Health Check

Monitor API status:

```bash
GET /health
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh access token
- `PUT /api/auth/update-password` - Update user password

### Books

- `GET /api/books` - List all books (with pagination and filters)
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create new book (admin/librarian)
- `PUT /api/books/:id` - Update book (admin/librarian)
- `DELETE /api/books/:id` - Delete book (admin only)
- `GET /api/books/search` - Search books by title/author/genre
- `GET /api/books/available` - Get available books

### Readers

- `GET /api/readers` - List all readers (admin/librarian)
- `GET /api/readers/:id` - Get reader by ID
- `POST /api/readers` - Create new reader
- `PUT /api/readers/:id` - Update reader
- `DELETE /api/readers/:id` - Delete reader (admin only)

### Rentals

- `GET /api/rentals` - List rentals with filters
- `POST /api/rentals` - Create new rental
- `PUT /api/rentals/:id/return` - Return book
- `GET /api/rentals/statistics` - Get rental statistics
- `GET /api/rentals/reader/:readerId` - Get reader's rental history

## Business Logic

### Reader Categories & Discounts

- **Senior:** 20% discount on rentals
- **Student:** 15% discount on rentals
- **Regular:** No discount

### Rental Rules

- Maximum 3 active rentals per reader
- Daily rental pricing with category discounts
- Automatic fine calculation for overdue books
- Deposit requirements for rentals

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-restart

---

**© Volodymyr Hrehul - 2025**
