const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Book Rental API',
      version: '2.1.0',
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
        : 'http://localhost:3000', // Fallback for local development
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
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            id: {
              type: 'string',
              description: 'User ID',
            },
            username: {
              type: 'string',
              minLength: 3,
              maxLength: 30,
              description: 'Username',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
            },
            isActive: {
              type: 'boolean',
              default: true,
              description: 'User active status',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
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
            },
            lastName: {
              type: 'string',
              maxLength: 50,
              description: 'Last name',
            },
            firstName: {
              type: 'string',
              maxLength: 50,
              description: 'First name',
            },
            middleName: {
              type: 'string',
              maxLength: 50,
              description: 'Middle name',
            },
            address: {
              type: 'string',
              maxLength: 200,
              description: 'Address',
            },
            phone: {
              type: 'string',
              description: 'Phone number',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address',
            },
            category: {
              type: 'string',
              enum: ['regular', 'student', 'senior', 'employee'],
              default: 'regular',
              description: 'Reader category',
            },
            discountPercentage: {
              type: 'number',
              minimum: 0,
              maximum: 100,
              default: 0,
              description: 'Discount percentage',
            },
            isActive: {
              type: 'boolean',
              default: true,
              description: 'Reader active status',
            },
            registrationDate: {
              type: 'string',
              format: 'date-time',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Book: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Book ID',
            },
            title: {
              type: 'string',
              description: 'Book title',
            },
            author: {
              type: 'string',
              description: 'Book author',
            },
            isbn: {
              type: 'string',
              description: 'ISBN number',
            },
            genre: {
              type: 'string',
              description: 'Book genre',
            },
            publishedYear: {
              type: 'number',
              description: 'Publication year',
            },
            totalCopies: {
              type: 'number',
              description: 'Total copies available',
            },
            availableCopies: {
              type: 'number',
              description: 'Available copies',
            },
            isActive: {
              type: 'boolean',
              default: true,
              description: 'Book active status',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Rental: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Rental ID',
            },
            reader: {
              type: 'string',
              description: 'Reader ID',
            },
            book: {
              type: 'string',
              description: 'Book ID',
            },
            rentDate: {
              type: 'string',
              format: 'date-time',
              description: 'Rental date',
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              description: 'Due date',
            },
            returnDate: {
              type: 'string',
              format: 'date-time',
              description: 'Return date',
            },
            status: {
              type: 'string',
              enum: ['active', 'returned', 'overdue'],
              description: 'Rental status',
            },
            fine: {
              type: 'number',
              minimum: 0,
              description: 'Fine amount',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
            status: {
              type: 'number',
              description: 'HTTP status code',
            },
            details: {
              type: 'object',
              description: 'Additional error details',
            },
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
            totalPages: {
              type: 'integer',
              description: 'Total number of pages',
            },
            currentPage: {
              type: 'integer',
              description: 'Current page number',
            },
            totalItems: {
              type: 'integer',
              description: 'Total number of items',
            },
            itemsPerPage: {
              type: 'integer',
              description: 'Number of items per page',
            },
            hasNextPage: {
              type: 'boolean',
              description: 'Whether there is a next page',
            },
            hasPrevPage: {
              type: 'boolean',
              description: 'Whether there is a previous page',
            },
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
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'User password',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'JWT access token',
            },
            refreshToken: {
              type: 'string',
              description: 'JWT refresh token',
            },
            user: {
              $ref: '#/components/schemas/User',
            },
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
  apis: ['./routes/*.js', './controllers/*.js'],
};

const specs = swaggerJSDoc(options);

module.exports = {
  specs,
  swaggerUi,
};