"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.logout = logout;
exports.getMe = getMe;
exports.changePassword = changePassword;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../config/db");
const jwt_1 = require("../utils/jwt");
const response_1 = require("../utils/response");
async function login(req, res) {
    try {
        const { username, password } = req.body;
        const admin = await db_1.prisma.admin.findUnique({ where: { username } });
        if (!admin) {
            return (0, response_1.sendError)(res, 'اسم المستخدم أو كلمة المرور غير صحيحة', 401);
        }
        const isValid = await bcrypt_1.default.compare(password, admin.password);
        if (!isValid) {
            return (0, response_1.sendError)(res, 'اسم المستخدم أو كلمة المرور غير صحيحة', 401);
        }
        const token = (0, jwt_1.generateToken)({ adminId: admin.id, username: admin.username });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return (0, response_1.sendSuccess)(res, { id: admin.id, username: admin.username }, 'تم تسجيل الدخول بنجاح');
    }
    catch (error) {
        return (0, response_1.sendError)(res, 'خطأ في تسجيل الدخول', 500);
    }
}
async function logout(_req, res) {
    res.clearCookie('token');
    return (0, response_1.sendSuccess)(res, null, 'تم تسجيل الخروج بنجاح');
}
async function getMe(req, res) {
    try {
        const admin = await db_1.prisma.admin.findUnique({
            where: { id: req.admin.adminId },
            select: { id: true, username: true, createdAt: true },
        });
        if (!admin) {
            return (0, response_1.sendError)(res, 'المستخدم غير موجود', 404);
        }
        return (0, response_1.sendSuccess)(res, admin);
    }
    catch {
        return (0, response_1.sendError)(res, 'خطأ في جلب البيانات', 500);
    }
}
async function changePassword(req, res) {
    try {
        const { currentPassword, newPassword } = req.body;
        const admin = await db_1.prisma.admin.findUnique({ where: { id: req.admin.adminId } });
        if (!admin)
            return (0, response_1.sendError)(res, 'المستخدم غير موجود', 404);
        const isValid = await bcrypt_1.default.compare(currentPassword, admin.password);
        if (!isValid)
            return (0, response_1.sendError)(res, 'كلمة المرور الحالية غير صحيحة', 401);
        const hashed = await bcrypt_1.default.hash(newPassword, 10);
        await db_1.prisma.admin.update({ where: { id: admin.id }, data: { password: hashed } });
        return (0, response_1.sendSuccess)(res, null, 'تم تغيير كلمة المرور بنجاح');
    }
    catch {
        return (0, response_1.sendError)(res, 'خطأ في تغيير كلمة المرور', 500);
    }
}
//# sourceMappingURL=auth.controller.js.map