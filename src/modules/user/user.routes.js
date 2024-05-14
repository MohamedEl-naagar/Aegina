import express from 'express'
import { validation } from '../../middleware/validation.js'
import {updateUser,deleteUser, getCurrentUser} from './user.controller.js'
import { updateUserVal } from './user.validation.js'
import { allowedTo, protectedRoutes, verifyEmail } from '../auth/auth.controller.js'
   
    const UserRoute = express.Router()
    UserRoute
    .route('/')
    .put(protectedRoutes,allowedTo("company","wholesaler"),validation(updateUserVal),updateUser)
    .delete(protectedRoutes,allowedTo("company","wholesaler"),deleteUser)

    UserRoute.
        get('/currentuser',protectedRoutes,getCurrentUser)
        
   UserRoute
   .get('/verify/:token',verifyEmail)

   export default UserRoute