import { AirportService } from "../services/index.js";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { SuccessResponse } from "../utils/common/index.js";

async function createAirport(req: Request, res: Response, next: NextFunction) {
  try {
    const { airportName, airportCode, address, cityId } = req.body;
    const airport = await AirportService.createAirport({
      airportName,
      airportCode,
      address,
      cityId,
    });

    return res
      .status(StatusCodes.CREATED)
      .json(SuccessResponse("Successfully created the airport", airport));
  } catch (error) {
    next(error);
  }
}

async function getAirports(req: Request, res: Response, next: NextFunction) {
  try {
    const airports = await AirportService.getAirports();
    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse("Successfully fetched all airports", airports));
  } catch (error) {
    next(error);
  }
}

async function getAirport(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id as string, 10);
    const airport = await AirportService.getAirport(id);
    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse("Successfully fetched the airport", airport));
  } catch (error) {
    next(error);
  }
}

async function deleteAirport(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id as string, 10);
    const airport = await AirportService.deleteAirport(id);
    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse("Successfully deleted the airport", airport));
  } catch (error) {
    next(error);
  }
}

async function updateAirport(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id as string, 10);
    const airport = await AirportService.updateAirport(id, req.body);
    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse("Successfully updated the airport", airport));
  } catch (error) {
    next(error);
  }
}

export {
  createAirport,
  getAirports,
  getAirport,
  deleteAirport,
  updateAirport,
};
