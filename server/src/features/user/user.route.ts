import { Router } from 'express'
// import authenticateToken from '../../middleware/authMiddleware'
import * as userController from './user.controller'
import authenticateToken from '../../middleware/authMiddleware';

const router = Router();

router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/sign-up', userController.signup);

router.get('/:id', authenticateToken, userController.get);
router.put('/:id', authenticateToken, userController.update);

export default router;