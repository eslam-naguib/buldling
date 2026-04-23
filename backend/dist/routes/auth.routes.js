"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const auth_schema_1 = require("../schemas/auth.schema");
const router = (0, express_1.Router)();
router.post('/login', (0, validate_middleware_1.validate)(auth_schema_1.loginSchema), auth_controller_1.login);
router.post('/logout', auth_controller_1.logout);
router.get('/me', auth_middleware_1.authMiddleware, auth_controller_1.getMe);
router.put('/change-password', auth_middleware_1.authMiddleware, (0, validate_middleware_1.validate)(auth_schema_1.changePasswordSchema), auth_controller_1.changePassword);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map