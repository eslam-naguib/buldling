import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/db';
import { generateToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/response';

export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) {
      return sendError(res, 'اسم المستخدم أو كلمة المرور غير صحيحة', 401);
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return sendError(res, 'اسم المستخدم أو كلمة المرور غير صحيحة', 401);
    }

    const token = generateToken({ adminId: admin.id, username: admin.username });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccess(res, { id: admin.id, username: admin.username }, 'تم تسجيل الدخول بنجاح');
  } catch (error) {
    return sendError(res, 'خطأ في تسجيل الدخول', 500);
  }
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie('token');
  return sendSuccess(res, null, 'تم تسجيل الخروج بنجاح');
}

export async function getMe(req: Request, res: Response) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.admin!.adminId },
      select: { id: true, username: true, createdAt: true },
    });

    if (!admin) {
      return sendError(res, 'المستخدم غير موجود', 404);
    }

    return sendSuccess(res, admin);
  } catch {
    return sendError(res, 'خطأ في جلب البيانات', 500);
  }
}

export async function changePassword(req: Request, res: Response) {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await prisma.admin.findUnique({ where: { id: req.admin!.adminId } });

    if (!admin) return sendError(res, 'المستخدم غير موجود', 404);

    const isValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isValid) return sendError(res, 'كلمة المرور الحالية غير صحيحة', 401);

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({ where: { id: admin.id }, data: { password: hashed } });

    return sendSuccess(res, null, 'تم تغيير كلمة المرور بنجاح');
  } catch {
    return sendError(res, 'خطأ في تغيير كلمة المرور', 500);
  }
}
