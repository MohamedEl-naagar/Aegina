import Joi from 'joi'


const addOrderValidation = Joi.object({
    id              : Joi.string().hex().length(24).required(),
    shippingAddress : Joi.object({
        street: Joi.string().trim().required(),
        city: Joi.string().trim().required(),
        phone: Joi.string().regex(/^[0-9]{11}$/).messages({'string.pattern.base': `Phone number must have 11 digits.`}).required(),
    }).required()

})

const paramsIdValidation = Joi.object({
    
    id: Joi.string().hex().length(24).required()
})


const updateCartValidation = Joi.object({
    id: Joi.string().hex().length(24).required(),
    quantity: Joi.number(),
})

export{
    addOrderValidation,
    updateCartValidation,
    paramsIdValidation
}