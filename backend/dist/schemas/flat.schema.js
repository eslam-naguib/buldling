"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFlatSchema = exports.createFlatSchema = void 0;
const zod_1 = require("zod");
exports.createFlatSchema = zod_1.z.object({
    number: zod_1.z.number().int().positive('رقم الشقة مطلوب'),
    ownerName: zod_1.z.string().optional().or(zod_1.z.literal('')),
    phone: zod_1.z.string().optional(),
    email: zod_1.z.string().email('بريد إلكتروني غير صالح').optional().or(zod_1.z.literal('')),
    monthlyFee: zod_1.z.number().int().positive('المبلغ الشهري مطلوب').default(200),
    notes: zod_1.z.string().optional(),
});
exports.updateFlatSchema = zod_1.z.object({
    ownerName: zod_1.z.string().optional().or(zod_1.z.literal('')),
    phone: zod_1.z.string().optional(),
    email: zod_1.z.string().email('بريد إلكتروني غير صالح').optional().or(zod_1.z.literal('')),
    monthlyFee: zod_1.z.number().int().positive('المبلغ الشهري مطلوب').optional(),
    notes: zod_1.z.string().optional(),
});
//# sourceMappingURL=flat.schema.js.map