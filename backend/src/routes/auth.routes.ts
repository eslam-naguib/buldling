import { Router } from 'express';
import { login, logout, getMe, changePassword } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { loginSchema, changePasswordSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', authMiddleware, getMe);
router.put('/change-password', authMiddleware, validate(changePasswordSchema), changePassword);

export default router;
