import cartModel from "../../../db/models/cart.model.js"
import orderModel from '../../../db/models/order.model.js'
import productModel from '../../../db/models/product.model.js'
import userModel from "../../../db/models/user.model.js"
import { catchError } from '../../middleware/catchError.js'
import { AppError } from "../../utils/AppError.js"
import Stripe from 'stripe';
import express from 'express'
import OrderModel from "../../../db/models/order.model.js"
const app =express()
const stripe = new Stripe(process.env.stripe);


const createCashOrder = catchError(async(req,res,next)=>{
 
// get cart    
let cart = await cartModel.findById(req.params.id)
if(!cart) return next(new AppError("cart not found",401))
//total order price
let totalOrderPrice =  cart.totalPriceAfterDiscount? cart.totalPriceAfterDiscount: cart.totalPrice;
//create order
let order = new orderModel({
    user:req.user._id,
    orderItems:cart.cartItems,
    totalOrderPrice,
    shippingAddress:req.body.shippingAddress,
})
if(!order){
    return next(new AppError("error in order",409))
 } 
 await order.populate({
    path: 'user',
    select: '-__v -createdAt -updatedAt -isBlocked -password'
}); 
await order.save()
//increament sold , decreament quantity
let options = cart.cartItems.map((prod)=>{

    return ( {
        updateOne: {
            "filter": {_id: prod.product},
            "update": {$inc: {sold: prod.quantity ,quantity: -prod.quantity}}
        }
    })
})
await productModel.bulkWrite(options)
//clear cart

await cartModel.findByIdAndDelete(req.params.id)

res.json({message:"order added",order})

})
const getAllOrder = catchError(async(req,res,next)=>{
    let orders = await orderModel.find({user:req.user._id}).populate('orderItems.product')
    const totalOrdersCount = orders.length;
    orders && res.json({message:"success",totalOrdersCount,orders})
    !orders && next(new AppError("orders not found for this user",401))

})
const getCompanyOrder = catchError(async(req,res,next)=>{
    const companyId = req.user._id; // Assuming companyId is passed as a route parameter

    let orders = await orderModel.find({})
        .populate({
            path: 'orderItems.product',
            match: { createdBy: companyId }
        }).populate({
            path:'user',
            select: 'name' // Exclude __v from brand

        });
        // Filter orders to remove those with no matching products
        orders = orders.filter(order => order.orderItems.some(item => item.product !== null));

        if (orders.length > 0) {
            const totalOrdersCount = orders.length;
            res.json({ message: "success", totalOrdersCount,orders });
        } else {
            next(new AppError("Orders not found for this company", 401));
        }
    
    })
const deleteOrder = catchError(async(req,res,next)=>{
    let order = await orderModel.findByIdAndDelete(req.params.id);
    order&&res.json({ message: "order deleted", order });
    !order&&next(new AppError("order not deleted", 404));


})

const createCheckoutURL = catchError(async(req,res,next) => {
  let cart = await cartModel.findById(req.params.id);
  if(!cart) return next (new AppError("cart not found", 404))

  // 2- total price
  let orderTotalPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount: cart.totalPrice;


  let session = await stripe.checkout.sessions.create({
      line_items: [
          {
              price_data: {
                  currency: "EGP",
                  unit_amount: orderTotalPrice * 100,
                  product_data: {
                      name:req.user.name
                  }
              },
              quantity: 1
          }
      ],
      mode:"payment",
      success_url: "https://aegina.onrender.com/",
      cancel_url:"https://aegina.onrender.com/",
      client_reference_id: req.params.id,
      customer_email:req.user.email,
      metadata: req.body.shippingAddress
  })

  res.json({message : "Done", session})
})

const createdOnlineOrder = catchError(async(req, res) => {
    const sig = req.headers['stripe-signature']
  console.log(sig);

  let event;
  

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.webhooks);
  } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if(event.type == "checkout.session.completed") {
      const checkoutSessionCompleted = event.data.object;
      let cart = await cartModel.findById(checkoutSessionCompleted.client_reference_id);
      if(!cart) return next (new AppError("cart not found", 404))
  
      // 2- total price
      // 3- create oder
      let user = await userModel.findOne({email: checkoutSessionCompleted.customer_email})
      let order = new orderModel({
          user: user._id,
          orderItems: cart.cartItems,
          totalPrice: checkoutSessionCompleted.amount_total / 100,
          shippingAddress : checkoutSessionCompleted.metadata.shippingAddress,
          paymentType:"card",
          isPaid:true,
          PaidAt:Date.now()
      });
      await order.save();

      let options = cart.cartItems.map(ele =>{
          return (
              {
                  updateOne:{
                      filter: {_id: ele.product},
                      update: { $inc: {sold: ele.quantity,quantity: -ele.quantity}}
                  }
              }
          )
      })
      
      await productModel.bulkWrite(options)
      // delete cart

      await cartModel.findOneAndDelete({user : user._id})

      console.log("completed");
  }else {
      console.log(`Unhandled event type ${event.type}`);

  }
  // Handle the event

  // Return a 200 res to acknowledge receipt of the event
  res.json({message:"welcome from online payment"});
})

export{
createCashOrder,
getAllOrder,
deleteOrder,
createCheckoutURL,
createdOnlineOrder,
getCompanyOrder
}