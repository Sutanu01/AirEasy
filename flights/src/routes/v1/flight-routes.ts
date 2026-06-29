import { Router } from "express";
import { FlightController } from "../../controllers/index.js";
import { FlightMiddleware } from "../../middlewares/index.js";

const router = Router();

router.post("/",
  FlightMiddleware.validateCreateRequest,
  FlightController.createFlight
);

router.get("/",
  FlightController.getAllFlights
);

export default router;
