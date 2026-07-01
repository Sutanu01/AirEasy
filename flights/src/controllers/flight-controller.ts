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

async function getFlight(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id as string, 10);
    const flight = await FlightService.getFlight(id);
    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse("Successfully fetched the flight", flight));
  } catch (error) {
    next(error);
  }
}

async function updateSeats(req: Request, res: Response, next: NextFunction) {
  try {
    const flightId = parseInt(req.params.id as string, 10);
    const { seats, dec } = req.body;
    const flight = await FlightService.updateSeats(flightId, seats, dec ?? true);
    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse("Successfully updated seats on the flight", flight));
  } catch (error) {
    next(error);
  }
}

async function getFlightSeats(req: Request, res: Response, next: NextFunction) {
  try {
    const flightId = parseInt(req.params.id as string, 10);
    const seats = await FlightService.getFlightSeats(flightId);
    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse("Successfully fetched physical seats map for the flight", seats));
  } catch (error) {
    next(error);
  }
}

export {
  createFlight,
  getAllFlights,
  getFlight,
  updateSeats,
  getFlightSeats,
};

