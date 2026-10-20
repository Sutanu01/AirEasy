import { apiRequest } from './api-client';
import {
  Flight,
  Airport,
  City,
  Airplane,
  Seat,
  Booking,
  RazorpayOrderResponse,
  FlightSearchParams,
} from '@/types';

export const FlightsApi = {
  // Public flight search
  async getFlights(params: FlightSearchParams = {}): Promise<Flight[]> {
    const query = new URLSearchParams();
    if (params.trips) query.set('trips', params.trips);
    if (params.date) query.set('date', params.date);
    if (params.passengers) query.set('passengers', String(params.passengers));
    if (params.price) query.set('price', params.price);
    if (params.sort) query.set('sort', params.sort);

    const queryString = query.toString();
    const endpoint = queryString ? `/flights?${queryString}` : '/flights';
    const res = await apiRequest<Flight[]>(endpoint, { skipAuth: true });
    return res.data || [];
  },

  async getFlight(id: number): Promise<Flight> {
    const res = await apiRequest<Flight>(`/flights/${id}`, { skipAuth: true });
    return res.data;
  },

  async getAirports(): Promise<Airport[]> {
    const res = await apiRequest<Airport[]>('/airports', { skipAuth: true });
    return res.data || [];
  },

  async getCities(): Promise<City[]> {
    const res = await apiRequest<City[]>('/cities', { skipAuth: true });
    return res.data || [];
  },

  // Booking & Seats
  async getFlightSeats(flightId: number): Promise<Seat[]> {
    const res = await apiRequest<Seat[]>(`/bookings/flights/${flightId}/seats`, {
      skipAuth: true,
    });
    return res.data || [];
  },

  async createBooking(data: {
    flightId: number;
    noOfSeats: number;
    seatIds: number[];
  }): Promise<Booking> {
    const res = await apiRequest<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async createRazorpayOrder(bookingId: number): Promise<RazorpayOrderResponse> {
    const res = await apiRequest<RazorpayOrderResponse>('/bookings/orders', {
      method: 'POST',
      body: JSON.stringify({ bookingId }),
    });
    return res.data;
  },

  async verifyAndConfirmPayment(data: {
    bookingId: number;
    idempotencyKey: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
  }): Promise<any> {
    const res = await apiRequest('/bookings/payments', {
      method: 'POST',
      idempotencyKey: data.idempotencyKey,
      body: JSON.stringify({
        bookingId: data.bookingId,
        razorpayPaymentId: data.razorpayPaymentId,
        razorpaySignature: data.razorpaySignature,
      }),
    });
    return res.data;
  },

  async getMyBookings(): Promise<Booking[]> {
    const res = await apiRequest<Booking[]>('/bookings');
    return res.data || [];
  },

  async getBooking(id: number): Promise<Booking> {
    const res = await apiRequest<Booking>(`/bookings/${id}`);
    return res.data;
  },

  async cancelBooking(id: number): Promise<Booking> {
    const res = await apiRequest<Booking>(`/bookings/${id}/cancel`, {
      method: 'PATCH',
    });
    return res.data;
  },

  // Admin / Airline Staff Endpoints
  async getAirplanes(): Promise<Airplane[]> {
    const res = await apiRequest<Airplane[]>('/airplanes');
    return res.data || [];
  },

  async createAirplane(data: { modelNumber: string; capacity: number }): Promise<Airplane> {
    const res = await apiRequest<Airplane>('/airplanes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async createFlight(data: {
    flightNumber: string;
    airplaneId: number;
    departureAirportId: number;
    arrivalAirportId: number;
    departureTime: string;
    arrivalTime: string;
    price: number;
    boardingGate?: string;
    totalSeats: number;
  }): Promise<Flight> {
    const res = await apiRequest<Flight>('/flights', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async createCity(data: { cityName: string }): Promise<City> {
    const res = await apiRequest<City>('/cities', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async createAirport(data: {
    airportName: string;
    airportCode: string;
    address?: string;
    cityId: number;
  }): Promise<Airport> {
    const res = await apiRequest<Airport>('/airports', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async assignUserRole(data: { userId: number; roleName: string }): Promise<any> {
    const res = await apiRequest('/auth/assign-role', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },
};
