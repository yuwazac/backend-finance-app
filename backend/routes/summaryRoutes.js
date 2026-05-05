
import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getMonthlySummary } from '../controllers/monthlySumarry.js';

const summaryRouter = express.Router();

summaryRouter.get('/', authMiddleware, getMonthlySummary);

export default summaryRouter;

/**
 * @swagger
 * /summary:
 *   get:
 *     summary: Get monthly summary
 *     tags: [Summary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly summary fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: income
 *                       totalAmount:
 *                         type: number
 *                         example: 5000
 */
