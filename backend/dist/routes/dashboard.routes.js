"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
router.get('/summary', dashboard_controller_1.getDashboardSummary);
router.get('/monthly', dashboard_controller_1.getMonthlyReport);
router.get('/yearly', dashboard_controller_1.getYearlyReport);
router.get('/flat/:id', dashboard_controller_1.getFlatReport);
router.get('/recent-transactions', dashboard_controller_1.getRecentTransactions);
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map