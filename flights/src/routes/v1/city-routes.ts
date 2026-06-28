import { Router } from "express";
import { CityController } from "../../controllers/index.js";
import { CityMiddleware } from "../../middlewares/index.js";

const router = Router();

router.post("/",
  CityMiddleware.validateCreateRequest,
  CityController.createCity
);

router.get("/",
  CityController.getCities
);

router.delete("/:id",
  CityMiddleware.validateGetRequest,
  CityController.deleteCity
);

router.patch("/:id",
  CityMiddleware.validateGetRequest,
  CityMiddleware.validateUpdateRequest,
  CityController.updateCity
);

export default router;
