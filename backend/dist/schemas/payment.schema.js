"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkPaymentSchema = exports.createPaymentSchema = void 0;
const zod_1 = require("zod");
exports.createPaymentSchema = zod_1.z.object({
    flatId: zod_1.z.number().int().positive('رقم الشقة مطلوب'),
    month: zod_1.z.number().int().min(1).max(12, 'الشهر غير صالح'),
    year: zod_1.z.number().int().min(2020).max(2100, 'السنة غير صالحة'),
    amount: zod_1.z.number().int().positive('المبلغ مطلوب'),
    notes: zod_1.z.string().optional(),
});
exports.bulkPaymentSchema = zod_1.z.object({
    flatIds: zod_1.z.array(zod_1.z.number().int().positive()).min(1, 'يرجى اختيار شقة واحدة على الأقل'),
    month: zod_1.z.number().int().min(1).max(12),
    year: zod_1.z.number().int().min(2020).max(2100),
});
//# sourceMappingURL=payment.schema.js.map