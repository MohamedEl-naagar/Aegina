




import userModel from '../../db/models/user.model.js'
import { AppError } from '../utils/AppError.js'
export const checkEmail = async(req,res,next)=>{

        let user = await userModel.findOne({email:req.body.email})
        if(user) return next(new AppError("User is already exist",409))

        next()
    }