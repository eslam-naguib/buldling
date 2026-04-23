import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { sendError } from '../utils/response';

declare global {
  namespace Express {
    interface Request {
      admin?: { adminId: number; username: string };
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;

  if (!token) {
    return sendError(res, 'غير مصرح - يرجى تسجيل الدخول', 401);
  }

  try {
    const decoded = verifyToken(token);
    req.admin = decoded;
    next();
  } catch {
    return sendError(res, 'جلسة غير صالحة - يرجى إعادة تسجيل الدخول', 401);
  }
}
