import subCategoryModel from "../../../db/models/subCategory.model.js"
import categoryModel from '../../../db/models/category.model.js'
import { catchError } from '../../middleware/catchError.js'
import slugify from "slugify"
import { AppError } from "../../utils/AppError.js"
import cloudinary from "../../utils/cloudConfig.js";
import { ApiFeatures } from "../../utils/apiFeatures.js"

  const addSubCategory = catchError(async(req,res,next) => {
    const existingSubcategory = await subCategoryModel.findOne({ title: req.body.title });
    if (existingSubcategory) {
        return next(new AppError("Subcategory with the same title already exists", 400));
    }
    req.body.slug = slugify(req.body.title);
    
    let existingCategory = await categoryModel.findById(req.body.category);
    if (!existingCategory) {
        return next(new AppError("Category not found", 401));
    }
    if (!existingCategory.createdBy || !existingCategory.createdBy.equals(req.user._id)) {
        return next(new AppError("You are not authorized to add this category", 401));
    }

    req.body.createdBy = req.user._id;
    cloudinary.uploader.upload(req.file.path, async function(error, result) {
        if (error) {
            return next(new AppError("Error uploading image to Cloudinary", 500));
        }
        req.body.image = result.secure_url;
        req.body.public_id = result.public_id;   
        let subcategory = new subCategoryModel(req.body);
        await subcategory.save();
        subcategory && res.json({ message: "Sub Category added successfully", subcategory });
        !subcategory && next(new AppError("Sub category not added", 500));
    });
});
const getAllSubCategories = catchError(async(req,res,next)=>{
    // createdBy
    const createdBy = req.query.createdBy;
    let numCount;
    if(createdBy){
         numCount = await categoryModel.find({createdBy}).countDocuments()
    }
    //join params
    let filterObj = {}
    if(req.params.category){
        filterObj.category = req.params.category
        let subcategories = await subCategoryModel.find({category:req.params.category})
        return  res.json({message:"success",subcategories})

    }
    let apiFeatures = new ApiFeatures(subCategoryModel.find(), req.query)
        .pagination()  // Apply pagination
        .fields()  // Select fields
        .filter()  // Apply filtering
        .sort(); // Apply sorting
    
    let allSubCategories = await apiFeatures.mongooseQuery.populate({
        path: 'createdBy',
        select: '-__v -createdAt -updatedAt -isBlocked -password' // Exclude __v, createdAt, and updatedAt from createdBy
    }).select('-__v -createdAt -updatedAt')
    let totalCount = await subCategoryModel.countDocuments();
    if(createdBy){
        totalCount = await subCategoryModel.find({createdBy}).countDocuments()
   }
    res.json({ message: "success", page: apiFeatures.pageNumber,totalCount,allSubCategories: allSubCategories });
})

const getSingleSubCategoryById = catchError(async(req,res,next)=>{
    let subcategory = await subCategoryModel.findById(req.params.id)
    subcategory&&res.json({message:"success",subcategory})
    !subcategory&&next(new AppError("not found sub category",401))
})

const updateSubCategory = catchError(async(req,res,next)=>{
    if(req.body.title){
        const existingSubcategory = await subCategoryModel.findOne({ title: req.body.title });
        if (existingSubcategory) {
            return next(new AppError("Subcategory with the same title already exists", 400));
        }      
        let {title} = req.body
        req.body.slug = slugify(title)
    }
    
    let checkExist = await subCategoryModel.findById(req.params.id)
    if(!checkExist){next(new AppError("Sub Category not found", 404));}
    if(!checkExist.createdBy.equals(req.user._id))
    {return next(new AppError("You are not authorized to update this sub category", 401));}
    
    if (req.body.category) {
        let checkCategory = await categoryModel.findById(req.body.category);
        if(!checkCategory) return next(new AppError("category not found",401)); 
        if (!checkCategory.createdBy.equals( req.user._id )){
           return next(new AppError("you are not created this category so you can't add brand to it",401))
        }
    }
   
    if (req.file) {
    // Extract the public_id of the existing image from the database
    const subcategory = await subCategoryModel.findById(req.params.id);
    const existingPublicId = subcategory.public_id;

    // If an existing image exists, delete it from Cloudinary
    if (existingPublicId) {
        await cloudinary.uploader.destroy(existingPublicId);
    }
    
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    // Update subcategory with new image URL
    req.body.image = result.secure_url;
   
    req.body.public_id = result.public_id;   
}
    let subcategory = await subCategoryModel.findByIdAndUpdate(req.params.id,req.body,{new:true})
    subcategory&&res.json({message:"Sub Category updated",subcategory}) 
    !subcategory&&next(new AppError("not found sub category",401))     
})
const deleteSubCategory = catchError(async (req, res, next) => {
    let checkExist = await subCategoryModel.findById(req.params.id);
    if (!checkExist) {
        return next(new AppError("Sub Category not found", 404));
    }
    if (!checkExist.createdBy || !checkExist.createdBy.equals(req.user._id)) {
        return next(new AppError("You are not authorized to delete this subcategory", 401));
    }

    let subcategory = await subCategoryModel.findByIdAndDelete(req.params.id);
    if (subcategory) {
        return res.json({ message: "Subcategory deleted", subcategory });
    } else {
        return next(new AppError("Subcategory not deleted", 404));
    }
});

export{
addSubCategory,
getAllSubCategories,
getSingleSubCategoryById,
updateSubCategory,
deleteSubCategory
}