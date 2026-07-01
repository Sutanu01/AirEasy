import express from 'express';
import { info } from '../../controllers/index.js';

const router = express.Router();

router.get('/info', info);

export default router;
