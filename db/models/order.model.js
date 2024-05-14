import mongoose, { Mongoose } from "mongoose";

const orderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Types.ObjectId,
        ref:"User"    
    },
    orderItems:[{
        product:{type:mongoose.Types.ObjectId,ref:"Product"},
        quantity:Number,
        price:Number
    }],
    totalOrderPrice:{type: Number},
    shippingAddress:{
        street:String,
        city:String,
        phone:String
    },
    paymentType:{
        type:String,
        enum:["cash","card"],
        default:"cash"
    },
    isDelivered:{
        type:Boolean,
        default:false
    },
    DeliveredAt:{
        type:Date
    },
    isPaid:{
        type:Boolean,
        default:false
    },
    PaidAt:{
        type:Date
    },
    iscancelled:{
        type:Boolean,
        default:false
    }

},{
    timestamps:true
})

const OrderModel = mongoose.model("Order",orderSchema)
export default OrderModel