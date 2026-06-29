import express from 'express';

import { InfoController } from '../../controllers/index.js';
import airplaneRoutes from './airplane-routes.js';
import cityRoutes from './city-routes.js';
import airportRoutes from './airport-routes.js';
import flightRoutes from './flight-routes.js';
const router = express.Router();

router.get("/info", InfoController.info);

router.use("/airplanes", airplaneRoutes);
router.use("/cities", cityRoutes);
router.use("/airports", airportRoutes);
router.use("/flights", flightRoutes);

export default router;
