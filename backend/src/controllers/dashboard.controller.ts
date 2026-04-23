import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { sendSuccess, sendError } from '../utils/response';

export async function getDashboardSummary(req: Request, res: Response) {
  try {
    const month = Number(req.query.month) || new Date().getMonth() + 1;
    const year = Number(req.query.year) || new Date().getFullYear();

    const activeFlats = await prisma.flat.findMany({ where: { isActive: true } });
    const totalExpected = activeFlats.reduce((sum, flat) => sum + flat.monthlyFee, 0);

    const payments = await prisma.payment.findMany({
      where: { month, year, isPaid: true },
    });
    const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
    const paidCount = payments.length;

    const expenses = await prisma.transaction.findMany({
      where: { month, year, type: 'expense' },
    });
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

    const balance = totalCollected - totalExpenses;
    const unpaidCount = activeFlats.length - paidCount;

    return sendSuccess(res, {
      totalExpected,
      totalCollected,
      totalExpenses,
      balance,
      paidCount,
      unpaidCount,
      totalFlats: activeFlats.length,
      isNegativeBalance: balance < 0,
      collectionRate: activeFlats.length > 0 ? Math.round((paidCount / activeFlats.length) * 100) : 0,
    });
  } catch {
    return sendError(res, 'خطأ في جلب إحصائيات لوحة التحكم', 500);
  }
}

export async function getMonthlyReport(req: Request, res: Response) {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();

    const months = [];
    for (let m = 1; m <= 12; m++) {
      const payments = await prisma.payment.findMany({
        where: { month: m, year, isPaid: true },
      });
      const collected = payments.reduce((sum, p) => sum + p.amount, 0);

      const expenses = await prisma.transaction.findMany({
        where: { month: m, year, type: 'expense' },
      });
      const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

      months.push({
        month: m,
        collected,
        expenses: totalExpenses,
        balance: collected - totalExpenses,
        paidCount: payments.length,
      });
    }

    return sendSuccess(res, months);
  } catch {
    return sendError(res, 'خطأ في جلب التقرير الشهري', 500);
  }
}

export async function getFlatReport(req: Request, res: Response) {
  try {
    const flatId = Number(req.params.id);
    const year = Number(req.query.year) || new Date().getFullYear();

    const flat = await prisma.flat.findUnique({ where: { id: flatId } });
    if (!flat) return sendError(res, 'الشقة غير موجودة', 404);

    const payments = await prisma.payment.findMany({
      where: { flatId, year },
      orderBy: { month: 'asc' },
    });

    const monthlyStatus = Array.from({ length: 12 }, (_, i) => {
      const payment = payments.find((p) => p.month === i + 1);
      return {
        month: i + 1,
        isPaid: !!payment?.isPaid,
        amount: payment?.amount || 0,
        paidAt: payment?.paidAt || null,
      };
    });

    return sendSuccess(res, {
      flat,
      year,
      monthlyStatus,
      totalPaid: payments.filter((p) => p.isPaid).reduce((sum, p) => sum + p.amount, 0),
      paidMonths: payments.filter((p) => p.isPaid).length,
    });
  } catch {
    return sendError(res, 'خطأ في جلب تقرير الشقة', 500);
  }
}

export async function getYearlyReport(req: Request, res: Response) {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();

    const flats = await prisma.flat.findMany({
      where: { isActive: true },
      orderBy: { number: 'asc' },
    });

    const payments = await prisma.payment.findMany({
      where: { year, isPaid: true },
    });

    const report = flats.map((flat) => {
      const flatPayments = payments.filter((p) => p.flatId === flat.id);
      const months: Record<number, boolean> = {};
      for (let m = 1; m <= 12; m++) {
        months[m] = flatPayments.some((p) => p.month === m);
      }
      return {
        flatId: flat.id,
        flatNumber: flat.number,
        ownerName: flat.ownerName,
        months,
        totalPaid: flatPayments.reduce((sum, p) => sum + p.amount, 0),
        paidCount: flatPayments.length,
      };
    });

    const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
    const expenses = await prisma.transaction.findMany({
      where: { year, type: 'expense' },
    });
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

    return sendSuccess(res, {
      year,
      report,
      summary: {
        totalCollected,
        totalExpenses,
        balance: totalCollected - totalExpenses,
      },
    });
  } catch {
    return sendError(res, 'خطأ في جلب التقرير السنوي', 500);
  }
}

export async function getRecentTransactions(_req: Request, res: Response) {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: 'desc' },
      take: 5,
    });
    return sendSuccess(res, transactions);
  } catch {
    return sendError(res, 'خطأ في جلب آخر المعاملات', 500);
  }
}
