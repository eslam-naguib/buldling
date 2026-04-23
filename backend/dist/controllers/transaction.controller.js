"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactions = getTransactions;
exports.createTransaction = createTransaction;
exports.updateTransaction = updateTransaction;
exports.deleteTransaction = deleteTransaction;
const db_1 = require("../config/db");
const response_1 = require("../utils/response");
async function getTransactions(req, res) {
    try {
        const month = Number(req.query.month) || new Date().getMonth() + 1;
        const year = Number(req.query.year) || new Date().getFullYear();
        const type = req.query.type;
        const category = req.query.category;
        const where = { month, year };
        if (type)
            where.type = type;
        if (category)
            where.category = category;
        const transactions = await db_1.prisma.transaction.findMany({
            where,
            orderBy: { date: 'desc' },
        });
        return (0, response_1.sendSuccess)(res, transactions);
    }
    catch {
        return (0, response_1.sendError)(res, 'خطأ في جلب المعاملات', 500);
    }
}
async function createTransaction(req, res) {
    try {
        const data = { ...req.body, date: new Date(req.body.date) };
        const transaction = await db_1.prisma.transaction.create({ data });
        return (0, response_1.sendSuccess)(res, transaction, 'تم إضافة المعاملة بنجاح', 201);
    }
    catch {
        return (0, response_1.sendError)(res, 'خطأ في إضافة المعاملة', 500);
    }
}
async function updateTransaction(req, res) {
    try {
        const data = { ...req.body };
        if (data.date)
            data.date = new Date(data.date);
        const transaction = await db_1.prisma.transaction.update({
            where: { id: Number(req.params.id) },
            data,
        });
        return (0, response_1.sendSuccess)(res, transaction, 'تم تحديث المعاملة بنجاح');
    }
    catch {
        return (0, response_1.sendError)(res, 'خطأ في تحديث المعاملة', 500);
    }
}
async function deleteTransaction(req, res) {
    try {
        await db_1.prisma.transaction.delete({ where: { id: Number(req.params.id) } });
        return (0, response_1.sendSuccess)(res, null, 'تم حذف المعاملة بنجاح');
    }
    catch {
        return (0, response_1.sendError)(res, 'خطأ في حذف المعاملة', 500);
    }
}
//# sourceMappingURL=transaction.controller.js.map