import Razorpay from 'razorpay';
import ServerConfig from './server-config.js';

export const razorpay = new Razorpay({
  key_id: ServerConfig.RAZORPAY_KEY_ID,
  key_secret: ServerConfig.RAZORPAY_KEY_SECRET,
});
