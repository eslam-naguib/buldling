"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const payment_schema_1 = require("../schemas/payment.schema");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
router.get('/', payment_controller_1.getPayments);
router.post('/', (0, validate_middleware_1.validate)(payment_schema_1.createPaymentSchema), payment_controller_1.createPayment);
router.post('/bulk', (0, validate_middleware_1.validate)(payment_schema_1.bulkPaymentSchema), payment_controller_1.bulkCreatePayments);
router.delete('/:id', payment_controller_1.deletePayment);
router.get('/unpaid', payment_controller_1.getUnpaid);
exports.default = router;
//# sourceMappingURL=payment.routes.js.map