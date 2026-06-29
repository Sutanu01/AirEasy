import { AppError } from "../errors/app-error.js";
import { StatusCodes } from "http-status-codes";

function compareTime(datetime1: string | Date, datetime2: string | Date): boolean {
  const time1 = new Date(datetime1).getTime();
  const time2 = new Date(datetime2).getTime();
  return time1 < time2;
}

function validateTimeOrder(
  datetime1: string | Date,
  datetime2: string | Date,
  errorMessage: string = "Second time cannot be before or equal to the first time"
): void {
  if (!compareTime(datetime1, datetime2)) {
    throw new AppError(errorMessage, StatusCodes.BAD_REQUEST);
  }
}

function validateNotEqual<T>(
  val1: T,
  val2: T,
  errorMessage: string
): void {
  if (val1 === val2) {
    throw new AppError(errorMessage, StatusCodes.BAD_REQUEST);
  }
}

export default { compareTime, validateTimeOrder, validateNotEqual };
