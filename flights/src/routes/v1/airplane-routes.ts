import { Router } from "express";
import { AirplaneController } from "../../controllers/index.js";
const router = Router();

router.post("/", AirplaneController.createAirplane);

export default router;