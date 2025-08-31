# Library Rental Service - Backend API

Library management system backend built with Node.js, Express, and MongoDB.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)
- **Security**: Helmet, CORS

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control (admin, librarian, reader)
- **Book Management**: CRUD operations, search functionality, inventory tracking
- **Reader Management**: Reader profiles with category-based discounts (student, senior, employee)
- **Rental System**: Book rentals with pricing, fines, and return management
- **API Documentation**: Swagger UI

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- npm installed

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd Library-Rental-Service_Backend
```

2. Install dependencies

```bash
npm install
```

3. Create environment variables file (`.env`)

```env
# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:4200

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/library-db

# JWT Configuration  
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-token-secret-key
JWT_EXPIRES_IN=15m
```

4. Start the server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## API Documentation

Once the server is running, access the interactive API documentation at:

```bash
http://localhost:<your-port>/api-docs
```

## Health Check

Monitor API status at:

```
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

## User Roles

- **Admin**: Full system access
- **Librarian**: Manage books, readers, and rentals
- **Reader**: View books and manage own rentals

## Business Logic

### Reader Categories & Discounts

- **Student**: 15% discount on rentals
- **Senior**: 20% discount on rentals  
- **Employee**: 10% discount on rentals
- **Regular**: No discount

### Rental Rules

- Maximum 3 active rentals per reader
- Daily rental pricing with category discounts
- Automatic fine calculation for overdue books
- Deposit requirements for rentals

**© Volodymyr Hrehul - 2025**
