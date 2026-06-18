import AirplaneRepository from "../repositories/airplane-repository.js";
import { Airplane, Prisma } from "@prisma/client";
import { AppError } from "../utils/errors/app-error.js";
import { StatusCodes } from "http-status-codes";

const airplaneRepository = new AirplaneRepository();

export async function createAirplane(data: Prisma.AirplaneCreateInput): Promise<Airplane> {
  try {
    return await airplaneRepository.create(data);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new AppError(error.message, StatusCodes.BAD_REQUEST);
    }
    throw new AppError("Cannot create a new Airplane object", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}