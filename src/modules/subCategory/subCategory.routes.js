import express from 'express'
import { validation } from '../../middleware/validation.js'
import { addSubCategoryValidation, paramsIdValidation, updateSubCategoryValidation } from './subCategory.validation.js'
import {uploadSingle} from '../../utils/fileUpload.js'
import { addSubCategory,getAllSubCategories,getSingleSubCategoryById,updateSubCategory,deleteSubCategory } from './subCategory.controller.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'

const SubCategoryRoute = express.Router({mergeParams:true})

    SubCategoryRoute
        .route('/')
        .get(getAllSubCategories)
        .post(protectedRoutes,allowedTo("company"),uploadSingle('image'), validation(addSubCategoryValidation), addSubCategory); 

    
    SubCategoryRoute
    .route('/:id')
    .get(validation(paramsIdValidation),getSingleSubCategoryById)
    .put(protectedRoutes,allowedTo("comapny"),uploadSingle('image'),validation(updateSubCategoryValidation),updateSubCategory)
    .delete(protectedRoutes,allowedTo("comapny"),validation(paramsIdValidation),deleteSubCategory)

export default SubCategoryRoute