const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Author:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         name:
 *           type: string
 *           description: Author's full name
 *           example: J.K. Rowling
 *         email:
 *           type: string
 *           description: Author's email address
 *           example: author@example.com
 *         birthYear:
 *           type: number
 *           description: Year of birth
 *           example: 1965
 *         nationality:
 *           type: string
 *           description: Author's nationality
 *           example: British
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
 * /authors:
 *   get:
 *     summary: Get all authors
 *     tags: [Authors]
 *     description: Retrieve a list of all authors in the database
 *     responses:
 *       200:
 *         description: List of all authors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Author'
 *       500:
 *         description: Server error
 */
router.get('/', authorController.getAllAuthors);

/**
 * @swagger
 * /authors/{id}:
 *   get:
 *     summary: Get an author by ID
 *     tags: [Authors]
 *     description: Retrieve a specific author by their MongoDB ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the author
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Author found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Author not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authorController.getAuthorById);

/**
 * @swagger
 * /authors:
 *   post:
 *     summary: Create a new author
 *     tags: [Authors]
 *     description: Add a new author to the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: George Orwell
 *               email:
 *                 type: string
 *                 example: george.orwell@example.com
 *               birthYear:
 *                 type: number
 *                 example: 1903
 *               nationality:
 *                 type: string
 *                 example: British
 *     responses:
 *       201:
 *         description: Author created successfully
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
 *         description: Validation error or duplicate email
 *       500:
 *         description: Server error
 */
router.post('/', authorController.createAuthor);

/**
 * @swagger
 * /authors/{id}:
 *   put:
 *     summary: Update an author
 *     tags: [Authors]
 *     description: Update an existing author's information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the author
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: George Orwell
 *               email:
 *                 type: string
 *                 example: george.orwell@newmail.com
 *               birthYear:
 *                 type: number
 *                 example: 1903
 *               nationality:
 *                 type: string
 *                 example: British
 *     responses:
 *       200:
 *         description: Author updated successfully
 *       400:
 *         description: Validation error or invalid ID
 *       404:
 *         description: Author not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authorController.updateAuthor);

/**
 * @swagger
 * /authors/{id}:
 *   delete:
 *     summary: Delete an author
 *     tags: [Authors]
 *     description: Remove an author from the database
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the author
 *     responses:
 *       200:
 *         description: Author deleted successfully
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Author not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authorController.deleteAuthor);

module.exports = router;