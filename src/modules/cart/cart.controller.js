import cartModel from "../../../db/models/cart.model.js"
import productModel from "../../../db/models/product.model.js"
import couponModel from '../../../db/models/coupon.model.js'
import { catchError } from '../../middleware/catchError.js'
import { AppError } from "../../utils/AppError.js"

function calcPrice(cart){
    let totalPrice = 0;
    cart.cartItems.forEach((ele)=>{
        totalPrice+= ele.quantity * ele.price;
    })
    
    cart.totalPrice = totalPrice

    if(cart.discount){
        cart.totalPriceAfterDiscount = cart.totalPrice - (cart.totalPrice * cart.discount) / 100;
    }
}

const addCart = catchError(async(req,res,next)=>{
    let cart = await productModel.findById(req.body.product).select("price title")
    !cart&&next(new AppError("product not found za3bolaaaaa",404))
    
    //UserID :::::: req.user._id
    req.body.price = cart.price
    let isCartExist = await cartModel.findOne({user:req.user._id}).populate(
        {
        path: 'user',
        select: '-__v -createdAt -updatedAt -isBlocked -password -isActive -confirmEmail'
    })
    if(!isCartExist) {
        let cart = new cartModel({
        user: req.user._id,
        cartItems: [req.body]
        })
        await cart.populate(
            {
            path: 'user',
            select: '-__v -createdAt -updatedAt -isBlocked -password -isActive -confirmEmail'
        })
        calcPrice(cart);
        await cart.save()
        cart&& res.json({message:"cart added successfully",cart})
        !cart&& next(new AppError("cart not found",401))
    }else{ // there is cart
    let item = isCartExist.cartItems.find((ele)=> ele.product== req.body.product)
    if(item){
        item.quantity+=1;
    }else{
        isCartExist.cartItems.push(req.body)
    }
    calcPrice(isCartExist)
    if(isCartExist.discount)isCartExist.totalPriceAfterDiscount = isCartExist.totalPrice -(isCartExist.totalPrice*isCartExist.discount)/100;
    await isCartExist.save()
    res.json({message:"else",isCartExist})
    }
})

const getCart = catchError(async(req,res,next)=>{
    let cart = await cartModel.findOne({ user: req.user._id}).populate({
        path: 'user',
        select: '-__v -createdAt -updatedAt -isBlocked -password'
    })
    cart&&res.json({message:"success",cart})
    !cart&&next(new AppError("not found cart",401))
})

const removeCartItem = catchError(async(req,res,next)=>{
    let cart = await cartModel.findOneAndUpdate({user:req.user._id},{ $pull:{cartItems:{_id:req.params.id}}},{new:true})
    calcPrice(cart)
    cart&&res.json({message:"removed",cart})
    !cart&&next(new AppError("not found cart",401))

})

const clearUserCart = catchError(async(req,res,next)=>{
    let cart = await cartModel.findOneAndDelete({user:req.user._id}).populate({
        path: 'user',
        select: '-__v -createdAt -updatedAt -isBlocked -password -phone -confirmEmail -isActive'
    })
    cart&&res.json({message:"cart removed",cart})
    !cart&&next(new AppError("not found cart",401))
})

const updateCart = catchError(async(req,res,next)=>{
    let cart = await productModel.findById(req.body.product).select("price")
    !cart&&next(new AppError("product not found",404))
    
    //UserID :::::: req.user._id
    req.body.price = cart.price
    let isCartExist = await cartModel.findOne({user:req.user._id})

    let item = isCartExist.cartItems.find((ele)=> ele.product== req.body.product)
    !item && next(new AppError("cart not found",401))
    if(item){
        item.quantity=req.body.quantity;
    }
    calcPrice(isCartExist)
    await isCartExist.save()
    res.json({message:"else",isCartExist})
    }
)

const applyCoupon = catchError(async(req,res,next)=>{
    //1- get coupon from params
    //2- get coupon discount
    //3- calc discount

    let code = await couponModel.findOne({ code: req.body.code, expires:{$gte:Date.now()}})
    if(!code)return next(new AppError("coupon not added",401))

    let cart = await cartModel.findOne( {user: req.user._id} )
    if(!cart) return next(new AppError("cart not found",401))
    cart.totalPriceAfterDiscount = cart.totalPrice - (cart.totalPrice * cart.discount) / 100;
    cart.discount = code.discount;
    calcPrice(cart)
    await cart.save();
    res.json( { message: "Done",cart})
})
    
export{
addCart,
getCart,
removeCartItem,
clearUserCart,
updateCart,
applyCoupon
}