import express from 'express';
import { AppError } from '../../utils/AppError.js';

const routerProfile = express.Router();

const authCheck = (req,res,next)=>{
    
    if(!req.user){
        // check if the user not logged in
        next(new AppError("you must logged in first",404))
    }else{
        next()
    }
};

routerProfile.get('/',authCheck,(req,res)=>{

    res.send("hello in redirect log in "+ req.user.userName)
})

export default routerProfile