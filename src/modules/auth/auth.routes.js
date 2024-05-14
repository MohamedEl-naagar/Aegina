import express from 'express'
import passport from 'passport';
import {checkEmail} from '../../middleware/checkEmail.js'
import { validation } from '../../middleware/validation.js'
import { changePasswordVal, signinVal, signupVal } from './auth.validation.js'
import { signUp,signIn,changePassword, protectedRoutes, allowedTo, verifyEmail } from './auth.controller.js'

const authRoutes = express.Router()
authRoutes.post('/signup',validation(signupVal),checkEmail,signUp)
authRoutes.post('/signin',validation(signinVal),signIn)
authRoutes.get('/verify/:token',verifyEmail)
authRoutes.patch('/changepassword/',protectedRoutes,validation(changePasswordVal),changePassword)


authRoutes.get('/logout', (req, res) => {
  // Handle logout using passport
  req.logOut()
  res.redirect('/')
});

authRoutes.get('/google', passport.authenticate('google', { scope: ['profile','email'] }));

// call back from google oauth
// authRoutes.get('/google/redirect', 
//   passport.authenticate('google'),
//   // (req, res) => {
//     // This callback function will only be called if authentication succeeds
//     // res.json({ message: 'you reached the callback URL' });
//   // }
//   (req,res)=>{
//     console.log(req.user)
//     // res.redirect('/api/v1/profile')
//   }
// );
export default authRoutes