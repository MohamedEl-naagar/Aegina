import reviewModel from "../../../db/models/review.model.js"
import { catchError } from '../../middleware/catchError.js'
import { AppError } from "../../utils/AppError.js"
import { ApiFeatures } from "../../utils/apiFeatures.js"

const addReview = catchError(async(req,res,next)=>{
    req.body.createdBy= req.user._id
    let review = new reviewModel(req.body)
    await review.save()
    review&& res.json({message:"review added successfully",review})
    !review&& next(new AppError("not found review",401))
})


const getAllReviews = catchError(async(req,res,next)=>{
    let apiFeatures = new ApiFeatures(reviewModel.find({}),req.query)
    .pagination().fields().filter().sort().search();
    let review = await apiFeatures.mongooseQuery
    let totalCount = await categoryModel.countDocuments();
    res.json({message:"success",page:apiFeatures.pageNumber,review,totalCount})
})

const getSingleReviewById = catchError(async(req,res,next)=>{
    let review = await reviewModel.findById(req.params.id)
    review&&res.json({message:"success",review})
    !review&&next(new AppError("not found review",401))
})

const updateReview = catchError(async(req,res,next)=>{
    let exist = await reviewModel.findOne({createdBy:req.params.id})
    if(exist.createdBy.equals(req.user._id)){
        return next(new AppError("You are not authorized to update this review", 401));
    }
    let review = await reviewModel.findByIdAndUpdate(req.params.id,req.body,{new:true})
    review&&res.json({message:"success",review})
    !review&&next(new AppError("not found review",401))

})

const deleteReview = catchError(async (req, res, next) => {
    let exist = await reviewModel.findOne({createdBy:req.params.id})
    if(exist.createdBy.equals(req.user._id)){
        return next(new AppError("You are not authorized to update this review", 401));
    }
    let review = await reviewModel.findByIdAndDelete(req.params.id);
    review&&res.json({ message: "review updated", review });
    !review&&next(new AppError("review not updated", 404));   
});


export{
addReview,
getAllReviews,
getSingleReviewById,
updateReview,
deleteReview
}