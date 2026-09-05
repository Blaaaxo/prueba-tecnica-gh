import { Router } from 'express';
import { getAnalytics } from '../controllers/analytics.controller.js';
import { getOpportunities } from '../controllers/products.controller.js';

const router = Router();

router.get('/analytics', getAnalytics);
router.get('/products/opportunities', getOpportunities);

export default router;