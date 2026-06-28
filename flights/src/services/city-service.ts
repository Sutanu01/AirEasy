import CityRepository from "../repositories/city-repository.js";
import { City, Prisma } from "@prisma/client";
import { AppError } from "../utils/errors/app-error.js";
import { StatusCodes } from "http-status-codes";

const cityRepository = new CityRepository();

async function createCity(data: Prisma.CityCreateInput): Promise<City> {
  try {
    return await cityRepository.create(data);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new AppError("City name already exists", StatusCodes.BAD_REQUEST);
    }
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new AppError(error.message, StatusCodes.BAD_REQUEST);
    }
    throw new AppError("Cannot create a new City object", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function getCities(): Promise<City[]> {
  try {
    return await cityRepository.getAll();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new AppError(error.message, StatusCodes.BAD_REQUEST);
    }
    throw new AppError("Cannot fetch all cities", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function deleteCity(id: number): Promise<City> {
  try {
    return await cityRepository.delete(id);
  } catch (error) {
    if (
      (error instanceof AppError && error.statusCode === StatusCodes.NOT_FOUND) ||
      (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025")
    ) {
      throw new AppError("The city you requested to delete was not found", StatusCodes.NOT_FOUND);
    }
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new AppError(error.message, StatusCodes.BAD_REQUEST);
    }
    throw new AppError("Cannot delete the city", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function updateCity(id: number, data: Prisma.CityUpdateInput): Promise<City> {
  try {
    return await cityRepository.update(id, data);
  } catch (error) {
    if (
      (error instanceof AppError && error.statusCode === StatusCodes.NOT_FOUND) ||
      (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025")
    ) {
      throw new AppError("The city you requested to update was not found", StatusCodes.NOT_FOUND);
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new AppError("City name already exists", StatusCodes.BAD_REQUEST);
    }
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new AppError(error.message, StatusCodes.BAD_REQUEST);
    }
    throw new AppError("Cannot update the city", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export {
  createCity,
  getCities,
  deleteCity,
  updateCity,
};