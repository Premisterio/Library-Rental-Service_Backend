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
 * tags:
 *   name: Readers
 *   description: Reader management endpoints
 */

/**
 * @swagger
 * /api/readers:
 *   get:
 *     summary: Get all readers
 *     tags: [Readers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [lastName, firstName, registrationDate]
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of readers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 readers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reader'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 totalReaders:
 *                   type: integer
 *       401:
 *         description: Unauthorized
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
 *     summary: Search readers
 *     tags: [Readers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query (searches in name, email, phone)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 readers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reader'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 totalReaders:
 *                   type: integer
 *       401:
 *         description: Unauthorized
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
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Readers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 readers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reader'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 totalReaders:
 *                   type: integer
 *       401:
 *         description: Unauthorized
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
 *         description: Reader ID
 *     responses:
 *       200:
 *         description: Reader retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reader'
 *       401:
 *         description: Unauthorized
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
 *               firstName:
 *                 type: string
 *                 maxLength: 50
 *                 description: First name
 *               middleName:
 *                 type: string
 *                 maxLength: 50
 *                 description: Middle name
 *               address:
 *                 type: string
 *                 maxLength: 200
 *                 description: Address
 *               phone:
 *                 type: string
 *                 description: Phone number
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address
 *               category:
 *                 type: string
 *                 enum: [regular, student, senior, employee]
 *                 default: regular
 *                 description: Reader category
 *               discountPercentage:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 default: 0
 *                 description: Discount percentage
 *     responses:
 *       201:
 *         description: Reader created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reader'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
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
 *         description: Reader ID
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
 *               firstName:
 *                 type: string
 *                 maxLength: 50
 *                 description: First name
 *               middleName:
 *                 type: string
 *                 maxLength: 50
 *                 description: Middle name
 *               address:
 *                 type: string
 *                 maxLength: 200
 *                 description: Address
 *               phone:
 *                 type: string
 *                 description: Phone number
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address
 *               category:
 *                 type: string
 *                 enum: [regular, student, senior, employee]
 *                 description: Reader category
 *               discountPercentage:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 description: Discount percentage
 *               isActive:
 *                 type: boolean
 *                 description: Reader active status
 *     responses:
 *       200:
 *         description: Reader updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reader'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
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
router.put('/:id', authenticateToken, updateReader);

/**
 * @swagger
 * /api/readers/{id}:
 *   delete:
 *     summary: Delete a reader
 *     tags: [Readers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reader ID
 *     responses:
 *       200:
 *         description: Reader deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reader deleted successfully
 *       401:
 *         description: Unauthorized
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