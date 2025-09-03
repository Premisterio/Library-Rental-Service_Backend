const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
    getAllRentals,
    getRentalById,
    createRental,
    returnBook,
    getActiveRentals,
    getOverdueRentals,
    getReaderRentals,
    getRentalStats
} = require('../controllers/rentalController');

/**
 * @swagger
 * /api/rentals:
 *   get:
 *     summary: Get all rentals with optional filtering and pagination
 *     tags: [Rentals]
 *     security:
 *       - bearerAuth: []
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, returned, overdue]
 *         description: Filter by rental status
 *         example: "active"
 *       - in: query
 *         name: reader
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Filter by reader ID
 *         example: "64f123456789abcdef123456"
 *       - in: query
 *         name: book
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Filter by book ID
 *         example: "64f123456789abcdef123456"
 *     responses:
 *       200:
 *         description: List of rentals retrieved successfully
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
 *                     rentals:
 *                       type: array
 *                       items:
 *                         allOf:
 *                           - $ref: '#/components/schemas/Rental'
 *                           - type: object
 *                             properties:
 *                               book:
 *                                 type: object
 *                                 properties:
 *                                   title:
 *                                     type: string
 *                                   author:
 *                                     type: string
 *                                   genre:
 *                                     type: string
 *                               reader:
 *                                 type: object
 *                                 properties:
 *                                   firstName:
 *                                     type: string
 *                                   lastName:
 *                                     type: string
 *                                   phone:
 *                                     type: string
 *                     pagination:
 *                       $ref: '#/components/schemas/PaginationMeta'
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', authenticateToken, getAllRentals);

/**
 * @swagger
 * /api/rentals/active:
 *   get:
 *     summary: Get all active rentals
 *     tags: [Rentals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active rentals retrieved successfully
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
 *                     rentals:
 *                       type: array
 *                       items:
 *                         allOf:
 *                           - $ref: '#/components/schemas/Rental'
 *                           - type: object
 *                             properties:
 *                               book:
 *                                 type: object
 *                                 properties:
 *                                   title:
 *                                     type: string
 *                                   author:
 *                                     type: string
 *                               reader:
 *                                 type: object
 *                                 properties:
 *                                   firstName:
 *                                     type: string
 *                                   lastName:
 *                                     type: string
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/active', authenticateToken, getActiveRentals);

/**
 * @swagger
 * /api/rentals/overdue:
 *   get:
 *     summary: Get all overdue rentals
 *     tags: [Rentals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overdue rentals retrieved successfully
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
 *                     rentals:
 *                       type: array
 *                       items:
 *                         allOf:
 *                           - $ref: '#/components/schemas/Rental'
 *                           - type: object
 *                             properties:
 *                               book:
 *                                 type: object
 *                                 properties:
 *                                   title:
 *                                     type: string
 *                                   author:
 *                                     type: string
 *                               reader:
 *                                 type: object
 *                                 properties:
 *                                   firstName:
 *                                     type: string
 *                                   lastName:
 *                                     type: string
 *                                   phone:
 *                                     type: string
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/overdue', authenticateToken, getOverdueRentals);

/**
 * @swagger
 * /api/rentals/stats:
 *   get:
 *     summary: Get rental statistics and analytics
 *     tags: [Rentals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rental statistics retrieved successfully
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
 *                     activeRentals:
 *                       type: integer
 *                       description: Number of currently active rentals
 *                       example: 25
 *                     overdueRentals:
 *                       type: integer
 *                       description: Number of overdue rentals
 *                       example: 3
 *                     totalRentals:
 *                       type: integer
 *                       description: Total number of all rentals
 *                       example: 150
 *                     totalRevenue:
 *                       type: number
 *                       description: Total revenue from completed rentals
 *                       example: 1250.50
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/stats', authenticateToken, getRentalStats);

/**
 * @swagger
 * /api/rentals/reader/{readerId}:
 *   get:
 *     summary: Get rentals for a specific reader
 *     tags: [Rentals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: readerId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Reader ID (MongoDB ObjectId)
 *         example: "64f123456789abcdef123456"
 *     responses:
 *       200:
 *         description: Reader rentals retrieved successfully
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
 *                     rentals:
 *                       type: array
 *                       items:
 *                         allOf:
 *                           - $ref: '#/components/schemas/Rental'
 *                           - type: object
 *                             properties:
 *                               book:
 *                                 type: object
 *                                 properties:
 *                                   title:
 *                                     type: string
 *                                   author:
 *                                     type: string
 *                                   genre:
 *                                     type: string
 *                               reader:
 *                                 type: object
 *                                 properties:
 *                                   firstName:
 *                                     type: string
 *                                   lastName:
 *                                     type: string
 *                                   middleName:
 *                                     type: string
 *                                   phone:
 *                                     type: string
 *                                   category:
 *                                     type: string
 *                                   discountPercentage:
 *                                     type: number
 *       400:
 *         description: Invalid reader ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Reader not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/reader/:readerId', authenticateToken, getReaderRentals);

/**
 * @swagger
 * /api/rentals/{id}:
 *   get:
 *     summary: Get rental by ID with full book and reader details
 *     tags: [Rentals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Rental ID (MongoDB ObjectId)
 *         example: "64f123456789abcdef123456"
 *     responses:
 *       200:
 *         description: Rental retrieved successfully
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
 *                     rental:
 *                       allOf:
 *                         - $ref: '#/components/schemas/Rental'
 *                         - type: object
 *                           properties:
 *                             book:
 *                               $ref: '#/components/schemas/Book'
 *                             reader:
 *                               $ref: '#/components/schemas/Reader'
 *       400:
 *         description: Invalid rental ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Rental not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', authenticateToken, getRentalById);

/**
 * @swagger
 * /api/rentals:
 *   post:
 *     summary: Create a new rental
 *     tags: [Rentals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - readerId
 *               - bookId
 *               - expectedReturnDate
 *             properties:
 *               readerId:
 *                 type: string
 *                 pattern: '^[0-9a-fA-F]{24}$'
 *                 description: Reader ID (MongoDB ObjectId)
 *                 example: "64f123456789abcdef123456"
 *               bookId:
 *                 type: string
 *                 pattern: '^[0-9a-fA-F]{24}$'
 *                 description: Book ID (MongoDB ObjectId)
 *                 example: "64f123456789abcdef123456"
 *               expectedReturnDate:
 *                 type: string
 *                 format: date-time
 *                 description: Expected return date (ISO 8601 format)
 *                 example: "2024-01-15T10:00:00.000Z"
 *           examples:
 *             rental_example:
 *               summary: Sample rental creation
 *               value:
 *                 readerId: "64f123456789abcdef123456"
 *                 bookId: "64f123456789abcdef123456"
 *                 expectedReturnDate: "2024-01-15T10:00:00.000Z"
 *     responses:
 *       201:
 *         description: Rental created successfully
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
 *                   example: "Rental created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     rental:
 *                       allOf:
 *                         - $ref: '#/components/schemas/Rental'
 *                         - type: object
 *                           properties:
 *                             book:
 *                               type: object
 *                               properties:
 *                                 title:
 *                                   type: string
 *                                 author:
 *                                   type: string
 *                             reader:
 *                               type: object
 *                               properties:
 *                                 firstName:
 *                                   type: string
 *                                 lastName:
 *                                   type: string
 *       400:
 *         description: Bad request - Invalid data, book not available, or reader limit reached
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               book_not_available:
 *                 summary: Book not available
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Book is not available for rental"
 *                     status: 400
 *               reader_limit:
 *                 summary: Reader limit reached
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Reader has reached maximum rental limit (3 books)"
 *                     status: 400
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Reader or book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authenticateToken, createRental);

/**
 * @swagger
 * /api/rentals/{id}/return:
 *   put:
 *     summary: Return a rented book
 *     tags: [Rentals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Rental ID (MongoDB ObjectId)
 *         example: "64f123456789abcdef123456"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fineAmount:
 *                 type: number
 *                 minimum: 0
 *                 description: Fine amount if book is overdue or damaged
 *                 example: 5.00
 *               notes:
 *                 type: string
 *                 maxLength: 500
 *                 description: Additional notes about the return
 *                 example: "Book returned in good condition"
 *           examples:
 *             return_with_fine:
 *               summary: Return with fine
 *               value:
 *                 fineAmount: 5.00
 *                 notes: "Book was returned 2 days late"
 *             return_normal:
 *               summary: Normal return
 *               value:
 *                 notes: "Book returned in good condition"
 *     responses:
 *       200:
 *         description: Book returned successfully
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
 *                   example: "Book returned successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     rental:
 *                       allOf:
 *                         - $ref: '#/components/schemas/Rental'
 *                         - type: object
 *                           properties:
 *                             book:
 *                               $ref: '#/components/schemas/Book'
 *                             reader:
 *                               $ref: '#/components/schemas/Reader'
 *       400:
 *         description: Bad request - Book already returned or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               already_returned:
 *                 summary: Book already returned
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Book has already been returned"
 *                     status: 400
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Rental not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id/return', authenticateToken, returnBook);

module.exports = router;