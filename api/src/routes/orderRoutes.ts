import { Router } from 'express';
import * as orderController from '../controllers/orderController.js';

export const orderRoutes = Router();

orderRoutes.post('/pedidos', orderController.createOrder);
