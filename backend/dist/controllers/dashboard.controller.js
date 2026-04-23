"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardSummary = getDashboardSummary;
exports.getMonthlyReport = getMonthlyReport;
exports.getFlatReport = getFlatReport;
exports.getYearlyReport = getYearlyReport;
exports.getRecentTransactions = getRecentTransactions;
const db_1 = require("../config/db");
const response_1 = require("../utils/response");
async function getDashboardSummary(req, res) {
    try {
        const month = Number(req.query.month) || new Date().getMonth() + 1;
        const year = Number(req.query.year) || new Date().getFullYear();
        const activeFlats = await db_1.prisma.flat.findMany({ where: { isActive: true } });
        const totalExpected = activeFlats.reduce((sum, flat) => sum + flat.monthlyFee, 0);
        const payments = await db_1.prisma.payment.findMany({
            where: { month, year, isPaid: true },
        });
        const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
        const paidCount = payments.length;
        const expenses = await db_1.prisma.transaction.findMany({
            where: { month, year, type: 'expense' },
        });
        const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
        const balance = totalCollected - totalExpenses;
        const unpaidCount = activeFlats.length - paidCount;
        return (0, response_1.sendSuccess)(res, {
            totalExpected,
            totalCollected,
            totalExpenses,
            balance,
            paidCount,
            unpaidCount,
            totalFlats: activeFlats.length,
            isNegativeBalance: balance < 0,
            collectionRate: activeFlats.length > 0 ? Math.round((paidCount / activeFlats.length) * 100) : 0,
        });
    }
    catch {
        return (0, response_1.sendError)(res, 'خطأ في جلب إحصائيات لوحة التحكم', 500);
    }
}
async function getMonthlyReport(req, res) {
    try {
        const year = Number(req.query.year) || new Date().getFullYear();
        const months = [];
        for (let m = 1; m <= 12; m++) {
            const payments = await db_1.prisma.payment.findMany({
                where: { month: m, year, isPaid: true },
            });
            const collected = payments.reduce((sum, p) => sum + p.amount, 0);
            const expenses = await db_1.prisma.transaction.findMany({
                where: { month: m, year, type: 'expense' },
            });
            const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
            months.push({
                month: m,
                collected,
                expenses: totalExpenses,
                balance: collected - totalExpenses,
                paidCount: payments.length,
            });
        }
        return (0, response_1.sendSuccess)(res, months);
    }
    catch {
        return (0, response_1.sendError)(res, 'خطأ في جلب التقرير الشهري', 500);
    }
}
async function getFlatReport(req, res) {
    try {
        const flatId = Number(req.params.id);
        const year = Number(req.query.year) || new Date().getFullYear();
        const flat = await db_1.prisma.flat.findUnique({ where: { id: flatId } });
        if (!flat)
            return (0, response_1.sendError)(res, 'الشقة غير موجودة', 404);
        const payments = await db_1.prisma.payment.findMany({
            where: { flatId, year },
            orderBy: { month: 'asc' },
        });
        const monthlyStatus = Array.from({ length: 12 }, (_, i) => {
            const payment = payments.find((p) => p.month === i + 1);
            return {
                month: i + 1,
                isPaid: !!payment?.isPaid,
                amount: payment?.amount || 0,
                paidAt: payment?.paidAt || null,
            };
        });
        return (0, response_1.sendSuccess)(res, {
            flat,
            year,
            monthlyStatus,
            totalPaid: payments.filter((p) => p.isPaid).reduce((sum, p) => sum + p.amount, 0),
            paidMonths: payments.filter((p) => p.isPaid).length,
        });
    }
    catch {
        return (0, response_1.sendError)(res, 'خطأ في جلب تقرير الشقة', 500);
    }
}
async function getYearlyReport(req, res) {
    try {
        const year = Number(req.query.year) || new Date().getFullYear();
        const flats = await db_1.prisma.flat.findMany({
            where: { isActive: true },
            orderBy: { number: 'asc' },
        });
        const payments = await db_1.prisma.payment.findMany({
            where: { year, isPaid: true },
        });
        const report = flats.map((flat) => {
            const flatPayments = payments.filter((p) => p.flatId === flat.id);
            const months = {};
            for (let m = 1; m <= 12; m++) {
                months[m] = flatPayments.some((p) => p.month === m);
            }
            return {
                flatId: flat.id,
                flatNumber: flat.number,
                ownerName: flat.ownerName,
                months,
                totalPaid: flatPayments.reduce((sum, p) => sum + p.amount, 0),
                paidCount: flatPayments.length,
            };
        });
        const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
        const expenses = await db_1.prisma.transaction.findMany({
            where: { year, type: 'expense' },
        });
        const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
        return (0, response_1.sendSuccess)(res, {
            year,
            report,
            summary: {
                totalCollected,
                totalExpenses,
                balance: totalCollected - totalExpenses,
            },
        });
    }
    catch {
        return (0, response_1.sendError)(res, 'خطأ في جلب التقرير السنوي', 500);
    }
}
async function getRecentTransactions(_req, res) {
    try {
        const transactions = await db_1.prisma.transaction.findMany({
            orderBy: { date: 'desc' },
            take: 5,
        });
        return (0, response_1.sendSuccess)(res, transactions);
    }
    catch {
        return (0, response_1.sendError)(res, 'خطأ في جلب آخر المعاملات', 500);
    }
}
//# sourceMappingURL=dashboard.controller.js.map