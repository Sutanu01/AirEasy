import { AirplaneService } from "../services/index.js";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { SuccessResponse } from "../utils/common/index.js";

async function createAirplane(req: Request, res: Response, next: NextFunction) {
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

async function getAirplanes(req: Request, res: Response, next: NextFunction) {
  try {
    const airplanes = await AirplaneService.getAirplanes();
    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse("Successfully fetched all airplanes", airplanes));
  } catch (error) {
    next(error);
  }
}

async function getAirplane(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id as string, 10);
    const airplane = await AirplaneService.getAirplane(id);
    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse("Successfully fetched the airplane", airplane));
  } catch (error) {
    next(error);
  }
}

async function deleteAirplane(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id as string, 10);
    const airplane = await AirplaneService.deleteAirplane(id);
    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse("Successfully deleted the airplane", airplane));
  } catch (error) {
    next(error);
  }
}

async function updateAirplane(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id as string, 10);
    const airplane = await AirplaneService.updateAirplane(id, req.body);
    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse("Successfully updated the airplane", airplane));
  } catch (error) {
    next(error);
  }
}

export {
  createAirplane,
  getAirplanes,
  getAirplane,
  deleteAirplane,
  updateAirplane
}