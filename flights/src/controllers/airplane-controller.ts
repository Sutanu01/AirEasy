import { AirplaneService } from "../services/index.js";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { SuccessResponse } from "../utils/common/index.js";

export async function createAirplane(req: Request, res: Response, next: NextFunction) {
  try {
    const { modelNumber, capacity } = req.body;
    const airplane = await AirplaneService.createAirplane({
      modelNumber,
      capacity,
    });

    return res
      .status(StatusCodes.CREATED)
      .json(SuccessResponse("Successfully created the airplane", airplane));
  } catch (error) {
    next(error);
  }
}
