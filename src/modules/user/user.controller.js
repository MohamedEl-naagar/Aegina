import userModel from "../../../db/models/user.model.js"
import { catchError } from '../../middleware/catchError.js'
import { AppError } from "../../utils/AppError.js"
const getCurrentUser = catchError(async(req,res,next)=>{
    let { _id } = req.user
    let currentuser = await userModel.findById(_id).select('-password -createdAt -updatedAt -__v');
    currentuser&&res.json({message:"success",currentuser})
    !currentuser&&next(new AppError("not found User",401))
})

const updateUser = catchError(async (req, res, next) => {
        let update = await userModel.findByIdAndUpdate(req.user._id, req.body, { new: true }).select('-password -createdAt -updatedAt -__v');
        update  && res.json({message:"success",update})
        !update && next(new AppError("error in update!",401))    
});

const deleteUser =  catchError(async(req,res,next)=>{
    let deleted = await userModel.findByIdAndDelete(req.user._id).select('-password -createdAt -updatedAt -__v');
    deleted&&res.json({message:"User deleted",deleted})
    !deleteUser && next (new AppError("not found User",401))

})

export{
getCurrentUser,
updateUser,
deleteUser
}