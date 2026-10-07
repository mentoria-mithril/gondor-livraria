import { Router } from 'express';
import * as cartController from '../controllers/cartController.js'
import { envolver } from '../middlewares/envolver.js';


export const cartRoutes = Router()


cartRoutes.get('/cart', envolver(cartController.getCart))
cartRoutes.post('/cart/items', envolver(cartController.addItem));
cartRoutes.patch('/cart/items/:itemId', envolver(cartController.updateItemQuantity));
cartRoutes.delete('/cart/items/:itemId', envolver(cartController.removeItem))
