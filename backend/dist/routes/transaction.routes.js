"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transaction_controller_1 = require("../controllers/transaction.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const transaction_schema_1 = require("../schemas/transaction.schema");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
router.get('/', transaction_controller_1.getTransactions);
router.post('/', (0, validate_middleware_1.validate)(transaction_schema_1.createTransactionSchema), transaction_controller_1.createTransaction);
router.put('/:id', (0, validate_middleware_1.validate)(transaction_schema_1.updateTransactionSchema), transaction_controller_1.updateTransaction);
router.delete('/:id', transaction_controller_1.deleteTransaction);
exports.default = router;
//# sourceMappingURL=transaction.routes.js.map