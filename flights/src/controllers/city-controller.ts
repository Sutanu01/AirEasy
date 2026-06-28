import { CityService } from "../services/index.js";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { SuccessResponse } from "../utils/common/index.js";

async function createCity(req: Request, res: Response, next: NextFunction) {
  try {
    const { cityName } = req.body;
    const city = await CityService.createCity({
      cityName,
    });

    return res
      .status(StatusCodes.CREATED)
      .json(SuccessResponse("Successfully created the city", city));
  } catch (error) {
    next(error);
  }
}

async function getCities(req: Request, res: Response, next: NextFunction) {
  try {
    const cities = await CityService.getCities();
    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse("Successfully fetched all cities", cities));
  } catch (error) {
    next(error);
  }
}

async function deleteCity(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id as string, 10);
    const city = await CityService.deleteCity(id);
    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse("Successfully deleted the city", city));
  } catch (error) {
    next(error);
  }
}

async function updateCity(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id as string, 10);
    const city = await CityService.updateCity(id, req.body);
    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse("Successfully updated the city", city));
  } catch (error) {
    next(error);
  }
}

export {
  createCity,
  getCities,
  deleteCity,
  updateCity,
};
