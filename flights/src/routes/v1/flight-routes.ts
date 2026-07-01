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

router.get("/:id",
  FlightMiddleware.validateGetRequest,
  FlightController.getFlight
);

router.patch("/:id/seats",
  FlightMiddleware.validateGetRequest,
  FlightMiddleware.validateUpdateSeatsRequest,
  FlightController.updateSeats
);

router.get("/:id/seats",
  FlightMiddleware.validateGetRequest,
  FlightController.getFlightSeats
);

export default router;

