import { AirplaneService } from "../services/index.js";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export async function createAirplane(req: Request, res: Response) {
  try {
    const { modelNumber, capacity } = req.body;
    const airplane = await AirplaneService.createAirplane({
      modelNumber,
      capacity,
    });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Airplane created successfully",
      data: airplane,
      error: {},
    });
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong while creating the airplane",
      data: {},
      error: error.message || error,
    });
  }
}
