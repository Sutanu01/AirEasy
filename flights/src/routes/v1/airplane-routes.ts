import { Router } from "express";
import { AirplaneController } from "../../controllers/index.js";
import { AirplaneMiddleware } from "../../middlewares/index.js";
const router = Router();

router.post("/",
    AirplaneMiddleware.validateCreateRequest,
    AirplaneController.createAirplane
);

router.get("/",
    AirplaneController.getAirplanes
);

router.get("/:id",
    AirplaneMiddleware.validateGetRequest,
    AirplaneController.getAirplane
);

router.delete("/:id",
    AirplaneMiddleware.validateGetRequest,
    AirplaneController.deleteAirplane
);

router.patch("/:id",
    AirplaneMiddleware.validateGetRequest,
    AirplaneMiddleware.validateUpdateRequest,
    AirplaneController.updateAirplane
);
export default router;