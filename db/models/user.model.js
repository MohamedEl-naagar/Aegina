import mongoose from "mongoose";
import bcrypt from 'bcrypt'
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        minLength:[2,"title is too short"],
        trim: true,
    },
    email:{
        type:String,
        required: true,
        trim: true,
        unique:true
    },
    password: {
        type:String,
        required: true,
    },
    isActive:{
        type:Boolean,
        default:true
    },
    isBlocked:{
        type:Boolean,
        default:false
    },  
    confirmEmail:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        enum:['company','wholesaler'],
        required:true
    },
    phone:{
        type:String,
        unique:true,
        required:true
    },
    passwordChangedAt:{
        type:Date
    },
    googleId:String

},{
    timestamps:true
})

userSchema.pre('save',function(){
    this.password= bcrypt.hashSync(this.password,parseInt(process.env.ROUND))
})
const userModel = mongoose.model("User",userSchema)
export default userModel