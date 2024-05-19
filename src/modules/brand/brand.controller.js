import brandModel from "../../../db/models/brand.model.js"
import categoryModel from '../../../db/models/category.model.js'
import { catchError } from '../../middleware/catchError.js'
import slugify from "slugify"
import { AppError } from "../../utils/AppError.js"
import cloudinary from "../../utils/cloudConfig.js";
import { ApiFeatures } from "../../utils/apiFeatures.js"


const addBrand = catchError(async(req,res,next)=>{
    const existingLogo = await brandModel.findOne({ title: req.body.title });
    if (existingLogo) {
        return next(new AppError("brand with the same title already exists", 400));
    }

    let checkCategory = await categoryModel.findById(req.body.category);
    if(!checkCategory) return next(new AppError("category not found",401)); 
    

    if (!checkCategory.createdBy.equals( req.user._id )){
       return next(new AppError("you are not created this category so you can't add brand to it",401))
    }
    
    req.body.createdBy = checkCategory.createdBy
    req.body.slug = slugify(req.body.title)
    req.body.logo = req.file.filename
    
    cloudinary.uploader.upload(req.file.path, 
        async function(error, result) {    
        req.body.logo = result.secure_url
        req.body.public_id = result.public_id;   
        req.body.createdBy = req.user._id
        let preBrand = new brandModel(req.body)
        let added = await preBrand.save()
        added&&res.json({message:"Brand added successfully",added})
        !added&&next(new AppError("not found Brand",401))   
    })    
    
})
const getAllBrands = catchError(async (req, res, next) => {
    const createdBy = req.query.createdBy;
    let apiFeatures = new ApiFeatures(brandModel.find(), req.query)
        .pagination()  // Apply pagination
        .fields()      // Select fields
        .filter()      // Apply filtering
        .sort();       // Apply sorting
    let allBrands = await apiFeatures.mongooseQuery.populate({
        path: 'createdBy',
        select: '-__v -createdAt -updatedAt -isBlocked -password' // Exclude __v, createdAt, and updatedAt from createdBy
    }).select('-__v -createdAt -updatedAt')
    let totalCount = await brandModel.countDocuments();
    if(createdBy){
        totalCount = await brandModel.find({createdBy}).countDocuments()
   }
    res.json({ message: "success", page: apiFeatures.pageNumber, totalCount, allBrands });
});

const getSingleBrandById = catchError(async(req,res,next)=>{
    let brand = await brandModel.findById(req.params.id)
    brand&&res.json({message:"success",brand})
    !brand&&next(new AppError("not found Brand",401))
})
const updateBrand = catchError(async (req, res, next) => {
    const brand = await brandModel.findById(req.params.id);
    if (!brand) return next(new AppError("Brand not found", 404));
    
    if(!brand.createdBy.equals(req.user._id)){
        return next(new AppError("you are not created this brand so you can't update it, you are not authoriazed",401))
    }
    let title;
  
    if (req.body.category) {
        let checkCategory = await categoryModel.findById(req.body.category);
        if(!checkCategory) return next(new AppError("category not found",401)); 
        if (!checkCategory.createdBy.equals( req.user._id )){
           return next(new AppError("you are not created this category so you can't add brand to it",401))
        }
    }

    if (req.body.title) {
         title = await brandModel.findOne({ title: req.body.title });
        if (title) return next(new AppError("title already exist", 404));
        req.body.slug = slugify(req.body.title)
    }
    

    if (req.file) {
        const existingPublicId = brand.public_id;
        if (existingPublicId) {
            await cloudinary.uploader.destroy(existingPublicId);
        }
        const result = await cloudinary.uploader.upload(req.file.path);
        
        req.body.logo = result.secure_url;
        req.body.public_id = result.public_id;
    }

    let update = await brandModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

    update && res.json({ message: "Brand updated successfully", update });
    !update && next(new AppError("Brand not updated", 401));
});
const deleteBrand =  catchError(async(req,res,next)=>{
    let existingLogo = await brandModel.findById(req.params.id)
    if(!existingLogo){next(new AppError("brand not found", 404));}
    if(!existingLogo.createdBy.equals(req.user._id)){
        return next(new AppError("You are not authorized to delete this brand", 401));
    }
    let brand = await brandModel.findByIdAndDelete(req.params.id)
    brand&&res.json({message:"Brand deleted",brand})
    !brand&&res.json(new AppError("not found Brand",401))
})


export{
addBrand,    
getAllBrands,
getSingleBrandById,
updateBrand,
deleteBrand
}