import { Router } from 'express';
import { getAllFlats, getFlatById, createFlat, updateFlat, deleteFlat, getFlatHistory, bulkUpdateFee } from '../controllers/flat.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createFlatSchema, updateFlatSchema } from '../schemas/flat.schema';

const router = Router();

router.use(authMiddleware);
router.get('/', getAllFlats);
router.get('/:id', getFlatById);
router.post('/', validate(createFlatSchema), createFlat);
router.post('/bulk-update-fee', bulkUpdateFee);
router.put('/:id', validate(updateFlatSchema), updateFlat);
router.delete('/:id', deleteFlat);
router.get('/:id/history', getFlatHistory);

export default router;
