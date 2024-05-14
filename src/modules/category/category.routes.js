import express from 'express'
import { validation } from '../../middleware/validation.js'
import { addCategory, deleteCategory, getAllCategories, getSingleCategory, updateCategory } from "./category.controller.js"
import { addCategoryValidation, paramsIdValidation, updateCategoryValidation } from './category.validation.js'
import {uploadSingle} from '../../utils/fileUpload.js'
import SubCategoryRoute from '../subCategory/subCategory.routes.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
const categoryRoute = express.Router()

categoryRoute.use("/:category/subcategory", SubCategoryRoute)


categoryRoute
        .route('/')
        .get(getAllCategories)        
        .post(protectedRoutes,allowedTo("company"),uploadSingle('image'), validation(addCategoryValidation), addCategory); 
categoryRoute
    .route('/:id')
    .get(validation(paramsIdValidation),getSingleCategory)
    .put(protectedRoutes,allowedTo("company"),uploadSingle('image'),validation(updateCategoryValidation),updateCategory)
    .delete(protectedRoutes,allowedTo("company"),validation(paramsIdValidation),deleteCategory)

export default categoryRoute