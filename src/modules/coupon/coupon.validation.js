import Joi from 'joi'


const addCouponValidation = Joi.object({
    code: Joi.string().min(3).max(300).trim().required(),
    discount: Joi.number().min(0).max(10000).required(),
    expires: Joi.date().required(),
})

const paramsIdValidation = Joi.object({
    
    id: Joi.string().hex().length(24).required()
})


const updateCouponValidation = Joi.object({
    id: Joi.string().hex().length(24).required(),
    code: Joi.string().min(3).max(300).trim(),
    discount: Joi.number().min(0).max(10000),
    expires: Joi.date(),


})

export{
    addCouponValidation,
    updateCouponValidation,
    paramsIdValidation
}