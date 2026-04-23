import { Router } from 'express';
import { getPayments, createPayment, deletePayment, getUnpaid, bulkCreatePayments } from '../controllers/payment.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createPaymentSchema, bulkPaymentSchema } from '../schemas/payment.schema';

const router = Router();

router.use(authMiddleware);
router.get('/', getPayments);
router.post('/', validate(createPaymentSchema), createPayment);
router.post('/bulk', validate(bulkPaymentSchema), bulkCreatePayments);
router.delete('/:id', deletePayment);
router.get('/unpaid', getUnpaid);

export default router;
