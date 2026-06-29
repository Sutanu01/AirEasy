import express from 'express';

import { InfoController } from '../../controllers/index.js';
import bookingRoutes from './booking-routes.js';

const router = express.Router();

router.get("/info", InfoController.info);

router.use("/bookings", bookingRoutes);


export default router;
