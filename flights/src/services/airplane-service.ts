import AirplaneRepository from "../repositories/airplane-repository.js";
import { Airplane, Prisma } from "@prisma/client";
import { AppError } from "../utils/errors/app-error.js";
import { StatusCodes } from "http-status-codes";

const airplaneRepository = new AirplaneRepository();

async function createAirplane(data: Prisma.AirplaneCreateInput): Promise<Airplane> {
  try {
    return await airplaneRepository.create(data);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new AppError(error.message, StatusCodes.BAD_REQUEST);
    }
    throw new AppError("Cannot create a new Airplane object", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function getAirplanes() {
  try {
    const airplanes = await airplaneRepository.getAll();
    return airplanes;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new AppError(error.message, StatusCodes.BAD_REQUEST);
    }
    throw new AppError("Cannot fetch all airplanes", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function getAirplane(id: number) {
  try {
    const airplane = await airplaneRepository.get(id);
    return airplane;
  } catch (error) {
    if (error instanceof AppError && error.statusCode === StatusCodes.NOT_FOUND) {
      throw new AppError("The airplane you requested was not found", StatusCodes.NOT_FOUND);
    }
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new AppError(error.message, StatusCodes.BAD_REQUEST);
    }
    throw new AppError("Cannot fetch the airplane details", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function deleteAirplane(id: number) {
  try {
    const airplane = await airplaneRepository.delete(id);
    return airplane;
  } catch (error) {
    if (
      (error instanceof AppError && error.statusCode === StatusCodes.NOT_FOUND) ||
      (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025")
    ) {
      throw new AppError("The airplane you requested was not found", StatusCodes.NOT_FOUND);
    }
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new AppError(error.message, StatusCodes.BAD_REQUEST);
    }
    throw new AppError("Cannot delete the airplane", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function updateAirplane(id: number, data: Prisma.AirplaneUpdateInput) {
  try {
    const airplane = await airplaneRepository.update(id, data);
    return airplane;
  } catch (error) {
    if (
      (error instanceof AppError && error.statusCode === StatusCodes.NOT_FOUND) ||
      (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025")
    ) {
      throw new AppError("The airplane you requested was not found", StatusCodes.NOT_FOUND);
    }
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new AppError(error.message, StatusCodes.BAD_REQUEST);
    }
    throw new AppError("Cannot update the airplane", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export {
  createAirplane,
  getAirplanes,
  getAirplane,
  deleteAirplane,
  updateAirplane
}