import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
        minLength:[3,"title is too short"],
        trim: true,
        unique:true,
        lowercase: true
    },
    logo:{
        type:String
    },
    public_id:{
        type:String,
        unique:true,
        required:true
    },
    slug:{
        type:String,
        required:true,
        lowercase:true
    },
    category:{
        type: mongoose.Types.ObjectId,
        ref:"Category",
        required: true
    },
    createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required:true
    }
},{
    timestamps:true
})

const brandModel = mongoose.model("Brand",brandSchema)
export default brandModel