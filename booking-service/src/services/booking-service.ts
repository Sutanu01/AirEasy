import BookingRepository from "../repositories/booking-repository.js";
import { Booking, Prisma } from "@prisma/client";
import { AppError } from "../utils/errors/app-error.js";
import { StatusCodes } from "http-status-codes";

const bookingRepository = new BookingRepository();


export {};
