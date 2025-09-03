const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
    getAllReaders,
    getReaderById,
    createReader,
    updateReader,
    deleteReader,
    searchReaders,
    getReadersByCategory
} = require('../controllers/readerController');

/**
 * @swagger
 * /api/readers:
 *   get:
 *     summary: Get all readers with optional filtering and pagination
 *     tags: [Readers]
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, email, or phone
 *         example: "john"
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [regular, student, senior, employee]
 *         description: Filter by reader category
 *         example: "student"
 *     responses:
 *       200:
 *         description: List of readers retrieved successfully
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
 *                     readers:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Reader'
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
router.get('/', authenticateToken, getAllReaders);

/**
 * @swagger
 * /api/readers/search:
 *   get:
 *     summary: Search readers by name, email, or phone
 *     tags: [Readers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *         description: Search query (searches in name, email, phone)
 *         example: "john smith"
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
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
 *                     readers:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Reader'
 *       400:
 *         description: Bad request - Missing search query
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
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/search', authenticateToken, searchReaders);

/**
 * @swagger
 * /api/readers/category/{category}:
 *   get:
 *     summary: Get readers by category
 *     tags: [Readers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [regular, student, senior, employee]
 *         description: Reader category
 *         example: "student"
 *     responses:
 *       200:
 *         description: Readers retrieved successfully
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
 *                     readers:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Reader'
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
router.get('/category/:category', authenticateToken, getReadersByCategory);

/**
 * @swagger
 * /api/readers/{id}:
 *   get:
 *     summary: Get reader by ID
 *     tags: [Readers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Reader ID (MongoDB ObjectId)
 *         example: "64f123456789abcdef123456"
 *     responses:
 *       200:
 *         description: Reader retrieved successfully
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
 *                     reader:
 *                       $ref: '#/components/schemas/Reader'
 *       400:
 *         description: Invalid ID format
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
router.get('/:id', authenticateToken, getReaderById);

/**
 * @swagger
 * /api/readers:
 *   post:
 *     summary: Create a new reader
 *     tags: [Readers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lastName
 *               - firstName
 *               - address
 *               - phone
 *             properties:
 *               lastName:
 *                 type: string
 *                 maxLength: 50
 *                 description: Last name
 *                 example: "Smith"
 *               firstName:
 *                 type: string
 *                 maxLength: 50
 *                 description: First name
 *                 example: "John"
 *               middleName:
 *                 type: string
 *                 maxLength: 50
 *                 description: Middle name (optional)
 *                 example: "Michael"
 *               address:
 *                 type: string
 *                 maxLength: 200
 *                 description: Full address
 *                 example: "123 Main St, City, State 12345"
 *               phone:
 *                 type: string
 *                 description: Phone number (must be unique)
 *                 example: "+1234567890"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address (optional, must be unique if provided)
 *                 example: "john.smith@example.com"
 *               category:
 *                 type: string
 *                 enum: [regular, student, senior, employee]
 *                 default: regular
 *                 description: Reader category (affects discount percentage)
 *                 example: "student"
 *           examples:
 *             reader_example:
 *               summary: Sample reader creation
 *               value:
 *                 lastName: "Smith"
 *                 firstName: "John"
 *                 middleName: "Michael"
 *                 address: "123 Main St, City, State 12345"
 *                 phone: "+1234567890"
 *                 email: "john.smith@example.com"
 *                 category: "student"
 *     responses:
 *       201:
 *         description: Reader created successfully
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
 *                   example: "Reader created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     reader:
 *                       $ref: '#/components/schemas/Reader'
 *       400:
 *         description: Bad request - Invalid input data
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
 *       409:
 *         description: Conflict - Reader with phone/email already exists
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
router.post('/', authenticateToken, createReader);

/**
 * @swagger
 * /api/readers/{id}:
 *   put:
 *     summary: Update a reader
 *     tags: [Readers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Reader ID (MongoDB ObjectId)
 *         example: "64f123456789abcdef123456"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lastName:
 *                 type: string
 *                 maxLength: 50
 *                 description: Last name
 *                 example: "Smith"
 *               firstName:
 *                 type: string
 *                 maxLength: 50
 *                 description: First name
 *                 example: "John"
 *               middleName:
 *                 type: string
 *                 maxLength: 50
 *                 description: Middle name
 *                 example: "Michael"
 *               address:
 *                 type: string
 *                 maxLength: 200
 *                 description: Full address
 *                 example: "456 New St, City, State 12345"
 *               phone:
 *                 type: string
 *                 description: Phone number (must be unique)
 *                 example: "+1234567891"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address (must be unique if provided)
 *                 example: "john.smith.updated@example.com"
 *               category:
 *                 type: string
 *                 enum: [regular, student, senior, employee]
 *                 description: Reader category (affects discount percentage)
 *                 example: "employee"
 *               isActive:
 *                 type: boolean
 *                 description: Reader active status
 *                 example: true
 *           examples:
 *             reader_update:
 *               summary: Sample reader update
 *               value:
 *                 address: "456 New St, City, State 12345"
 *                 email: "john.smith.updated@example.com"
 *                 category: "employee"
 *     responses:
 *       200:
 *         description: Reader updated successfully
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
 *                   example: "Reader updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     reader:
 *                       $ref: '#/components/schemas/Reader'
 *       400:
 *         description: Bad request - Invalid input data
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
 *       409:
 *         description: Conflict - Phone/email already in use
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
router.put('/:id', authenticateToken, updateReader);

/**
 * @swagger
 * /api/readers/{id}:
 *   delete:
 *     summary: Delete a reader (soft delete - sets isActive to false)
 *     tags: [Readers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Reader ID (MongoDB ObjectId)
 *         example: "64f123456789abcdef123456"
 *     responses:
 *       200:
 *         description: Reader deleted successfully
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
 *                   example: "Reader deleted successfully"
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
router.delete('/:id', authenticateToken, deleteReader);

module.exports = router;