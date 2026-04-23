"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const response_1 = require("../utils/response");
function validate(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const messages = result.error.errors.map((e) => e.message).join(', ');
            return (0, response_1.sendError)(res, messages, 422);
        }
        req.body = result.data;
        next();
    };
}
//# sourceMappingURL=validate.middleware.js.map