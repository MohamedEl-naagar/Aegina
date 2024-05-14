import Joi from "joi"

const signupVal = Joi.object({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(),
    rePassword: Joi.valid(Joi.ref('password')).required(),
    phone: Joi.string().regex(/^[0-9]{11}$/).messages({'string.pattern.base': `Phone number must have 11 digits.`}).required(),
    role: Joi.string().valid('company', 'wholesaler').required(), // Validating the role field
})


const signinVal = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
})

const changePasswordVal = Joi.object({
    password: Joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(),
    newPassword: Joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(),

})


export{
    signinVal,
    signupVal,
    changePasswordVal
}