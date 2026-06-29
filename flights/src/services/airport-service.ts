import AirportRepository from "../repositories/airport-repository.js";
import { Airport, Prisma } from "@prisma/client";
import { AppError } from "../utils/errors/app-error.js";
import { StatusCodes } from "http-status-codes";

const airportRepository = new AirportRepository();

async function createAirport(data: Prisma.AirportUncheckedCreateInput): Promise<Airport> {
  try {
    return await airportRepository.create(data);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new AppError("Airport name or code already exists", StatusCodes.BAD_REQUEST);
      }
      if (error.code === "P2003") {
        throw new AppError("The city requested to be associated does not exist", StatusCodes.BAD_REQUEST);
      }
    }
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new AppError(error.message, StatusCodes.BAD_REQUEST);
    }
    throw new AppError("Cannot create a new Airport object", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function getAirports(): Promise<Airport[]> {
  try {
    return await airportRepository.getAll();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new AppError(error.message, StatusCodes.BAD_REQUEST);
    }
    throw new AppError("Cannot fetch all airports", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function getAirport(id: number): Promise<Airport> {
  try {
    const airport = await airportRepository.get(id);
    if (!airport) {
      throw new AppError("The airport you requested was not found", StatusCodes.NOT_FOUND);
    }
    return airport;
  } catch (error) {
    if (error instanceof AppError && error.statusCode === StatusCodes.NOT_FOUND) {
      throw new AppError("The airport you requested was not found", StatusCodes.NOT_FOUND);
    }
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new AppError(error.message, StatusCodes.BAD_REQUEST);
    }
    throw new AppError("Cannot fetch the airport details", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function deleteAirport(id: number): Promise<Airport> {
  try {
    return await airportRepository.delete(id);
  } catch (error) {
    if (
      (error instanceof AppError && error.statusCode === StatusCodes.NOT_FOUND) ||
      (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025")
    ) {
      throw new AppError("The airport you requested to delete was not found", StatusCodes.NOT_FOUND);
    }
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new AppError(error.message, StatusCodes.BAD_REQUEST);
    }
    throw new AppError("Cannot delete the airport", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function updateAirport(id: number, data: Prisma.AirportUncheckedUpdateInput): Promise<Airport> {
  try {
    return await airportRepository.update(id, data);
  } catch (error) {
    if (
      (error instanceof AppError && error.statusCode === StatusCodes.NOT_FOUND) ||
      (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025")
    ) {
      throw new AppError("The airport you requested to update was not found", StatusCodes.NOT_FOUND);
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new AppError("Airport name or code already exists", StatusCodes.BAD_REQUEST);
      }
      if (error.code === "P2003") {
        throw new AppError("The city requested to be associated does not exist", StatusCodes.BAD_REQUEST);
      }
    }
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new AppError(error.message, StatusCodes.BAD_REQUEST);
    }
    throw new AppError("Cannot update the airport", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export {
  createAirport,
  getAirports,
  getAirport,
  deleteAirport,
  updateAirport,
};
