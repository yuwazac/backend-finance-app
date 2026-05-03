import express from 'express';
import { getUsers, loginUser, registerUser } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';






const authRouter = express.Router();




/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 */

// Public routes
authRouter.post('/register', registerUser);


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 */

// Login route
authRouter.post('/login', loginUser);

/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: Get all users (protected)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */

//get users route
authRouter.get('/', getUsers);

/** 
 * @swagger
 * /auth/summary:
 *   get:
 *     summary: Get monthly summary (protected)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly summary data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

// get monthly summary route
authRouter.get('/summary', authMiddleware)

// //protected route 
// authRouter.get('/protected', authMiddleware, (req, res) => {
//   res.json({ message: "You are authorized!",
//     user: req.user,
//     email: req.user.email,  // Access the user info from the token
//    });
// }
// );




export default authRouter;