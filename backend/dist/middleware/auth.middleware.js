"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jwt_1 = require("../utils/jwt");
const response_1 = require("../utils/response");
function authMiddleware(req, res, next) {
    const token = req.cookies?.token;
    if (!token) {
        return (0, response_1.sendError)(res, 'غير مصرح - يرجى تسجيل الدخول', 401);
    }
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        req.admin = decoded;
        next();
    }
    catch {
        return (0, response_1.sendError)(res, 'جلسة غير صالحة - يرجى إعادة تسجيل الدخول', 401);
    }
}
//# sourceMappingURL=auth.middleware.js.map