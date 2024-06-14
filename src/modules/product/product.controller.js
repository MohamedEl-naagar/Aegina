import productModel from "../../../db/models/product.model.js"
import categoryModel from '../../../db/models/category.model.js'
import subCategoryModel from '../../../db/models/subCategory.model.js'
import brandModel from '../../../db/models/brand.model.js'
import { catchError } from '../../middleware/catchError.js'
import slugify from "slugify"
import { AppError } from "../../utils/AppError.js"
import { ApiFeatures } from "../../utils/apiFeatures.js"
import cloudinary from "../../utils/cloudConfig.js";

const addProduct = catchError(async (req, res, next) => {
    req.body.slug = slugify(req.body.title);
    // Check if a product with the same title already exists
    const existingProduct = await productModel.findOne({ title: req.body.title });
    if (existingProduct) {
        return next(new AppError("Product with the same title already exists", 400));
    }
    if(req.body.category){
        let checkExist = await categoryModel.findById(req.body.category);
        if(!checkExist) return next(new AppError("category not found",401)); 
    if(!checkExist.createdBy.equals(req.user._id)){
        return next(new AppError("you don't create this category so you are not authorized to add this to product", 401));
    }
    }
    if(req.body.subcategory){
        let checkExist = await subCategoryModel.findById(req.body.category);
        if(!checkExist) return next(new AppError("sub category not found",401)); 
        if(!checkExist.createdBy.equals(req.user._id)){
            return next(new AppError("you don't create this sub category so you are not authorized to add this to product", 401));
        }
    }
    if(req.body.brand){
        let checkExist = await brandModel.findById(req.body.brand);
        if(!checkExist) return next(new AppError("brand not found",401)); 
        if(!checkExist.createdBy.equals(req.user._id)){
            return next(new AppError("you don't create this brand so you are not authorized to add this to product", 401));
        }
    }
    //upload image cover
    let imageCover = await cloudinary.uploader.upload(req.files.imageCover[0].path)
    // Assign the path of the image cover
    req.body.imageCover = imageCover.secure_url;
    req.body.imageCoverPublicId = imageCover.public_id;

    // Upload each image in the images array to Cloudinary
    const imagesResults = [];
    const imagesPublicIds = [];
    for (const file of req.files.images) {
        const result = await cloudinary.uploader.upload(file.path);
        imagesResults.push(result.secure_url);
        imagesPublicIds.push(result.public_id);
    }
    req.body.imagesPublicIds = imagesPublicIds; // Store public_ids for images
    req.body.images = imagesResults;
    // Create a new product
    req.body.createdBy = req.user._id 
    const newProduct = new productModel(req.body);
    const addedProduct = await newProduct.save();

    addedProduct&& res.json({message:"product added successfully",addedProduct})
    !addedProduct&& next(new AppError("not found product",401))  
});


const getAllProducts = catchError(async (req, res, next) => {
    const createdBy = req.query.createdBy;
    let apiFeatures = new ApiFeatures(productModel.find(), req.query)
        .pagination()  // Apply pagination
        .fields()  // Select fields
        .filter()  // Apply filtering
        .sort(); // Apply sorting

    // Populate 'brand', 'category', and 'createdBy' fields
    let allProducts = await apiFeatures.mongooseQuery
        .populate({
            path: 'brand',
            select: '-__v -category -createdAt -updatedAt' // Exclude __v from brand
        })
        .populate({
            path: 'category',
            select: '-__v  -createdAt -updatedAt' // Exclude __v from brand
        })
        .populate({
            path: 'createdBy',
            select: '-__v -createdAt -updatedAt -isBlocked -password'
        })
        .select('-__v -createdAt -updatedAt ');
    
        let totalCount = await productModel.countDocuments(apiFeatures.query);
        if(createdBy){
            totalCount = await productModel.find({createdBy}).countDocuments()
       }
    res.json({ message: "success", page: apiFeatures.pageNumber, totalCount, allProducts });
});


const getSingleProductById = catchError(async (req, res, next) => {
    let product = await productModel.findById(req.params.id)
        .populate({
            path: 'brand',
            select: '-__v -category -createdAt -updatedAt' // Exclude __v from brand
        })
        .populate({
            path: 'category',
            select: '-__v  -createdAt -updatedAt' // Exclude __v from brand
        })
        .populate({
            path: 'createdBy',
            select: '-__v -createdAt -updatedAt -isBlocked -password'
        })
        .select('-__v -createdAt -updatedAt');

    if (product) {
        res.json({ message: "success", product });
    } else {
        return next(new AppError("Product not found", 404));
    }
});

