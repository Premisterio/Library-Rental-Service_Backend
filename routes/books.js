const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    getAvailableBooks,
    getBooksByGenre
} = require('../controllers/bookController');

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books with optional filtering and pagination
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *         example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title or author
 *         example: "gatsby"
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter by genre
 *         example: "Fiction"
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter by author
 *         example: "F. Scott Fitzgerald"
 *       - in: query
 *         name: available
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         description: Filter by availability (true for available books only)
 *         example: "true"
 *     responses:
 *       200:
 *         description: List of books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     books:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Book'
 *                     pagination:
 *                       $ref: '#/components/schemas/PaginationMeta'
 *             examples:
 *               books_response:
 *                 summary: Sample books response
 *                 value:
 *                   success: true
 *                   data:
 *                     books:
 *                       - id: "64f123456789abcdef123456"
 *                         title: "The Great Gatsby"
 *                         author: "F. Scott Fitzgerald"
 *                         genre: "Fiction"
 *                         depositAmount: 25.00
 *                         rentalPricePerDay: 2.50
 *                         totalCopies: 5
 *                         availableCopies: 3
 *                         isActive: true
 *                         createdAt: "2024-01-01T10:00:00.000Z"
 *                         updatedAt: "2024-01-01T10:00:00.000Z"
 *                     pagination:
 *                       current: 1
 *                       pages: 5
 *                       total: 50
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getAllBooks);

