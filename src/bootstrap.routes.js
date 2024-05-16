import {globalError} from "./middleware/globalError.js"

import categoryRoute from './modules/category/category.routes.js'
import SubCategoryRoute from "./modules/subCategory/subCategory.routes.js"
import BrandRoute from './modules/brand/brand.routes.js'
import ProductRoute from "./modules/product/product.routes.js"
import UserRoute from "./modules/user/user.routes.js"
import authRoutes from "./modules/auth/auth.routes.js"
import ReviewRoute from "./modules/review/review.routes.js"
import CouponRoute from "./modules/coupon/coupon.routes.js"
import CartRoute from "./modules/cart/cart.routes.js"
import OrderRoute from "./modules/order/order.routes.js"
// import routerProfile from "./modules/auth/profile.route.js"
import passport from "passport"

export const bootstrap =(app)=>{

 
    app.use('/api/v1/categories/',categoryRoute)
    app.use('/api/v1/subcategories/',SubCategoryRoute)
    app.use('/api/v1/brand/',BrandRoute)
    app.use('/api/v1/product/',ProductRoute)
    app.use('/api/v1/user/',UserRoute)
    app.use('/api/v1/auth/',authRoutes)
    app.get('/auth/google/redirect', 
    passport.authenticate('google'),
    (req, res) => {
      // This callback function will only be called if authentication succeeds
      // res.json({ message: 'you reached the callback URL' });
    // } 
    // (req,res)=>{
        res.json(req.user);
      // res.redirect('/profile/')
        }    // }
  );
    app.use('/api/v1/review/',ReviewRoute)
    app.use('/api/v1/coupon/',CouponRoute)
    app.use('/api/v1/cart/',CartRoute)
    app.use('/api/v1/order/',OrderRoute)
    
    app.use('/',(req,res) => res.json({message:'hello in Aegina!'}))
    // Gobal Error Handle👌
    app.use(globalError)
}