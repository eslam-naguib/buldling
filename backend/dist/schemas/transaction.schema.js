"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTransactionSchema = exports.createTransactionSchema = void 0;
const zod_1 = require("zod");
exports.createTransactionSchema = zod_1.z.object({
    type: zod_1.z.enum(['income', 'expense'], { message: 'النوع يجب أن يكون دخول أو خروج' }),
    category: zod_1.z.enum(['maintenance_fee', 'elevator', 'cleaning', 'electricity', 'water', 'other'], {
        message: 'التصنيف غير صالح',
    }),
    amount: zod_1.z.number().int().positive('المبلغ مطلوب'),
    description: zod_1.z.string().min(1, 'البيان مطلوب'),
    flatId: zod_1.z.number().int().positive().optional().nullable(),
    month: zod_1.z.number().int().min(1).max(12),
    year: zod_1.z.number().int().min(2020).max(2100),
    date: zod_1.z.string().or(zod_1.z.date()),
});
exports.updateTransactionSchema = exports.createTransactionSchema.partial();
//# sourceMappingURL=transaction.schema.js.map