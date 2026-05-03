import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import {
  getTransactions,
  createTransaction,
  getTransactionById,
  updateTransaction,
  deleteTransaction
} from '../controllers/transactionControl.js';
import { validate } from '../middlewares/validateZod.js';
import transactionSchema from '../schemas/transactionSchema.js';

const transactionRouter = express.Router();

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all transactions for the logged-in user
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of transactions
 */
transactionRouter.get('/', authMiddleware, getTransactions);

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Get a transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The transaction ID
 *     responses:
 *       200:
 *         description: A transaction object
 */
transactionRouter.get('/:id', authMiddleware, validate(transactionSchema), getTransactionById);

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum:
 *                   - income
 *                   - expense
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transaction created successfully
 */
transactionRouter.post('/', authMiddleware, validate(transactionSchema), createTransaction);

/**
 * @swagger
 * /transactions/{id}:
 *   put:
 *     summary: Update a transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The transaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 150.75
 *               type:
 *                 type: string
 *                 enum:
 *                   - income
 *                   - expense
 *                 example: income
 *               category:
 *                 type: string
 *                 example: Salary
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-06-15T12:00:00Z
 *     responses:
 *       200:
 *         description: The updated transaction
 */
transactionRouter.put('/:id', authMiddleware, validate(transactionSchema), updateTransaction);

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Delete a transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The transaction ID
 *     responses:
 *       204:
 *         description: Transaction deleted successfully
 */
transactionRouter.delete('/:id', authMiddleware, deleteTransaction);

export default transactionRouter;