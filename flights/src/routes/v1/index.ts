import express from 'express';

import { InfoController } from '../../controllers/index.js';
import airplaneRoutes from './airplane-routes.js';
import cityRoutes from './city-routes.js';
const router = express.Router();

router.get("/info", InfoController.info);

router.use("/airplanes", airplaneRoutes);
router.use("/cities", cityRoutes);

export default router;
