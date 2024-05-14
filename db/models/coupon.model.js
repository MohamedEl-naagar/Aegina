import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code:{
        type:String,
        required: [true,'coupon code required'],
        trim: true,
        unique: true
    },
    expires:{
        type:Date,
        required: [true,'coupon date required'],

    },
    discount:{
        type:Number,
        required: true,
        min:0
    },    
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }

   
},{
    timestamps:true
})

const couponModel = mongoose.model("Coupon",couponSchema)
export default couponModel