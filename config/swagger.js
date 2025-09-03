const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Book Rental API',
      version: '2.2.0',
      description: 'Backend API documentation for the Book Rental System. This API provides endpoints for managing books, readers, rentals, and authentication.',
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints'
      },
      {
        name: 'Books',
        description: 'Book management endpoints'
      },
      {
        name: 'Readers',
        description: 'Reader management endpoints'
      },
      {
        name: 'Rentals',
        description: 'Book rental management endpoints'
      },
      {
        name: 'System',
        description: 'System health and status endpoints'
      }
    ],
    servers: [
      {
        url: 
        process.env.NODE_ENV === 'production' 
        ? process.env.API_URL
        : 'http://localhost:3000',
        description: 
        process.env.NODE_ENV === 'production' 
        ? 'Production server' 
        : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: your_token_here (without Bearer prefix)'
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['username', 'email'],
          properties: {
            id: {
              type: 'string',
              description: 'User ID',
              example: '64f123456789abcdef123456'
            },
            username: {
              type: 'string',
              minLength: 3,
              maxLength: 30,
              description: 'Username',
              example: 'john_doe'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
              example: 'john@example.com'
            },
            isActive: {
              type: 'boolean',
              default: true,
              description: 'User active status',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T10:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T10:00:00.000Z'
            },
          },
        },
        Reader: {
          type: 'object',
          required: ['lastName', 'firstName', 'address', 'phone'],
          properties: {
            id: {
              type: 'string',
              description: 'Reader ID',
              example: '64f123456789abcdef123456'
            },
            lastName: {
              type: 'string',
              maxLength: 50,
              description: 'Last name',
              example: 'Smith'
            },
            firstName: {
              type: 'string',
              maxLength: 50,
              description: 'First name',
              example: 'John'
            },
            middleName: {
              type: 'string',
              maxLength: 50,
              description: 'Middle name',
              example: 'Michael'
            },
            address: {
              type: 'string',
              maxLength: 200,
              description: 'Address',
              example: '123 Main St, City, State 12345'
            },
            phone: {
              type: 'string',
              description: 'Phone number',
              example: '+1234567890'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address',
              example: 'john.smith@example.com'
            },
            category: {
              type: 'string',
              enum: ['regular', 'student', 'senior', 'employee'],
              default: 'regular',
              description: 'Reader category',
              example: 'student'
            },
            discountPercentage: {
              type: 'number',
              minimum: 0,
              maximum: 100,
              default: 0,
              description: 'Discount percentage',
              example: 15
            },
            isActive: {
              type: 'boolean',
              default: true,
              description: 'Reader active status',
              example: true
            },
            registrationDate: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T10:00:00.000Z'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T10:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T10:00:00.000Z'
            },
          },
        },
        Book: {
          type: 'object',
          required: ['title', 'author', 'genre', 'depositAmount', 'rentalPricePerDay', 'totalCopies'],
          properties: {
            id: {
              type: 'string',
              description: 'Book ID',
              example: '64f123456789abcdef123456'
            },
            title: {
              type: 'string',
              description: 'Book title',
              example: 'The Great Gatsby'
            },
            author: {
              type: 'string',
              description: 'Book author',
              example: 'F. Scott Fitzgerald'
            },
            genre: {
              type: 'string',
              description: 'Book genre',
              example: 'Fiction'
            },
            depositAmount: {
              type: 'number',
              minimum: 0,
              description: 'Deposit amount required',
              example: 25.00
            },
            rentalPricePerDay: {
              type: 'number',
              minimum: 0,
              description: 'Rental price per day',
              example: 2.50
            },
            totalCopies: {
              type: 'number',
              minimum: 1,
              description: 'Total copies available',
              example: 5
            },
            availableCopies: {
              type: 'number',
              minimum: 0,
              description: 'Available copies',
              example: 3
            },
            isActive: {
              type: 'boolean',
              default: true,
              description: 'Book active status',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T10:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T10:00:00.000Z'
            },
          },
        },
        Rental: {
          type: 'object',
          required: ['book', 'reader', 'issueDate', 'expectedReturnDate'],
          properties: {
            id: {
              type: 'string',
              description: 'Rental ID',
              example: '64f123456789abcdef123456'
            },
            reader: {
              type: 'string',
              description: 'Reader ID',
              example: '64f123456789abcdef123456'
            },
            book: {
              type: 'string',
              description: 'Book ID',
              example: '64f123456789abcdef123456'
            },
            issueDate: {
              type: 'string',
              format: 'date-time',
              description: 'Issue date',
              example: '2024-01-01T10:00:00.000Z'
            },
            expectedReturnDate: {
              type: 'string',
              format: 'date-time',
              description: 'Expected return date',
              example: '2024-01-15T10:00:00.000Z'
            },
            actualReturnDate: {
              type: 'string',
              format: 'date-time',
              description: 'Actual return date',
              example: '2024-01-14T10:00:00.000Z'
            },
            status: {
              type: 'string',
              enum: ['active', 'returned', 'overdue'],
              description: 'Rental status',
              example: 'active'
            },
            depositAmount: {
              type: 'number',
              minimum: 0,
              description: 'Deposit amount',
              example: 25.00
            },
            rentalPricePerDay: {
              type: 'number',
              minimum: 0,
              description: 'Rental price per day',
              example: 2.50
            },
            fineAmount: {
              type: 'number',
              minimum: 0,
              description: 'Fine amount',
              example: 5.00
            },
            discountAmount: {
              type: 'number',
              minimum: 0,
              description: 'Discount amount',
              example: 3.75
            },
            totalAmount: {
              type: 'number',
              minimum: 0,
              description: 'Total amount',
              example: 35.00
            },
            notes: {
              type: 'string',
              description: 'Additional notes',
              example: 'Book returned in good condition'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T10:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T10:00:00.000Z'
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'Error message',
                  example: 'Resource not found'
                },
                status: {
                  type: 'number',
                  description: 'HTTP status code',
                  example: 404
                },
                details: {
                  type: 'object',
                  description: 'Additional error details'
                }
              }
            }
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              description: 'Success message',
              example: 'Operation completed successfully'
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
          },
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            current: {
              type: 'integer',
              description: 'Current page number',
              example: 1
            },
            pages: {
              type: 'integer',
              description: 'Total number of pages',
              example: 5
            },
            total: {
              type: 'integer',
              description: 'Total number of items',
              example: 50
            }
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
              example: 'john@example.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'User password',
              example: 'password123'
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            username: {
              type: 'string',
              minLength: 3,
              maxLength: 30,
              description: 'Username',
              example: 'john_doe'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
              example: 'john@example.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'User password',
              example: 'password123'
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operation successful'
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User',
                },
                token: {
                  type: 'string',
                  description: 'JWT access token',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                },
                refreshToken: {
                  type: 'string',
                  description: 'JWT refresh token',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                }
              }
            }
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js', './controllers/*.js', './server.js'],
};

const specs = swaggerJSDoc(options);

module.exports = {
  specs,
  swaggerUi,
};