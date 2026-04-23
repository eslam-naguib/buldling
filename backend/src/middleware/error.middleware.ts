import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export function errorMiddleware(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error('❌ Error:', err.message);

  if (err.name === 'ZodError') {
    return sendError(res, 'بيانات غير صالحة', 422);
  }

  if (err.name === 'PrismaClientKnownRequestError') {
    return sendError(res, 'خطأ في قاعدة البيانات', 409);
  }

  return sendError(res, err.message || 'خطأ في الخادم', 500);
}
