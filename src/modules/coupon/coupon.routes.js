import express from 'express'
import { validation } from '../../middleware/validation.js'
import { addCouponValidation,paramsIdValidation,updateCouponValidation } from './coupon.validation.js'
import { addCoupon,getAllCoupons,getSingleCouponById,updateCoupon,deleteCoupon } from './coupon.controller.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'

const CouponRoute = express.Router()

    CouponRoute
        .route('/')
        .get(protectedRoutes,allowedTo("company"),getAllCoupons)
        .post(protectedRoutes,allowedTo('company'),validation(addCouponValidation), addCoupon); 

    
    CouponRoute
    .route('/:id')
    .get(protectedRoutes,allowedTo("company"),validation(paramsIdValidation),getSingleCouponById)
    .put(protectedRoutes,allowedTo('company'),validation(updateCouponValidation),updateCoupon)
    .delete(protectedRoutes,allowedTo('company'),validation(paramsIdValidation),deleteCoupon)

export default CouponRoute