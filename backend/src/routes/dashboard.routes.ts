import { Router } from 'express';
import { getDashboardSummary, getMonthlyReport, getFlatReport, getYearlyReport, getRecentTransactions } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);
router.get('/summary', getDashboardSummary);
router.get('/monthly', getMonthlyReport);
router.get('/yearly', getYearlyReport);
router.get('/flat/:id', getFlatReport);
router.get('/recent-transactions', getRecentTransactions);

export default router;
