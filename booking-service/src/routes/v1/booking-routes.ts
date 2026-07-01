import { Router } from 'express';
import { BookingController } from '../../controllers/index.js';
import { BookingMiddleware } from '../../middlewares/index.js';

const router = Router();

router.post('/',
  BookingMiddleware.validateCreateRequest,
  BookingController.createBooking
);

router.post('/payments',
  BookingMiddleware.validatePaymentRequest,
  BookingController.makePayment
);

router.get('/flights/:flightId/seats',
  BookingController.getFlightSeatsMap
);

export default router;
