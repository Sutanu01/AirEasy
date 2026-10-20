export type RoleType = 'CUSTOMER' | 'ADMIN' | 'FLIGHT_COMPANY';

export interface User {
  id: number;
  email: string;
  roles: RoleType[];
}

export interface City {
  id: number;
  cityName: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Airport {
  id: number;
  airportName: string;
  airportCode: string;
  address?: string;
  cityId: number;
  city?: City;
}

export interface Airplane {
  id: number;
  modelNumber: string;
  capacity: number;
}

export type SeatClass = 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST_CLASS';

export interface Seat {
  id: number;
  airplaneId: number;
  row: number;
  column: string;
  seatType: SeatClass;
  isBooked?: boolean;
}

export interface Flight {
  id: number;
  flightNumber: string;
  airplaneId: number;
  departureAirportId: number;
  arrivalAirportId: number;
  arrivalTime: string;
  departureTime: string;
  price: number;
  boardingGate?: string;
  totalSeats: number;
  availableSeats: number;
  airplane?: Airplane;
  departureAirport?: Airport;
  arrivalAirport?: Airport;
}

export type BookingStatus = 'PENDING' | 'BOOKED' | 'CANCELLED';

export interface BookingSeat {
  id: number;
  bookingId: number;
  seatId: number;
}

export interface Booking {
  id: number;
  pnr: string;
  flightId: number;
  userId: number;
  status: BookingStatus;
  noOfSeats: number;
  totalCost: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  createdAt: string;
  updatedAt: string;
  bookingSeats?: BookingSeat[];
  flight?: Flight; // For joined display in UI
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  error?: {
    explanation?: string | string[];
    [key: string]: any;
  };
}

export interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  booking: Booking;
}

export interface FlightSearchParams {
  trips?: string; // "DEL-BOM"
  date?: string;  // "YYYY-MM-DD"
  passengers?: number;
  price?: string; // "min-max"
  sort?: string;  // "price_asc,departureTime_desc"
}
