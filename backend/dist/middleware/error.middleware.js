"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
const response_1 = require("../utils/response");
function errorMiddleware(err, _req, res, _next) {
    console.error('❌ Error:', err.message);
    if (err.name === 'ZodError') {
        return (0, response_1.sendError)(res, 'بيانات غير صالحة', 422);
    }
    if (err.name === 'PrismaClientKnownRequestError') {
        return (0, response_1.sendError)(res, 'خطأ في قاعدة البيانات', 409);
    }
    return (0, response_1.sendError)(res, err.message || 'خطأ في الخادم', 500);
}
//# sourceMappingURL=error.middleware.js.map