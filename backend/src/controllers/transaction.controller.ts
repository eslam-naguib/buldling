import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { sendSuccess, sendError } from '../utils/response';

export async function getTransactions(req: Request, res: Response) {
  try {
    const month = Number(req.query.month) || new Date().getMonth() + 1;
    const year = Number(req.query.year) || new Date().getFullYear();
    const type = req.query.type as string | undefined;
    const category = req.query.category as string | undefined;

    const where: any = { month, year };
    if (type) where.type = type;
    if (category) where.category = category;

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    return sendSuccess(res, transactions);
  } catch {
    return sendError(res, 'خطأ في جلب المعاملات', 500);
  }
}

export async function createTransaction(req: Request, res: Response) {
  try {
    const data = { ...req.body, date: new Date(req.body.date) };
    const transaction = await prisma.transaction.create({ data });
    return sendSuccess(res, transaction, 'تم إضافة المعاملة بنجاح', 201);
  } catch {
    return sendError(res, 'خطأ في إضافة المعاملة', 500);
  }
}

export async function updateTransaction(req: Request, res: Response) {
  try {
    const data = { ...req.body };
    if (data.date) data.date = new Date(data.date);

    const transaction = await prisma.transaction.update({
      where: { id: Number(req.params.id) },
      data,
    });
    return sendSuccess(res, transaction, 'تم تحديث المعاملة بنجاح');
  } catch {
    return sendError(res, 'خطأ في تحديث المعاملة', 500);
  }
}

export async function deleteTransaction(req: Request, res: Response) {
  try {
    await prisma.transaction.delete({ where: { id: Number(req.params.id) } });
    return sendSuccess(res, null, 'تم حذف المعاملة بنجاح');
  } catch {
    return sendError(res, 'خطأ في حذف المعاملة', 500);
  }
}
