import { Router } from 'express';
import { BookingController } from '../../controllers/index.js';
import { BookingMiddleware } from '../../middlewares/index.js';

const router = Router();

router.get('/',
  BookingController.getUserBookings
);

router.get('/:id',
  BookingController.getBookingById
);

router.patch('/:id/cancel',
  BookingController.cancelBooking
);

router.post('/',
  BookingMiddleware.validateCreateRequest,
  BookingController.createBooking
);

router.post('/orders',
  BookingMiddleware.validateCreateOrderRequest,
  BookingController.createPaymentOrder
);

router.post('/payments',
  BookingMiddleware.validatePaymentRequest,
  BookingController.makePayment
);

router.get('/flights/:flightId/seats',
  BookingController.getFlightSeatsMap
);

export default router;
