import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { sendSuccess, sendError } from '../utils/response';

export async function getAllFlats(req: Request, res: Response) {
  try {
    const month = Number(req.query.month) || new Date().getMonth() + 1;
    const year = Number(req.query.year) || new Date().getFullYear();

    const flats = await prisma.flat.findMany({
      where: { isActive: true },
      include: {
        payments: {
          where: { month, year },
          take: 1,
        },
      },
      orderBy: { number: 'asc' },
    });

    const data = flats.map((flat) => ({
      ...flat,
      isPaid: flat.payments.length > 0 && flat.payments[0].isPaid,
      payment: flat.payments[0] || null,
    }));

    return sendSuccess(res, data);
  } catch {
    return sendError(res, 'خطأ في جلب الشقق', 500);
  }
}

export async function getFlatById(req: Request, res: Response) {
  try {
    const flat = await prisma.flat.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        payments: { orderBy: { createdAt: 'desc' }, take: 12 },
      },
    });

    if (!flat) return sendError(res, 'الشقة غير موجودة', 404);
    return sendSuccess(res, flat);
  } catch {
    return sendError(res, 'خطأ في جلب بيانات الشقة', 500);
  }
}

export async function createFlat(req: Request, res: Response) {
  try {
    const flat = await prisma.flat.create({ data: req.body });
    return sendSuccess(res, flat, 'تم إضافة الشقة بنجاح', 201);
  } catch {
    return sendError(res, 'خطأ في إضافة الشقة - قد يكون الرقم مستخدم مسبقاً', 409);
  }
}

export async function updateFlat(req: Request, res: Response) {
  try {
    const flat = await prisma.flat.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    return sendSuccess(res, flat, 'تم تحديث بيانات الشقة بنجاح');
  } catch {
    return sendError(res, 'خطأ في تحديث بيانات الشقة', 500);
  }
}

export async function deleteFlat(req: Request, res: Response) {
  try {
    await prisma.flat.update({
      where: { id: Number(req.params.id) },
      data: { isActive: false },
    });
    return sendSuccess(res, null, 'تم حذف الشقة بنجاح');
  } catch {
    return sendError(res, 'خطأ في حذف الشقة', 500);
  }
}

export async function getFlatHistory(req: Request, res: Response) {
  try {
    const payments = await prisma.payment.findMany({
      where: { flatId: Number(req.params.id) },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
      take: 24,
    });
    return sendSuccess(res, payments);
  } catch {
    return sendError(res, 'خطأ في جلب سجل المدفوعات', 500);
  }
}

export async function bulkUpdateFee(req: Request, res: Response) {
  try {
    const { amount } = req.body;
    if (!amount || amount < 0) {
      return sendError(res, 'المبلغ غير صالح', 400);
    }
    
    await prisma.flat.updateMany({
      where: { isActive: true },
      data: { monthlyFee: Number(amount) },
    });
    
    return sendSuccess(res, null, 'تم تحديث مبلغ الاشتراك الشهري لجميع الشقق بنجاح');
  } catch {
    return sendError(res, 'خطأ في تحديث مبلغ الاشتراك', 500);
  }
}
