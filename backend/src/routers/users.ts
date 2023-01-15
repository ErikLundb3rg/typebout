import { Router } from 'express';
import { asyncHandler } from '../api-utils';
import { login, register } from '../controllers/user';

const router = Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));

export default router;
