import FlightRepository from "../repositories/flight-repository.js";
import AirplaneRepository from "../repositories/airplane-repository.js";
import { Flight, Prisma } from "@prisma/client";
import { AppError } from "../utils/errors/app-error.js";
import { StatusCodes } from "http-status-codes";
import DateTimeHelpers from "../utils/helpers/datetime-helpers.js";
import { buildFlightQueryFilters } from "../utils/helpers/flight-query-builder.js";

const flightRepository = new FlightRepository();
const airplaneRepository = new AirplaneRepository();

async function createFlight(data: Omit<Prisma.FlightUncheckedCreateInput, "availableSeats">): Promise<Flight> {

  // Bussiness LOGIC CHECKS
  DateTimeHelpers.validateNotEqual(data.departureAirportId, data.arrivalAirportId, "Departure and arrival airports must be different");

  DateTimeHelpers.validateTimeOrder(data.departureTime, data.arrivalTime, "Arrival time cannot be before or equal to departure time");
  

  const airplane = await airplaneRepository.get(data.airplaneId);
  if (!airplane) {
    throw new AppError("The airplane requested to be associated does not exist", StatusCodes.BAD_REQUEST);
  }

  const flightData: Prisma.FlightUncheckedCreateInput = {
    ...data,
    availableSeats: airplane.capacity,
  };

  try {
    return await flightRepository.create(flightData);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new AppError("Flight number already exists", StatusCodes.BAD_REQUEST);
      }
      if (error.code === "P2003") {
        const fieldName = (error.meta?.field_name as string) || "";
        if (fieldName.includes("airplaneId")) {
          throw new AppError("The airplane requested to be associated does not exist", StatusCodes.BAD_REQUEST);
        }
        if (fieldName.includes("departureAirportId")) {
          throw new AppError("The departure airport requested to be associated does not exist", StatusCodes.BAD_REQUEST);
        }
        if (fieldName.includes("arrivalAirportId")) {
          throw new AppError("The arrival airport requested to be associated does not exist", StatusCodes.BAD_REQUEST);
        }
        throw new AppError("A related resource (airplane or airport) was not found", StatusCodes.BAD_REQUEST);
      }
    }
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new AppError(error.message, StatusCodes.BAD_REQUEST);
    }
    throw new AppError("Cannot create a new Flight object", StatusCodes.INTERNAL_SERVER_ERROR); 
  }
}




async function getAllFlights(query: any): Promise<Flight[]> {
  try {
    const { where, orderBy } = buildFlightQueryFilters(query);
    const flights = await flightRepository.getAllFlights(where, orderBy);
    return flights;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new AppError(error.message, StatusCodes.BAD_REQUEST);
    }
    throw new AppError("Cannot fetch flights", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function getFlight(id: number): Promise<Flight> {
  try {
    const flight = await flightRepository.getFlight(id);
    if (!flight) {
      throw new AppError("The flight you requested was not found", StatusCodes.NOT_FOUND);
    }
    return flight;
  } catch (error) {
    if (error instanceof AppError && error.statusCode === StatusCodes.NOT_FOUND) {
      throw new AppError("The flight you requested was not found", StatusCodes.NOT_FOUND);
    }
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new AppError(error.message, StatusCodes.BAD_REQUEST);
    }
    throw new AppError("Cannot fetch the flight details", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function updateSeats(flightId: number, seats: number, dec: boolean): Promise<Flight> {
  try {
    const response = await flightRepository.updateRemainingSeats(flightId, seats, dec);
    return response;
  } catch (error) {
    console.error("Error in updateSeats service:", error);
    if (error instanceof AppError) {
      throw error;
    }
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new AppError(error.message, StatusCodes.BAD_REQUEST);
    }
    throw new AppError("Cannot update seats on the flight", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export {
  createFlight,
  getAllFlights,
  getFlight,
  updateSeats,
};