const updateProduct = catchError(async(req,res,next)=>{
    const productExist = await productModel.findById(req.params.id);
    if (!productExist) return next(new AppError("product not found", 404));

    if(!productExist.createdBy.equals(req.user._id)){
        return next(new AppError("you don't created this product , so you are not authoriaze to update it",401))
    }
    if (req.body.price) {
        productExist.price = req.body.price;
    }
    
    if(req.body.title){
        const existingSubcategory = await productModel.findOne({ title: req.body.title });
        if (existingSubcategory) {
            return next(new AppError("product with the same title already exists", 400));
        }      
        let {title} = req.body
        req.body.slug = slugify(title)
    }
    
    if(req.body.category){
        let checkExist = await categoryModel.findById(req.body.category);
        if(!checkExist) return next(new AppError("category not found",401)); 
        if(!checkExist.createdBy.equals(req.user._id)){
            return next(new AppError("you don't create this category so you are not authorized to add this to product", 401));
    }
}
    if(req.body.subcategory){
        let checkExist = await subCategoryModel.findById(req.body.category);
        if(!checkExist) return next(new AppError("sub category not found",401)); 
        if(!checkExist.createdBy.equals(req.user._id)){
            return next(new AppError("you don't create this sub category so you are not authorized to add this to product", 401));
    }
}
    if(req.body.brand){
        let checkExist = await brandModel.findById(req.body.brand);
        if(!checkExist) return next(new AppError("brand not found",401)); 
        if(!checkExist.createdBy.equals(req.user._id)){
            return next(new AppError("you don't create this brand so you are not authorized to add this to product", 401));
    }
}

    const product = await productModel.findById(req.params.id);

    // destroy image cover
    if (req.files.imageCover) {
        // Extract the public_id of the existing image from the database
        const existingPublicId = product.imageCoverPublicId;
        // If an existing image exists, delete it from Cloudinary
        if (existingPublicId) {
            await cloudinary.uploader.destroy(existingPublicId);
        }
        let imageCoverUpdated = await cloudinary.uploader.upload(req.files.imageCover[0].path)
        // Assign the path of the image cover
        req.body.imageCover = imageCoverUpdated.secure_url;
        req.body.imageCoverPublicId = imageCoverUpdated.public_id;
    }

    // destroy images
    if (req.files.images) {
        // Extract the public_ids of the existing images from the database
        const existingPublicIds = product.imagesPublicIds || [];

        // Check if there's a specific image being updated
        if (req.body.updatedImageIndex !== undefined) {
            // Get the public_id of the image being replaced
            const publicIdToDelete = existingPublicIds[req.body.updatedImageIndex];
            
            // Delete the specific image from Cloudinary
            if (publicIdToDelete) {
                await cloudinary.uploader.destroy(publicIdToDelete);
            }
        } else {
            // If no specific image is being updated, delete all existing images
            if (existingPublicIds.length > 0) {
                await Promise.all(existingPublicIds.map(async (public_id) => {
                    await cloudinary.uploader.destroy(public_id);
                }));
            }
        }

        const imagesResults = [];
        const imagesPublicIds = [];
        for (const file of req.files.images) {
            const result = await cloudinary.uploader.upload(file.path);
            imagesResults.push(result.secure_url);
            imagesPublicIds.push(result.public_id);
        }
        req.body.imagesPublicIds = imagesPublicIds; // Store public_ids for images
        req.body.images = imagesResults;
    }
    req.body.createdBy = req.user._id
    // Update the product with the new information including imagesPublicIds and images
    let update = await productModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    update && res.json({ message: "product updated", update });
    !update && next(new AppError("Product not updated", 401));
});


const deleteProduct =  catchError(async(req,res,next)=>{
    let checkExist = await productModel.findById(req.params.id)
    if(!checkExist){next(new AppError("product not found", 404));}
    if(!checkExist.createdBy.equals(req.user._id)){
        return next(new AppError("You are not authorized to delete this product", 401));
    }
    let product = await productModel.findByIdAndDelete(req.params.id)
    product&&res.json({message:"product deleted",product})
    !product&&next(new AppError("Product not deleted", 401));


})

export{
    addProduct,
    getAllProducts,
    getSingleProductById,
    updateProduct,
    deleteProduct
}