import express from 'express'
import { validation } from '../../middleware/validation.js'
import { addOrderValidation ,paramsIdValidation} from './order.validation.js'
import { createCashOrder , getAllOrder , deleteOrder , createCheckoutURL, createdOnlineOrder} from './order.controller.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'

const OrderRoute = express.Router()

    OrderRoute
    .route('/')
    .get(protectedRoutes,allowedTo("comapny","wholesaler"),getAllOrder)
   
    OrderRoute
        .route('/:id')
        .post(protectedRoutes,allowedTo("wholesaler"),validation(addOrderValidation), createCashOrder)
        .delete(protectedRoutes,allowedTo("wholesaler"),validation(paramsIdValidation),deleteOrder)
    OrderRoute
    .route('/online/:id')
    .post(protectedRoutes,allowedTo("wholesaler"),validation(addOrderValidation), createCheckoutURL)
 
    // OrderRoute.route('/webhook')
    // .post(express.raw({type: 'application/json'}),createOnlineOrder)


export default OrderRoute