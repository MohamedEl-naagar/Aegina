import express from 'express'
import { validation } from '../../middleware/validation.js'
import { addBrand,getAllBrands,getSingleBrandById,updateBrand,deleteBrand} from './brand.controller.js'
import {uploadSingle} from '../../utils/fileUpload.js'
import { addBrandValidation,paramsIdValidation, updateBrandValidation} from './brand.validation.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
   
    const BrandRoute = express.Router()
    BrandRoute
    .route('/')
    .get(getAllBrands)
    .post(protectedRoutes,allowedTo('company'),uploadSingle('image'), validation(addBrandValidation), addBrand); 

    
    BrandRoute
    .route('/:id')
    .get(validation(paramsIdValidation),getSingleBrandById)
    .put(protectedRoutes,allowedTo('company'),uploadSingle('image'),validation(updateBrandValidation),updateBrand)
    .delete(protectedRoutes,allowedTo('company'),validation(paramsIdValidation),deleteBrand)

export default BrandRoute