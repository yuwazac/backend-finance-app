import express, { Router } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import authRouter from './routes/authRoutes.js';
import trackRouter from './routes/trackRoutes.js';
import transactionRouter from './routes/transactionRoutes.js';
import profileRouter from './routes/profileRoute.js';
import summaryRouter from './routes/summaryRoutes.js';
import errorHandler, { notFound } from './middlewares/errorMiddleware.js';
import swaggerSpec from './config/swagger.js';
import Limiter from './middlewares/rateLimiter.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

app.use(cors());
dotenv.config();
app.use(helmet()); // Add security headers

app.use(
  cors({
    origin: "http://localhost:3000", // your frontend
    credentials: true,
  })
);

app.use(Limiter)

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//routes
app.use('/auth', authRouter);
app.use('/tracker', trackRouter);
app.use('/transactions', transactionRouter);
app.use('/profile', profileRouter);
app.use('/summary', summaryRouter);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB ✅'))
  .catch(err => console.log(err));

app.use(notFound);
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});