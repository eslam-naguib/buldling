"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, 'اسم المستخدم مطلوب'),
    password: zod_1.z.string().min(1, 'كلمة المرور مطلوبة'),
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, 'كلمة المرور الحالية مطلوبة'),
    newPassword: zod_1.z.string().min(6, 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل'),
});
//# sourceMappingURL=auth.schema.js.map