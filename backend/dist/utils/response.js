"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendError = sendError;
function sendSuccess(res, data, message = 'تمت العملية بنجاح', status = 200) {
    const response = { success: true, message, data };
    return res.status(status).json(response);
}
function sendError(res, message, status = 400) {
    const response = { success: false, message, data: null };
    return res.status(status).json(response);
}
//# sourceMappingURL=response.js.map