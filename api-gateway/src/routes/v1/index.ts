import express from 'express';

import { InfoController } from '../../controllers/index.js';
import authRoutes from './auth-routes.js';

const router = express.Router();

router.get("/info", InfoController.info);

router.use("/auth", authRoutes);


export default router;
