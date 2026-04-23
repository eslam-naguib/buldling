"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFlats = getAllFlats;
exports.getFlatById = getFlatById;
exports.createFlat = createFlat;
exports.updateFlat = updateFlat;
exports.deleteFlat = deleteFlat;
exports.getFlatHistory = getFlatHistory;
exports.bulkUpdateFee = bulkUpdateFee;
const db_1 = require("../config/db");
const response_1 = require("../utils/response");
async function getAllFlats(req, res) {
    try {
        const month = Number(req.query.month) || new Date().getMonth() + 1;
        const year = Number(req.query.year) || new Date().getFullYear();
        const flats = await db_1.prisma.flat.findMany({
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
        return (0, response_1.sendSuccess)(res, data);
    }
    catch {
        return (0, response_1.sendError)(res, 'خطأ في جلب الشقق', 500);
    }
}
async function getFlatById(req, res) {
    try {
        const flat = await db_1.prisma.flat.findUnique({
            where: { id: Number(req.params.id) },
            include: {
                payments: { orderBy: { createdAt: 'desc' }, take: 12 },
            },
        });
        if (!flat)
            return (0, response_1.sendError)(res, 'الشقة غير موجودة', 404);
        return (0, response_1.sendSuccess)(res, flat);
    }
    catch {
        return (0, response_1.sendError)(res, 'خطأ في جلب بيانات الشقة', 500);
    }
}
async function createFlat(req, res) {
    try {
        const flat = await db_1.prisma.flat.create({ data: req.body });
        return (0, response_1.sendSuccess)(res, flat, 'تم إضافة الشقة بنجاح', 201);
    }
    catch {
        return (0, response_1.sendError)(res, 'خطأ في إضافة الشقة - قد يكون الرقم مستخدم مسبقاً', 409);
    }
}
async function updateFlat(req, res) {
    try {
        const flat = await db_1.prisma.flat.update({
            where: { id: Number(req.params.id) },
            data: req.body,
        });
        return (0, response_1.sendSuccess)(res, flat, 'تم تحديث بيانات الشقة بنجاح');
    }
    catch {
        return (0, response_1.sendError)(res, 'خطأ في تحديث بيانات الشقة', 500);
    }
}
async function deleteFlat(req, res) {
    try {
        await db_1.prisma.flat.update({
            where: { id: Number(req.params.id) },
            data: { isActive: false },
        });
        return (0, response_1.sendSuccess)(res, null, 'تم حذف الشقة بنجاح');
    }
    catch {
        return (0, response_1.sendError)(res, 'خطأ في حذف الشقة', 500);
    }
}
async function getFlatHistory(req, res) {
    try {
        const payments = await db_1.prisma.payment.findMany({
            where: { flatId: Number(req.params.id) },
            orderBy: [{ year: 'desc' }, { month: 'desc' }],
            take: 24,
        });
        return (0, response_1.sendSuccess)(res, payments);
    }
    catch {
        return (0, response_1.sendError)(res, 'خطأ في جلب سجل المدفوعات', 500);
    }
}
async function bulkUpdateFee(req, res) {
    try {
        const { amount } = req.body;
        if (!amount || amount < 0) {
            return (0, response_1.sendError)(res, 'المبلغ غير صالح', 400);
        }
        await db_1.prisma.flat.updateMany({
            where: { isActive: true },
            data: { monthlyFee: Number(amount) },
        });
        return (0, response_1.sendSuccess)(res, null, 'تم تحديث مبلغ الاشتراك الشهري لجميع الشقق بنجاح');
    }
    catch {
        return (0, response_1.sendError)(res, 'خطأ في تحديث مبلغ الاشتراك', 500);
    }
}
//# sourceMappingURL=flat.controller.js.map