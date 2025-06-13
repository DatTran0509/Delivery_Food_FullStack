import express from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cartController.js';
import authMiddleware from '../middleware/auth.js';
import authMiddleware_nobody from '../middleware/auth_noboy.js';

const cartRouter = express.Router();

cartRouter.post('/add', authMiddleware, addToCart); // Route to add items to cart
cartRouter.post('/remove', authMiddleware, removeFromCart); // Route to remove items from cart
cartRouter.post('/get', authMiddleware_nobody, getCart); // Route to get user cart

export default cartRouter;