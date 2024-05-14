import Joi from 'joi'


const addCartValidation = Joi.object({
    product: Joi.string().hex().length(24).required()

})

const paramsIdValidation = Joi.object({
    
    id: Joi.string().hex().length(24).required()
})


const updateCartValidation = Joi.object({
    id: Joi.string().hex().length(24).required(),
    quantity: Joi.number(),
    product: Joi.string().hex().length(24).required()
})

export{
    addCartValidation,
    updateCartValidation,
    paramsIdValidation
}