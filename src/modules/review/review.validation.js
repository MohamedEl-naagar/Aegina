import Joi from 'joi'


const addReviewValidation = Joi.object({
        text: Joi.string().min(3).max(300).trim().required(),
        rate: Joi.number().min(0).max(5).required(),
        product: Joi.string().hex().length(24).required()      
})

const paramsIdValidation = Joi.object({
    
    id: Joi.string().hex().length(24).required()
})


const updateReviewValidation = Joi.object({
    id: Joi.string().hex().length(24).required(),
    text: Joi.string().min(3).max(300).trim(),
    rate: Joi.number().min(0).max(5),
    product: Joi.string().hex().length(24)


})

export{
    addReviewValidation,
    paramsIdValidation,
    updateReviewValidation
}