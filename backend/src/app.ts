import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { errorMiddleware } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import flatRoutes from './routes/flat.routes';
import paymentRoutes from './routes/payment.routes';
import transactionRoutes from './routes/transaction.routes';
import dashboardRoutes from './routes/dashboard.routes';

const app = express();

app.use(helmet());

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000', 'https://building.revelop.dev'];
if (env.FRONTEND_URL) {
  allowedOrigins.push(env.FRONTEND_URL);
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/flats', flatRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorMiddleware);

export default app;
