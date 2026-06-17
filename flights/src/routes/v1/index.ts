import express from 'express';

import { InfoController } from '../../controllers/index.js';
import airplaneRoutes from './airplane-routes.js';
const router = express.Router();

router.get("/info", InfoController.info);

router.use("/airplanes", airplaneRoutes);

export default router;
