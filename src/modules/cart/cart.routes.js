import express from 'express'
import { validation } from '../../middleware/validation.js'
import { addCartValidation,paramsIdValidation,updateCartValidation } from './cart.validation.js'
import { addCart, getCart  , removeCartItem, clearUserCart ,updateCart, applyCoupon} from './cart.controller.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'

const CartRoute = express.Router()

    CartRoute
        .route('/')
        .get(protectedRoutes,allowedTo("wholesaler"),getCart)
        .post(protectedRoutes,allowedTo("wholesaler"),validation(addCartValidation), addCart)
        .delete(protectedRoutes,allowedTo('wholesaler'),clearUserCart);
    
    CartRoute
    .post('/applycoupon',protectedRoutes,allowedTo("wholesaler"),applyCoupon)    
    CartRoute
    .route('/:id')
    .put(protectedRoutes,allowedTo("wholesaler"),validation(updateCartValidation),updateCart)
    .delete(protectedRoutes,allowedTo("wholesaler"),validation(paramsIdValidation),removeCartItem)

export default CartRoute