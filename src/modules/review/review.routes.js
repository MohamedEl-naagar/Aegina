import express from 'express'
import { validation } from '../../middleware/validation.js'
import { addReviewValidation,paramsIdValidation,updateReviewValidation } from './review.validation.js'
import { addReview,getAllReviews,getSingleReviewById,updateReview,deleteReview } from './review.controller.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'

const ReviewRoute = express.Router()

    ReviewRoute
        .route('/')
        .get(getAllReviews)
        .post(protectedRoutes,allowedTo('wholesaler'),validation(addReviewValidation), addReview); 

    
    ReviewRoute
    .route('/:id')
    .get(validation(paramsIdValidation),getSingleReviewById)
    .put(protectedRoutes,allowedTo('wholesaler'),validation(updateReviewValidation),updateReview)
    .delete(protectedRoutes,allowedTo('wholesaler'),validation(paramsIdValidation),deleteReview)

export default ReviewRoute