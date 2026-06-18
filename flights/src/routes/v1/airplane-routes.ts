import { Router } from "express";
import { AirplaneController } from "../../controllers/index.js";
import { AirplaneMiddleware } from "../../middlewares/index.js";
const router = Router();

router.post("/",
    AirplaneMiddleware.validateCreateRequest,
    AirplaneController.createAirplane);

export default router;