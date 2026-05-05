import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import Path from 'path';
import { fileURLToPath } from 'url';

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

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

//http://localhost:5173/
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5000',
    ], 
    credentials: true,
  })
);

//  Rate limiter
app.use(Limiter);

//  Swagger docs
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//  ROOT ROUTE (this fixes your issue)
app.get('/api', (req, res) => {
  res.send('API is running 🚀');
});

//  Routes
app.use('/api/auth', authRouter);
app.use('/api/tracker', trackRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/profile', profileRouter);
app.use('/api/summary', summaryRouter);

//  MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB ✅'))
  .catch(err => console.error(err));


  // server frontend in production

  if (process.env.NODE_ENV === 'production') {
    const __dirname =  Path.dirname(fileURLToPath(import.meta.url));
    app.use(express.static(Path.json(__dirname, '../frontend/dist')));
    app.get('*', (req, res) => {
      res.sendFile(Path.json(__dirname, "..", "frontend", "dist", "index.html"));
    });
  }
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static('client/build'));
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   });
// }





//  Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});