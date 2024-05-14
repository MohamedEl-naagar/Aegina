import jwt from "jsonwebtoken";
import { catchError } from "../../middleware/catchError.js";
import userModel from "../../../db/models/user.model.js";
import bcrypt from 'bcrypt'
import { AppError } from "../../utils/AppError.js";
import { sendEmail } from "../../middleware/email/sendEmail.js";

    const signUp = catchError(async(req,res,next)=>{
        let user = new userModel(req.body)
        let token = jwt.sign({ userId : user._id, role: user.role},process.env.SECRET_KEY)
        await user.save()
        await sendEmail({ email: req.body.email, api: `https://aegina.onrender.com/api/v1/api/v1/user/verify/${token}` });
        res.json({message:"succsess",token})
    })


const signIn = catchError(async(req,res,next)=>{
    let user =  await userModel.findOne({ email: req.body.email })
    if(!user){
        next(new AppError("User not found",401))
    }
    if(user && bcrypt.compareSync(req.body.password,user.password)){
        let token = jwt.sign({ userId : user._id, role: user.role},process.env.SECRET_KEY)
        // if(user.confirmEmail !=true){
        //     await sendEmail({ email: req.body.email, api: `https://aegina.onrender.com/api/v1/api/v1/user/verify/${token}` });
         //  }
        return res.json({message:"success",token})
    }

    next(new AppError("incorrect email or password",401))
})

const changePassword = catchError(async(req,res,next)=>{
    let user =  await userModel.findById(req.user._id)
    if(user && bcrypt.compareSync(req.body.password,user.password)){
        let token = jwt.sign({ userId : user._id, role: user.role},process.env.SECRET_KEY)
        await userModel.findByIdAndUpdate(req.params.id,{password:req.body.newPassword,passwordChangedAt:Date.now()})
        return res.json({message:"success",token})
    }
    next(new AppError("incorrect email or password",401))

})

const protectedRoutes = catchError(async(req,res,next)=>{
    const {token} = req.headers
        if(!token){
        return next(new AppError("token not provided!",401))
    }
    let decoded = jwt.verify(token,process.env.SECRET_KEY)

    let user = await userModel.findById(decoded.userId)
    if(!user){return next(new AppError("user not found",401))}

    if(user.passwordChangedAt){
        let time = parseInt(user?.passwordChangedAt.getTime() / 1000)

        if(time > decoded.iat){
            return next(new AppError("invalid token .. login again"))
        }
    }
    req.user = user
    next()
})

const allowedTo = (...roles)=>{
    return catchError(async(req,res,next)=>{

        if(!roles.includes(req.user.role))
            return next(new AppError("you are not authorized!",401))

        next()
    })
}
export const verifyEmail =catchError( async (req, res, next) => {
const { token } = req.params;

let decoded = jwt.verify(token,process.env.SECRET_KEY)

let user = await userModel.findById(decoded.userId)
if(!user){return next(new AppError("user not found",401))}


if(user.passwordChangedAt){
    let time = parseInt(user?.passwordChangedAt.getTime() / 1000)

    if(time > decoded.iat){
        return next(new AppError("invalid token .. login again"))
    }
}

const updatedUser = await userModel.findByIdAndUpdate(user._id, { confirmEmail: true }, { new: true });
    res.json({ message: "Email verified successfully", updatedUser });
!updatedUser && next(new AppError("Error occurred during email verification", 500));

    });

export{
    signIn,
    signUp,
    changePassword,
    protectedRoutes,
    allowedTo
}