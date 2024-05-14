import categoryModel from "../../../db/models/category.model.js"
import { catchError } from '../../middleware/catchError.js'
import slugify from "slugify"
import { AppError } from "../../utils/AppError.js"
import { ApiFeatures } from "../../utils/apiFeatures.js";
import cloudinary from "../../utils/cloudConfig.js";

const addCategory = catchError(async(req,res,next)=>{    
    // check title exist
    const existingcategory = await categoryModel.findOne({ title: req.body.title });
    if (existingcategory) {
        return next(new AppError("Category with the same title already exists", 400));
    }
    req.body.slug = slugify(req.body.title)
    cloudinary.uploader.upload(req.file.path, 
    async function(error, result) {    
    req.body.image = result.secure_url
    req.body.public_id = result.public_id;   
    req.body.createdBy = req.user._id
    let category = new categoryModel(req.body)
    await category.save()
    category&&res.json({message:"category added successfully",category})
    !category&&next(new AppError("Category not added", 401));

})
}); 
const getAllCategories = catchError(async(req,res,next)=>{
    const createdBy = req.query.createdBy;
    let apiFeatures = new ApiFeatures(categoryModel.find(), req.query)
        .pagination()  // Apply pagination
        .fields()  // Select fields
        .filter()  // Apply filtering
        .sort(); // Apply sorting
    let allCategories = await apiFeatures.mongooseQuery.populate({
        path: 'createdBy',
        select: '-__v -createdAt -updatedAt -isBlocked -password' // Exclude __v, createdAt, and updatedAt password from createdBy
    }).select('-__v -createdAt -updatedAt')
    let totalCount = await categoryModel.countDocuments(apiFeatures.query);
    if(createdBy){
        totalCount = await categoryModel.find({createdBy}).countDocuments()
   }
    res.json({ message: "success", page: apiFeatures.pageNumber,totalCount, allCategories });
});
const getSingleCategory = catchError(async(req,res,next)=>{
    let category = await categoryModel.findById(req.params.id)
    category&&res.json({message:"success",category})
    !category&&next(new AppError("Category not found", 404));
})

const updateCategory = catchError(async (req, res, next) => {
    let checkExist = await categoryModel.findById(req.params.id)
    if(!checkExist){next(new AppError("Category not found", 404));}
    if(!checkExist.createdBy.equals(req.user._id)){
        return next(new AppError("You are not authorized to update this category", 401));
    }
    if(req.body.title){
        const existingSubcategory = await categoryModel.findOne({ title: req.body.title });
        if (existingSubcategory) {
            return next(new AppError("category with the same title already exists", 400));
        }      
        let {title} = req.body
        req.body.slug = slugify(title)
    }
    
        let updatedCategory;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            req.body.image = result.secure_url;
            req.body.public_id = result.public_id;
            updatedCategory = await categoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        } else {
            updatedCategory = await categoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        }

        res.json({ message: "Category updated", category: updatedCategory });
   
});

const deleteCategory = catchError(async (req, res, next) => {
    let checkExist = await categoryModel.findById(req.params.id)
    if(!checkExist){next(new AppError("Category not found", 404));}
    if(!checkExist.createdBy.equals(req.user._id)){
        return next(new AppError("You are not authorized to delete this category", 401));
    }
    
   let category = await categoryModel.findByIdAndDelete(req.params.id);
    category&&res.json({ message: "Category deleted", category });
    !category&&next(new AppError("Category not deleted", 404));
});

export{
addCategory,
getAllCategories,
getSingleCategory,
updateCategory,
deleteCategory,
}