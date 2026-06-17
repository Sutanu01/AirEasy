import AirplaneRepository from "../repositories/airplane-repository.js";
import type { Airplane, Prisma } from "@prisma/client";

const airplaneRepository = new AirplaneRepository();


export async function createAirplane(data: Prisma.AirplaneCreateInput): Promise<Airplane> {
  try {
    return await airplaneRepository.create(data);
  } catch (error) {
    throw error;
  }
}