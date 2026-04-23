import express from 'express';
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

//  Load env FIRST
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Core middleware
app.use(express.json());
app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

//  Rate limiter
app.use(Limiter);

//  Swagger docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//  ROOT ROUTE (this fixes your issue)
app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

//  Routes
app.use('/auth', authRouter);
app.use('/tracker', trackRouter);
app.use('/transactions', transactionRouter);
app.use('/profile', profileRouter);
app.use('/summary', summaryRouter);

//  MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB ✅'))
  .catch(err => console.error(err));

// ❗ ALWAYS LAST
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});