import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
        minLength:[3,"title is too short"],
        trim: true,
        unique:true
    },
    slug:{
        type:String,
        required:true,
        lowercase:true
    },
    category:{
        type: mongoose.Types.ObjectId,
        ref:"Category",
        required:true
    },
    image:{
        type:String,
    },
    //returned by Cloudinary is a unique identifier for the uploaded asset
    public_id:{
        type:String,
        unique:true,
        required:true
    },
    createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        }

},{
    timestamps:true
})

const subCategoryModel = mongoose.model("subCategory",subCategorySchema)
export default subCategoryModel