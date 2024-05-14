import brandModel from "../../../db/models/brand.model.js"
import couponModel from "../../../db/models/coupon.model.js"
import { catchError } from '../../middleware/catchError.js'
import { ApiFeatures } from "../../utils/apiFeatures.js"
import { AppError } from "../../utils/AppError.js"
import  QRCode  from 'qrcode'

const addCoupon = catchError(async(req,res,next)=>{
    let isCouponExist = await couponModel.findOne({code:req.body.code})
    if(isCouponExist) return next(new AppError("Coupon already Exist!"))
    req.body.createdBy = req.user._id
    let coupon = new couponModel(req.body)
    await coupon.save()
    coupon&& res.json({message:"coupon added successfully",coupon})
    !coupon&& res.json({message:"coupon not added",coupon})
})
const getAllCoupons = catchError(async(req,res,next)=>{
    const createdBy = req.query.createdBy;
    let apiFeatures = new ApiFeatures(couponModel.find(), req.query)
        .pagination()  // Apply pagination
        .fields()  // Select fields
        .filter()  // Apply filtering
        .sort(); // Apply sorting
    let allBrands = await apiFeatures.mongooseQuery.populate({
        path: 'createdBy',
        select: '-__v -createdAt -updatedAt -isBlocked -password' // Exclude __v, createdAt, and updatedAt from createdBy
    }).select('-__v -createdAt -updatedAt')
    let totalCount = await couponModel.countDocuments(apiFeatures.query);
    if(createdBy){
        totalCount = await couponModel.find({createdBy}).countDocuments()
   }
    res.json({ message: "success", page: apiFeatures.pageNumber, totalCount, allBrands });
   
});

const getSingleCouponById = catchError(async(req,res,next)=>{
    let coupon = await couponModel.findById(req.params.id)
    if(!coupon.createdBy.equals(req.user._id)){
        return next(new AppError("you are not created this category so you can't add brand to it",401))
    }
    let url = await QRCode.toDataURL(coupon.code)
    coupon&&res.json({message:"success",coupon,url})
    !coupon&&next(new AppError("not found coupon",401))
})

const updateCoupon = catchError(async(req,res,next)=>{  
    let couponExist = await couponModel.findById(req.params.id);
    if (!couponExist) return next(new AppError("coupon not found", 404));
    if(!couponExist.createdBy.equals(req.user._id)){
        return next(new AppError("you are not created this category so you can't add coupon to it",401))
    }
    let coupon = await couponModel.findByIdAndUpdate(req.params.id,req.body,{new:true})
    coupon&&res.json({message:"success",coupon})
    !coupon&&next(new AppError("not found coupon",401))

})

const deleteCoupon = catchError(async (req, res, next) => {
    let couponExist = await couponModel.findById(req.params.id);
    if (!couponExist) return next(new AppError("coupon not found", 404));
    if(!couponExist.createdBy.equals(req.user._id)){
        return next(new AppError("you are not created this category so you can't add brand to it",401))
    }

    let coupon = await couponModel.findOneAndDelete(req.params.id)
    coupon&&res.json({ message: "coupon deleted!", coupon });
    !coupon&&next(new AppError("coupon not deleted", 404));   
});


export{
addCoupon,
getAllCoupons,
getSingleCouponById,
updateCoupon,
deleteCoupon
}