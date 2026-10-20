import express from 'express';

import { AuthController } from '../../controllers/index.js';
import { AuthMiddleware } from '../../middlewares/index.js';

const router = express.Router();

router.post('/signup',
  AuthMiddleware.authRateLimiter,
  AuthMiddleware.validateSignupRequest,
  AuthController.signup
);

router.post('/login',
  AuthMiddleware.authRateLimiter,
  AuthMiddleware.validateLoginRequest,
  AuthController.login
);

router.post('/refresh',
  AuthController.refresh
);

router.post('/logout',
  AuthController.logout
);

router.post('/logout-all',
  AuthMiddleware.isAuthenticated,
  AuthController.logoutAll
);

router.post('/assign-role',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.checkRole(['ADMIN']),
  AuthController.assignRole
);

export default router;
