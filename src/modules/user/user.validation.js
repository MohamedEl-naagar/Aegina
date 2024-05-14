import Joi from 'joi'

const paramsIdVal = Joi.object({ 
    id: Joi.string().hex().length(24).required()
})

const updateUserVal = Joi.object({
    name: Joi.string().min(2).max(300).trim(),
    email: Joi.string().email(),
    password: Joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
    rePassword: Joi.valid(Joi.ref('password')),
    phone: Joi.string().regex(/^[0-9]{11}$/).messages({'string.pattern.base': `Phone number must have 11 digits.`}),
})

export{
    paramsIdVal,
    updateUserVal
}