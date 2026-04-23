import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { sendSuccess, sendError } from '../utils/response';

export async function getPayments(req: Request, res: Response) {
  try {
    const month = Number(req.query.month) || new Date().getMonth() + 1;
    const year = Number(req.query.year) || new Date().getFullYear();

    const payments = await prisma.payment.findMany({
      where: { month, year },
      include: { flat: { select: { number: true, ownerName: true } } },
      orderBy: { flat: { number: 'asc' } },
    });

    return sendSuccess(res, payments);
  } catch {
    return sendError(res, 'خطأ في جلب المدفوعات', 500);
  }
}

export async function createPayment(req: Request, res: Response) {
  try {
    const { flatId, month, year, amount, notes } = req.body;

    const flat = await prisma.flat.findUnique({ where: { id: flatId } });
    if (!flat) return sendError(res, 'الشقة غير موجودة', 404);

    const existing = await prisma.payment.findUnique({
      where: { flatId_month_year: { flatId, month, year } },
    });
    if (existing) return sendError(res, 'تم تسجيل الدفع لهذا الشهر مسبقاً', 409);

    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          flatId,
          month,
          year,
          amount: amount || flat.monthlyFee,
          isPaid: true,
          paidAt: new Date(),
          notes,
        },
      });

      await tx.transaction.create({
        data: {
          type: 'income',
          category: 'maintenance_fee',
          amount: amount || flat.monthlyFee,
          description: `رسوم صيانة شقة ${flat.number} - ${flat.ownerName}`,
          flatId,
          month,
          year,
          date: new Date(),
        },
      });

      return payment;
    });

    return sendSuccess(res, result, 'تم تسجيل الدفع بنجاح', 201);
  } catch (err: any) {
    if (err.code === 'P2002') return sendError(res, 'تم تسجيل الدفع لهذا الشهر مسبقاً', 409);
    return sendError(res, 'خطأ في تسجيل الدفع', 500);
  }
}

export async function bulkCreatePayments(req: Request, res: Response) {
  try {
    const { flatIds, month, year } = req.body;

    const results = await prisma.$transaction(async (tx) => {
      const payments = [];
      for (const flatId of flatIds) {
        const flat = await tx.flat.findUnique({ where: { id: flatId } });
        if (!flat) continue;

        const existing = await tx.payment.findUnique({
          where: { flatId_month_year: { flatId, month, year } },
        });
        if (existing) continue;

        const payment = await tx.payment.create({
          data: {
            flatId,
            month,
            year,
            amount: flat.monthlyFee,
            isPaid: true,
            paidAt: new Date(),
          },
        });

        await tx.transaction.create({
          data: {
            type: 'income',
            category: 'maintenance_fee',
            amount: flat.monthlyFee,
            description: `رسوم صيانة شقة ${flat.number} - ${flat.ownerName}`,
            flatId,
            month,
            year,
            date: new Date(),
          },
        });

        payments.push(payment);
      }
      return payments;
    });

    return sendSuccess(res, results, `تم تسجيل ${results.length} دفعة بنجاح`, 201);
  } catch {
    return sendError(res, 'خطأ في تسجيل الدفع الجماعي', 500);
  }
}

export async function deletePayment(req: Request, res: Response) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!payment) return sendError(res, 'الدفعة غير موجودة', 404);

    await prisma.$transaction(async (tx) => {
      await tx.payment.delete({ where: { id: payment.id } });

      await tx.transaction.deleteMany({
        where: {
          flatId: payment.flatId,
          month: payment.month,
          year: payment.year,
          type: 'income',
          category: 'maintenance_fee',
        },
      });
    });

    return sendSuccess(res, null, 'تم حذف الدفعة وإلغاء المعاملة المرتبطة بها');
  } catch {
    return sendError(res, 'خطأ في حذف الدفعة', 500);
  }
}

export async function getUnpaid(req: Request, res: Response) {
  try {
    const month = Number(req.query.month) || new Date().getMonth() + 1;
    const year = Number(req.query.year) || new Date().getFullYear();

    const flats = await prisma.flat.findMany({
      where: {
        isActive: true,
        payments: { none: { month, year, isPaid: true } },
      },
      orderBy: { number: 'asc' },
    });

    return sendSuccess(res, flats);
  } catch {
    return sendError(res, 'خطأ في جلب الشقق غير المدفوعة', 500);
  }
}
