import { Router } from 'express';
import * as cartController from '../controllers/cartController.js'
import { envolver } from '../middlewares/envolver.js';


export const cartRoutes = Router()


cartRoutes.get('/carts', envolver(cartController.getCart))
cartRoutes.post('/carts/items', envolver(cartController.addItem));
cartRoutes.patch('/carts/items/:itemId', envolver(cartController.updateItemQuantity));
cartRoutes.delete('/carts/items/:itemId', envolver(cartController.removeItem))
