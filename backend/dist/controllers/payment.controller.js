"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPayments = getPayments;
exports.createPayment = createPayment;
exports.bulkCreatePayments = bulkCreatePayments;
exports.deletePayment = deletePayment;
exports.getUnpaid = getUnpaid;
const db_1 = require("../config/db");
const response_1 = require("../utils/response");
async function getPayments(req, res) {
    try {
        const month = Number(req.query.month) || new Date().getMonth() + 1;
        const year = Number(req.query.year) || new Date().getFullYear();
        const payments = await db_1.prisma.payment.findMany({
            where: { month, year },
            include: { flat: { select: { number: true, ownerName: true } } },
            orderBy: { flat: { number: 'asc' } },
        });
        return (0, response_1.sendSuccess)(res, payments);
    }
    catch {
        return (0, response_1.sendError)(res, 'خطأ في جلب المدفوعات', 500);
    }
}
async function createPayment(req, res) {
    try {
        const { flatId, month, year, amount, notes } = req.body;
        const flat = await db_1.prisma.flat.findUnique({ where: { id: flatId } });
        if (!flat)
            return (0, response_1.sendError)(res, 'الشقة غير موجودة', 404);
        const existing = await db_1.prisma.payment.findUnique({
            where: { flatId_month_year: { flatId, month, year } },
        });
        if (existing)
            return (0, response_1.sendError)(res, 'تم تسجيل الدفع لهذا الشهر مسبقاً', 409);
        const result = await db_1.prisma.$transaction(async (tx) => {
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
        return (0, response_1.sendSuccess)(res, result, 'تم تسجيل الدفع بنجاح', 201);
    }
    catch (err) {
        if (err.code === 'P2002')
            return (0, response_1.sendError)(res, 'تم تسجيل الدفع لهذا الشهر مسبقاً', 409);
        return (0, response_1.sendError)(res, 'خطأ في تسجيل الدفع', 500);
    }
}
async function bulkCreatePayments(req, res) {
    try {
        const { flatIds, month, year } = req.body;
        const results = await db_1.prisma.$transaction(async (tx) => {
            const payments = [];
            for (const flatId of flatIds) {
                const flat = await tx.flat.findUnique({ where: { id: flatId } });
                if (!flat)
                    continue;
                const existing = await tx.payment.findUnique({
                    where: { flatId_month_year: { flatId, month, year } },
                });
                if (existing)
                    continue;
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
        return (0, response_1.sendSuccess)(res, results, `تم تسجيل ${results.length} دفعة بنجاح`, 201);
    }
    catch {
        return (0, response_1.sendError)(res, 'خطأ في تسجيل الدفع الجماعي', 500);
    }
}
async function deletePayment(req, res) {
    try {
        const payment = await db_1.prisma.payment.findUnique({
            where: { id: Number(req.params.id) },
        });
        if (!payment)
            return (0, response_1.sendError)(res, 'الدفعة غير موجودة', 404);
        await db_1.prisma.$transaction(async (tx) => {
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
        return (0, response_1.sendSuccess)(res, null, 'تم حذف الدفعة وإلغاء المعاملة المرتبطة بها');
    }
    catch {
        return (0, response_1.sendError)(res, 'خطأ في حذف الدفعة', 500);
    }
}
async function getUnpaid(req, res) {
    try {
        const month = Number(req.query.month) || new Date().getMonth() + 1;
        const year = Number(req.query.year) || new Date().getFullYear();
        const flats = await db_1.prisma.flat.findMany({
            where: {
                isActive: true,
                payments: { none: { month, year, isPaid: true } },
            },
            orderBy: { number: 'asc' },
        });
        return (0, response_1.sendSuccess)(res, flats);
    }
    catch {
        return (0, response_1.sendError)(res, 'خطأ في جلب الشقق غير المدفوعة', 500);
    }
}
//# sourceMappingURL=payment.controller.js.map