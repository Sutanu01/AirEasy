import { Router } from "express";
import { AirportController } from "../../controllers/index.js";
import { AirportMiddleware } from "../../middlewares/index.js";

const router = Router();

router.post("/",
  AirportMiddleware.validateCreateRequest,
  AirportController.createAirport
);

router.get("/",
  AirportController.getAirports
);

router.get("/:id",
  AirportMiddleware.validateGetRequest,
  AirportController.getAirport
);

router.delete("/:id",
  AirportMiddleware.validateGetRequest,
  AirportController.deleteAirport
);

router.patch("/:id",
  AirportMiddleware.validateGetRequest,
  AirportMiddleware.validateUpdateRequest,
  AirportController.updateAirport
);

export default router;
