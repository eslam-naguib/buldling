"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const flat_controller_1 = require("../controllers/flat.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const flat_schema_1 = require("../schemas/flat.schema");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
router.get('/', flat_controller_1.getAllFlats);
router.get('/:id', flat_controller_1.getFlatById);
router.post('/', (0, validate_middleware_1.validate)(flat_schema_1.createFlatSchema), flat_controller_1.createFlat);
router.post('/bulk-update-fee', flat_controller_1.bulkUpdateFee);
router.put('/:id', (0, validate_middleware_1.validate)(flat_schema_1.updateFlatSchema), flat_controller_1.updateFlat);
router.delete('/:id', flat_controller_1.deleteFlat);
router.get('/:id/history', flat_controller_1.getFlatHistory);
exports.default = router;
//# sourceMappingURL=flat.routes.js.map