import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
        minLength:[2,"title is too short"],
        trim: true,
        unique:true
    },
    slug:{
        type:String,
        lowercase:true
    },
    image:{
        type:String,
        img:String,
        images:[{
            type:String
        }]
    },
    //returned by Cloudinary is a unique identifier for the uploaded asset
    public_id:{
        type:String,
        unique:true,
        required:true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required:true
    }


},{
    timestamps:true
})

// categorySchema.post('init',function(doc){
//     doc.image = process.env.BASE_URL+"uploads/"+doc.image
// })
const categoryModel = mongoose.model("Category",categorySchema)
export default categoryModel