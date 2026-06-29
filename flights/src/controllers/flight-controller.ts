import { FlightService } from "../services/index.js";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { SuccessResponse } from "../utils/common/index.js";

async function createFlight(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      flightNumber,
      airplaneId,
      departureAirportId,
      arrivalAirportId,
      departureTime,
      arrivalTime,
      price,
      boardingGate,
    } = req.body;

    const flight = await FlightService.createFlight({
      flightNumber,
      airplaneId,
      departureAirportId,
      arrivalAirportId,
      departureTime,
      arrivalTime,
      price,
      boardingGate,
    });

    return res
      .status(StatusCodes.CREATED)
      .json(SuccessResponse("Successfully created the flight", flight));
  } catch (error) {
    next(error);
  }
}



async function getAllFlights(req: Request, res: Response, next: NextFunction) {
  try {
    const flights = await FlightService.getAllFlights(req.query);
    const message = flights.length > 0
      ? "Successfully fetched flights"
      : "No flights found";

    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse(message, flights));
  } catch (error) {
    next(error);
  }
}
export {
  createFlight,
  getAllFlights
};
