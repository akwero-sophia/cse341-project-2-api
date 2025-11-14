const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - isbn
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         title:
 *           type: string
 *           description: Book title
 *           example: To Kill a Mockingbird
 *         author:
 *           type: string
 *           description: Book author name
 *           example: Harper Lee
 *         isbn:
 *           type: string
 *           description: ISBN number (10-13 characters)
 *           example: 978-0061120084
 *         publishedYear:
 *           type: number
 *           description: Year the book was published
 *           example: 1960
 *         genre:
 *           type: string
 *           description: Book genre/category
 *           example: Fiction
 *         pages:
 *           type: number
 *           description: Number of pages
 *           example: 324
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     description: Retrieve a list of all books in the database
 *     responses:
 *       200:
 *         description: List of all books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Server error
 */
router.get('/', bookController.getAllBooks);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     tags: [Books]
 *     description: Retrieve a specific book by its MongoDB ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the book
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Book found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.get('/:id', bookController.getBookById);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     description: Add a new book to the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - isbn
 *             properties:
 *               title:
 *                 type: string
 *                 example: 1984
 *               author:
 *                 type: string
 *                 example: George Orwell
 *               isbn:
 *                 type: string
 *                 example: 978-0451524935
 *               publishedYear:
 *                 type: number
 *                 example: 1949
 *               genre:
 *                 type: string
 *                 example: Dystopian Fiction
 *               pages:
 *                 type: number
 *                 example: 328
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: string
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/', bookController.createBook);

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update a book
 *     tags: [Books]
 *     description: Update an existing book's information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: 1984 (Updated Edition)
 *               author:
 *                 type: string
 *                 example: George Orwell
 *               isbn:
 *                 type: string
 *                 example: 978-0451524935
 *               publishedYear:
 *                 type: number
 *                 example: 1949
 *               genre:
 *                 type: string
 *                 example: Dystopian Fiction
 *               pages:
 *                 type: number
 *                 example: 328
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       400:
 *         description: Validation error or invalid ID
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.put('/:id', bookController.updateBook);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
 *     description: Remove a book from the database
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the book
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', bookController.deleteBook);

module.exports = router;