import express from 'express';
import { InfoController } from '../../controllers/index.js';
import authRoutes from './auth-routes.js';
import { AuthMiddleware } from '../../middlewares/index.js';
import { flightsServiceProxy, bookingServiceProxy } from './proxies.js';

const router = express.Router();

router.get("/info", InfoController.info);
router.use("/auth", authRoutes);

// --- Public read mappings ---
router.get("/flights", flightsServiceProxy);
router.get("/flights/*", flightsServiceProxy);
router.get("/cities", flightsServiceProxy);
router.get("/cities/*", flightsServiceProxy);
router.get("/airports", flightsServiceProxy);
router.get("/airports/*", flightsServiceProxy);
router.get("/bookings/flights/:flightId/seats", bookingServiceProxy);

// --- Admin / Flight Company routes ---
router.all("/airplanes*", 
  AuthMiddleware.isAuthenticated, 
  AuthMiddleware.checkRole(['ADMIN', 'FLIGHT_COMPANY']), 
  flightsServiceProxy
);

router.post("/flights", 
  AuthMiddleware.isAuthenticated, 
  AuthMiddleware.checkRole(['ADMIN', 'FLIGHT_COMPANY']), 
  flightsServiceProxy
);
router.put("/flights/*", 
  AuthMiddleware.isAuthenticated, 
  AuthMiddleware.checkRole(['ADMIN', 'FLIGHT_COMPANY']), 
  flightsServiceProxy
);
router.delete("/flights/*", 
  AuthMiddleware.isAuthenticated, 
  AuthMiddleware.checkRole(['ADMIN', 'FLIGHT_COMPANY']), 
  flightsServiceProxy
);

router.post("/cities", 
  AuthMiddleware.isAuthenticated, 
  AuthMiddleware.checkRole(['ADMIN']), 
  flightsServiceProxy
);
router.put("/cities/*", 
  AuthMiddleware.isAuthenticated, 
  AuthMiddleware.checkRole(['ADMIN']), 
  flightsServiceProxy
);
router.delete("/cities/*", 
  AuthMiddleware.isAuthenticated, 
  AuthMiddleware.checkRole(['ADMIN']), 
  flightsServiceProxy
);

router.post("/airports", 
  AuthMiddleware.isAuthenticated, 
  AuthMiddleware.checkRole(['ADMIN']), 
  flightsServiceProxy
);
router.put("/airports/*", 
  AuthMiddleware.isAuthenticated, 
  AuthMiddleware.checkRole(['ADMIN']), 
  flightsServiceProxy
);
router.delete("/airports/*", 
  AuthMiddleware.isAuthenticated, 
  AuthMiddleware.checkRole(['ADMIN']), 
  flightsServiceProxy
);

// --- Customer / Booking routes (Automatically maps userId from token) ---
router.post("/bookings", 
  AuthMiddleware.isAuthenticated, 
  AuthMiddleware.checkRole(['CUSTOMER', 'ADMIN']), 
  bookingServiceProxy
);
router.post("/bookings/payments", 
  AuthMiddleware.isAuthenticated, 
  AuthMiddleware.checkRole(['CUSTOMER', 'ADMIN']), 
  bookingServiceProxy
);

export default router;
