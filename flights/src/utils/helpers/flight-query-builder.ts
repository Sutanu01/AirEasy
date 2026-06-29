import { Prisma } from "@prisma/client";
import { AppError } from "../errors/app-error.js";
import { StatusCodes } from "http-status-codes";

export function buildFlightQueryFilters(query: any): {
  where: Prisma.FlightWhereInput;
  orderBy: Prisma.FlightFindManyArgs["orderBy"];
} {
  const customFilter: Prisma.FlightWhereInput = {};
  let sortFilter: Prisma.FlightFindManyArgs["orderBy"] = [];

  // 1. Route filter (trips)
  if (query.trips) {
    const [departureAirportCode, arrivalAirportCode] = (query.trips as string).split("-");

    if (departureAirportCode === arrivalAirportCode) {
      throw new AppError("Departure and arrival airports must be different", StatusCodes.BAD_REQUEST);
    }

    customFilter.departureAirport = {
      airportCode: departureAirportCode,
    };
    customFilter.arrivalAirport = {
      airportCode: arrivalAirportCode,
    };
  }

  // 2. Date filter
  if (query.date) {
    const dateStr = query.date as string;
    const startOfDay = new Date(dateStr);
    const endOfDay = new Date(dateStr);
    endOfDay.setUTCHours(23, 59, 59, 999);

    customFilter.departureTime = {
      gte: startOfDay,
      lte: endOfDay,
    };
  }

  // 3. Seats/Passengers filter
  if (query.passengers) {
    customFilter.availableSeats = {
      gte: parseInt(query.passengers as string, 10),
    };
  }

  // 4. Price range filter (e.g., price=3000-5000, price=3000-, price=-5000, price=3000)
  if (query.price) {
    const priceStr = query.price as string;
    const hyphenIndex = priceStr.indexOf("-");

    if (hyphenIndex === -1) {
      // No hyphen: treat as exact price filter
      const priceVal = parseFloat(priceStr);
      if (isNaN(priceVal) || priceVal < 0) {
        throw new AppError("Price must be a positive number", StatusCodes.BAD_REQUEST);
      }
      customFilter.price = { equals: priceVal };
    } else {
      const parts = priceStr.split("-");
      const minStr = parts[0].trim();
      const maxStr = parts[1]?.trim() || "";

      let min = 0;
      let max = Infinity;

      if (minStr) {
        min = parseFloat(minStr);
        if (isNaN(min) || min < 0) {
          throw new AppError("Minimum price must be a positive number", StatusCodes.BAD_REQUEST);
        }
      }

      if (maxStr) {
        max = parseFloat(maxStr);
        if (isNaN(max) || max < 0) {
          throw new AppError("Maximum price must be a positive number", StatusCodes.BAD_REQUEST);
        }
      }

      if (minStr && maxStr && min > max) {
        throw new AppError("Minimum price cannot be greater than maximum price", StatusCodes.BAD_REQUEST);
      }

      customFilter.price = {
        ...(minStr ? { gte: min } : {}),
        ...(maxStr ? { lte: max } : {}),
      };
    }
  }

  // 4. Sort filter (e.g., sort=price_desc,departureTime_asc)
  if (query.sort) {
    const criteria = (query.sort as string).split(",");
    const sortList: any[] = [];

    const allowedSortFields = ["price", "departureTime", "arrivalTime", "availableSeats"];
    const allowedDirections = ["asc", "desc"];

    for (const criterion of criteria) {
      const sortParams = criterion.trim().split("_");
      const field = sortParams[0];
      const direction = sortParams[1] || "asc";

      if (!allowedSortFields.includes(field)) {
        throw new AppError(
          `Sorting by field '${field}' is not supported. Allowed fields: ${allowedSortFields.join(", ")}`,
          StatusCodes.BAD_REQUEST
        );
      }

      if (!allowedDirections.includes(direction.toLowerCase())) {
        throw new AppError(
          `Sort direction '${direction}' is invalid. Use 'asc' or 'desc'.`,
          StatusCodes.BAD_REQUEST
        );
      }

      sortList.push({
        [field]: direction,
      });
    }

    sortFilter = sortList;
  }

  return { where: customFilter, orderBy: sortFilter };
}