/**
 * @swagger
 * /api/books/available:
 *   get:
 *     summary: Get all available books (availableCopies > 0)
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of available books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     books:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Book'
 *             examples:
 *               available_books:
 *                 summary: Sample available books response
 *                 value:
 *                   success: true
 *                   data:
 *                     books:
 *                       - id: "64f123456789abcdef123456"
 *                         title: "The Great Gatsby"
 *                         author: "F. Scott Fitzgerald"
 *                         genre: "Fiction"
 *                         depositAmount: 25.00
 *                         rentalPricePerDay: 2.50
 *                         totalCopies: 5
 *                         availableCopies: 3
 *                         isActive: true
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/available', getAvailableBooks);

/**
 * @swagger
 * /api/books/genre/{genre}:
 *   get:
 *     summary: Get books by genre
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: genre
 *         required: true
 *         schema:
 *           type: string
 *         description: Book genre (case-insensitive)
 *         example: "Fiction"
 *     responses:
 *       200:
 *         description: Books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     books:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Book'
 *             examples:
 *               genre_books:
 *                 summary: Books by genre response
 *                 value:
 *                   success: true
 *                   data:
 *                     books:
 *                       - id: "64f123456789abcdef123456"
 *                         title: "The Great Gatsby"
 *                         author: "F. Scott Fitzgerald"
 *                         genre: "Fiction"
 *                         depositAmount: 25.00
 *                         rentalPricePerDay: 2.50
 *                         totalCopies: 5
 *                         availableCopies: 3
 *                         isActive: true
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/genre/:genre', getBooksByGenre);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Book ID (MongoDB ObjectId)
 *         example: "64f123456789abcdef123456"
 *     responses:
 *       200:
 *         description: Book retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     book:
 *                       $ref: '#/components/schemas/Book'
 *             examples:
 *               book_response:
 *                 summary: Single book response
 *                 value:
 *                   success: true
 *                   data:
 *                     book:
 *                       id: "64f123456789abcdef123456"
 *                       title: "The Great Gatsby"
 *                       author: "F. Scott Fitzgerald"
 *                       genre: "Fiction"
 *                       depositAmount: 25.00
 *                       rentalPricePerDay: 2.50
 *                       totalCopies: 5
 *                       availableCopies: 3
 *                       isActive: true
 *                       createdAt: "2024-01-01T10:00:00.000Z"
 *                       updatedAt: "2024-01-01T10:00:00.000Z"
 *       400:
 *         description: Invalid ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalid_id:
 *                 summary: Invalid ObjectId format
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Invalid book ID format"
 *                     status: 400
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               not_found:
 *                 summary: Book not found
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Book not found"
 *                     status: 404
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', getBookById);

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - genre
 *               - depositAmount
 *               - rentalPricePerDay
 *               - totalCopies
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *                 description: Book title
 *                 example: "The Great Gatsby"
 *               author:
 *                 type: string
 *                 maxLength: 100
 *                 description: Book author
 *                 example: "F. Scott Fitzgerald"
 *               genre:
 *                 type: string
 *                 maxLength: 50
 *                 description: Book genre
 *                 example: "Fiction"
 *               depositAmount:
 *                 type: number
 *                 minimum: 0
 *                 description: Deposit amount required
 *                 example: 25.00
 *               rentalPricePerDay:
 *                 type: number
 *                 minimum: 0
 *                 description: Rental price per day
 *                 example: 2.50
 *               totalCopies:
 *                 type: integer
 *                 minimum: 1
 *                 description: Total copies available
 *                 example: 5
 *           examples:
 *             book_example:
 *               summary: Sample book creation
 *               value:
 *                 title: "The Great Gatsby"
 *                 author: "F. Scott Fitzgerald"
 *                 genre: "Fiction"
 *                 depositAmount: 25.00
 *                 rentalPricePerDay: 2.50
 *                 totalCopies: 5
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Book created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     book:
 *                       $ref: '#/components/schemas/Book'
 *             examples:
 *               created_book:
 *                 summary: Successfully created book
 *                 value:
 *                   success: true
 *                   message: "Book created successfully"
 *                   data:
 *                     book:
 *                       id: "64f123456789abcdef123456"
 *                       title: "The Great Gatsby"
 *                       author: "F. Scott Fitzgerald"
 *                       genre: "Fiction"
 *                       depositAmount: 25.00
 *                       rentalPricePerDay: 2.50
 *                       totalCopies: 5
 *                       availableCopies: 5
 *                       isActive: true
 *                       createdAt: "2024-01-01T10:00:00.000Z"
 *                       updatedAt: "2024-01-01T10:00:00.000Z"
 *       400:
 *         description: Bad request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               validation_error:
 *                 summary: Missing required fields
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Title, author, and genre are required"
 *                     status: 400
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               missing_token:
 *                 summary: Missing authorization token
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Access token is required"
 *                     status: 401
 *       409:
 *         description: Conflict - Book already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               book_exists:
 *                 summary: Book already exists
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Book with this title and author already exists"
 *                     status: 409
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authenticateToken, createBook);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Book ID (MongoDB ObjectId)
 *         example: "64f123456789abcdef123456"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *                 description: Book title
 *                 example: "The Great Gatsby (Updated)"
 *               author:
 *                 type: string
 *                 maxLength: 100
 *                 description: Book author
 *                 example: "F. Scott Fitzgerald"
 *               genre:
 *                 type: string
 *                 maxLength: 50
 *                 description: Book genre
 *                 example: "Classic Fiction"
 *               depositAmount:
 *                 type: number
 *                 minimum: 0
 *                 description: Deposit amount required
 *                 example: 30.00
 *               rentalPricePerDay:
 *                 type: number
 *                 minimum: 0
 *                 description: Rental price per day
 *                 example: 3.00
 *               totalCopies:
 *                 type: integer
 *                 minimum: 1
 *                 description: Total copies available
 *                 example: 7
 *               availableCopies:
 *                 type: integer
 *                 minimum: 0
 *                 description: Available copies (must not exceed total copies)
 *                 example: 5
 *               isActive:
 *                 type: boolean
 *                 description: Book active status
 *                 example: true
 *           examples:
 *             book_update:
 *               summary: Sample book update
 *               value:
 *                 title: "The Great Gatsby (Revised Edition)"
 *                 depositAmount: 30.00
 *                 rentalPricePerDay: 3.00
 *                 totalCopies: 7
 *     responses:
 *       200:
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Book updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     book:
 *                       $ref: '#/components/schemas/Book'
 *             examples:
 *               updated_book:
 *                 summary: Successfully updated book
 *                 value:
 *                   success: true
 *                   message: "Book updated successfully"
 *                   data:
 *                     book:
 *                       id: "64f123456789abcdef123456"
 *                       title: "The Great Gatsby (Revised Edition)"
 *                       author: "F. Scott Fitzgerald"
 *                       genre: "Classic Fiction"
 *                       depositAmount: 30.00
 *                       rentalPricePerDay: 3.00
 *                       totalCopies: 7
 *                       availableCopies: 5
 *                       isActive: true
 *                       createdAt: "2024-01-01T10:00:00.000Z"
 *                       updatedAt: "2024-01-01T12:00:00.000Z"
 *       400:
 *         description: Bad request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               validation_error:
 *                 summary: Invalid data
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Available copies cannot exceed total copies"
 *                     status: 400
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               not_found:
 *                 summary: Book not found
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Book not found"
 *                     status: 404
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', authenticateToken, updateBook);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete a book (soft delete - sets isActive to false)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Book ID (MongoDB ObjectId)
 *         example: "64f123456789abcdef123456"
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Book deleted successfully"
 *             examples:
 *               deleted_book:
 *                 summary: Successfully deleted book
 *                 value:
 *                   success: true
 *                   message: "Book deleted successfully"
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               not_found:
 *                 summary: Book not found
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Book not found"
 *                     status: 404
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', authenticateToken, deleteBook);

module.exports = router;